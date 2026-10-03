// AUD-WEB-001: monta a comparação lado a lado (ref | antes | depois) e a sobreposição (antes ou
// depois sobre a referência, 50%) a partir das capturas de scripts/ux-compare.mjs. Saída em
// docs/audit/aud-web-001/compare/ (fora do git, porque contém a referência).
//
//   node scripts/ux-sidebyside.mjs [rótulos…]   (padrão: ref before after)
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { chromium } from "playwright";

const root = "docs/audit/aud-web-001";
const labels = process.argv.slice(2).length ? process.argv.slice(2) : ["ref", "before", "after"];
const outDir = join(root, "compare");
mkdirSync(outDir, { recursive: true });

const dataUri = (p) => `data:image/png;base64,${readFileSync(p).toString("base64")}`;
const browser = await chromium.launch({
	executablePath: existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined,
});
for (const width of [390, 768, 1440]) {
	const cols = labels.map((l) => ({ l, p: resolve(root, l, `full-${width}.png`) })).filter((c) => existsSync(c.p));
	if (cols.length < 2) continue;
	const colW = width === 1440 ? 560 : width === 768 ? 420 : 340;
	const html = `<body style="margin:0;font:600 14px system-ui;background:#fff;display:flex;gap:16px;padding:16px;align-items:flex-start">${cols
		.map(
			(c) =>
				`<figure style="margin:0;width:${colW}px"><figcaption style="margin-bottom:8px">${c.l} @${width}</figcaption><img src="${dataUri(c.p)}" style="width:100%;outline:1px solid #ccc"></figure>`,
		)
		.join("")}</body>`;
	const page = await browser.newPage({ viewport: { width: cols.length * (colW + 16) + 16, height: 800 } });
	await page.setContent(html, { waitUntil: "load" });
	await page.screenshot({ path: join(outDir, `side-${width}.png`), fullPage: true });

	// Sobreposição: cada rótulo (exceto ref) a 50% sobre a referência, no tamanho real da largura.
	if (cols[0].l === "ref") {
		for (const c of cols.slice(1)) {
			await page.setViewportSize({ width, height: 800 });
			await page.setContent(
				`<body style="margin:0;position:relative"><img src="${dataUri(cols[0].p)}" style="display:block;width:${width}px"><img src="${dataUri(c.p)}" style="position:absolute;top:0;left:0;width:${width}px;opacity:.5"></body>`,
				{ waitUntil: "load" },
			);
			await page.screenshot({ path: join(outDir, `overlay-${c.l}-${width}.png`), fullPage: true });
		}
	}
	await page.close();
}
await browser.close();
console.log(`ok: ${outDir}`);
