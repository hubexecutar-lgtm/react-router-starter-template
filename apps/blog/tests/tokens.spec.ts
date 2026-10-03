import { expect, test, type Page } from "@playwright/test";

import { contrast } from "./theme";

// Mockup tokens (RC-DESIGN-MOCKUPS-001 / ADR-11): exact values of mood board 10 on every route.
const SHOWROOM = "/admin/design-system/";

const color = (page: Page, value: string) =>
  page.evaluate((v) => {
    const el = document.createElement("div");
    el.style.color = v;
    document.body.appendChild(el);
    const out = getComputedStyle(el).color;
    el.remove();
    return out;
  }, value);

test("palette tokens carry the mockup values", async ({ page }) => {
  await page.goto(SHOWROOM);
  const expected: Record<string, string> = {
    "--background": "rgb(255, 255, 255)",
    "--card": "rgb(245, 245, 244)",
    "--border": "rgb(234, 234, 232)",
    "--surface-model": "rgb(239, 246, 255)",
    "--foreground": "rgb(32, 33, 36)",
    "--muted-foreground": "rgb(107, 114, 128)",
    "--muted-foreground-on-gray": "rgb(95, 102, 112)",
    "--primary": "rgb(37, 99, 235)",
    "--primary-hover": "rgb(29, 78, 216)",
    "--ring": "rgb(37, 99, 235)",
  };
  for (const [token, rgb] of Object.entries(expected)) expect(await color(page, `var(${token})`), token).toBe(rgb);
});

test("typography: Inter 700 for display, IBM Plex Mono for technical text", async ({ page }) => {
  await page.goto("/admin/rotas/");
  await page.evaluate(() => document.fonts.ready);
  const h1 = await page.locator("h1").evaluate((e) => ({ family: getComputedStyle(e).fontFamily, weight: getComputedStyle(e).fontWeight }));
  expect(h1.family.split(",")[0].replace(/"/g, "").trim()).toBe("Inter");
  expect(h1.weight).toBe("700");
  const mono = await page.locator(".rc-eyebrow, .rc-meta").first().evaluate((e) => getComputedStyle(e).fontFamily);
  expect(mono.split(",")[0].replace(/"/g, "").trim()).toBe("IBM Plex Mono");
  const body = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
  expect(body.split(",")[0].replace(/"/g, "").trim()).toBe("Inter");
});

test("secondary text switches to the AA gray inside gray surfaces", async ({ page }) => {
  await page.goto("/");
  const onCanvas = await page.locator("main .stories-meta").first().evaluate((e) => getComputedStyle(e).color);
  expect(onCanvas).toBe("rgb(107, 114, 128)");
  // editorial surface (SURFACE) and shadcn card
  await page.goto("/admin/rotas/");
  const inSurface = await page.locator("main .rc-surface .rc-eyebrow, main .rc-cell .text-muted-foreground").first().evaluate((e) => getComputedStyle(e).color);
  expect(inSurface).toBe("rgb(95, 102, 112)");
  for (const route of ["/admin/", SHOWROOM]) {
    await page.goto(route);
    const pairs = await page
      .locator("main :is(.rc-surface, [data-slot=card]) :is(.text-muted-foreground, .rc-eyebrow, .rc-meta)")
      .evaluateAll((els) =>
        els.slice(0, 40).map((el) => {
          let bg = "rgba(0, 0, 0, 0)";
          for (let n: Element | null = el; n && bg === "rgba(0, 0, 0, 0)"; n = n.parentElement) bg = getComputedStyle(n).backgroundColor;
          return [getComputedStyle(el).color, bg] as const;
        }),
      );
    expect(pairs.length, route).toBeGreaterThan(0);
    for (const [fg, bg] of pairs) expect(await contrast(page, fg, bg), `${route}: ${fg} on ${bg}`).toBeGreaterThanOrEqual(4.5);
  }
});

test("buttons: 8px radius; outline uses the primary border and text", async ({ page }) => {
  await page.goto(SHOWROOM);
  const actions = page.getByTestId("grammar-actions");
  const solid = await actions.getByRole("link", { name: "Ler artigo" }).evaluate((e) => getComputedStyle(e));
  expect(solid.borderTopLeftRadius).toBe("8px");
  expect(solid.backgroundColor).toBe("rgb(37, 99, 235)");
  const outline = await actions.getByRole("link", { name: "Ver todos" }).evaluate((e) => {
    const cs = getComputedStyle(e);
    return { radius: cs.borderTopLeftRadius, border: cs.borderTopColor, color: cs.color, shadow: cs.boxShadow };
  });
  expect(outline).toMatchObject({ radius: "8px", border: "rgb(37, 99, 235)", color: "rgb(37, 99, 235)" });
});

test("visual grammar mirrors mood board 10", async ({ page }) => {
  await page.goto(SHOWROOM);
  const grammar = page.getByTestId("visual-grammar");
  await expect(grammar).toBeVisible();
  const swatches = await grammar.locator("[data-swatch]").evaluateAll((els) => els.map((e) => getComputedStyle(e).backgroundColor));
  expect(swatches).toEqual(["rgb(255, 255, 255)", "rgb(245, 245, 244)", "rgb(234, 234, 232)", "rgb(239, 246, 255)"]);
  for (const hex of ["#FFFFFF", "#F5F5F4", "#EAEAE8", "#EFF6FF"]) await expect(grammar).toContainText(hex);
  // table header on Tabular never carries blue text (4.29:1)
  const th = await grammar.locator(".ds-table th").first().evaluate((e) => getComputedStyle(e).color);
  expect(th).not.toBe("rgb(37, 99, 235)");
  expect(await grammar.getByTestId("grammar-model").evaluate((e) => getComputedStyle(e).backgroundColor)).toBe("rgb(239, 246, 255)");
});
