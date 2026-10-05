import { expect, test, type Page } from "@playwright/test";

import { contrast, expectTheme, useTheme } from "./theme";

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

test("typography: Inter 500 for display (ADR-22), IBM Plex Mono for technical text", async ({ page }) => {
  await page.goto("/admin/rotas/");
  await page.evaluate(() => document.fonts.ready);
  const h1 = await page.locator("h1").evaluate((e) => ({ family: getComputedStyle(e).fontFamily, weight: getComputedStyle(e).fontWeight }));
  expect(h1.family.split(",")[0].replace(/"/g, "").trim()).toBe("Inter");
  expect(h1.weight).toBe("500");
  // rótulos técnicos: a numeração dos passos do método na home (ADR-25)
  await page.goto("/");
  const mono = await page.locator(".cfh-step-n").first().evaluate((e) => getComputedStyle(e).fontFamily);
  expect(mono.split(",")[0].replace(/"/g, "").trim()).toBe("IBM Plex Mono");
  const body = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
  expect(body.split(",")[0].replace(/"/g, "").trim()).toBe("Inter");
});

test("secondary text switches to the AA gray inside gray surfaces", async ({ page }) => {
  await page.goto("/comece/");
  const onCanvas = await page.locator("main .hy-hero .hy-eyebrow").first().evaluate((e) => getComputedStyle(e).color);
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

// ---- ADR-15 / LANC-001 PR-B (RQ-011…015): illustration layer, graph aliases, motion, geometry.
const rootVar = (page: Page, name: string) =>
  page.evaluate((n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim(), name);
const probe = (page: Page, prop: string, value: string) =>
  page.evaluate(
    ([p, v]) => {
      const el = document.createElement("div");
      el.style.setProperty(p, v);
      document.body.appendChild(el);
      const out = getComputedStyle(el).getPropertyValue(p);
      el.remove();
      return out;
    },
    [prop, value],
  );

test("illustration layer carries the RC-BRAND-STYLING values (RQ-011)", async ({ page }) => {
  await page.goto(SHOWROOM);
  const expected: Record<string, string> = {
    "--illu-ink": "rgb(24, 52, 111)",
    "--illu-blue": "rgb(49, 85, 231)",
    "--illu-coral": "rgb(242, 143, 131)",
    "--illu-blue-soft": "rgb(169, 191, 244)",
    "--illu-canvas": "rgb(244, 246, 241)",
  };
  for (const [token, rgb] of Object.entries(expected)) expect(await color(page, `var(${token})`), token).toBe(rgb);
  await expect(page.getByTestId("illu-layer").locator("[data-illu-swatch]")).toHaveCount(5);
});

test("motion and component tokens (RQ-014, RQ-015)", async ({ page }) => {
  await page.goto(SHOWROOM);
  expect(await probe(page, "transition-timing-function", "var(--ease)")).toBe("cubic-bezier(0.22, 1, 0.36, 1)");
  expect(await probe(page, "transition-duration", "var(--dur-fast)")).toBe("0.15s");
  expect(await probe(page, "transition-duration", "var(--dur-base)")).toBe("0.25s");
  expect(await probe(page, "transition-duration", "var(--dur-slow)")).toBe("0.45s");
  expect(await probe(page, "border-top-left-radius", "var(--radius-sheet)")).toBe("20px");
  expect(await probe(page, "border-top-left-radius", "var(--radius-pill)")).toBe("40px");
  expect(await probe(page, "border-top-left-radius", "var(--radius-node)")).toBe("40px");
  expect(await probe(page, "border-top-left-radius", "var(--radius-card)")).toBe("2px");
  expect(await probe(page, "border-top-left-radius", "var(--radius-control)")).toBe("8px");
  expect(await probe(page, "box-shadow", "var(--shadow-overlay)")).toBe("rgba(0, 0, 0, 0.1) 0px 8px 28px 0px");
  expect(parseFloat(await rootVar(page, "--graph-dim-opacity"))).toBe(0.35);
  const hero = await page.getByTestId("hero-reveal").evaluate((e) => getComputedStyle(e).animationName);
  expect(hero).toBe("heroReveal");
});

for (const theme of ["light", "dark"] as const) {
  test(`graph marks with meaning reach 3:1 on the canvas and on the node (${theme}, RQ-012)`, async ({ page }) => {
    await useTheme(page, theme);
    await page.goto(SHOWROOM);
    await expectTheme(page, theme);
    const bg = await color(page, "var(--background)");
    const node = await color(page, "var(--graph-node-bg)");
    for (const token of ["--graph-edge", "--graph-edge-active", "--graph-node-border-selected", "--graph-node-text", "--graph-accent-event-outline"]) {
      const fg = await color(page, `var(${token})`);
      expect(await contrast(page, fg, bg), `${token} on --background`).toBeGreaterThanOrEqual(3);
      if (token !== "--graph-accent-event-outline") expect(await contrast(page, fg, node), `${token} on --graph-node-bg`).toBeGreaterThanOrEqual(3);
    }
    // Decorative fills stay below 3:1, so they must keep their outline (ADR-13).
    expect(await contrast(page, await color(page, "var(--illu-coral)"), "rgb(255, 255, 255)")).toBeLessThan(3);
  });
}

test("reduced motion: no animation nor transition longer than 0.01s (RQ-014)", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const route of ["/", SHOWROOM, "/artigos/risco-cognitivo/", "/admin/"]) {
    await page.goto(route);
    const slow = await page.evaluate(() => {
      const secs = (v: string) => v.split(",").map((x) => (x.trim().endsWith("ms") ? parseFloat(x) / 1000 : parseFloat(x)));
      const out: string[] = [];
      for (const el of document.querySelectorAll("*")) {
        for (const pseudo of [null, "::before", "::after"]) {
          const cs = getComputedStyle(el, pseudo);
          const anim = cs.animationName !== "none" ? Math.max(...secs(cs.animationDuration)) : 0;
          const trans = Math.max(...secs(cs.transitionDuration));
          if (anim > 0.01 || trans > 0.01) out.push(`${el.tagName.toLowerCase()}${pseudo ?? ""}.${el.className}: ${cs.animationDuration} / ${cs.transitionDuration}`);
        }
      }
      return out.slice(0, 10);
    });
    expect(slow, route).toEqual([]);
  }
  await page.goto(SHOWROOM);
  expect(await page.getByTestId("hero-reveal").evaluate((e) => getComputedStyle(e).animationName)).toBe("none");
  expect(parseFloat(await rootVar(page, "--dur-slow"))).toBe(0);
});
