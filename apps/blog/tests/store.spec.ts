import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const WIDTHS = [320, 375, 768, 1024, 1440];
// ADR-26: o catálogo mostra só itens reais (as 6 soluções); os 9 tipos continuam com rota, e tipo sem item tem estado vazio.
const TYPE_ROUTES = [
  "/ferramentas/skills/",
  "/ferramentas/agentes/",
  "/ferramentas/prompts/",
  "/ferramentas/ebooks/",
  "/ferramentas/pdfs/",
  "/ferramentas/html/",
  "/ferramentas/workbooks/",
  "/ferramentas/solucoes/",
  "/ferramentas/assets/",
];
const DETAIL = "/ferramentas/solucoes/status-report/";
const ROUTES = ["/ferramentas/", ...TYPE_ROUTES, DETAIL];
const SOLUTIONS_COUNT = 6;

const items = (page: Page) => page.getByTestId("store-item");

// WCAG contrast between two computed CSS colours (oklch included) through a canvas.
async function contrast(page: Page, fg: string, bg: string) {
  return page.evaluate(
    ([a, b]) => {
      const ctx = document.createElement("canvas").getContext("2d")!;
      const lum = (c: string) => {
        ctx.clearRect(0, 0, 1, 1);
        ctx.fillStyle = c;
        ctx.fillRect(0, 0, 1, 1);
        const [r, g, bl] = Array.from(ctx.getImageData(0, 0, 1, 1).data.slice(0, 3)).map((v) => {
          const s = v / 255;
          return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
      };
      const [x, y] = [lum(a), lum(b)];
      return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
    },
    [fg, bg],
  );
}

test.describe("routes render", () => {
  for (const route of ROUTES) {
    test(`${route} loads with one h1 and the demo notice`, async ({ page }) => {
      const res = await page.goto(route);
      expect(res?.status()).toBe(200);
      await expect(page.locator("main h1")).toHaveCount(1);
      await expect(page.locator("main [data-demo-notice]").first()).toBeVisible();
    });
  }
});

test.describe("no horizontal overflow", () => {
  for (const width of WIDTHS) {
    for (const route of ["/ferramentas/", "/ferramentas/solucoes/", "/ferramentas/ebooks/", DETAIL]) {
      test(`${route} @${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(route);
        await page.waitForLoadState("networkidle");
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth,
        );
        expect(overflow).toBeLessThanOrEqual(0);
      });
    }
  }
});

test("hub: real catalog only, types without items are 'em preparação' and never links", async ({ page }) => {
  await page.goto("/ferramentas/");
  await page.waitForLoadState("networkidle"); // wait for hydration
  await expect(page.getByRole("heading", { level: 2, name: "Catálogo" })).toBeVisible();
  await expect(items(page)).toHaveCount(SOLUTIONS_COUNT);
  await expect(page.locator("[data-store-catalog] .ds-card[data-type=solution]")).toHaveCount(SOLUTIONS_COUNT);
  await expect(page.getByText("Catálogo de exemplo")).toHaveCount(0);
  const types = page.locator("[data-store-types]");
  await expect(types.getByRole("button", { name: /Soluções/ })).toBeVisible();
  // 8 tipos sem item: texto "em preparação", sem botão nem link
  await expect(types.locator(".ds-chip[data-state=soon]")).toHaveCount(8);
  await expect(types.locator("a")).toHaveCount(0);
  // ferramenta interativa real e um único CTA primário
  await expect(page.locator("[data-tool-card=prisma] a")).toHaveAttribute("href", "/prisma/");
  await expect(page.locator("main [data-cta=primary]")).toHaveCount(1);
  // nenhum link aponta para um item de exemplo retirado
  const hrefs = await page.locator("main a").evaluateAll((els) => els.map((e) => e.getAttribute("href") ?? ""));
  expect(hrefs.filter((h) => /\/ferramentas\/(skills|agentes|prompts|ebooks|pdfs|html|workbooks|assets)\/[^/]+\//.test(h))).toEqual([]);
  expect(hrefs.filter((h) => h === "#")).toEqual([]);
});

test("search filters the real dataset as the user types and keeps ?q=", async ({ page }) => {
  await page.goto("/ferramentas/");
  await page.waitForLoadState("networkidle"); // wait for hydration
  const search = page.getByRole("searchbox", { name: "Buscar ferramentas" });
  await search.fill("status report");
  await expect(items(page)).toHaveCount(1);
  await expect(page).toHaveURL(/q=status\+report/);
  await search.fill("solução"); // matches by type
  await expect(items(page)).toHaveCount(SOLUTIONS_COUNT);
  await search.fill("zzzz");
  await expect(page.getByTestId("state-empty")).toBeVisible();
  await page.getByRole("button", { name: "Limpar filtros" }).click();
  await expect(items(page)).toHaveCount(SOLUTIONS_COUNT);
  await expect(page).not.toHaveURL(/q=/);
});

test("?q= from a function chip opens the catalog filtered", async ({ page }) => {
  await page.goto("/ferramentas/");
  const chip = page.locator("[data-store-facets] a.ds-chip").first();
  const href = await chip.getAttribute("href");
  expect(href).toMatch(/^\/ferramentas\/\?q=/);
  await page.goto(href!);
  await page.waitForLoadState("networkidle");
  const q = new URL(page.url()).searchParams.get("q")!;
  await expect(page.getByRole("searchbox", { name: "Buscar ferramentas" })).toHaveValue(q);
  expect(await items(page).count()).toBeGreaterThan(0);
});

test("type filter (chips) filters the same dataset in place and mirrors ?tipo=", async ({ page }) => {
  await page.goto("/ferramentas/?tipo=solucoes");
  await page.waitForLoadState("networkidle"); // wait for hydration
  const sol = page.locator("[data-store-types]").getByRole("button", { name: /Soluções/ });
  await expect(sol).toHaveAttribute("aria-pressed", "true");
  await expect(items(page)).toHaveCount(SOLUTIONS_COUNT);
  await page.locator("[data-store-types]").getByRole("button", { name: /Todos/ }).click();
  await expect(page).not.toHaveURL(/tipo=/);
  await sol.click();
  await expect(page).toHaveURL(/tipo=solucoes/);
});

test("?area= still filters (the select only shows up with two or more areas)", async ({ page }) => {
  await page.goto("/ferramentas/?area=operations");
  await page.waitForLoadState("networkidle"); // wait for hydration
  await expect(items(page)).toHaveCount(SOLUTIONS_COUNT);
  await expect(page.getByRole("combobox", { name: "Filtrar por área" })).toHaveCount(0);
  await page.goto("/ferramentas/?area=editorial");
  await page.waitForLoadState("networkidle");
  await expect(page.getByTestId("state-empty")).toBeVisible();
  await page.getByRole("button", { name: "Limpar filtros" }).click();
  await expect(items(page)).toHaveCount(SOLUTIONS_COUNT);
  await expect(page).not.toHaveURL(/area=/);
});

test("/ferramentas/solucoes/ fixes the type and shares the catalog", async ({ page }) => {
  await page.goto("/ferramentas/solucoes/");
  await page.waitForLoadState("networkidle"); // wait for hydration
  await expect(page.locator("main h1")).toHaveText("Soluções");
  await expect(page.locator("main nav[aria-label=Trilha] a[href='/ferramentas/']")).toBeVisible();
  await expect(items(page)).toHaveCount(SOLUTIONS_COUNT);
  await page.getByRole("searchbox", { name: "Buscar em Soluções" }).fill("plano");
  expect(await items(page).count()).toBeLessThan(SOLUTIONS_COUNT);
  await expect(page).toHaveURL(/q=plano/);
});

test("type without real items shows an honest empty state with a real link", async ({ page }) => {
  for (const route of TYPE_ROUTES.filter((r) => r !== "/ferramentas/solucoes/")) {
    await page.goto(route);
    const empty = page.getByTestId("state-empty");
    await expect(empty, route).toBeVisible();
    await expect(empty.locator("h3"), route).toContainText("em preparação");
    await expect(empty.locator("a"), route).toHaveAttribute("href", "/ferramentas/solucoes/");
    await expect(items(page), route).toHaveCount(0);
    await expect(page.getByText("Catálogo de exemplo"), route).toHaveCount(0);
  }
});

test("loading and error states", async ({ page }) => {
  await page.goto("/ferramentas/?estado=carregando");
  await page.waitForLoadState("networkidle"); // wait for hydration
  await expect(page.getByTestId("state-loading")).toBeVisible();
  await page.goto("/ferramentas/?estado=erro");
  await page.waitForLoadState("networkidle"); // wait for hydration
  await expect(page.getByTestId("state-error")).toBeVisible();
  await expect(page.getByTestId("state-error")).toHaveAttribute("role", "alert");
  await page.getByRole("button", { name: "Tentar novamente" }).click();
  await expect(items(page)).toHaveCount(SOLUTIONS_COUNT);
  await expect(page).not.toHaveURL(/estado=/);
});

test("detail: a card opens the solution page with breadcrumb back to its type", async ({ page }) => {
  await page.goto("/ferramentas/solucoes/");
  await page.waitForLoadState("networkidle"); // wait for hydration
  await items(page).first().locator("a.ds-card-link").click();
  await expect(page).toHaveURL(/\/ferramentas\/solucoes\/[a-z0-9-]+\/$/);
  await expect(page.locator("[data-solution-card]")).toBeVisible();
  await page.locator("main nav[aria-label=Trilha]").getByRole("link", { name: "Soluções" }).click();
  await expect(page).toHaveURL(/\/ferramentas\/solucoes\/$/);
});

test("retired example items answer 302 to /ferramentas/", async ({ request }) => {
  for (const from of ["/ferramentas/skills/skill-001/", "/ferramentas/ebooks/ebook-011/"]) {
    const res = await request.get(from, { maxRedirects: 0 });
    expect(res.status(), from).toBe(302);
    expect(new URL(res.headers()["location"], "http://x").pathname, from).toBe("/ferramentas/");
  }
});

test("navigation: Ferramentas is reachable by keyboard from the navbar", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/artigos/");
  await page.waitForLoadState("networkidle"); // wait for hydration
  const link = page.locator("header nav a[href^='/ferramentas']").first();
  await link.focus();
  await expect(link).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/ferramentas\/?$/);
});

test("area tokens stay distinct and legible (the catalog shows the area as text only, ADR-26)", async ({ page }) => {
  await page.goto("/ferramentas/");
  await page.waitForLoadState("networkidle"); // wait for hydration
  const colours = await page.evaluate(() => {
    const probe = document.createElement("span");
    document.body.appendChild(probe);
    const read = (name: string) => {
      probe.style.color = `var(--${name})`;
      return getComputedStyle(probe).color;
    };
    return Object.fromEntries(
      ["institutional", "editorial", "skills", "operations", "tools", "data"].map((a) => [a, read(`area-${a}`)]),
    );
  });
  expect(new Set(Object.values(colours)).size).toBe(6);
  for (const c of Object.values(colours)) expect(await contrast(page, c, "rgb(255,255,255)")).toBeGreaterThanOrEqual(4.5);
});

test("accessibility (axe) on store routes", async ({ page }) => {
  for (const route of ["/ferramentas/", "/ferramentas/solucoes/", "/ferramentas/ebooks/", DETAIL]) {
    await page.goto(route);
    await page.waitForLoadState("networkidle");
    const { violations } = await new AxeBuilder({ page }).include("main").analyze();
    const blocking = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(blocking, `${route}: ${JSON.stringify(blocking.map((v) => [v.id, v.nodes.length]))}`).toEqual([]);
  }
});

test("dark mode keeps area markers legible", async ({ page }) => {
  await page.goto("/ferramentas/");
  await page.waitForLoadState("networkidle"); // wait for hydration
  await page.evaluate(() => document.documentElement.classList.add("dark"));
  const ratios = await page.evaluate(() => {
    const probe = document.createElement("span");
    document.body.appendChild(probe);
    return ["institutional", "editorial", "skills", "operations", "tools", "data"].map((a) => {
      probe.style.color = `var(--area-${a})`;
      return [a, getComputedStyle(probe).color];
    });
  });
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  for (const [name, colour] of ratios) {
    expect(await contrast(page, colour, bg), name).toBeGreaterThanOrEqual(4.5);
  }
});

// ADR-14 / LANC-001 RQ-100, RQ-103: a Loja deixou de existir.
test("Ferramentas routes never show the word Loja nor purchase wording", async ({ page }) => {
  for (const route of ROUTES) {
    await page.goto(route);
    const text = await page.locator("body").innerText();
    expect(text, route).not.toMatch(/\bLoja\b|\bcomprar\b|\bcarrinho\b|\bcheckout\b/i);
  }
});

test("/loja/* answers 301 to the same path under /ferramentas", async ({ request }) => {
  for (const [from, to] of [
    ["/loja/", "/ferramentas/"],
    ["/loja/skills/", "/ferramentas/skills/"],
    ["/loja/solucoes/status-report/", "/ferramentas/solucoes/status-report/"],
  ]) {
    const res = await request.get(from, { maxRedirects: 0 });
    expect(res.status(), from).toBe(301);
    expect(new URL(res.headers()["location"], "http://x").pathname, from).toBe(to);
  }
});
