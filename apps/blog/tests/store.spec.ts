import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const WIDTHS = [320, 375, 768, 1024, 1440];
const ROUTES = [
  "/ferramentas/",
  "/ferramentas/skills/",
  "/ferramentas/agentes/",
  "/ferramentas/prompts/",
  "/ferramentas/ebooks/",
  "/ferramentas/pdfs/",
  "/ferramentas/html/",
  "/ferramentas/workbooks/",
  "/ferramentas/assets/",
  "/ferramentas/skills/skill-001/",
  "/ferramentas/ebooks/ebook-011/",
];

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
    test(`${route} loads with one h1`, async ({ page }) => {
      const res = await page.goto(route);
      expect(res?.status()).toBe(200);
      await expect(page.locator("main h1")).toHaveCount(1);
    });
  }
});

test.describe("no horizontal overflow", () => {
  for (const width of WIDTHS) {
    for (const route of ["/ferramentas/", "/ferramentas/skills/", "/ferramentas/ebooks/", "/ferramentas/skills/skill-001/"]) {
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

test("hub: categories, featured, skills list and ebook grid", async ({ page }) => {
  await page.goto("/ferramentas/");
  await page.waitForLoadState("networkidle"); // wait for hydration
  await expect(page.getByRole("heading", { level: 2, name: "Categorias" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Destaque" })).toBeVisible();
  await expect(page.locator("#skills")).toBeVisible();
  await expect(page.locator("#ebooks")).toBeVisible();
  // plugin/list pattern for skills, connector/grid (cover) pattern for e-books
  await expect(page.locator("section[aria-labelledby=skills] [data-type=skill]")).toHaveCount(4);
  await expect(page.locator("section[aria-labelledby=ebooks] [data-type=ebook]")).toHaveCount(3);
  await expect(page.locator("section[aria-labelledby=ebooks] [data-slot=card]").first()).toContainText("Capa de exemplo");
});

test("search filters the mock dataset as the user types", async ({ page }) => {
  await page.goto("/ferramentas/");
  await page.waitForLoadState("networkidle"); // wait for hydration
  const search = page.getByRole("searchbox", { name: "Buscar ferramentas" });
  await search.fill("priorização");
  await expect(items(page)).toHaveCount(1);
  await search.fill("pesquisa"); // matches by tag (3 skills + 1 prompt)
  await expect(items(page)).toHaveCount(4);
  await search.fill("e-book"); // matches by type
  await expect(items(page)).toHaveCount(3);
  await search.fill("institucional"); // matches by area
  await expect(items(page)).toHaveCount(1);
  await search.fill("zzzz");
  await expect(page.getByTestId("state-empty")).toBeVisible();
  await page.getByRole("button", { name: "Limpar filtros" }).click();
  await expect(page.getByRole("heading", { level: 2, name: "Categorias" })).toBeVisible();
});

test("type filter (tabs) filters the same dataset in place", async ({ page }) => {
  await page.goto("/ferramentas/");
  await page.waitForLoadState("networkidle"); // wait for hydration
  await page.getByRole("tab", { name: "Prompts" }).click();
  await expect(items(page)).toHaveCount(3);
  await expect(page).toHaveURL(/tipo=prompts/);
  await page.getByRole("tab", { name: "Skills", exact: true }).click();
  await expect(items(page)).toHaveCount(10);
  await page.getByRole("tab", { name: "Todos" }).click();
  await expect(page.getByRole("heading", { level: 2, name: "Categorias" })).toBeVisible();
});

test("area filter narrows results and combines with type", async ({ page }) => {
  await page.goto("/ferramentas/");
  await page.waitForLoadState("networkidle"); // wait for hydration
  await page.getByRole("combobox", { name: "Filtrar por área" }).click();
  await page.getByRole("option", { name: "Artigos" }).click();
  await expect(items(page)).toHaveCount(3); // e-books
  await page.getByRole("tab", { name: "Prompts" }).click();
  await expect(page.getByTestId("state-empty")).toBeVisible();
});

test("/ferramentas/skills fixes type=skill and shares the store shell", async ({ page }) => {
  await page.goto("/ferramentas/skills/");
  await page.waitForLoadState("networkidle"); // wait for hydration
  await expect(page.locator("main h1")).toHaveText(/Skills/);
  await expect(items(page)).toHaveCount(10);
  await expect(page.locator("[data-type=skill]")).toHaveCount(10);
  await page.getByRole("searchbox").fill("visual");
  await expect(items(page)).toHaveCount(2);
});

test("/ferramentas/ebooks uses the visual grid", async ({ page }) => {
  await page.goto("/ferramentas/ebooks/");
  await page.waitForLoadState("networkidle"); // wait for hydration
  await expect(items(page)).toHaveCount(3);
  await expect(items(page).first().locator("[data-slot=card]")).toBeVisible();
});

test("empty category shows the empty state", async ({ page }) => {
  await page.goto("/ferramentas/agentes/");
  await page.waitForLoadState("networkidle"); // wait for hydration
  await expect(page.getByTestId("state-empty")).toBeVisible();
});

test("loading and error states", async ({ page }) => {
  await page.goto("/ferramentas/?estado=carregando");
  await page.waitForLoadState("networkidle"); // wait for hydration
  await expect(page.getByTestId("state-loading")).toBeVisible();
  await page.goto("/ferramentas/?estado=erro");
  await page.waitForLoadState("networkidle"); // wait for hydration
  await expect(page.getByTestId("state-error")).toBeVisible();
  await page.getByRole("button", { name: "Tentar novamente" }).click();
  await expect(page.getByRole("heading", { level: 2, name: "Categorias" })).toBeVisible();
});

test("detail: Problem, Process (3 steps), Progress and a flowchart with the same steps", async ({ page }) => {
  await page.goto("/ferramentas/skills/");
  await page.waitForLoadState("networkidle"); // wait for hydration
  await items(page).first().click();
  await expect(page).toHaveURL(/\/ferramentas\/skills\/skill-\d{3}\/$/);
  await page.waitForLoadState("networkidle"); // the detail is a new document: wait for hydration
  for (const name of ["Problema", "Processo", "Progresso", "Como funciona"]) {
    await expect(page.getByRole("heading", { level: 2, name })).toBeVisible();
  }
  const steps = page.getByTestId("process-steps").locator("li");
  await expect(steps).toHaveCount(3);
  const labels = await steps.locator("div > span:last-child").allTextContents();
  const flow = page.getByTestId("flowchart").locator("[data-node^=s]");
  await expect(flow).toHaveCount(3);
  for (let i = 0; i < 3; i++) await expect(flow.nth(i)).toContainText(labels[i]);
  // references disclosure is keyboard operable
  const trigger = page.getByRole("button", { name: "Referências" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText("Referência de exemplo A")).toBeVisible();
  await page.getByRole("link", { name: /Voltar para Skills/ }).click();
  await expect(page).toHaveURL(/\/ferramentas\/skills\/$/);
});

test("detail is a single column on mobile and split on desktop", async ({ page }) => {
  const cols = () =>
    page.evaluate(() => {
      const h = (id: string) => document.getElementById(id)!.getBoundingClientRect();
      return { left: h("como-funciona").left, right: h("problema").left };
    });
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("/ferramentas/skills/skill-001/");
  await page.waitForLoadState("networkidle"); // wait for hydration
  const m = await cols();
  expect(Math.abs(m.left - m.right)).toBeLessThan(2);
  await page.setViewportSize({ width: 1440, height: 900 });
  const d = await cols();
  expect(d.right).toBeGreaterThan(d.left + 200);
});

test("navigation: Ferramentas is reachable by keyboard from the navbar", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/blog/");
  await page.waitForLoadState("networkidle"); // wait for hydration
  const link = page.locator("header nav a[href^='/ferramentas']").first();
  await link.focus();
  await expect(link).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/ferramentas\/?$/);
});

test("area markers: blue institutional, yellow articles, green skills, distinct and stable", async ({ page }) => {
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
  // skill rows carry the green marker on the left border, e-book covers the accent bar
  const border = await page.locator("[data-type=skill]").first().evaluate((el) => getComputedStyle(el).borderLeftColor);
  expect(border).toBe(colours.skills);
});

test("accessibility (axe) on store routes", async ({ page }) => {
  for (const route of ["/ferramentas/", "/ferramentas/skills/", "/ferramentas/ebooks/", "/ferramentas/skills/skill-001/"]) {
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
    ["/loja/skills/skill-001/", "/ferramentas/skills/skill-001/"],
  ]) {
    const res = await request.get(from, { maxRedirects: 0 });
    expect(res.status(), from).toBe(301);
    expect(new URL(res.headers()["location"], "http://x").pathname, from).toBe(to);
  }
});
