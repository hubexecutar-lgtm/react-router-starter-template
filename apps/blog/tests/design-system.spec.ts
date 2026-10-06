import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { contrast, expectTheme, useTheme } from "./theme";

// Showroom do RC-DS-CF (ADR-26, DS-CF-001 + DS-CF-001-admin): documentação viva (skill Design 1.2.0, /design-system
// document) de cada componente de @/components/ds, com tokens lidos do navegador e as camadas semânticas da exceção.
const SHOWROOM = "/admin/design-system/";
const SECTIONS = ["tokens", "laranja", "botoes", "cabecalhos", "cards", "navegacao", "leitura", "estados", "formularios", "dados", "plain", "camadas"];

test("showroom: uma seção por família de componentes e um espécime por componente exportado", async ({ page }) => {
	await page.goto(SHOWROOM);
	await expect(page.locator("main h1")).toHaveCount(1);
	for (const id of SECTIONS) await expect(page.locator(`#${id}`), id).toHaveCount(1);
	const exported = [...readFileSync(join(process.cwd(), "app/components/ds/index.tsx"), "utf8").matchAll(/export (?:function|const) ([A-Z][A-Za-z]+)/g)].map((m) => m[1]);
	const text = (await page.locator("main").textContent()) ?? "";
	for (const name of exported) expect(text, name).toContain(name);
});

for (const theme of ["light", "dark"] as const) {
	test(`tabela de contraste do showroom: todos os pares no mínimo (${theme})`, async ({ page }) => {
		await useTheme(page, theme);
		await page.goto(SHOWROOM);
		await expectTheme(page, theme);
		const rows = page.locator("[data-contrast-pair]");
		await expect.poll(() => rows.first().getAttribute("data-ratio")).not.toBeNull();
		const pairs = await rows.evaluateAll((els) => els.map((e) => ({ pair: e.getAttribute("data-contrast-pair"), ratio: Number(e.getAttribute("data-ratio")), min: Number(e.getAttribute("data-min")) })));
		expect(pairs.length).toBeGreaterThan(5);
		for (const p of pairs) expect(p.ratio, `${p.pair} (${theme})`).toBeGreaterThanOrEqual(p.min);
	});

	// Camada semântica (exceção 4 do ADR-26): séries de gráfico distintas e ≥ 3:1 sobre o painel.
	test(`chart palette: 5 distinct colours, each ≥3:1 on card (${theme})`, async ({ page }) => {
		await useTheme(page, theme);
		await page.goto(SHOWROOM);
		await expectTheme(page, theme);
		const colors = await page.evaluate(() => {
			const probe = (v: string) => {
				const el = document.createElement("div");
				el.style.color = v;
				document.body.appendChild(el);
				const out = getComputedStyle(el).color;
				el.remove();
				return out;
			};
			return { series: [1, 2, 3, 4, 5].map((n) => probe(`var(--chart-${n})`)), card: probe("var(--card)") };
		});
		expect(new Set(colors.series).size).toBe(5);
		for (const c of colors.series) expect(await contrast(page, c, colors.card), c).toBeGreaterThanOrEqual(3);
	});
}

test("abas do showroom: setas trocam a aba e o painel", async ({ page }) => {
	await page.goto(SHOWROOM);
	const demo = page.getByTestId("tabs-demo");
	const first = demo.getByRole("tab").first();
	await first.focus();
	await page.keyboard.press("ArrowRight");
	await expect(demo.getByRole("tab").nth(1)).toHaveAttribute("aria-selected", "true");
	await expect(demo.getByRole("tabpanel")).toBeVisible();
});

test("diálogo de confirmação: abre, prende o foco, Esc fecha e devolve o foco", async ({ page }) => {
	await page.goto(SHOWROOM);
	const trigger = page.getByRole("button", { name: "Limpar dados de exemplo" });
	await trigger.click();
	const dialog = page.getByRole("alertdialog");
	await expect(dialog).toBeVisible();
	await expect(dialog.getByRole("button", { name: "Limpar dados" })).toBeVisible();
	await page.keyboard.press("Escape");
	await expect(dialog).toHaveCount(0);
	await expect(trigger).toBeFocused();
});

for (const width of [320, 375, 768, 1440]) {
	test(`showroom sem rolagem horizontal @${width}px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 900 });
		await page.goto(SHOWROOM);
		expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
	});
}

test("axe: showroom sem problemas sérios ou críticos, nos dois temas", async ({ page }) => {
	test.setTimeout(90_000);
	for (const theme of ["light", "dark"] as const) {
		await useTheme(page, theme);
		await page.goto(SHOWROOM);
		await expectTheme(page, theme);
		const { violations } = await new AxeBuilder({ page }).include("main").analyze();
		const serious = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
		expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(" | ")}`), theme).toEqual([]);
	}
});

test("movimento reduzido: o letreiro do cartão laranja para", async ({ page }) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	await page.goto("/");
	expect(await page.locator(".ds-ticker-track").first().evaluate((e) => getComputedStyle(e).animationName)).toBe("none");
});

for (const width of [375, 1440]) {
	test(`visual: tokens do showroom @${width}px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 900 });
		await page.goto(SHOWROOM);
		await page.waitForLoadState("networkidle");
		await expect(page.locator("#tokens")).toHaveScreenshot(`ds-tokens-${width}.png`);
	});
}
