import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

import { contrast, expectTheme, useTheme } from "./theme";

// Superfícies, contraste e regressão visual do RC-DS-CF (ADR-26; ADR-09 emendado). O contrato de proibição do DS antigo e
// dos componentes está em tests/ds.spec.ts.
const ROOT = process.cwd();

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

/** True when any layer of a computed box-shadow is actually painted. */
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
const src = walk(join(ROOT, "app")).filter((f) => /\.(tsx?|mdx?|css)$/.test(f));

test.describe("source contract", () => {
	// ADR-15 / LANC-001 RQ-011–012: coral (2.33:1) and light blue (1.83:1) are never text.
	test("--illu-coral and --illu-blue-soft are never used as text colour", () => {
		const textUse = /(?<![-\w])(?:color|-webkit-text-fill-color)\s*:\s*var\(--(?:illu-coral|illu-blue-soft|graph-accent-event)\)|\btext-(?:\[var\()?\(?--(?:illu-coral|illu-blue-soft|graph-accent-event)/;
		const offenders = src.filter((f) => textUse.test(readFileSync(f, "utf-8"))).map((f) => relative(ROOT, f));
		expect(offenders, "coral e azul claro nunca como texto (ADR-15)").toEqual([]);
	});

	test("heavy shadows only on overlays (dialog, sheet, drawer, canvas popovers)", () => {
		const heavy = /shadow-(md|lg|xl|2xl)\b/;
		const offenders = src
			.filter((f) => /\.tsx$/.test(f) && !f.includes(join("components", "ui")))
			.map((f) => relative(ROOT, f))
			.filter((f) => heavy.test(readFileSync(join(ROOT, f), "utf-8")));
		expect(offenders, "sombra de overlay fora de um overlay").toEqual([]);
	});
});

test.describe("tokens", () => {
	test("surface aliases resolve to the RC-DS-CF values (no parallel visual system)", async ({ page }) => {
		await page.goto("/fontes/");
		for (const [alias, base] of [
			["--surface-page", "--cf-bg"],
			["--surface-default", "--cf-bg-200"],
			["--surface-subtle", "--cf-bg-200"],
			["--surface-hover", "--cf-bg-300"],
			["--surface-tabular", "--cf-bg-300"],
			["--surface-model", "--cf-accent-soft"],
			["--border-default", "--cf-border"],
			["--border-strong", "--cf-border-strong"],
			["--card", "--cf-bg-200"],
			["--border", "--cf-border"],
			["--plain-surface", "--cf-bg-200"],
			["--primary-soft", "--cf-accent-soft"],
		] as const) {
			expect(await resolve(page, "background-color", `var(${alias})`), alias).toBe(await resolve(page, "background-color", `var(${base})`));
		}
		expect(await resolve(page, "box-shadow", "var(--shadow-sm)")).toBe(await resolve(page, "box-shadow", "var(--elevation-raised)"));
		for (const s of ["md", "lg", "xl"]) expect(await resolve(page, "box-shadow", `var(--shadow-${s})`)).toBe(await resolve(page, "box-shadow", "var(--elevation-overlay)"));
	});

	for (const theme of ["light", "dark"] as const) {
		test(`RC-DS-CF text and accent pairs keep AA (${theme})`, async ({ page }) => {
			await useTheme(page, theme);
			await page.goto("/fontes/");
			await expectTheme(page, theme);
			const c = async (fg: string, bg: string) => contrast(page, await resolve(page, "color", `var(${fg})`), await resolve(page, "background-color", `var(${bg})`));
			for (const bg of ["--cf-bg", "--cf-bg-200", "--cf-bg-300"]) {
				expect(await c("--cf-fg", bg), `fg on ${bg}`).toBeGreaterThanOrEqual(7);
				expect(await c("--cf-fg-muted", bg), `muted on ${bg}`).toBeGreaterThanOrEqual(4.5);
				expect(await c("--cf-accent-text", bg), `accent text on ${bg}`).toBeGreaterThanOrEqual(4.5);
			}
			// sobre o acento: texto pequeno escuro (AA 4.5) e branco só em texto grande (AA 3:1)
			expect(await c("--cf-on-accent-ink", "--cf-accent"), "ink on accent").toBeGreaterThanOrEqual(4.5);
			expect(await c("--cf-on-accent-ink", "--cf-accent-200"), "ink on accent-200").toBeGreaterThanOrEqual(4.5);
			expect(await c("--cf-on-accent", "--cf-accent"), "white (large) on accent").toBeGreaterThanOrEqual(3);
		});
	}
});

test.describe("flat cards, real overlays", () => {
	for (const route of ["/", "/artigos/", "/ferramentas/", "/admin/"]) {
		test(`${route}: cards are flat (no painted shadow)`, async ({ page }) => {
			await page.goto(route);
			const shadows = await page.locator(".ds-card").evaluateAll((els) => els.map((e) => getComputedStyle(e).boxShadow));
			expect(shadows.length, route).toBeGreaterThan(0);
			for (const s of shadows) expect(paintsShadow(s), s).toBe(false);
		});
	}
});

// Rotas de cada família (um layout demonstrativo por rota, ADR-26).
const ROUTES = ["/", "/artigos/", "/artigos/riscos-cognitivos-guia/", "/mapas/", "/ferramentas/", "/sobre/", "/rota-inexistente/"];

test.describe("editorial routes", () => {
	for (const route of ROUTES) {
		test(`${route}: no overflow at 320/390/768/1363 in both themes`, async ({ page }) => {
			test.setTimeout(120_000);
			for (const theme of ["light", "dark"] as const) {
				await useTheme(page, theme);
				for (const width of [320, 390, 768, 1363]) {
					await page.setViewportSize({ width, height: 900 });
					await page.goto(route);
					await expectTheme(page, theme);
					expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), `${theme} ${width}px`).toBeLessThanOrEqual(0);
				}
			}
		});
	}

	test("axe: no serious or critical issues on the main routes, both themes", async ({ page }) => {
		test.setTimeout(240_000);
		for (const theme of ["light", "dark"] as const) {
			await useTheme(page, theme);
			for (const route of ROUTES) {
				await page.goto(route);
				await expectTheme(page, theme);
				const { violations } = await new AxeBuilder({ page }).analyze();
				const serious = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
				expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(" | ")}`), `${theme} ${route}`).toEqual([]);
			}
		}
	});

	test("keyboard: skip link and visible focus on the header", async ({ page }) => {
		await page.setViewportSize({ width: 1363, height: 900 });
		await page.goto("/");
		await page.keyboard.press("Tab");
		const skip = page.getByRole("link", { name: "Pular para o conteúdo" });
		await expect(skip).toBeFocused();
		await expect(skip).toBeVisible();
		await page.keyboard.press("Tab");
		const ring = await page.locator(":focus").evaluate((e) => getComputedStyle(e).boxShadow + " " + getComputedStyle(e).outlineStyle);
		expect(paintsShadow(ring) || !ring.endsWith("none"), "focus ring").toBe(true);
	});
});

test.describe("visual regression (one layout per route family)", () => {
	const shots: [string, string][] = [
		["home", "/"],
		["blog", "/artigos/"],
		["artigo", "/artigos/riscos-cognitivos-guia/"],
		["ferramentas", "/ferramentas/"],
		["comece", "/comece/"],
		["admin", "/admin/"],
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
