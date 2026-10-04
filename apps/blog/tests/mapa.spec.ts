import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { DEFAULT_FOCUS, allEdgeViews, chainFor, factorHref, nodeById } from "../app/lib/graph/explore";
import { MAX_VISIBLE_NODES, publicMap } from "../app/lib/graph/project";
import { RC_GRAPH_FOR_TESTS as graph } from "./graph-data";

// LANC-001 PR-H (RQ-070…080): mapa causal em /mapas/explorar/ sobre o Stories. Os fluxos rodam sem hover
// (RQ-075): toque (hasTouch + tap) ou teclado.
const EXPLORE = "/mapas/explorar/";
const MOBILE = { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true };

const ready = (page: Page) => page.locator("[data-map-canvas][data-map-ready]").waitFor();
const nodes = (page: Page) => page.locator("[data-map-canvas] [data-map-node]");
const focusParam = (page: Page) => new URL(page.url()).searchParams.get("foco");

test.describe("Explorar no celular, só por toque", () => {
  test.use(MOBILE);

  test(`carga com 1 foco e no máximo ${MAX_VISIBLE_NODES} nós; tocar um vizinho recentra e abre o sheet (RQ-070)`, async ({ page }) => {
    await page.goto(EXPLORE);
    await ready(page);
    const count = await nodes(page).count();
    expect(count).toBeGreaterThan(1);
    expect(count).toBeLessThanOrEqual(MAX_VISIBLE_NODES);
    await expect(page.locator(`[data-map-canvas] [data-map-node="${DEFAULT_FOCUS}"]`)).toBeVisible();

    const neighbor = nodes(page).filter({ hasNot: page.locator(`[data-map-node="${DEFAULT_FOCUS}"]`) }).nth(1);
    const id = (await neighbor.getAttribute("data-map-node"))!;
    await neighbor.tap();
    await expect.poll(() => focusParam(page)).toBe(id);
    const selected = page.locator(`[data-map-canvas] [data-map-node="${id}"]`);
    await expect(selected).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("[data-sheet]")).toHaveAttribute("data-snap", "collapsed");
    expect(await nodes(page).count()).toBeLessThanOrEqual(MAX_VISIBLE_NODES);
    // Recentrado: o nó selecionado fica no meio do canvas (folga de 1 nó).
    const canvas = (await page.locator("[data-map-canvas]").boundingBox())!;
    const b = (await selected.boundingBox())!;
    expect(Math.abs(b.x + b.width / 2 - (canvas.x + canvas.width / 2))).toBeLessThan(b.width);
  });

  test("o sheet passa pelos 3 snaps e fecha só por toque (RQ-071)", async ({ page }) => {
    await page.goto(`${EXPLORE}?foco=FRC-INTERRUPCOES`);
    await ready(page);
    const sheet = page.locator("[data-sheet]");
    await expect(sheet).toHaveAttribute("data-snap", "collapsed");
    await page.locator("[data-sheet-up]").tap();
    await expect(sheet).toHaveAttribute("data-snap", "medium");
    await expect(sheet.locator("[data-relation-counts]")).toBeVisible();
    await page.locator("[data-sheet-up]").tap();
    await expect(sheet).toHaveAttribute("data-snap", "expanded");
    for (const tab of ["Causas", "Impactos", "Soluções", "Evidências"]) {
      await sheet.getByRole("tab", { name: new RegExp(`^${tab}`) }).tap();
      await expect(sheet.getByRole("tab", { name: new RegExp(`^${tab}`) })).toHaveAttribute("aria-selected", "true");
    }
    await page.locator("[data-sheet-down]").tap();
    await expect(sheet).toHaveAttribute("data-snap", "medium");
    await page.locator("[data-sheet-close]").tap();
    await expect(sheet).toHaveCount(0);
    // Limpar a seleção não tira o foco do centro.
    await expect(page.locator('[data-map-canvas] [data-map-node="FRC-INTERRUPCOES"]')).toBeVisible();
  });

  test("arrastar a alça muda a altura do sheet (RQ-071)", async ({ page }) => {
    await page.goto(`${EXPLORE}?foco=FRC-INTERRUPCOES`);
    await ready(page);
    const handle = page.locator("[data-sheet-handle]");
    const box = (await handle.boundingBox())!;
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    await handle.dispatchEvent("pointerdown", { clientX: x, clientY: y, pointerType: "touch" });
    await handle.dispatchEvent("pointerup", { clientX: x, clientY: y - 120, pointerType: "touch" });
    await expect(page.locator("[data-sheet]")).toHaveAttribute("data-snap", "medium");
  });

  test("abrir o fator e voltar ao mapa preserva a seleção (RQ-072)", async ({ page }) => {
    await page.goto(`${EXPLORE}?foco=FRC-INTERRUPCOES`);
    await ready(page);
    await page.locator("[data-sheet-up]").tap();
    await page.locator("[data-factor-link]").tap();
    await expect(page).toHaveURL(/\/mapas\/explorar\/frc-interrupcoes\/$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Interrupções");
    await page.locator("[data-back-to-map]").tap();
    await ready(page);
    expect(focusParam(page)).toBe("FRC-INTERRUPCOES");
    await expect(page.locator('[data-map-canvas] [data-map-node="FRC-INTERRUPCOES"]')).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("[data-sheet]")).toBeVisible();
  });

  test("chip de tipo reduz os nós sem perder o foco (RQ-074) e os modos são presets (RQ-080)", async ({ page }) => {
    await page.goto(`${EXPLORE}?foco=FRC-INTERRUPCOES`);
    await ready(page);
    const before = await nodes(page).count();
    await page.locator('[data-type-chip="capacity"]').tap();
    await expect.poll(() => new URL(page.url()).searchParams.get("tipo")).toBe("capacity");
    await expect.poll(() => nodes(page).count()).toBeLessThan(before);
    await expect(page.locator('[data-map-canvas] [data-map-node="FRC-INTERRUPCOES"]')).toBeVisible();
    const types = await nodes(page).evaluateAll((els) => els.map((e) => [e.getAttribute("data-map-node"), e.getAttribute("data-node-type")]));
    for (const [id, type] of types) if (id !== "FRC-INTERRUPCOES") expect(type).toBe("capacity");

    await page.locator("[data-map-modes]").getByRole("link", { name: "Soluções" }).tap();
    await expect.poll(() => new URL(page.url()).searchParams.get("modo")).toBe("solucoes");
    const typesNow = () => nodes(page).evaluateAll((els) => els.filter((e) => e.getAttribute("data-map-node") !== "FRC-INTERRUPCOES").map((e) => e.getAttribute("data-node-type")));
    await expect.poll(async () => [...new Set(await typesNow())]).toEqual(["compensation"]);
    await expect(page.locator('[data-map-canvas] [data-map-node="FRC-INTERRUPCOES"]')).toBeVisible();
  });

  test("sem rolagem horizontal em 320px com o sheet aberto (RQ-077)", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto(`${EXPLORE}?foco=EVT-ERRO`);
    await ready(page);
    await page.locator("[data-sheet-up]").tap();
    await page.locator("[data-sheet-up]").tap();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    // Alvos dos nós continuam ≥ 44px (RQ-025).
    for (const b of await nodes(page).evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height))) expect(b).toBeGreaterThanOrEqual(44);
  });
});

test.describe("Explorar no desktop, só por teclado", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("Tab até um nó, Enter seleciona, setas nas abas, Esc fecha (RQ-071/075)", async ({ page }) => {
    await page.goto(EXPLORE);
    await ready(page);
    const target = nodes(page).nth(2);
    const id = (await target.getAttribute("data-map-node"))!;
    await target.focus();
    await page.keyboard.press("Enter");
    await expect.poll(() => focusParam(page)).toBe(id);
    const sheet = page.locator("[data-sheet]");
    await expect(sheet).toBeVisible();
    await page.locator("[data-sheet-handle]").focus();
    await page.keyboard.press("ArrowUp");
    await page.keyboard.press("ArrowUp");
    await expect(sheet).toHaveAttribute("data-snap", "expanded");
    await sheet.getByRole("tab", { name: /^Causas/ }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(sheet.getByRole("tab", { name: /^Impactos/ })).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("Escape");
    await expect(sheet).toHaveCount(0);
    await expect(page.locator(`[data-map-canvas] [data-map-node="${id}"]`)).toBeFocused();
  });

  test("a Lista tem toda aresta do mapa como frase (RQ-073)", async ({ page }) => {
    await page.goto(EXPLORE);
    await page.locator("[data-tab-list]").click();
    const list = page.locator("[data-all-relations]");
    await expect(list).toBeVisible();
    const sentences = await list.locator("[data-edge-sentence]").evaluateAll((els) => els.map((e) => e.getAttribute("data-edge-sentence")));
    const expected = allEdgeViews(graph).map((e) => e.sentence);
    expect(expected.length).toBe(publicMap(graph).edges.length);
    expect(new Set(sentences)).toEqual(new Set(expected));
  });

  test("a Lista existe sem JavaScript", async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto(EXPLORE);
    expect(await page.locator("[data-all-relations] [data-edge-sentence]").count()).toBe(publicMap(graph).edges.length);
    expect(await page.locator("[data-map-static] [data-map-node]").count()).toBeLessThanOrEqual(MAX_VISIBLE_NODES);
    await ctx.close();
  });

  test("tipos por forma + rótulo e arestas por traço + rótulo, também em escala de cinza (RQ-076)", async ({ page }) => {
    await page.goto(`${EXPLORE}?foco=FRC-INTERRUPCOES`);
    await ready(page);
    await page.addStyleTag({ content: "html { filter: grayscale(1) }" });
    const byType = await nodes(page).evaluateAll((els) =>
      els.map((e) => ({ type: e.getAttribute("data-node-type"), glyph: e.querySelector("[aria-hidden]")?.textContent, name: e.getAttribute("aria-label") })),
    );
    const glyphs = new Map<string, string>();
    for (const n of byType) {
      expect(n.glyph, n.type!).toBeTruthy();
      expect(n.name).toContain(",");
      if (glyphs.has(n.type!)) expect(glyphs.get(n.type!)).toBe(n.glyph);
      glyphs.set(n.type!, n.glyph!);
    }
    expect(new Set(glyphs.values()).size).toBe(glyphs.size);
    const labels = page.locator("[data-map-canvas] [data-edge-label]");
    expect(await labels.count()).toBeGreaterThan(0);
    for (const t of await labels.allTextContents()) expect(t.trim().length).toBeGreaterThan(0);
    // Inferida = tracejada.
    const dashed = await page.locator("[data-map-canvas] [data-edge-label][data-dashed]").allTextContents();
    for (const t of dashed) expect(t).toContain("inferido");
  });

  test("modo Por quê? mostra a cadeia também em texto (RQ-078)", async ({ page }) => {
    await page.goto(`${EXPLORE}?foco=IMP-RETRABALHO`);
    await ready(page);
    await page.locator("[data-why-toggle]").click();
    const chain = chainFor(graph, "IMP-RETRABALHO");
    const text = page.locator("main [data-why-chain]").first();
    for (const e of chain.causes) await expect(text.locator(`[data-edge-sentence="${e.sentence}"]`)).toHaveCount(1);
    expect(chain.causes.length).toBeGreaterThan(1);
    expect(await nodes(page).count()).toBe(new Set(chain.causes.flatMap((e) => [e.source.id, e.target.id])).size);
  });

  test("React Flow só carrega em /mapas/explorar/; INP do toque ≤ 200ms (RQ-079)", async ({ page }) => {
    const loaded: string[] = [];
    page.on("request", (r) => loaded.push(r.url()));
    for (const path of ["/", "/artigos/", "/artigos/riscos-cognitivos/", "/mapas/", "/mapas/explorar/frc-interrupcoes/"]) {
      loaded.length = 0;
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      expect(loaded.filter((u) => /CausalMap/.test(u)), path).toEqual([]);
    }
    loaded.length = 0;
    await page.goto(EXPLORE);
    await ready(page);
    expect(loaded.some((u) => /CausalMap/.test(u))).toBe(true);
    const inp = await page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          let max = 0;
          new PerformanceObserver((list) => {
            for (const e of list.getEntries()) max = Math.max(max, e.duration);
          }).observe({ type: "event", durationThreshold: 16, buffered: true } as PerformanceObserverInit);
          const btn = document.querySelectorAll<HTMLElement>("[data-map-canvas] [data-map-node]")[1];
          btn.click();
          setTimeout(() => resolve(max), 500);
        }),
    );
    expect(inp).toBeLessThanOrEqual(200);
  });

  test("página do fator: relações, Por quê? e voltar ao mapa (RQ-072/078)", async ({ page }) => {
    await page.goto(factorHref("EVT-PERDA-CONTEXTO"));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(nodeById(graph, "EVT-PERDA-CONTEXTO")!.label);
    await expect(page.locator("[data-relation-tabs]")).toBeVisible();
    await expect(page.locator("[data-why-chain]")).toBeVisible();
    await expect(page.locator("[data-back-to-map]")).toHaveAttribute("href", "/mapas/explorar/?foco=EVT-PERDA-CONTEXTO");
    expect((await page.request.get("/mapas/explorar/nao-existe/")).status()).toBe(404);
  });

  for (const path of ["/mapas/", EXPLORE, factorHref("FRC-INTERRUPCOES")]) {
    test(`axe sem violação séria em ${path}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(path);
      if (path === EXPLORE) await ready(page);
      const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
      expect(r.violations.filter((v) => v.impact === "serious" || v.impact === "critical").map((v) => `${v.id}: ${v.nodes[0]?.target}`)).toEqual([]);
    });
  }
});

test("Mapa no menu do topo e na barra inferior (RQ-020/050)", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/mapas/");
  await expect(page.locator('header nav[aria-label="Principal"] a[aria-current="page"]')).toHaveText("Mapa");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/mapas/explorar/");
  await expect(page.locator('[data-bottom-bar] a[aria-current="page"]')).toHaveText("Mapa");
});
