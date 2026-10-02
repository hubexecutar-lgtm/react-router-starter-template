import { expect, test } from "@playwright/test";
import jsQR from "jsqr";
import { PNG } from "pngjs";

import { DEFAULT_BASE_URL, ROUTES, ROUTE_GROUPS, absoluteUrl } from "../app/data/routes";
import { GENERATED_ROUTES, scanBlogSlugs, scanPages, scanPublicTools } from "../app/lib/routes/scan";

// Workflow "toda nova rota ou link gerado entra no hub" (ADR-06).
// `npm run routes:check` roda este arquivo.
const ROOT = process.cwd();
const registered = new Set(ROUTES.filter((r) => r.kind === "route").map((r) => r.path));

test.describe("registry ↔ repository", () => {
  test("every page, static tool and blog post is registered (or listed automatically)", () => {
    const real = new Set<string>([...scanPages(ROOT), ...scanPublicTools(ROOT), ...GENERATED_ROUTES]);
    const missing = [...real].filter((p) => !registered.has(p)).sort();
    expect(
      missing,
      `Rotas sem registro em src/data/routes.ts (ADR-06):\n  ${missing.join("\n  ")}\nAcrescente uma entrada para cada uma.`,
    ).toEqual([]);
  });

  test("every registered route exists in the repository", () => {
    const real = new Set<string>([...scanPages(ROOT), ...scanPublicTools(ROOT), ...GENERATED_ROUTES]);
    const orphans = [...registered].filter((p): p is string => !!p && !real.has(p));
    expect(
      orphans,
      `Entradas registradas que não existem no código:\n  ${orphans.join("\n  ")}\nRemova a entrada ou crie a rota.`,
    ).toEqual([]);
  });

  test("blog posts are picked up from the collection", () => {
    expect(scanBlogSlugs(ROOT).length).toBeGreaterThan(0);
    for (const slug of scanBlogSlugs(ROOT)) {
      expect(registered.has(`/blog/${slug}/`), `${slug} é listado automaticamente; não registre à mão`).toBe(false);
    }
  });

  test("entries are well-formed and unique", () => {
    const ids = ROUTES.map((r) => r.id);
    expect(new Set(ids).size, "ids duplicados").toBe(ids.length);
    for (const r of ROUTES) {
      expect(ROUTE_GROUPS, r.id).toContain(r.group);
      expect(r.addedAt, r.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(r.id, r.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      if (r.kind === "route") {
        expect(r.path, r.id).toMatch(/^\/([\w.-]+\/)*[\w.-]*$/);
        expect(r.path!.startsWith("/"), r.id).toBe(true);
        expect(r.url, `${r.id}: rota não usa url`).toBeUndefined();
      } else {
        expect(r.url, r.id).toMatch(/^https:\/\//);
        expect(r.group, `${r.id}: links gerados ficam em Links gerados`).toBe("Links gerados");
        expect(r.path, `${r.id}: link não usa path`).toBeUndefined();
      }
    }
    const paths = ROUTES.filter((r) => r.kind === "route").map((r) => r.path);
    expect(new Set(paths).size, "paths duplicados").toBe(paths.length);
  });

  test("QR targets never use a branch preview host", () => {
    expect(DEFAULT_BASE_URL).not.toMatch(/claude-.*-risco-cognitivo/);
    for (const r of ROUTES) expect(absoluteUrl(r)).not.toMatch(/claude-[a-z]+-[a-z]+-\w+-risco/);
  });
});

test.describe("/admin/rotas/", () => {
  test("renders one card per entry with a QR that decodes to its URL", async ({ page }) => {
    await page.goto("/admin/rotas/");
    const cards = page.locator(".route-card");
    const total = await cards.count();
    expect(total).toBeGreaterThanOrEqual(ROUTES.length + scanBlogSlugs(ROOT).length);
    await expect(page.getByTestId("hub-summary").locator("[data-count=total]")).toHaveText(String(total));
    await expect(page.getByTestId("hub-base")).toContainText(DEFAULT_BASE_URL);

    // every registry route has a card
    for (const r of ROUTES) await expect(page.locator(`.route-card[data-id="${r.id}"]`)).toHaveCount(1);

    // real round trip: screenshot each QR, decode it, compare with the URL printed on the card
    const seen = new Set<string>();
    for (let i = 0; i < total; i++) {
      const card = cards.nth(i);
      await card.scrollIntoViewIfNeeded();
      const url = await card.locator("a[href]").first().getAttribute("href");
      const png = PNG.sync.read(await card.locator("[role=img]").screenshot({ scale: "device" }));
      const decoded = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
      expect(decoded?.data, `QR do card ${i} (${url})`).toBe(url);
      seen.add(decoded!.data);
    }
    expect(seen.size, "QRs distintos").toBe(total);
  });

  test("filters by text, group and exposure; copy puts the URL on the clipboard", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/admin/rotas/");
    const visible = () => page.locator(".route-card:not(.hidden)").count();
    const all = await visible();

    await page.getByLabel("Filtrar por nome, rota ou URL").fill("design-system");
    expect(await visible()).toBe(1);
    await page.getByLabel("Filtrar por nome, rota ou URL").fill("");

    await page.getByLabel("Grupo", { exact: true }).selectOption("Blog");
    const blog = await visible();
    expect(blog).toBeGreaterThan(1);
    expect(blog).toBeLessThan(all);
    await page.getByLabel("Grupo", { exact: true }).selectOption("");

    await page.getByLabel("Exposição", { exact: true }).selectOption("internal");
    const internal = await page.locator(".route-card:not(.hidden)").evaluateAll((els) => els.map((e) => e.getAttribute("data-group")));
    expect(new Set(internal)).toEqual(new Set(["Interno (admin)"]));
    await page.getByLabel("Exposição", { exact: true }).selectOption("");

    await page.getByLabel("Filtrar por nome, rota ou URL").fill("zzz-inexistente");
    expect(await visible()).toBe(0);
    await expect(page.locator("[data-hub-empty]")).toBeVisible();
    await page.getByLabel("Filtrar por nome, rota ou URL").fill("");

    const card = page.locator('.route-card[data-id="faq"]');
    await card.getByRole("button", { name: "Copiar URL" }).click();
    await expect(card.getByRole("button")).toContainText("Copiado");
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(`${DEFAULT_BASE_URL}/faq/`);
  });

  test("is listed in the admin panel, and has no horizontal overflow", async ({ page }) => {
    await page.goto("/admin/");
    await expect(page.getByRole("link", { name: /Rotas e links/ })).toHaveAttribute("href", "/admin/rotas/");
    for (const width of [320, 375, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/admin/rotas/");
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), `${width}px`).toBeLessThanOrEqual(0);
    }
  });

  test("python archive is downloadable", async ({ request }) => {
    const res = await request.get("/admin/tools/qr-python.zip");
    expect(res.status()).toBe(200);
    expect((await res.body()).subarray(0, 2).toString()).toBe("PK");
  });
});
