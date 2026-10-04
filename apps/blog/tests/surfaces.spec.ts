import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

import { contrast, expectTheme, useTheme } from "./theme";

// Surface & Elevation contract (ADR-09 / DS-SURFACE-UNIFICATION-001).
const ROOT = process.cwd();
const SHOWROOM = "/admin/design-system/";

/** Resolves a CSS value (tokens included) to its computed colour/shadow through a probe. */
async function resolve(page: Page, prop: "color" | "background-color" | "box-shadow", value: string) {
  return page.evaluate(
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
}

/** True when any layer of a computed box-shadow is actually painted (Tailwind's shadow-none computes to transparent layers). */
function paintsShadow(value: string) {
  if (value === "none") return false;
  return [...value.matchAll(/rgba?\(([^)]*)\)\s+(-?[\d.]+)px\s+(-?[\d.]+)px\s+(-?[\d.]+)px/g)].some((m) => {
    const parts = m[1].split(",").map((x) => parseFloat(x));
    const alpha = parts.length === 4 ? parts[3] : 1;
    return alpha > 0 && [m[2], m[3], m[4]].some((n) => parseFloat(n) !== 0);
  });
}

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const f = join(dir, n);
    return statSync(f).isDirectory() ? walk(f) : [f];
  });
}
const src = walk(join(ROOT, "app")).filter((f) => /\.(tsx?|astro|mdx?|css)$/.test(f));

test.describe("source contract", () => {
  test("neutral hex values live only in the token layer (global.css)", () => {
    const offenders = src
      .filter((f) => !f.endsWith(join("styles", "global.css")))
      // + the --illu-* layer (ADR-13 / LANC-001 RQ-011)
      .filter((f) => /#f8f8f8|#ebebeb|#f5f5f4|#eaeae8|#eff6ff|#2563eb|#202124|#6b7280|#18346f|#3155e7|#f28f83|#a9bff4|#f4f6f1/i.test(readFileSync(f, "utf-8")))
      .map((f) => relative(ROOT, f));
    expect(offenders, "hex da paleta só em app/styles/global.css").toEqual([]);
  });

  // ADR-13 / LANC-001 RQ-011–012: coral (2.33:1) and light blue (1.83:1) are never text.
  test("--illu-coral and --illu-blue-soft are never used as text colour", () => {
    const textUse = /(?<![-\w])(?:color|-webkit-text-fill-color)\s*:\s*var\(--(?:illu-coral|illu-blue-soft|graph-accent-event)\)|\btext-(?:\[var\()?\(?--(?:illu-coral|illu-blue-soft|graph-accent-event)/;
    const offenders = src.filter((f) => textUse.test(readFileSync(f, "utf-8"))).map((f) => relative(ROOT, f));
    expect(offenders, "coral e azul claro nunca como texto (ADR-13)").toEqual([]);
  });

  test("shadow-md/lg/xl/2xl only on overlays; no shadow-sm on cards", () => {
    const overlay = new Set(
      ["dialog", "sheet", "alert-dialog", "drawer", "popover", "hover-card", "dropdown-menu", "context-menu", "menubar", "select", "navigation-menu", "tooltip", "chart"].map(
        (n) => `app/components/ui/${n}.tsx`,
      ),
    );
    const heavy = /shadow-(md|lg|xl|2xl)\b/;
    const offenders = src
      .filter((f) => /\.(tsx|astro)$/.test(f))
      .map((f) => relative(ROOT, f))
      .filter((f) => !overlay.has(f))
      .filter((f) => heavy.test(readFileSync(join(ROOT, f), "utf-8")));
    expect(offenders, "sombra de overlay fora de um overlay").toEqual([]);

    const sm = /shadow-sm\b/;
    const allowedSm = new Set(["app/components/ui/tabs.tsx", "app/components/ui/slider.tsx", "app/components/ui/sidebar.tsx"]);
    const smOffenders = src
      .filter((f) => /\.(tsx|astro)$/.test(f))
      .map((f) => relative(ROOT, f))
      .filter((f) => !allowedSm.has(f) && sm.test(readFileSync(join(ROOT, f), "utf-8")));
    expect(smOffenders, "shadow-sm em card").toEqual([]);
  });

  test("cards (Card component, admin and hub) declare no shadow", () => {
    const card = readFileSync(join(ROOT, "app/components/ui/card.tsx"), "utf-8");
    expect(card).toContain("shadow-none");
    expect(card).not.toMatch(/shadow-(xs|sm|md|lg|xl)/);
  });
});

test.describe("tokens", () => {
  test("surface contract values and aliases", async ({ page }) => {
    await page.goto(SHOWROOM);
    const expected: Record<string, string> = {
      // mood board 10 (ADR-11): Canvas, Subtle, Tabular, Diagram
      "--surface-page": "rgb(255, 255, 255)",
      "--surface-subtle": "rgb(245, 245, 244)",
      "--surface-default": "rgb(245, 245, 244)",
      "--surface-tabular": "rgb(234, 234, 232)",
      "--surface-model": "rgb(239, 246, 255)",
      "--surface-hover": "rgb(240, 240, 238)",
      "--surface-selected": "rgb(234, 234, 232)",
      "--border-subtle": "rgb(240, 240, 238)",
      "--border-default": "rgb(234, 234, 232)",
      "--border-strong": "rgb(214, 214, 211)",
    };
    for (const [token, rgb] of Object.entries(expected)) expect(await resolve(page, "background-color", `var(${token})`), token).toBe(rgb);
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--elevation-flat").trim())).toBe("none");
    // aliases resolve to the same colours: no parallel visual system
    for (const [alias, base] of [
      ["--plain-surface", "--surface-default"],
      ["--plain-border", "--border-default"],
      ["--card", "--surface-default"],
      ["--border", "--border-default"],
      ["--muted", "--surface-hover"],
      ["--surface-neutral", "--surface-default"],
      ["--surface-neutral-border", "--border-default"],
      ["--surface-selected", "--surface-tabular"],
      ["--table-head-surface", "--surface-tabular"],
      ["--primary-soft", "--surface-model"],
      ["--plain-accent-soft", "--surface-model"],
    ] as const) {
      expect(await resolve(page, "background-color", `var(${alias})`), alias).toBe(await resolve(page, "background-color", `var(${base})`));
    }
    // shadow scale collapses to the two elevation levels
    expect(await resolve(page, "box-shadow", "var(--shadow-sm)")).toBe(await resolve(page, "box-shadow", "var(--elevation-raised)"));
    for (const s of ["md", "lg", "xl"]) expect(await resolve(page, "box-shadow", `var(--shadow-${s})`)).toBe(await resolve(page, "box-shadow", "var(--elevation-overlay)"));
  });

  for (const theme of ["light", "dark"] as const) {
    test(`text, brand and surfaces keep AA (${theme})`, async ({ page }) => {
      await useTheme(page, theme);
      await page.goto(SHOWROOM);
      await expectTheme(page, theme);
      const c = async (fg: string, bg: string) =>
        contrast(page, await resolve(page, "color", `var(${fg})`), await resolve(page, "background-color", `var(${bg})`));

      // primary text on every surface; secondary gray: #6B7280 on the canvas, the on-gray
      // value on every gray surface (ADR-11 AA deviation, applied by scope in global.css)
      const grays = ["--surface-default", "--surface-hover", "--surface-selected", "--surface-tabular", "--surface-model"];
      for (const bg of ["--surface-page", ...grays]) {
        expect(await c("--foreground", bg), `foreground on ${bg}`).toBeGreaterThanOrEqual(7);
      }
      expect(await c("--muted-foreground", "--surface-page"), "muted-foreground on the canvas").toBeGreaterThanOrEqual(4.5);
      expect(await c("--muted-foreground-subtle", "--surface-page"), "subtle on the canvas").toBeGreaterThanOrEqual(4.5);
      for (const bg of grays) {
        expect(await c("--muted-foreground-on-gray", bg), `on-gray secondary on ${bg}`).toBeGreaterThanOrEqual(4.5);
      }
      // brand blue: links/titles on page, cards, hover and model panels (never on --surface-tabular)
      for (const bg of ["--surface-page", "--surface-default", "--surface-hover", "--surface-model"]) {
        expect(await c("--primary", bg), `primary on ${bg}`).toBeGreaterThanOrEqual(4.5);
      }
      expect(await c("--primary-foreground", "--primary"), "button label").toBeGreaterThanOrEqual(4.5);
      if (theme === "light") expect(await c("--primary-foreground", "--primary-hover"), "button label (hover)").toBeGreaterThanOrEqual(4.5);
    });
  }
});

test.describe("flat cards, real overlays", () => {
  const flat = async (page: Page, sel: string) => {
    const els = page.locator(sel);
    const n = await els.count();
    expect(n, sel).toBeGreaterThan(0);
    return els.evaluateAll((nodes) =>
      nodes.map((el) => {
        const cs = getComputedStyle(el);
        return { bg: cs.backgroundColor, borderWidth: cs.borderTopWidth, radius: cs.borderTopLeftRadius, shadow: cs.boxShadow };
      }),
    );
  };

  for (const [route, sel] of [
    [SHOWROOM, "[data-testid=kpi]"],
    ["/admin/", "a.rc-cell"],
    ["/admin/rotas/", ".route-card"],
    ["/ferramentas/", "[data-slot=card]"],
  ] as const) {
    // ADR-12: a card is a table cell — Subtle fill, no outline, 2px radius, no shadow.
    test(`${route} ${sel}: table-cell surface, no outline, no shadow`, async ({ page }) => {
      await page.goto(route);
      for (const s of await flat(page, sel)) {
        expect({ bg: s.bg, borderWidth: s.borderWidth, radius: s.radius }).toEqual({ bg: "rgb(245, 245, 244)", borderWidth: "0px", radius: "2px" });
        expect(paintsShadow(s.shadow), `shadow: ${s.shadow}`).toBe(false);
      }
    });
  }

  test("admin card hover changes surface, never adds a shadow", async ({ page }) => {
    await page.goto("/admin/");
    const card = page.locator("a.rc-cell").first();
    await card.hover();
    await expect.poll(() => card.evaluate((e) => getComputedStyle(e).backgroundColor)).toBe("rgb(240, 240, 238)");
    expect(paintsShadow(await card.evaluate((e) => getComputedStyle(e).boxShadow))).toBe(false);
  });

  test("a table inside a card keeps visible cells (page surface), a standalone table keeps the neutral one", async ({ page }) => {
    await page.goto(SHOWROOM);
    await page.locator("#dados").scrollIntoViewIfNeeded();
    await expect(page.locator("[data-testid=charts] .recharts-surface").first()).toBeVisible();
    await page.waitForLoadState("networkidle");
    await page.getByRole("tab", { name: "Tabela" }).click();
    const inCard = await page.locator("[data-slot=card] .ds-table td").first().evaluate((e) => getComputedStyle(e).backgroundColor);
    expect(inCard).toBe(await resolve(page, "background-color", "var(--surface-page)"));
    const standalone = await page.locator("[data-testid=table-reference] .ds-table td").first().evaluate((e) => getComputedStyle(e).backgroundColor);
    expect(standalone).toBe("rgb(245, 245, 244)");
  });

  test("dialog is a real overlay: elevation-overlay shadow, page surface", async ({ page }) => {
    await page.goto(SHOWROOM);
    await page.locator("#componentes").scrollIntoViewIfNeeded();
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Abrir dialog" }).click();
    const content = page.locator("[data-slot=dialog-content]");
    await expect(content).toBeVisible();
    const style = await content.evaluate((e) => ({ shadow: getComputedStyle(e).boxShadow, bg: getComputedStyle(e).backgroundColor }));
    expect(paintsShadow(style.shadow)).toBe(true);
    expect(style.shadow.endsWith(await resolve(page, "box-shadow", "var(--elevation-overlay)"))).toBe(true);
    expect(style.bg).toBe(await resolve(page, "background-color", "var(--surface-page)"));
  });

  test("showroom documents the three elevation levels", async ({ page }) => {
    await page.goto(SHOWROOM);
    for (const n of ["elevation-flat", "elevation-raised", "elevation-overlay"]) await expect(page.locator(`[data-elevation=${n}]`)).toHaveCount(1);
    await expect(page.getByTestId("surface-scale").locator("[data-surface-token]")).toHaveCount(8);
  });
});

// HANDOFF-RC-GLOBAL-DESIGN-CONTENT-001: the same contract on every editorial route and tool.
const EDITORIAL = [
  "/",
  "/blog/",
  "/blog/o-que-e-risco-cognitivo/",
  "/temas/",
  "/temas/controles-cognitivos/",
  "/mapas/",
  "/guias/",
  "/evidencias/",
  "/buscar/?q=risco",
  "/about/",
  "/faq/",
  "/contact/",
  "/pricing/",
  "/signup/",
  "/login/",
  "/privacy/",
  "/rota-inexistente/",
];

test.describe("editorial routes", () => {
  for (const route of EDITORIAL) {
    test(`${route}: neutral cards, no overflow at 390/768/1363 in both themes`, async ({ page }) => {
      test.setTimeout(90_000);
      for (const theme of ["light", "dark"] as const) {
        await useTheme(page, theme);
        for (const width of [390, 768, 1363]) {
          await page.setViewportSize({ width, height: 900 });
          await page.goto(route);
          await expectTheme(page, theme);
          expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), `${theme} ${width}px`).toBeLessThanOrEqual(0);
        }
        const cards = await page.locator('[class*="bg-[var(--surface-default)]"]').evaluateAll((nodes) =>
          nodes.map((el) => {
            const cs = getComputedStyle(el);
            return { bg: cs.backgroundColor, border: cs.borderTopColor, radius: cs.borderTopLeftRadius, shadow: cs.boxShadow };
          }),
        );
        const surface = await resolve(page, "background-color", "var(--surface-default)");
        const border = await resolve(page, "background-color", "var(--border-default)");
        for (const c of cards) {
          expect({ bg: c.bg, border: c.border, radius: c.radius }, theme).toEqual({ bg: surface, border, radius: "12px" });
          expect(paintsShadow(c.shadow), `shadow: ${c.shadow}`).toBe(false);
        }
      }
    });
  }

  test("axe: no serious or critical issues on editorial routes", async ({ page }) => {
    test.setTimeout(180_000);
    for (const route of EDITORIAL) {
      await page.goto(route);
      await page.waitForLoadState("networkidle");
      const { violations } = await new AxeBuilder({ page }).analyze();
      const serious = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(" | ")}`), route).toEqual([]);
    }
  });

  test("keyboard: skip link and visible focus on the primary nav", async ({ page }) => {
    await page.setViewportSize({ width: 1363, height: 900 });
    await page.goto("/blog/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Pular para o conteúdo" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    const focused = page.locator(":focus");
    const ring = await focused.evaluate((e) => getComputedStyle(e).boxShadow);
    expect(paintsShadow(ring) || ring.includes("rgb"), "focus ring").toBe(true);
    await expect(page.locator('header nav[aria-label="Principal"] a[aria-current="page"]')).toHaveText("Artigos");
  });
});

test.describe("standalone tools share the token source", () => {
  for (const [route, token] of [
    ["/hub-editorial/", "--surface"],
    ["/skills/", "--c-surface"],
    ["/catalogo-offline/", "--surface"],
  ] as const) {
    for (const theme of ["light", "dark"] as const) {
      test(`${route} ${theme}: neutral surface and border come from /ds/surfaces.css`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: theme });
        await page.goto(route);
        await page.waitForLoadState("networkidle");
        const probe = (v: string) => resolve(page, "background-color", v);
        expect(await probe(`var(${token})`)).toBe(await probe("var(--ds-surface-default)"));
        if (theme === "light") expect(await probe(`var(${token})`)).toBe("rgb(245, 245, 244)");
        else expect(await probe(`var(${token})`)).not.toBe("rgb(245, 245, 244)");
      });
    }
  }

  test("Hub dashboard table: segmented cells, header surface, no row borders", async ({ page }) => {
    await page.goto("/hub-editorial/");
    // The Hub renders with React/Babel from cdnjs; the contract under test is its CSS, so a
    // static table with the same classes is injected (works offline and behind proxies).
    await page.evaluate(() => {
      const wrap = document.createElement("div");
      wrap.className = "dash-table-wrap";
      wrap.innerHTML = '<table class="dash-table"><thead><tr><th>ID</th></tr></thead><tbody><tr><td>CNT-RC-0001</td></tr></tbody></table>';
      document.body.prepend(wrap);
    });
    const table = page.locator(".dash-table").first();
    await expect(table).toBeVisible();
    const s = await table.evaluate((el) => {
      const cs = getComputedStyle(el);
      const th = getComputedStyle(el.querySelector("th")!);
      const td = getComputedStyle(el.querySelector("td")!);
      return { collapse: cs.borderCollapse, spacing: cs.borderSpacing.split(" ")[0], th: th.backgroundColor, td: td.backgroundColor, tdBorder: td.borderBottomWidth, radius: td.borderTopLeftRadius };
    });
    expect(s).toEqual({ collapse: "separate", spacing: "3px", th: "rgb(234, 234, 232)", td: "rgb(245, 245, 244)", tdBorder: "0px", radius: "2px" });
  });
});

test.describe("visual regression (minimum routes)", () => {
  const shots: [string, string][] = [
    ["admin", "/admin/"],
    ["blog", "/blog/"],
    ["article", "/blog/do-risco-cognitivo-a-execucao-assistida/"],
    ["ferramentas", "/ferramentas/"],
    ["home", "/"],
    ["temas", "/temas/"],
    ["evidencias", "/evidencias/"],
  ];
  for (const [name, route] of shots) {
    for (const [label, size] of [["desktop", { width: 1280, height: 900 }], ["mobile", { width: 390, height: 844 }]] as const) {
      test(`${name} ${label}`, async ({ page }) => {
        await page.setViewportSize(size);
        await page.goto(route);
        await page.waitForLoadState("networkidle");
        await expect(page).toHaveScreenshot(`surface-${name}-${label}.png`, { threshold: 0.01, maxDiffPixelRatio: 0.002 });
        expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
      });
    }
  }
});
