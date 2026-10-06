import { expect, test, type Page } from "@playwright/test";

import { contrast, expectTheme, useTheme } from "./theme";

// RC-DS-CF (ADR-26, DS-CF-001 §2): a identidade transversal, com os valores medidos da cloudflare.com (ADR-25).
// Os aliases de infraestrutura (shadcn/Radix e camadas semânticas) apontam para os --cf-*.
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

test("RC-DS-CF: tokens de identidade e aliases (ADR-26)", async ({ page }) => {
  await page.goto("/fontes/");
  const expected: Record<string, string> = {
    "--cf-fg": "rgb(38, 38, 38)",
    "--cf-fg-muted": "rgb(112, 112, 112)",
    "--cf-bg": "rgb(255, 255, 255)",
    "--cf-bg-200": "rgb(253, 253, 252)",
    "--cf-bg-300": "rgb(249, 247, 246)",
    "--cf-border": "rgb(240, 240, 240)",
    "--cf-accent": "rgb(255, 94, 31)",
    "--cf-accent-text": "rgb(191, 76, 20)",
    "--cf-on-accent-ink": "rgb(38, 38, 38)",
    // aliases: nenhum azul de identidade sobrou
    "--background": "rgb(255, 255, 255)",
    "--foreground": "rgb(38, 38, 38)",
    "--muted-foreground": "rgb(112, 112, 112)",
    "--primary": "rgb(191, 76, 20)",
    "--ring": "rgb(191, 76, 20)",
    "--border": "rgb(240, 240, 240)",
  };
  for (const [token, rgb] of Object.entries(expected)) expect(await color(page, `var(${token})`), token).toBe(rgb);
});

test("tipografia: Hanken Grotesk em todo o site; IBM Plex Mono só nos rótulos técnicos (ADR-26)", async ({ page }) => {
  for (const route of ["/", "/artigos/riscos-cognitivos-guia/", "/mapas/", "/ferramentas/", "/admin/rotas/"]) {
    await page.goto(route);
    const fonts = await page.evaluate(() => ({ body: getComputedStyle(document.body).fontFamily, h1: getComputedStyle(document.querySelector("h1")!).fontFamily, w: getComputedStyle(document.querySelector("h1")!).fontWeight }));
    expect(fonts.body.split(",")[0].replace(/"/g, "").trim(), route).toBe("Hanken Grotesk");
    expect(fonts.h1.split(",")[0].replace(/"/g, "").trim(), route).toBe("Hanken Grotesk");
    expect(fonts.w, route).toBe("500");
  }
  await page.goto("/artigos/riscos-cognitivos-guia/");
  const mono = await page.locator("[data-article-meta] dd[data-mono]").evaluate((e) => getComputedStyle(e).fontFamily);
  expect(mono.split(",")[0].replace(/"/g, "").trim()).toBe("IBM Plex Mono");
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

test("illustration layer keeps the RC-BRAND-STYLING values in the repository (RQ-011; off screen since ADR-26)", async ({ page }) => {
  await page.goto("/fontes/");
  const expected: Record<string, string> = {
    "--illu-ink": "rgb(24, 52, 111)",
    "--illu-blue": "rgb(49, 85, 231)",
    "--illu-coral": "rgb(242, 143, 131)",
    "--illu-blue-soft": "rgb(169, 191, 244)",
    "--illu-canvas": "rgb(244, 246, 241)",
  };
  for (const [token, rgb] of Object.entries(expected)) expect(await color(page, `var(${token})`), token).toBe(rgb);
});

test("motion and component tokens (RQ-014, RQ-015; geometry from RC-DS-CF, ADR-26)", async ({ page }) => {
  await page.goto("/");
  expect(await probe(page, "transition-timing-function", "var(--ease)")).toBe("cubic-bezier(0.22, 1, 0.36, 1)");
  expect(await probe(page, "transition-duration", "var(--dur-fast)")).toBe("0.15s");
  expect(await probe(page, "transition-duration", "var(--dur-base)")).toBe("0.25s");
  expect(await probe(page, "transition-duration", "var(--dur-slow)")).toBe("0.45s");
  expect(await probe(page, "border-top-left-radius", "var(--radius-sheet)")).toBe("16px");
  expect(await probe(page, "border-top-left-radius", "var(--radius-pill)")).toBe("9999px");
  expect(await probe(page, "border-top-left-radius", "var(--radius-node)")).toBe("9999px");
  expect(await probe(page, "border-top-left-radius", "var(--radius-card)")).toBe("8px");
  expect(await probe(page, "border-top-left-radius", "var(--radius-control)")).toBe("8px");
  expect(await probe(page, "box-shadow", "var(--shadow-overlay)")).toBe("rgba(0, 0, 0, 0.12) 0px 12px 32px 0px");
  expect(parseFloat(await rootVar(page, "--graph-dim-opacity"))).toBe(0.35);
  const hero = await page.locator(".ds-hero-content").evaluate((e) => getComputedStyle(e).animationName);
  expect(hero).toBe("heroReveal");
});

for (const theme of ["light", "dark"] as const) {
  test(`graph marks with meaning reach 3:1 on the canvas and on the node (${theme}, RQ-012)`, async ({ page }) => {
    await useTheme(page, theme);
    await page.goto("/mapas/explorar/");
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
  for (const route of ["/", SHOWROOM, "/artigos/riscos-cognitivos-guia/", "/mapas/", "/admin/"]) {
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
  await page.goto("/");
  expect(await page.locator(".ds-hero-content").evaluate((e) => getComputedStyle(e).animationName)).toBe("none");
  expect(parseFloat(await rootVar(page, "--dur-slow"))).toBe(0);
});
