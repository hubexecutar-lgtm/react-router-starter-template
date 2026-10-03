// AUD-WEB-001: critérios de aceite da home nas larguras 390, 768 e 1440 — sem overflow horizontal,
// seções sem sobreposição, todos os links internos respondendo 200 e foco visível em cada ação
// percorrida por Tab. Grava docs/audit/aud-web-001/after/verify.json e sai com 1 se algo falhar.
//
//   node scripts/ux-verify.mjs [--base http://localhost:4331]
import { existsSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";

const args = process.argv.slice(2);
const base = args.includes("--base") ? args[args.indexOf("--base") + 1] : "http://localhost:4331";
const browser = await chromium.launch({
	executablePath: existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined,
});
const result = { base, widths: {}, links: {}, failures: [] };

for (const width of [390, 768, 1440]) {
	const page = await browser.newPage({ viewport: { width, height: 900 } });
	await page.goto(`${base}/`, { waitUntil: "networkidle" });
	const layout = await page.evaluate(() => {
		const sections = [...document.querySelectorAll("main > section")].map((s) => {
			const r = s.getBoundingClientRect();
			return { label: s.getAttribute("aria-labelledby") ?? s.getAttribute("aria-label"), top: r.top + scrollY, bottom: r.bottom + scrollY };
		});
		const overlaps = sections.slice(1).filter((s, i) => s.top < sections[i].bottom - 0.5).map((s) => s.label);
		const clipped = [...document.querySelectorAll("main *")]
			.filter((el) => {
				const r = el.getBoundingClientRect();
				return r.width > 0 && (r.right > innerWidth + 0.5 || r.left < -0.5) && !el.closest("[role=region], pre, [data-plain]") && !(el instanceof SVGElement && el.ownerSVGElement);
			})
			.slice(0, 5)
			.map((el) => el.tagName.toLowerCase() + "." + [...el.classList].slice(0, 2).join("."));
		return {
			overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
			sections: sections.map((s) => s.label),
			overlaps,
			clipped,
		};
	});
	// Teclado: Tab por toda a página; cada ação dentro de main precisa de anel ou contorno visível.
	const focus = [];
	for (let i = 0; i < 80; i++) {
		await page.keyboard.press("Tab");
		const f = await page.evaluate(() => {
			const el = document.activeElement;
			if (!el || el === document.body) return null;
			const s = getComputedStyle(el);
			const visible =
				(s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0) || (s.boxShadow && s.boxShadow !== "none") || s.textDecorationLine.includes("underline");
			return { text: (el.textContent || el.getAttribute("aria-label") || el.getAttribute("placeholder") || el.tagName).trim().slice(0, 40), inMain: !!el.closest("main"), visible };
		});
		if (!f) break;
		if (f.inMain) focus.push(f);
		if (focus.length && focus.length > 60) break;
	}
	const invisible = focus.filter((f) => !f.visible).map((f) => f.text);
	result.widths[width] = { ...layout, focusStops: focus.length, focusInvisible: invisible };
	if (layout.overflowX > 0) result.failures.push(`${width}: overflow ${layout.overflowX}px`);
	if (layout.overlaps.length) result.failures.push(`${width}: sobreposição ${layout.overlaps.join(", ")}`);
	if (layout.clipped.length) result.failures.push(`${width}: cortado ${layout.clipped.join(", ")}`);
	if (invisible.length) result.failures.push(`${width}: foco invisível em ${invisible.join(", ")}`);
	if (width === 1440) {
		const hrefs = await page.evaluate(() => [...new Set([...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")))]);
		for (const href of hrefs.filter((h) => h.startsWith("/"))) {
			const res = await page.request.get(`${base}${href}`, { maxRedirects: 5 });
			result.links[href] = res.status();
			if (res.status() !== 200) result.failures.push(`link ${href}: ${res.status()}`);
		}
	}
	await page.close();
}
await browser.close();
writeFileSync("docs/audit/aud-web-001/after/verify.json", JSON.stringify(result, null, 2) + "\n");
console.log(result.failures.length ? `FAIL\n${result.failures.join("\n")}` : `PASS · ${Object.keys(result.links).length} links internos · 3 larguras`);
process.exit(result.failures.length ? 1 : 0);
