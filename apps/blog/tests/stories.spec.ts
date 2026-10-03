import { expect, test, type Page } from "@playwright/test";

// Tokens do handoff OPENAI-STORIES-DESIGN-001 (valores LITERAIS medidos em 1363×936, DPR 1) nos elementos reais.
// Só há medida desktop na referência; 390 e 768 só têm o gate de overflow aqui (medidas em docs/audit/aud-web-002).
// Tolerância de 0,75 px para frações de layout; tipografia é comparada em valor exato.
const DESKTOP = { width: 1363, height: 936 };
const ARTICLE = "/artigos/risco-cognitivo/";
const FIXTURES = "/admin/stories-fixtures/";

const px = (v: string) => parseFloat(v);
const near = (got: number, want: number, tol = 0.75) => expect(Math.abs(got - want), `${got} ≉ ${want}`).toBeLessThanOrEqual(tol);

const type = (page: Page, selector: string) =>
	page.locator(selector).first().evaluate((el) => {
		const s = getComputedStyle(el);
		const r = el.getBoundingClientRect();
		return {
			size: s.fontSize,
			line: s.lineHeight,
			tracking: s.letterSpacing,
			weight: s.fontWeight,
			x: r.left,
			y: r.top + scrollY,
			w: r.width,
			h: r.height,
			mb: s.marginBottom,
		};
	});

test.use({ viewport: DESKTOP });

test("tokens --ref-* keep the literal handoff values", async ({ page }) => {
	await page.goto("/");
	const tokens = await page.evaluate(() => {
		const s = getComputedStyle(document.documentElement);
		const names = [
			"--ref-gutter", "--ref-grid-gap", "--ref-h1-size", "--ref-h1-line", "--ref-h1-tracking", "--ref-h2-size", "--ref-h2-line",
			"--ref-h2-tracking", "--ref-body-size", "--ref-body-line", "--ref-body-tracking", "--ref-quote-size", "--ref-quote-line",
			"--ref-caption-size", "--ref-caption-line", "--ref-reading-width", "--ref-wide-width",
		];
		// o minificador troca "-0.17px" por "-.17px": compara-se o número, não o texto
		return Object.fromEntries(names.map((n) => [n, parseFloat(s.getPropertyValue(n))]));
	});
	expect(tokens).toEqual({
		"--ref-gutter": 32,
		"--ref-grid-gap": 24,
		"--ref-h1-size": 61.6864,
		"--ref-h1-line": 62.0103,
		"--ref-h1-tracking": -1.85059,
		"--ref-h2-size": 46.8432,
		"--ref-h2-line": 54.2918,
		"--ref-h2-tracking": -1.38216,
		"--ref-body-size": 17,
		"--ref-body-line": 27.999,
		"--ref-body-tracking": -0.17,
		"--ref-quote-size": 29.5662,
		"--ref-quote-line": 39.0274,
		"--ref-caption-size": 14,
		"--ref-caption-line": 22.96,
		"--ref-reading-width": 637.5,
		"--ref-wide-width": 1078.5,
	});
});

test("home: header, title, toolbar and featured block follow the handoff geometry", async ({ page }) => {
	await page.goto("/");
	const header = await page.locator("body > header").evaluate((el) => el.getBoundingClientRect().height);
	near(header, 64, 0.5); // a régua inferior é box-shadow: a barra mede 64 px, como na referência

	const h1 = await type(page, "main h1");
	expect(h1).toMatchObject({ size: "46.8432px", line: "54.2918px", tracking: "-1.38216px", weight: "500" });
	near(h1.x, 32);
	near(h1.y, 152, 1);

	const toolbar = await page.locator("[data-stories-toolbar]").evaluate((el) => el.getBoundingClientRect().top + scrollY);
	near(toolbar, 222, 6); // alinhado ao topo dos botões de 40 px da referência

	const img = await page.locator('[data-story-card="feature"] img').evaluate((el) => {
		const r = el.parentElement!.getBoundingClientRect();
		return { x: r.left, y: r.top + scrollY, w: r.width, h: r.height };
	});
	near(img.x, 32);
	near(img.y, 326, 1);
	near(img.w, 968.25);
	near(img.h, 544.64, 1);
});

test("article: hero, reading column and body follow the handoff tokens", async ({ page }) => {
	await page.goto(ARTICLE);
	const h1 = await type(page, "[data-article-hero] h1");
	expect(h1).toMatchObject({ size: "61.6864px", line: "62.0103px", tracking: "-1.85059px", weight: "500" });
	expect(h1.w).toBeLessThanOrEqual(802.5);

	const lead = await type(page, "[data-article-hero] p");
	expect(lead).toMatchObject({ size: "17px", line: "27.999px", tracking: "-0.17px", weight: "400" });
	expect(lead.w).toBeLessThanOrEqual(596.5);

	const p = await type(page, "[data-article-body] p");
	expect(p).toMatchObject({ size: "17px", line: "27.999px", tracking: "-0.17px", weight: "400" });
	near(p.mb ? px(p.mb) : 0, 24);

	const column = await page.locator("[data-article-body] > div").evaluate((el) => {
		const r = el.getBoundingClientRect();
		return { x: r.left, w: r.width };
	});
	near(column.w, 637.5);
	near(column.x, (1363 - 637.5) / 2, 1); // centrada

	const h2 = await type(page, "[data-article-body] h2");
	expect(h2).toMatchObject({ size: "46.8432px", line: "54.2918px", tracking: "-1.38216px", weight: "500" });

	const hero = await page.locator("[data-article-hero] img").evaluate((el) => el.getBoundingClientRect().width);
	near(hero, 1078.5);
});

test("article: one h1 only (the MDX title is not repeated) and the author's MDX is intact", async ({ page }) => {
	await page.goto(ARTICLE);
	await expect(page.locator("h1")).toHaveCount(1);
	await expect(page.locator("main h1")).toContainText("O que é risco cognitivo?");
	await expect(page.locator("[data-article-body] h2")).toHaveCount(13);
	// meta: título, canonical e JSON-LD Article
	await expect(page).toHaveTitle(/O que é risco cognitivo\?.*\| Risco Cognitivo/);
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/artigos\/risco-cognitivo\/$/);
	const ld = JSON.parse((await page.locator('script[type="application/ld+json"]').first().textContent()) ?? "{}");
	expect(ld["@type"]).toBe("Article");
	expect(ld.headline).toContain("O que é risco cognitivo?");
});

test("article: every plain panel reads as structure, never as monospaced prose (ADR-12)", async ({ page }) => {
	await page.goto(ARTICLE);
	const found = await page.locator('[data-plain="panel"]').evaluateAll((els) =>
		els.map((el) => {
			const content = el.querySelector("[data-plain-content]")!;
			return {
				id: el.id,
				font: getComputedStyle(content).fontFamily,
				structured: content.querySelectorAll("dl, ol, ul, table").length,
				source: el.querySelector("[data-plain-source]")?.textContent ?? "",
			};
		}),
	);
	expect(found.length).toBeGreaterThan(0);
	for (const f of found) {
		expect(f.font, f.id).not.toMatch(/monospace/);
		expect(f.structured, `${f.id} has no structure`).toBeGreaterThan(0);
		expect(f.source.length, `${f.id} keeps its plain-text source`).toBeGreaterThan(0);
	}
});

test("fixtures: grid of four 306.75 px cards with 24 px gaps, quote and caption tokens", async ({ page }) => {
	await page.goto(FIXTURES);
	const cards = await page.locator("[data-story-grid] [data-story-card] img").evaluateAll((els) =>
		els.slice(0, 4).map((el) => {
			const r = el.parentElement!.getBoundingClientRect();
			return { x: r.left, w: r.width, h: r.height };
		}),
	);
	expect(cards).toHaveLength(4);
	for (const c of cards) {
		near(c.w, 306.75);
		near(c.h, 306.75); // imagem quadrada
	}
	for (let i = 1; i < 4; i++) near(cards[i].x - (cards[i - 1].x + cards[i - 1].w), 24);

	const quote = await type(page, "blockquote");
	expect(quote).toMatchObject({ size: "29.5662px", line: "39.0274px", tracking: "-0.739155px", weight: "500" });
	const caption = await type(page, "figure figcaption");
	expect(caption).toMatchObject({ size: "14px", line: "22.96px" });
});

test("fixtures: load more adds a batch without duplicating cards; sort is deterministic and lives in the URL", async ({ page }) => {
	await page.goto(FIXTURES);
	const titles = () => page.locator("[data-story-card] h2 a, [data-story-card] h3 a").allTextContents();
	const before = await titles();
	expect(before).toHaveLength(16);
	const more = page.getByRole("button", { name: "Carregar mais" });
	const box = await more.boundingBox();
	near(box!.height, 40, 0.5);
	expect(await more.evaluate((el) => getComputedStyle(el).borderRadius)).toBe("40px");
	await more.click();
	const after = await titles();
	expect(after).toHaveLength(22);
	expect(new Set(after).size, "sem duplicar cards").toBe(22);
	await expect(more).toHaveCount(0);

	await page.getByLabel("Classificar").selectOption("title_asc");
	await expect(page).toHaveURL(/ordem=title_asc/);
	await expect(page.locator("[data-story-card]")).toHaveCount(16); // lote inicial de novo
	const sorted = await titles();
	expect([...sorted].sort((a, b) => a.localeCompare(b, "pt-BR"))).toEqual(sorted.slice(0, 16));
	// recarregar com a URL preserva a ordenação
	await page.reload();
	await expect(page.getByLabel("Classificar")).toHaveValue("title_asc");
});

test("fixtures: category tab filters and returns to Tudo", async ({ page }) => {
	await page.goto(FIXTURES);
	await page.getByRole("button", { name: "Categoria B", exact: true }).click();
	await expect(page).toHaveURL(/categoria=Categoria\+B|categoria=Categoria%20B/);
	const cats = await page.locator("[data-story-card] .stories-meta").allTextContents();
	expect(cats.length).toBeGreaterThan(0);
	for (const c of cats) expect(c).toContain("Categoria B");
	await page.getByRole("button", { name: "Tudo", exact: true }).click();
	await expect(page).not.toHaveURL(/categoria=/);
});

test("keyboard: the card title is a real link with a visible focus state", async ({ page }) => {
	await page.goto("/");
	const link = page.locator("[data-story-card] h2 a");
	await link.focus();
	await expect(link).toBeFocused();
	const style = await link.evaluate((el) => getComputedStyle(el).textDecorationLine);
	expect(style).toContain("underline");
	await expect(link).toHaveAttribute("href", ARTICLE);
});

test.describe("no horizontal overflow at 390, 768 and 1363", () => {
	for (const route of ["/", ARTICLE, FIXTURES]) {
		test(route, async ({ page }) => {
			for (const width of [390, 768, 1363]) {
				await page.setViewportSize({ width, height: 900 });
				await page.goto(route);
				await page.waitForLoadState("networkidle");
				expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), `${route} @${width}`).toBeLessThanOrEqual(0);
			}
		});
	}
});
