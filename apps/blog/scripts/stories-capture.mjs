// RC-FRONT-001 / AUD-WEB-002: captura e mede as páginas novas (Home, artigo, fixtures) em 390, 768 e 1363 px.
// Grava página inteira e um JSON com os estilos computados dos elementos-chave em docs/audit/aud-web-002/after/.
// Só mede ESTE site: a referência (OpenAI Stories) responde 403 ao container e não é capturada aqui; os valores
// dela vêm do handoff (tokens --ref-*) e são conferidos por tests/stories.spec.ts.
//
//   node scripts/stories-capture.mjs [--base http://localhost:4331]
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";

const args = process.argv.slice(2);
const base = args.includes("--base") ? args[args.indexOf("--base") + 1] : "http://localhost:4331";
const outDir = "docs/audit/aud-web-002/after";
mkdirSync(outDir, { recursive: true });

const ROUTES = [
	["home", "/"],
	["artigo", "/artigos/risco-cognitivo/"],
	["fixtures", "/admin/stories-fixtures/"],
];
const WIDTHS = [390, 768, 1363];

const SELECTORS = {
	header: "body > header",
	h1: "main h1",
	h2: "main h2",
	p: "main p",
	toolbar: "[data-stories-toolbar]",
	featuredImage: '[data-story-card="feature"] > div',
	smallCardImage: '[data-story-card="small"] > div',
	readingColumn: "[data-article-body] > div",
	heroImage: "[data-article-hero] img",
	quote: "blockquote",
	caption: "figcaption",
};

const browser = await chromium.launch({
	executablePath: existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined,
});
const report = { capturedAt: new Date().toISOString(), base, routes: {} };
for (const [name, path] of ROUTES) {
	report.routes[name] = {};
	for (const width of WIDTHS) {
		const page = await browser.newPage({ viewport: { width, height: 936 }, reducedMotion: "reduce" });
		await page.goto(base + path, { waitUntil: "networkidle" });
		await page.evaluate(async () => {
			for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
				scrollTo(0, y);
				await new Promise((r) => setTimeout(r, 50));
			}
			scrollTo(0, 0);
		});
		await page.waitForTimeout(400);
		report.routes[name][width] = await page.evaluate((selectors) => {
			const out = { pageHeight: document.documentElement.scrollHeight, overflowX: document.documentElement.scrollWidth - innerWidth };
			for (const [key, sel] of Object.entries(selectors)) {
				const el = document.querySelector(sel);
				if (!el) continue;
				const s = getComputedStyle(el);
				const r = el.getBoundingClientRect();
				out[key] = {
					fontSize: s.fontSize,
					lineHeight: s.lineHeight,
					letterSpacing: s.letterSpacing,
					fontWeight: s.fontWeight,
					x: Math.round(r.left * 100) / 100,
					y: Math.round((r.top + scrollY) * 100) / 100,
					w: Math.round(r.width * 100) / 100,
					h: Math.round(r.height * 100) / 100,
				};
			}
			return out;
		}, SELECTORS);
		// Barras fixas viram estáticas só na foto de página inteira.
		await page.evaluate(() => {
			for (const el of document.querySelectorAll("body *")) {
				if (["sticky", "fixed"].includes(getComputedStyle(el).position)) el.style.setProperty("position", "relative", "important");
			}
		});
		await page.screenshot({ path: join(outDir, `${name}-${width}.png`), fullPage: true });
		await page.close();
	}
}
await browser.close();
writeFileSync(join(outDir, "metrics.json"), JSON.stringify(report, null, 2) + "\n");
console.log(`ok: ${outDir}/metrics.json`);
