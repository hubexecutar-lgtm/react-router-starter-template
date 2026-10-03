// AUD-WEB-001: captura e mede a home local e a referência (developer.apple.com/programs) nas
// mesmas larguras (390, 768, 1440). Gera página inteira, recortes por seção e um JSON de medidas
// computadas (getComputedStyle / getBoundingClientRect). Os números saem do navegador: nada aqui é
// estimado.
//
//   node scripts/ux-compare.mjs <rotulo> [--ref] [--base http://localhost:4331]
//
// A referência fica em docs/audit/aud-web-001/ref/ (fora do git). O proxy do container é
// confiado pela chave da sua própria CA (--ignore-certificate-errors-spki-list), sem desligar o TLS.
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";

const args = process.argv.slice(2);
const label = args.find((a) => !a.startsWith("--")) ?? "before";
const isRef = args.includes("--ref");
const base = args.includes("--base") ? args[args.indexOf("--base") + 1] : "http://localhost:4331";
const url = isRef ? "https://developer.apple.com/programs/" : `${base}/`;
const outDir = join("docs/audit/aud-web-001", isRef ? "ref" : label);
mkdirSync(outDir, { recursive: true });

const WIDTHS = [390, 768, 1440];
const CA = "/root/.ccr/agent-proxy-ca.crt";
const launchArgs = [];
if (isRef && existsSync(CA)) {
	const spki = execSync(
		`openssl x509 -in ${CA} -pubkey -noout | openssl pkey -pubin -outform der | openssl dgst -sha256 -binary | base64`,
	)
		.toString()
		.trim();
	launchArgs.push(`--ignore-certificate-errors-spki-list=${spki}`);
}
const proxy = isRef && process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;

function measure() {
	const px = (v) => Math.round(parseFloat(v) * 10) / 10;
	const box = (el) => {
		const r = el.getBoundingClientRect();
		return { x: Math.round(r.left), y: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height) };
	};
	const chWidth = (el) => {
		const probe = document.createElement("span");
		probe.textContent = "0";
		probe.style.cssText = "position:absolute;visibility:hidden;font:inherit;letter-spacing:inherit";
		el.appendChild(probe);
		const ch = probe.getBoundingClientRect().width;
		probe.remove();
		return ch ? Math.round(el.getBoundingClientRect().width / ch) : null;
	};
	const type = (el) => {
		if (!el) return null;
		const s = getComputedStyle(el);
		return {
			text: el.textContent.trim().replace(/\s+/g, " ").slice(0, 60),
			fontSize: px(s.fontSize),
			fontWeight: s.fontWeight,
			lineHeight: s.lineHeight === "normal" ? "normal" : px(s.lineHeight),
			letterSpacing: s.letterSpacing,
			color: s.color,
			textAlign: s.textAlign,
			widthCh: chWidth(el),
			box: box(el),
		};
	};
	const visible = (el) => el.getBoundingClientRect().height > 0 && getComputedStyle(el).visibility !== "hidden";
	const main = document.querySelector("main");
	const sections = [...main.querySelectorAll(":scope > section, :scope > div > section")].filter(visible);
	const bgOf = (el) => {
		for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
			const c = getComputedStyle(n).backgroundColor;
			if (c && c !== "rgba(0, 0, 0, 0)" && c !== "transparent") return c;
		}
		return getComputedStyle(document.body).backgroundColor;
	};
	const sectionInfo = sections.map((s) => {
		const inner = s.querySelector(".section-content, .container") ?? s;
		const innerChild = inner.firstElementChild ?? inner;
		const card = s.querySelector(".section-rounded, .rc-cell");
		const h = s.querySelector("h1, h2");
		return {
			heading: h?.textContent.trim().replace(/\s+/g, " ").slice(0, 50) ?? null,
			box: box(s),
			bg: getComputedStyle(s).backgroundColor,
			paddingTop: px(getComputedStyle(s).paddingTop),
			paddingBottom: px(getComputedStyle(s).paddingBottom),
			marginTop: px(getComputedStyle(s).marginTop),
			contentWidth: box(innerChild).w,
			textAlign: h ? getComputedStyle(h).textAlign : null,
			card: card
				? { radius: getComputedStyle(card).borderRadius, bg: bgOf(card), padding: getComputedStyle(card).padding }
				: null,
		};
	});
	const stickies = [...document.querySelectorAll("body *")]
		.filter((el) => ["sticky", "fixed"].includes(getComputedStyle(el).position) && visible(el))
		.filter((el) => el.getBoundingClientRect().top <= 1 && el.getBoundingClientRect().height < 200)
		.map((el) => ({
			tag: el.tagName.toLowerCase() + (el.id ? `#${el.id}` : ""),
			position: getComputedStyle(el).position,
			h: Math.round(el.getBoundingClientRect().height),
			bg: getComputedStyle(el).backgroundColor,
			backdrop: getComputedStyle(el).backdropFilter,
		}));
	const ctas = [...main.querySelectorAll("a.button, a[class*='bg-primary'], a[class*='border-input']")]
		.filter(visible)
		.slice(0, 4)
		.map((a) => {
			const s = getComputedStyle(a);
			return {
				text: a.textContent.trim().slice(0, 40),
				h: Math.round(a.getBoundingClientRect().height),
				radius: s.borderRadius,
				padding: s.padding,
				fontSize: px(s.fontSize),
				fontWeight: s.fontWeight,
				bg: s.backgroundColor,
			};
		});
	const leads = [...main.querySelectorAll("section p")].filter(visible).slice(0, 3);
	const h2s = [...main.querySelectorAll("h2")].filter(visible);
	return {
		viewport: innerWidth,
		pageHeight: document.documentElement.scrollHeight,
		overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
		sticky: stickies,
		sections: sectionInfo,
		sectionCount: sectionInfo.length,
		h1: type(main.querySelector("h1")),
		h2: type(h2s[0]),
		h2Count: h2s.length,
		h3: type([...main.querySelectorAll("h3")].find(visible)),
		heroParagraphs: leads.map(type),
		ctas,
		footer: (() => {
			const f = document.querySelector("footer");
			return f ? { box: box(f), bg: bgOf(f), navGroups: f.querySelectorAll("nav").length } : null;
		})(),
	};
}

const browser = await chromium.launch({
	executablePath: existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined,
	proxy,
	args: launchArgs,
});
const report = { url, label: isRef ? "ref" : label, capturedAt: new Date().toISOString(), widths: {} };
for (const width of WIDTHS) {
	const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
	// A rede do container às vezes devolve falha transitória: até 3 tentativas.
	for (let attempt = 1; ; attempt++) {
		try {
			await page.goto(url, { waitUntil: "load", timeout: 60_000 });
			break;
		} catch (err) {
			if (attempt === 3) throw err;
			await page.waitForTimeout(2000 * attempt);
		}
	}
	// Imagens lazy: rola até o fim para carregá-las, volta ao topo.
	await page.evaluate(async () => {
		for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
			scrollTo(0, y);
			await new Promise((r) => setTimeout(r, 60));
		}
		scrollTo(0, 0);
	});
	await page.waitForTimeout(800);
	const m = await page.evaluate(measure);
	// Comportamento na rolagem: o que continua grudado no topo depois de 1500 px.
	await page.evaluate(() => scrollTo(0, 1500));
	await page.waitForTimeout(400);
	m.stickyAfterScroll = await page.evaluate(() =>
		[...document.querySelectorAll("body *")]
			.filter((el) => {
				const r = el.getBoundingClientRect();
				return ["sticky", "fixed"].includes(getComputedStyle(el).position) && r.height > 0 && r.top <= 1 && r.bottom > 0 && r.height < 200;
			})
			.map((el) => ({ tag: el.tagName.toLowerCase() + (el.id ? `#${el.id}` : ""), h: Math.round(el.getBoundingClientRect().height) })),
	);
	await page.screenshot({ path: join(outDir, `scrolled-${width}.png`) });
	await page.evaluate(() => scrollTo(0, 0));
	await page.waitForTimeout(200);
	// Na captura de página inteira, barras fixas viram estáticas (senão o Chromium as pinta no meio
	// da página). As medidas acima já registraram o comportamento real.
	await page.evaluate(() => {
		for (const el of document.querySelectorAll("body *")) {
			if (["sticky", "fixed"].includes(getComputedStyle(el).position)) el.style.setProperty("position", "relative", "important");
		}
	});
	await page.screenshot({ path: join(outDir, `full-${width}.png`), fullPage: true });
	const sections = page.locator("main > section, main > div > section");
	const n = await sections.count();
	for (let i = 0; i < n; i++) {
		const s = sections.nth(i);
		if (!(await s.isVisible())) continue;
		await s.screenshot({ path: join(outDir, `section-${width}-${String(i + 1).padStart(2, "0")}.png`) }).catch(() => {});
	}
	report.widths[width] = m;
	await page.close();
}
await browser.close();
writeFileSync(join(outDir, "metrics.json"), JSON.stringify(report, null, 2) + "\n");
console.log(`ok: ${outDir}/metrics.json`);
