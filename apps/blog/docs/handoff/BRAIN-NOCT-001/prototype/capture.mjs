// BRAIN-NOCT-001 · serve os mockups e captura os estados (Playwright + WebGL por software, como o `npm run test:brain`).
// Uso (na raiz do repositório):
//   node apps/blog/docs/handoff/BRAIN-NOCT-001/fonte-design/build/run-node.mjs <dir>   # gera <dir>/assets a partir de <dir>/source
//   node apps/blog/docs/handoff/BRAIN-NOCT-001/prototype/capture.mjs <dir>/assets [--serve]
// Com --serve, só sobe o servidor em http://127.0.0.1:4410/prototype/landing.html (revisão manual).
import { execFileSync } from "node:child_process";
import { createServer } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import { dirname, extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "@playwright/test";
import sharp from "sharp";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, ".."); // BRAIN-NOCT-001/
const assets = resolve(process.argv[2] ?? "");
const three = resolve("node_modules/three/build");
const out = join(root, "mockups");
const PORT = 4410;
const UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".bin": "application/octet-stream", ".glb": "model/gltf-binary" };

const server = createServer(async (req, res) => {
	const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
	const file = path.startsWith("/prototype/assets/") ? join(assets, path.slice(18))
		: path.startsWith("/prototype/vendor/") ? join(three, path.slice(18))
		: join(root, normalize(path).replace(/^([/\\])+/, ""));
	try {
		res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" }).end(await readFile(file));
	} catch {
		res.writeHead(404).end();
	}
});
await new Promise((ok) => server.listen(PORT, "127.0.0.1", ok));
const base = `http://127.0.0.1:${PORT}/prototype/`;
if (process.argv.includes("--serve")) {
	console.log(`${base}landing.html`);
} else {
	await mkdir(out, { recursive: true });
	const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
	const errors = [];
	const shots = [];
	const ready = (page) => page.waitForFunction(() => ["ready", "fallback"].includes(document.querySelector(".stage")?.dataset.status), null, { timeout: 60_000 });
	const save = async (page, name, full = false) => {
		const png = await page.screenshot({ fullPage: full });
		await sharp(png).webp({ quality: 82 }).toFile(join(out, `${name}.webp`));
		shots.push(name);
	};
	for (const [label, width, height] of [["1440", 1440, 960], ["390", 390, 844]]) {
		const mobile = width < 600;
		const ctx = async (opts = {}) => {
			const c = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: mobile ? 2 : 1, hasTouch: mobile, ...opts });
			// Google Fonts pelo curl (que usa o CA do proxy do ambiente); o Chromium do Playwright não confia nele.
			await c.route(/fonts\.(googleapis|gstatic)\.com/, async (route) => {
				const url = route.request().url();
				const body = execFileSync("curl", ["-sSfL", url, "-H", `user-agent: ${UA}`]);
				await route.fulfill({ body, contentType: url.includes("googleapis") ? "text/css" : "font/woff2", headers: { "access-control-allow-origin": "*" } });
			});
			const p = await c.newPage();
			p.on("console", (m) => m.type() === "error" && errors.push(`${label} ${m.text()}`));
			p.on("pageerror", (e) => errors.push(`${label} ${e.message}`));
			return [c, p];
		};
		// 1 · Landing em repouso girando (página inteira) e 2 · callout entrando pelo giro
		{
			const [c, p] = await ctx();
			await p.goto(`${base}landing.html`);
			await ready(p);
			await p.waitForTimeout(1500);
			await save(p, `01-landing-repouso-${label}`, true);
			await p.evaluate(() => window.__brain.setRotation(-0.05));
			await p.waitForTimeout(2000); // depois da troca de slot e do fade (180 ms)
			await p.locator(".stage").scrollIntoViewIfNeeded();
			await save(p, `02-landing-callout-giro-${label}`);
			await c.close();
		}
		// 3 · Mapa com pin selecionado e detalhe aberto (?foco=)
		{
			const [c, p] = await ctx();
			await p.goto(`${base}mapa.html?foco=COG-MEMORIA-TRABALHO`);
			await ready(p);
			await p.waitForTimeout(1600);
			await save(p, `03-mapa-selecao-${label}`, true);
			await c.close();
		}
		// 4 · Movimento reduzido: parado, chave ligada
		{
			const [c, p] = await ctx({ reducedMotion: "reduce" });
			await p.goto(`${base}mapa.html`);
			await ready(p);
			await p.waitForTimeout(800);
			await save(p, `04-mapa-movimento-reduzido-${label}`);
			await c.close();
		}
		// 5 · Foco por teclado no pin (Tab a partir do palco)
		{
			const [c, p] = await ctx({ reducedMotion: "reduce" });
			await p.goto(`${base}mapa.html`);
			await ready(p);
			await p.locator(".stage").focus();
			await p.keyboard.press("Tab");
			await p.waitForTimeout(400);
			await save(p, `05-mapa-foco-teclado-${label}`);
			await c.close();
		}
		// 6 · Fallback sem WebGL
		{
			const [c, p] = await ctx();
			await p.goto(`${base}mapa.html?nowebgl=1`);
			await ready(p);
			await save(p, `06-mapa-sem-webgl-${label}`);
			await c.close();
		}
	}
	await browser.close();
	console.log(JSON.stringify({ shots, errors }, null, 1));
	server.close();
}
