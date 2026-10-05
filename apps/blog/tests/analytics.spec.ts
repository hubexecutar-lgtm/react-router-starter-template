import { expect, test, type Page, type Request } from "@playwright/test";

import { ID_FIELDS, buildEvent, campaignFrom, toDataPoint } from "../app/lib/analytics/events";

// LANC-001 PR-K: eventos da jornada no Workers Analytics Engine (RQ-111) e gate de Core Web Vitals (RQ-110).
// Sem cookies e sem dado pessoal: só estágio, ação, caminho e IDs do grafo/conteúdo.
const ALLOWED = new Set(["stage", "action", "path", ...ID_FIELDS]);

test.describe("emissor de eventos (unidade, RQ-111)", () => {
  test("evento válido vira linha do Analytics Engine com blobs na ordem fixa", () => {
    const e = buildEvent({ stage: "ARTICLE", action: "view", path: "/artigos/riscos-cognitivos/", problem_id: "COG-ATENCAO", asset_id: "riscos-cognitivos" });
    expect(e).toEqual({ stage: "ARTICLE", action: "view", path: "/artigos/riscos-cognitivos/", problem_id: "COG-ATENCAO", asset_id: "riscos-cognitivos" });
    expect(toDataPoint(e!)).toEqual({
      indexes: ["ARTICLE"],
      blobs: ["view", "/artigos/riscos-cognitivos/", "COG-ATENCAO", "", "", "riscos-cognitivos", "", ""],
      doubles: [1],
    });
  });

  test("campos fora do contrato são ignorados (nada de e-mail, IP ou user agent)", () => {
    const e = buildEvent({ stage: "TOOL", action: "select", path: "/mapas/explorar/", email: "a@b.com", ip: "1.2.3.4", ua: "x", solution_id: "CMP-REDUCAO" });
    expect(Object.keys(e!).every((k) => ALLOWED.has(k))).toBe(true);
    expect(JSON.stringify(e)).not.toMatch(/@|1\.2\.3\.4/);
  });

  for (const [name, input] of [
    ["estágio desconhecido", { stage: "SPAM", action: "view", path: "/" }],
    ["ação desconhecida", { stage: "BLOG", action: "hover", path: "/" }],
    ["caminho com query", { stage: "BLOG", action: "view", path: "/artigos/?email=a@b.com" }],
    ["caminho absoluto", { stage: "BLOG", action: "view", path: "https://evil.example/" }],
    ["e-mail num ID", { stage: "BLOG", action: "view", path: "/", campaign_id: "fulano@x.com" }],
    ["telefone num ID", { stage: "BLOG", action: "view", path: "/", campaign_id: "11987654321" }],
    ["CPF num ID", { stage: "BLOG", action: "view", path: "/", asset_id: "123.456.789-09" }],
    ["ID com espaço", { stage: "BLOG", action: "view", path: "/", asset_id: "João Silva" }],
    ["ID longo", { stage: "BLOG", action: "view", path: "/", asset_id: "a".repeat(65) }],
    ["ID que não é texto", { stage: "BLOG", action: "view", path: "/", asset_id: 42 }],
    ["lista", [{ stage: "BLOG" }]],
  ] as const) {
    test(`recusa ${name}`, () => expect(buildEvent(input)).toBeNull());
  }

  test("campanha só da URL de entrada e só se for um ID", () => {
    expect(campaignFrom("?utm_campaign=lanc-001")).toBe("lanc-001");
    expect(campaignFrom("?utm_campaign=fulano%40x.com")).toBeUndefined();
    expect(campaignFrom("")).toBeUndefined();
  });
});

test.describe("POST /api/eventos (Worker, RQ-111)", () => {
  test("válido → 204 sem cookie; inválido → 400; outro método → 405; corpo grande → 413", async ({ request }) => {
    const ok = await request.post("/api/eventos", { data: { stage: "BLOG", action: "view", path: "/artigos/" } });
    expect(ok.status()).toBe(204);
    expect(ok.headers()["set-cookie"]).toBeUndefined();
    expect((await request.post("/api/eventos", { data: { stage: "BLOG", action: "view", path: "/", campaign_id: "a@b.com" } })).status()).toBe(400);
    expect((await request.post("/api/eventos", { data: "não é json", headers: { "content-type": "text/plain" } })).status()).toBe(400);
    expect((await request.get("/api/eventos")).status()).toBe(405);
    expect((await request.post("/api/eventos", { data: "x".repeat(3000), headers: { "content-type": "text/plain" } })).status()).toBe(413);
  });
});

/**
 * Coleta os eventos que a página manda ao Worker. O Chromium não expõe ao Playwright o corpo de um sendBeacon,
 * então o teste embrulha o sendBeacon (que continua enviando de verdade) e lê o que passou por ele.
 */
async function collect(page: Page) {
  await page.addInitScript(() => {
    const w = window as unknown as { __rcEvents: string[] };
    w.__rcEvents = [];
    const original = navigator.sendBeacon.bind(navigator);
    navigator.sendBeacon = (url, data) => {
      if (String(url).endsWith("/api/eventos") && data instanceof Blob) data.text().then((t) => w.__rcEvents.push(t));
      return original(url, data);
    };
  });
  return async () => (await page.evaluate(() => (window as unknown as { __rcEvents: string[] }).__rcEvents)).map((t) => JSON.parse(t) as Record<string, string>);
}

test.describe("eventos da jornada no navegador (RQ-111)", () => {
  test("artigo: leitura e clique no Próximo passo, com o problema ligado ao grafo", async ({ page, context }) => {
    const events = await collect(page);
    await page.goto("/artigos/riscos-cognitivos/?utm_campaign=lanc-001");
    await expect.poll(async () => (await events()).length).toBeGreaterThan(0);
    expect((await events())[0]).toEqual({ stage: "ARTICLE", action: "view", path: "/artigos/riscos-cognitivos/", problem_id: "COG-ATENCAO", asset_id: "riscos-cognitivos", campaign_id: "lanc-001" });
    // Segura a navegação do CTA (o listener do documento roda depois do React) para ler o evento nesta página.
    await page.evaluate(() => document.addEventListener("click", (e) => e.preventDefault()));
    await page.locator('[data-next-step] [data-cta="primary"]').click();
    await expect.poll(async () => (await events()).find((e) => e.action === "cta")).toEqual({
      stage: "ARTICLE",
      action: "cta",
      path: "/artigos/riscos-cognitivos/",
      problem_id: "COG-ATENCAO",
      asset_id: "riscos-cognitivos",
      campaign_id: "lanc-001",
    });
    for (const e of await events()) expect(Object.keys(e).every((k) => ALLOWED.has(k)), JSON.stringify(e)).toBe(true);
    expect(await context.cookies()).toEqual([]);
  });

  test("listagem com chip de problema e escolha de fator no mapa", async ({ page }) => {
    const events = await collect(page);
    await page.goto("/artigos/?problema=sobrecarga");
    await expect.poll(async () => (await events()).find((e) => e.stage === "BLOG")?.problem_id).toBe("FRC-SOBRECARGA");
    await page.goto("/mapas/explorar/");
    await page.locator("[data-map-canvas][data-map-ready]").waitFor();
    await page.locator('[data-map-canvas] [data-map-node="CMP-PRESERVAR-ESTADO"]').click();
    await expect.poll(async () => (await events()).find((e) => e.stage === "TOOL")).toEqual({ stage: "TOOL", action: "select", path: "/mapas/explorar/", solution_id: "CMP-PRESERVAR-ESTADO" });
  });

  test("Do Not Track ligado: nenhum evento sai", async ({ page }) => {
    await page.addInitScript(() => Object.defineProperty(navigator, "doNotTrack", { get: () => "1" }));
    const sent: string[] = [];
    page.on("request", (r) => new URL(r.url()).pathname === "/api/eventos" && sent.push(r.url()));
    await page.goto("/artigos/riscos-cognitivos/");
    await page.waitForLoadState("networkidle");
    expect(sent).toEqual([]);
  });
});

// RQ-110: medição de laboratório (celular emulado) nas rotas principais; a de campo (p75) vem do Cloudflare Web
// Analytics quando o token do site estiver em app/consts.ts.
test.describe("Core Web Vitals de laboratório (RQ-110)", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  for (const path of ["/", "/artigos/", "/artigos/riscos-cognitivos/", "/mapas/", "/mapas/explorar/", "/ferramentas/"]) {
    test(`LCP ≤ 2,5 s e CLS ≤ 0,1 em ${path}`, async ({ page }) => {
      await page.goto(path, { waitUntil: "load" });
      const { lcp, cls } = await page.evaluate(
        () =>
          new Promise<{ lcp: number; cls: number }>((resolve) => {
            let lcp = 0;
            let cls = 0;
            new PerformanceObserver((l) => l.getEntries().forEach((e) => (lcp = Math.max(lcp, e.startTime)))).observe({ type: "largest-contentful-paint", buffered: true });
            new PerformanceObserver((l) =>
              l.getEntries().forEach((e) => {
                const s = e as PerformanceEntry & { value: number; hadRecentInput: boolean };
                if (!s.hadRecentInput) cls += s.value;
              }),
            ).observe({ type: "layout-shift", buffered: true });
            setTimeout(() => resolve({ lcp, cls }), 1500);
          }),
      );
      test.info().annotations.push({ type: "cwv", description: `${path} LCP=${Math.round(lcp)}ms CLS=${cls.toFixed(3)}` });
      expect(lcp).toBeLessThanOrEqual(2500);
      expect(cls).toBeLessThanOrEqual(0.1);
    });
  }
});
