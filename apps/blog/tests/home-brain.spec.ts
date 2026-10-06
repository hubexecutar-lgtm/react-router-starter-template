import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync } from "node:fs";

// HOME-BRAIN-001: cérebro 3D da home (WebGL). Roda com `npm run test:brain` (playwright.brain.config.ts, WebGL por
// software no Chromium de teste); o `npm test` cobre o resto da home sem depender de GPU.
// ADR-26: o mesmo BrainHero está na Home (variant="preview", o card leva a /mapas/?foco=) e no Mapa Cognitivo
// (/mapas/, variant="full", lê e grava ?foco= e o card leva às relações em /mapas/explorar/?foco=).
const FUNCTIONS = ["COG-PLANEJAMENTO", "COG-MEMORIA-TRABALHO", "COG-CONTROLE-INIBITORIO", "COG-FLEXIBILIDADE"];

async function ready(page: Page, path = "/") {
	await page.goto(path);
	await page.locator("#mapa").scrollIntoViewIfNeeded();
	await expect(page.locator("#mapa[data-brain-status=ready]")).toBeVisible({ timeout: 60_000 });
	await expect.poll(() => page.locator(".brain-canvas").getAttribute("data-frames")).not.toBeNull();
}
const marker = (page: Page, name: string) => page.getByRole("group", { name: "Funções executivas" }).getByRole("button", { name: new RegExp(`^${name}`) });

test("the point asset matches the manifest (CC0 provenance)", () => {
	const manifest = JSON.parse(readFileSync("public/models/home-brain/manifest.json", "utf8"));
	const bin = readFileSync("public/models/home-brain/brain-points.bin");
	expect(manifest.license).toBe("CC0-1.0");
	expect(bin.length).toBe(manifest.files["brain-points.bin"].bytes);
	expect(createHash("sha256").update(bin).digest("hex")).toBe(manifest.files["brain-points.bin"].sha256);
	expect(bin.length).toBe(manifest.points * 6);
});

test("3D rotates, pauses, drags and resumes", async ({ page }) => {
	const requests: string[] = [];
	const errors: string[] = [];
	await page.setViewportSize({ width: 1440, height: 1000 });
	page.on("request", (r) => requests.push(r.url()));
	page.on("pageerror", (e) => errors.push(e.message));
	await ready(page);
	const canvas = page.locator(".brain-canvas");
	// Estado inicial: rotação lenta e contínua (sem movimento reduzido).
	await expect(canvas).toHaveAttribute("data-motion", "rotating");
	const angle = await canvas.getAttribute("data-angle");
	await expect.poll(() => canvas.getAttribute("data-angle")).not.toBe(angle);
	expect(requests.some((r) => r.includes("brain-points.bin"))).toBe(true);
	await page.getByRole("button", { name: "Pausar", exact: true }).click();
	await expect(canvas).toHaveAttribute("data-motion", "paused");
	const paused = await canvas.getAttribute("data-angle");
	await page.waitForTimeout(180);
	expect(await canvas.getAttribute("data-angle")).toBe(paused);
	const box = (await canvas.boundingBox())!;
	await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
	await page.mouse.down();
	await page.mouse.move(box.x + box.width / 2 + 60, box.y + box.height / 2, { steps: 6 });
	await page.mouse.up();
	await expect.poll(() => canvas.getAttribute("data-angle")).not.toBe(paused);
	await expect(canvas).toHaveAttribute("data-motion", "paused");
	await page.getByRole("button", { name: "Girar", exact: true }).click();
	await expect(canvas).toHaveAttribute("data-motion", "rotating");
	expect(errors).toEqual([]);
});

test("selecting a function pauses, explains it and opens the map on the same canonical focus", async ({ page }) => {
	await ready(page);
	await expect(page.locator(".brain-canvas")).toHaveAttribute("data-motion", "rotating");
	await marker(page, "Controle inibitório").click();
	await expect(page.locator(".brain-canvas")).toHaveAttribute("data-motion", "paused");
	const detail = page.locator("#brain-detail article:visible");
	await expect(detail.locator("h3")).toHaveText("Função selecionada: Controle inibitório");
	await expect(detail).toContainText("proteger a prioridade diante de estímulos concorrentes.");
	await expect(detail).toContainText("Interrupções aumenta Controle inibitório (inferido)");
	const link = detail.getByRole("link", { name: /no Mapa Cognitivo/ });
	await expect(link).toHaveAttribute("href", "/mapas/?foco=COG-CONTROLE-INIBITORIO");
	await link.click();
	await expect(page).toHaveURL(/\/mapas\/\?foco=COG-CONTROLE-INIBITORIO/);
	// O Mapa Cognitivo abre o mesmo cérebro já na função escolhida.
	await expect(page.locator("#mapa[data-brain-variant=full]")).toBeVisible();
	await expect(page.locator("#brain-detail article:visible h3")).toHaveText("Função selecionada: Controle inibitório");
});

test("every selector opens a map page that knows its node", async ({ page }) => {
	for (const id of FUNCTIONS) {
		await page.goto(`/mapas/explorar/?foco=${id}`);
		await expect(page).toHaveURL(new RegExp(`foco=${id}`));
		const res = await page.request.get(`/mapas/explorar/${id.toLowerCase()}/`);
		expect(res.status(), id).toBe(200);
	}
	// Foco inválido não quebra o mapa: cai no foco padrão.
	const errors: string[] = [];
	page.on("pageerror", (e) => errors.push(e.message));
	await page.goto("/mapas/explorar/?foco=COG-NAO-EXISTE");
	await expect(page.locator("main")).toBeVisible();
	expect(errors).toEqual([]);
});

test("arrow keys move between the selectors; reduced motion starts paused; keyboard rotation", async ({ page }) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	await ready(page);
	const canvas = page.locator(".brain-canvas");
	await expect(canvas).toHaveAttribute("data-motion", "paused");
	await marker(page, "Planejamento").focus();
	await page.keyboard.press("ArrowDown");
	await expect(marker(page, "Memória de trabalho")).toBeFocused();
	await expect(marker(page, "Memória de trabalho")).toHaveAttribute("aria-pressed", "true");
	await page.keyboard.press("ArrowUp");
	await page.keyboard.press("ArrowUp");
	await expect(marker(page, "Flexibilidade cognitiva")).toHaveAttribute("aria-pressed", "true");
	const angle = await canvas.getAttribute("data-angle");
	await page.getByRole("button", { name: "Girar o cérebro para a direita", exact: true }).focus();
	await page.keyboard.press("Enter");
	await expect.poll(() => canvas.getAttribute("data-angle")).not.toBe(angle);
	await expect(canvas).toHaveAttribute("data-motion", "paused");
});

test("asset failure keeps the selectors and the map, then retry loads the 3D", async ({ page }) => {
	await page.route("**/brain-points.bin", (route) => route.abort());
	await page.goto("/");
	await expect(page.locator("#mapa[data-brain-status=fallback]")).toBeVisible({ timeout: 60_000 });
	await expect(page.locator(".brain-poster")).toBeVisible();
	await marker(page, "Memória de trabalho").click();
	await expect(page.locator("#brain-detail article:visible h3")).toHaveText("Função selecionada: Memória de trabalho");
	await page.unroute("**/brain-points.bin");
	await page.getByRole("button", { name: "Tentar carregar o 3D novamente" }).click();
	await expect(page.locator("#mapa[data-brain-status=ready]")).toBeVisible({ timeout: 60_000 });
});

test("server HTML works without JS", async ({ browser, baseURL }) => {
	const context = await browser.newContext({ javaScriptEnabled: false });
	const page = await context.newPage();
	await page.goto(baseURL!);
	await expect(page.getByRole("heading", { level: 1 })).toHaveText(/transformar intenção em execução\?/);
	await expect(page.locator(".brain-poster")).toBeVisible();
	await expect(page.locator(".brain-nojs-links a")).toHaveCount(4);
	await expect(page.locator("#brain-detail article:visible .brain-detail-link")).toHaveAttribute("href", "/mapas/?foco=COG-PLANEJAMENTO");
	// Sem JS, os links do noscript continuam levando às relações de cada função no mapa causal.
	await expect(page.locator(".brain-nojs-links a").first()).toHaveAttribute("href", "/mapas/explorar/?foco=COG-PLANEJAMENTO");
	await context.close();
});

test("touch drag keeps vertical scrolling (touch-action: pan-y)", async ({ page }) => {
	await ready(page);
	expect(await page.locator(".brain-canvas").evaluate((el) => getComputedStyle(el).touchAction)).toBe("pan-y");
});

for (const theme of ["light", "dark"]) {
	test(`responsive, axe and screenshots (${theme})`, async ({ page }) => {
		await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
		await page.emulateMedia({ reducedMotion: "reduce", colorScheme: theme as "light" | "dark" });
		mkdirSync("test-results/home-brain", { recursive: true });
		for (const width of [320, 390, 1440]) {
			await page.setViewportSize({ width, height: width < 700 ? 844 : 1000 });
			await ready(page);
			expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${theme} ${width}`).toBe(true);
			if (width < 620) {
				const boxes = await page.locator(".brain-marker").evaluateAll((elements) => elements.map((el) => {
					const r = el.getBoundingClientRect();
					return { left: r.left, right: r.right, top: r.top, bottom: r.bottom };
				}));
				for (const box of boxes) {
					expect(box.left, `marker inside ${width}px`).toBeGreaterThanOrEqual(0);
					expect(box.right, `marker inside ${width}px`).toBeLessThanOrEqual(width);
				}
				for (const [i, j] of [[0, 1], [2, 3]]) {
					expect(boxes[i].bottom, `markers ${i}/${j} at ${width}px`).toBeLessThan(boxes[j].top);
				}
			}
			const result = await new AxeBuilder({ page }).include("main").withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
			expect(result.violations.filter((v) => v.impact === "serious" || v.impact === "critical").map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" ")}`)).toEqual([]);
			if (width !== 320) {
				await page.locator("#mapa").screenshot({ path: `test-results/home-brain/${theme}-${width}.png` });
			}
		}
	});
}

// Mapa Cognitivo (/mapas/, ADR-26): o mesmo cérebro em tamanho principal, com ?foco= nos dois sentidos.
test.describe("Mapa Cognitivo: cérebro full em /mapas/", () => {
	const detail = (page: Page) => page.locator("#brain-detail article:visible");
	const foco = (page: Page) => new URL(page.url()).searchParams.get("foco");

	test("carrega o cérebro full e a seleção por clique troca o card e grava ?foco=", async ({ page }) => {
		const errors: string[] = [];
		page.on("pageerror", (e) => errors.push(e.message));
		await page.setViewportSize({ width: 1440, height: 1000 });
		await ready(page, "/mapas/");
		await expect(page.locator("#mapa")).toHaveAttribute("data-brain-variant", "full");
		await expect(page.getByRole("heading", { level: 1 })).toHaveText("Mapa Cognitivo");
		await expect(detail(page).locator("h3")).toHaveText("Função selecionada: Planejamento");
		await marker(page, "Flexibilidade cognitiva").click();
		await expect(marker(page, "Flexibilidade cognitiva")).toHaveAttribute("aria-pressed", "true");
		await expect(detail(page).locator("h3")).toHaveText("Função selecionada: Flexibilidade cognitiva");
		await expect.poll(() => foco(page)).toBe("COG-FLEXIBILIDADE");
		// O card completo leva às relações do grafo no Explorar, com o mesmo foco.
		await expect(detail(page).locator(".brain-detail-link")).toHaveAttribute("href", "/mapas/explorar/?foco=COG-FLEXIBILIDADE");
		expect(errors).toEqual([]);
	});

	test("as setas trocam a função, o card e o ?foco=", async ({ page }) => {
		await ready(page, "/mapas/");
		await marker(page, "Planejamento").focus();
		await page.keyboard.press("ArrowDown");
		await expect(marker(page, "Memória de trabalho")).toBeFocused();
		await expect(marker(page, "Memória de trabalho")).toHaveAttribute("aria-pressed", "true");
		await expect(detail(page).locator("h3")).toHaveText("Função selecionada: Memória de trabalho");
		await expect.poll(() => foco(page)).toBe("COG-MEMORIA-TRABALHO");
		await page.keyboard.press("ArrowUp");
		await page.keyboard.press("ArrowUp");
		await expect(marker(page, "Flexibilidade cognitiva")).toHaveAttribute("aria-pressed", "true");
		await expect(detail(page).locator("h3")).toHaveText("Função selecionada: Flexibilidade cognitiva");
		await expect.poll(() => foco(page)).toBe("COG-FLEXIBILIDADE");
	});

	test("?foco= na URL abre a função pedida", async ({ page }) => {
		await ready(page, "/mapas/?foco=COG-FLEXIBILIDADE");
		await expect(marker(page, "Flexibilidade cognitiva")).toHaveAttribute("aria-pressed", "true");
		await expect(detail(page).locator("h3")).toHaveText("Função selecionada: Flexibilidade cognitiva");
		await expect(page.locator("#brain-detail article:visible")).toHaveCount(1);
	});

	test("movimento reduzido começa parado", async ({ page }) => {
		await page.emulateMedia({ reducedMotion: "reduce" });
		await ready(page, "/mapas/");
		const canvas = page.locator(".brain-canvas");
		await expect(canvas).toHaveAttribute("data-motion", "paused");
		const angle = await canvas.getAttribute("data-angle");
		await page.waitForTimeout(180);
		expect(await canvas.getAttribute("data-angle")).toBe(angle);
	});

	test("em 390 px os marcadores ficam dentro da viewport, sem rolagem horizontal", async ({ page }) => {
		await page.emulateMedia({ reducedMotion: "reduce" });
		await page.setViewportSize({ width: 390, height: 844 });
		await ready(page, "/mapas/");
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
		const boxes = await page.locator(".brain-marker").evaluateAll((elements) =>
			elements.map((el) => {
				const r = el.getBoundingClientRect();
				return { left: r.left, right: r.right, height: r.height };
			}),
		);
		expect(boxes).toHaveLength(4);
		for (const box of boxes) {
			expect(box.left, "marker inside 390px").toBeGreaterThanOrEqual(0);
			expect(box.right, "marker inside 390px").toBeLessThanOrEqual(390);
			expect(box.height, "marker target ≥ 44px").toBeGreaterThanOrEqual(44);
		}
		const result = await new AxeBuilder({ page }).include("main").withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
		expect(result.violations.filter((v) => v.impact === "serious" || v.impact === "critical").map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" ")}`)).toEqual([]);
	});
});
