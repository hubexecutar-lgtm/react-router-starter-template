import { expect, test } from "@playwright/test";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

// RC-DS-CF (ADR-26, docs/design-system/DS-CF-001.md): uma identidade só em todas as rotas, públicas e de admin.
// Este spec trava (1) a ausência do DS antigo no código, (2) o hex só no bloco de tokens e (3) o contrato dos componentes
// nas páginas: aviso de layout demonstrativo, h1 único, alvos ≥ 44 px e foco visível.
const ROOT = process.cwd();
const walk = (dir: string): string[] => readdirSync(dir).flatMap((n) => (statSync(join(dir, n)).isDirectory() ? walk(join(dir, n)) : [join(dir, n)]));
const APP = walk(join(ROOT, "app")).filter((f) => /\.(tsx?|css)$/.test(f));
const read = (f: string) => readFileSync(f, "utf8");
const rel = (f: string) => relative(ROOT, f);

test.describe("DS antigo fora do código (ADR-26)", () => {
	test("nenhuma classe nem token do DS antigo", () => {
		// hy-* (Editorial Hybrid v4), stories-* (Stories), rc-* de composição e tokens --ref-*/--hy-*/--home-*.
		const banned = /\b(?:hy-[a-z]|stories-(?!fixtures)[a-z]|rc-(?:cell|surface|band|display|title|eyebrow|lead|meta|link|rule|prose)\b|cfh-)|--(?:ref|hy|home)-[a-z]/;
		const offenders = APP.filter((f) => banned.test(read(f))).map(rel);
		expect(offenders).toEqual([]);
	});

	test("rotas e features não importam componentes do DS antigo", () => {
		const banned = /from "@\/components\/(?:ui|stories|editorial|layout|design-system)\//;
		const scope = APP.filter((f) => /[\\/]app[\\/](?:routes|features|layouts|components[\\/](?:site|landing|article|ds|plain))[\\/]/.test(f));
		const offenders = scope.filter((f) => banned.test(read(f))).map(rel);
		expect(offenders).toEqual([]);
	});

	test("os diretórios do DS antigo deixaram de existir", () => {
		for (const dir of ["app/components/stories", "app/components/editorial", "app/components/layout"]) expect(existsSync(join(ROOT, dir)), dir).toBe(false);
		expect(existsSync(join(ROOT, "app/styles/home.css"))).toBe(false);
		expect(existsSync(join(ROOT, "tests/stories.spec.ts"))).toBe(false);
	});

	test("hex de identidade só no global.css; componentes ds-*.css só com var()", () => {
		const hex = /#[0-9a-f]{3,8}\b/i;
		const css = APP.filter((f) => f.endsWith(".css") && !f.endsWith(join("styles", "global.css")));
		const offenders = css.filter((f) => read(f).replace(/\/\*[\s\S]*?\*\//g, "").match(hex)).map(rel);
		expect(offenders, "hex fora do global.css").toEqual([]);
		const tsx = APP.filter((f) => /\.tsx$/.test(f) && !f.includes(join("components", "ui")));
		const inTsx = tsx.filter((f) => /(?:color|background|border|fill|stroke)[^;\n]*#[0-9a-f]{3,8}\b/i.test(read(f))).map(rel);
		expect(inTsx, "hex em TSX").toEqual([]);
		// o bloco RC-DS-CF existe e é a fonte do acento
		expect(read(join(ROOT, "app/styles/global.css"))).toMatch(/RC-DS-CF[\s\S]*--cf-accent: #ff5e1f;/);
		// o azul antigo só sobrevive na folha A4 do Prisma (exceção 1 do ADR-26)
		expect(read(join(ROOT, "app/styles/global.css")).replace(/\.prisma-sheet \{[\s\S]*?\n\}/, "")).not.toMatch(/#2563eb/i);
	});

	test("todo componente novo do DS está especificado no DS-CF-001", () => {
		const spec = [
			read(join(ROOT, "docs/design-system/DS-CF-001.md")),
			...readdirSync(join(ROOT, "docs/design-system"))
				.filter((f) => /^DS-CF-001-.+\.md$/.test(f))
				.map((f) => read(join(ROOT, "docs/design-system", f))),
		].join("\n");
		const exported = [...read(join(ROOT, "app/components/ds/index.tsx")).matchAll(/export (?:function|const) ([A-Z][A-Za-z]+)/g)].map((m) => m[1]);
		const aliases: Record<string, string> = { Button: "Botão", Table: "Tabela", MoreLink: "Saiba mais", CardGrid: "Card", Chips: "Chip", ConfirmDialog: "Dialog", Input: "Field", Textarea: "Field", Select: "Field", Check: "Field", SectionHead: "Cabeçalho de seção", Frame: "Quadro", Dots: "Pontos", Tabs: "Abas", DemoNotice: "DemoNotice", Toc: "Toc" };
		for (const name of exported) expect(spec, name).toContain(aliases[name] ?? name);
	});
});

// Uma página por família: o layout demonstrativo é rotulado, tem h1 único e controles acessíveis.
const PAGES: [string, boolean][] = [
	["/artigos/", true],
	["/artigos/riscos-cognitivos-guia/", true],
	["/mapas/", true],
	["/ferramentas/", true],
	["/ferramentas/solucoes/", true],
	["/sobre/", true],
	["/comece/", true],
	["/fontes/", true],
	["/admin/", true],
	["/", false],
];

test.describe("componentes nas páginas", () => {
	for (const [route, notice] of PAGES) {
		test(`${route}: h1 único, aviso de demonstração e alvos ≥ 44 px`, async ({ page }) => {
			await page.setViewportSize({ width: 390, height: 844 });
			await page.goto(route);
			await expect(page.locator("main h1")).toHaveCount(1);
			if (notice) await expect(page.locator("main [data-demo-notice]").first()).toBeVisible();
			const small = await page
				.locator("main :is(.ds-btn, .ds-chip, .ds-tab, .ds-link, .ds-btn-white, .ds-btn-soft, .ds-pill, .ds-field-control, .ds-copy, .plain-surface__copy)")
				.evaluateAll((els) =>
					els
						.filter((e) => (e as HTMLElement).offsetParent !== null)
						.map((e) => ({ t: (e.textContent ?? "").trim().slice(0, 30), h: e.getBoundingClientRect().height }))
						.filter((r) => r.h < 41.5),
				);
			expect(small, route).toEqual([]);
		});
	}

	test("botão primário: acento com texto escuro, pílula, foco com anel de 3 px", async ({ page }) => {
		await page.goto("/comece/");
		const btn = page.locator("main .ds-btn[data-variant=primary]").first();
		const cs = await btn.evaluate((e) => {
			const s = getComputedStyle(e);
			return { bg: s.backgroundColor, color: s.color, radius: s.borderTopLeftRadius };
		});
		expect(cs).toEqual({ bg: "rgb(255, 94, 31)", color: "rgb(38, 38, 38)", radius: "9999px" });
		await btn.focus();
		await page.keyboard.press("Shift+Tab");
		await page.keyboard.press("Tab");
		expect(await btn.evaluate((e) => getComputedStyle(e).outlineWidth)).toBe("3px");
	});

	test("cartão laranja: título grande em branco, texto pequeno escuro", async ({ page }) => {
		await page.goto("/");
		const h1 = await page.locator(".ds-hero h1").evaluate((e) => ({ c: getComputedStyle(e).color, s: parseFloat(getComputedStyle(e).fontSize) }));
		expect(h1.c).toBe("rgb(255, 255, 255)");
		expect(h1.s).toBeGreaterThanOrEqual(24);
		expect(await page.locator(".ds-hero-lead p").first().evaluate((e) => getComputedStyle(e).color)).toBe("rgb(38, 38, 38)");
	});
});
