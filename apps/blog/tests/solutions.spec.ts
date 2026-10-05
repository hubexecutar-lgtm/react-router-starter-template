import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";

import { SCIENTIFIC_SOURCES } from "../app/data/sources-scientific";
import { SOLUTIONS } from "../app/features/solutions/data";

// RC-PUB-PACK-003 (ADR-24): as 6 soluções em /ferramentas/solucoes/ seguem o schema RC-SCHEMA-001.
const YAML = "../../docs/lancamento/LANC-001/intake/RC-PUB-PACK-003/03-data/RC_SCHEMA_6_SOLUCOES_v3.0.0.yaml";
const EVIDENCE_STATUS = ["MECANISMO APOIADO", "MECANISMOS APOIADOS", "COMPONENTES APOIADOS", "EVIDÊNCIA INDIRETA"];
const words = (s: string) => s.trim().split(/\s+/).length;

test.describe("schema das soluções (RC-SCHEMA-001)", () => {
	test("data.ts é o YAML do intake, sem reescrita", () => {
		const doc = parse(readFileSync(join(process.cwd(), YAML), "utf8"));
		expect(SOLUTIONS.map((s) => s.id)).toEqual(doc.solutions.map((s: { id: string }) => s.id));
		for (const [i, s] of doc.solutions.entries()) {
			const d = SOLUTIONS[i];
			expect(d.yellow12, s.id).toBe(s.yellow12);
			expect(d.pain, s.id).toBe(s.pain);
			expect(d.steps, s.id).toEqual(s.steps);
			expect(d.functions.map((f) => `${f.name} — ${f.detail}`), s.id).toEqual(s.functions);
		}
	});

	test("6 soluções: amarelo com exatamente 12 palavras, 3 funções, 3 passos, indicadores, estado e fontes do RC-SRC-002", () => {
		expect(SOLUTIONS).toHaveLength(6);
		const keys = new Set(SCIENTIFIC_SOURCES.map((s) => s.key));
		for (const s of SOLUTIONS) {
			expect(words(s.yellow12), `${s.id}: "${s.yellow12}"`).toBe(12);
			expect(s.functions, s.id).toHaveLength(3);
			expect(s.steps, s.id).toHaveLength(3);
			expect(s.metrics.length, s.id).toBeGreaterThan(0);
			expect(EVIDENCE_STATUS, s.id).toContain(s.evidenceStatus);
			expect(s.refs.length, s.id).toBeGreaterThan(0);
			for (const r of s.refs) expect(keys.has(r), `${s.id} cita ${r}`).toBe(true);
		}
	});
});

test.describe("páginas /ferramentas/solucoes/", () => {
	test("o catálogo lista as 6 soluções como conteúdo publicado", async ({ page }) => {
		await page.goto("/ferramentas/solucoes/");
		for (const s of SOLUTIONS) await expect(page.locator(`a[href="/ferramentas/solucoes/${s.slug}/"]`).first()).toBeVisible();
		await expect(page.getByText("Catálogo de exemplo")).toHaveCount(0);
	});

	for (const s of SOLUTIONS) {
		test(`${s.id} ${s.name}: card 2×2 na ordem do schema, texto do MDX e acessibilidade`, async ({ page }) => {
			await page.goto(`/ferramentas/solucoes/${s.slug}/`);
			await expect(page.getByRole("heading", { level: 1 })).toHaveText(s.name);
			const card = page.locator("[data-solution-card]");
			await expect(card.locator("[data-quadrant]")).toHaveCount(4);
			expect(await card.locator("[data-quadrant]").evaluateAll((els) => els.map((e) => e.getAttribute("data-quadrant")))).toEqual([
				"atencao",
				"demanda",
				"tecnica",
				"progresso",
			]);
			// Cor nunca é o único indicador: cada quadrante tem número e rótulo em texto.
			for (const label of ["01 · Atenção", "02 · Demanda executiva", "03 · Técnica", "04 · Progresso"]) await expect(card).toContainText(label);
			await expect(card.locator("[data-yellow12]")).toHaveText(s.yellow12);
			await expect(card.locator("[data-evidence-status]")).toHaveText(s.evidenceStatus);
			// Corpo do MDX (sem reescrita) depois do card; nenhum infográfico v2.0.
			const body = page.locator("[data-article-body]");
			await expect(body).toContainText("Macro problema");
			await expect(body).toContainText(s.risk);
			await expect(page.locator("main img[src*='risco-cognitivo/solucoes']")).toHaveCount(0);
			await expect(page.locator("[data-cta=primary]")).toHaveCount(1);
			const axe = await new AxeBuilder({ page }).include("main").withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
			expect(axe.violations.filter((v) => v.impact === "serious" || v.impact === "critical").map((v) => v.id)).toEqual([]);
		});
	}

	test("o artigo 04 linka as 6 soluções no lugar dos infográficos", async ({ page }) => {
		await page.goto("/artigos/estrategias-reduzir-riscos-cognitivos/");
		for (const s of SOLUTIONS) await expect(page.locator(`[data-solution-link="${s.slug}"] a`)).toHaveAttribute("href", `/ferramentas/solucoes/${s.slug}/`);
	});

	test("a correlação da solução cita o próprio texto (RQ-121)", () => {
		const src = readFileSync(join(process.cwd(), "app/features/store/data/correlations.ts"), "utf8");
		const quote = /id: "formulario-padrao-do-ciclo"[\s\S]*?quote: "([^"]+)"/.exec(src)![1];
		expect(readFileSync(join(process.cwd(), "content/solucoes/formulario-padrao-do-ciclo.mdx"), "utf8")).toContain(quote);
	});
});

test("/fontes/ lista as fontes científicas do RC-SRC-002, cada uma com âncora", async ({ page }) => {
	await page.goto("/fontes/");
	const list = page.locator("[data-scientific-sources] li");
	await expect(list).toHaveCount(SCIENTIFIC_SOURCES.length);
	for (const s of SCIENTIFIC_SOURCES) await expect(page.locator(`#${s.id} a`)).toHaveAttribute("href", s.url);
});
