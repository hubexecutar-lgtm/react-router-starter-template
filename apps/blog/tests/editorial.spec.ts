import { expect, test, type Page } from "@playwright/test";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

// LANC-001 G1 (PR-D + PR-E + PR-F) sobre o Stories (DEC-U14): imagens RC, conteúdo canônico, fontes e jornada.
const ROOT = process.cwd();
const CANON = join(ROOT, "../../docs/lancamento/LANC-001/intake/DOCS-002/RC_EDITORIAL_PLAIN_TXT_v1.0.0");
const ARTICLES: Record<string, string> = {
  "riscos-cognitivos": "01_CANONICO/02_RC_ARTIGO_P1_RISCOS_COGNITIVOS.txt",
  "processos-neuroadaptativos": "01_CANONICO/03_RC_ARTIGO_P2_PROCESSOS_NEUROADAPTATIVOS.txt",
  "compensacao-cognitiva": "01_CANONICO/04_RC_ARTIGO_P3_FERRAMENTAS_SOLUCOES.txt",
  "tres-pilares-riscos-cognitivos": "01_CANONICO/05_RC_ARTIGO_MASTER_3_PILARES_1500.txt",
};
const PUBLISHED = readdirSync(join(ROOT, "content/artigos")).map((f) => f.replace(/\.mdx$/, ""));
const EDITORIAL = ["/", "/fontes/", "/sobre/", "/mapas/", ...PUBLISHED.map((s) => `/artigos/${s}/`)];

// Aspas tipográficas (remark-smartypants, tipografia do site) não contam como reescrita.
const norm = (s: string) => s.replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/\s+/g, " ").trim().toLocaleLowerCase("pt-BR");
/** Linhas de conteúdo do texto canônico: sem cabeçalho (ID…TITLE), sem o título repetido e sem a linha CTA. */
function canonicalLines(file: string) {
  const [, body] = readFileSync(join(CANON, file), "utf8").replace(/\r\n/g, "\n").split(/\n\n(.*)/s);
  return body
    .split("\n")
    .map((l) => l.trim())
    .filter((l, i) => l && i > 0 && !l.startsWith("CTA: "))
    .map((l) => l.replace(/^\d+\.\s+/, ""));
}
const pageText = async (page: Page, path: string) => {
  await page.goto(path);
  return norm(await page.locator("main").innerText());
};

test.describe("D · imagens RC (RQ-030…033)", () => {
  test("6 ilustrações no banco, sem texto, com alt, cada variante ≤ 250 KB (RQ-030)", () => {
    const manifest = JSON.parse(readFileSync(join(ROOT, "docs/banco-imagens/manifest.json"), "utf8"));
    const rc = manifest.imagens.filter((i: { original?: string }) => i.original?.startsWith("RC_"));
    expect(rc).toHaveLength(6);
    for (const img of rc) {
      expect(img.tem_texto, img.id).toBe(false);
      expect(img.alt?.length, img.id).toBeGreaterThan(20);
      expect(img.usos.length, img.id).toBeGreaterThan(0);
      for (const f of img.arquivo_site) {
        const path = join(ROOT, "public", f);
        expect(existsSync(path), f).toBe(true);
        expect(statSync(path).size, f).toBeLessThanOrEqual(250 * 1024);
      }
    }
  });

  test("nenhuma referência REF_* publicada (RQ-031)", () => {
    const walk = (d: string): string[] =>
      readdirSync(d).flatMap((n) => (statSync(join(d, n)).isDirectory() ? walk(join(d, n)) : [n]));
    expect(walk(join(ROOT, "public")).filter((n) => /^REF_/i.test(n))).toEqual([]);
  });

  for (const slug of PUBLISHED) {
    test(`todo artigo tem imagem com art direction: ${slug} (RQ-032)`, async ({ page }) => {
      await page.goto(`/artigos/${slug}/`);
      const fig = page.locator("[data-article-image] picture");
      await expect(fig.locator("source[media]")).toHaveCount(1);
      const img = fig.locator("img");
      await expect(img).toHaveAttribute("alt", /.{20,}/);
      await expect(img).toHaveAttribute("width", /\d+/);
      await expect(img).toHaveAttribute("fetchpriority", "high");
      expect(await img.evaluate((e: HTMLImageElement) => e.complete && e.naturalWidth > 0)).toBe(true);
    });
  }

  test("retrato no mobile e 16:9 no desktop (RQ-032)", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/artigos/riscos-cognitivos/");
    const mobile = page.locator("[data-article-image] img");
    await expect.poll(() => mobile.evaluate((e: HTMLImageElement) => e.currentSrc)).toContain("retrato");
    const box = await mobile.boundingBox();
    expect(box!.height).toBeGreaterThan(box!.width);
    expect(box!.height).toBeLessThanOrEqual(844 + 1);
    await page.setViewportSize({ width: 1363, height: 900 });
    await page.goto("/artigos/riscos-cognitivos/");
    await expect.poll(() => page.locator("[data-article-image] img").evaluate((e: HTMLImageElement) => e.currentSrc)).toContain("16x9");
  });

  for (const path of ["/", "/artigos/riscos-cognitivos/", "/sobre/"]) {
    test(`CLS ≤ 0,1 em ${path} (RQ-033)`, async ({ page }) => {
      await page.addInitScript(() => {
        (window as unknown as { __cls: number }).__cls = 0;
        new PerformanceObserver((list) => {
          for (const e of list.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean })[]) {
            if (!e.hadRecentInput) (window as unknown as { __cls: number }).__cls += e.value;
          }
        }).observe({ type: "layout-shift", buffered: true });
      });
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      await page.mouse.wheel(0, 2000);
      await page.waitForTimeout(500);
      expect(await page.evaluate(() => (window as unknown as { __cls: number }).__cls)).toBeLessThanOrEqual(0.1);
    });
  }
});

test.describe("E · conteúdo canônico (RQ-040…046)", () => {
  test("/comece/ = RC-LP-001 sem reescrita, na ordem Problema → Conhecimento → Ferramenta → Ação (RQ-040)", async ({ page }) => {
    const text = await pageText(page, "/comece/");
    for (const line of canonicalLines("01_CANONICO/01_RC_LANDING_3_PILARES.txt")) expect(text, line).toContain(norm(line));
    const order = await page.locator("[data-landing-section]").evaluateAll((els) => els.map((e) => e.getAttribute("data-landing-section")));
    expect(order).toEqual(["Problema", "Conhecimento", "Ferramenta", "Ação"]);
    for (const p of ["p1", "p2", "p3"]) await expect(page.locator(`[data-pillar=${p}] a`, { hasText: "Saiba mais" })).toHaveCount(1);
  });

  test("home = RC-HOME-002 sem reescrita, na ordem do esboço (HOME-BRAIN-001)", async ({ page }) => {
    await page.goto("/");
    // textContent: as explicações das 4 funções estão no HTML, só a selecionada fica visível.
    const text = norm((await page.locator("main").textContent()) ?? "");
    const lines = readFileSync(join(ROOT, "../../docs/lancamento/LANC-001/intake/HOME-002/RC_HOME_002.txt"), "utf8")
      .split("\n")
      .map((l) => l.trim().replace(/^CTA: /, ""))
      .filter((l) => l && !l.startsWith("FONTES DOS DADOS") && !/\| https?:/.test(l));
    for (const line of lines) {
      // Separadores de forma do canônico (": " de rótulo, " | " de tabela, " → " de cadeia, "01 " de passo) viram layout.
      for (const part of line.replace(/^\d+\.?\s+/, "").split(/: | \| | → |, (?=[A-ZÁÉÍÓÚ])/)) {
        if (part.trim()) expect(text, line).toContain(norm(part.replace(/[.→]+$/, "")));
      }
    }
    const order = await page.locator("[data-home-section]").evaluateAll((els) => els.map((e) => e.getAttribute("data-home-section")));
    expect(order).toEqual(["Hero", "Dados", "Risco", "Mapa", "Trilha", "Exigências", "Problemas", "Método", "Apoio", "CTA"]);
    await expect(page.locator("[data-cta=primary]")).toHaveCount(1);
    await expect(page.getByRole("link", { name: "Comece por aqui" }).first()).toHaveAttribute("href", "/comece/");
    // Camada própria da home (ADR-23): o home.css só entra na home.
    const homeCss = () => page.evaluate(() => [...document.querySelectorAll<HTMLLinkElement>("link[rel=stylesheet]")].some((l) => /\/home[-.][^/]*\.css$/.test(l.href)));
    expect(await homeCss()).toBe(true);
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--home-accent").trim())).toBe("#ff5b0a");
    await page.goto("/comece/");
    expect(await homeCss()).toBe(false);
  });

  test("os números da home citam a fonte primária, também listada em /fontes/", async ({ page }) => {
    await page.goto("/");
    for (const href of ["https://educa.ibge.gov.br/jovens/materias-especiais/22700-censo-2022-contou-2-4-milhoes-de-pessoas-diagnosticadas-com-autismo-no-brasil.html", "https://doi.org/10.7189/jogh.11.04009"]) {
      await expect(page.locator(`.home-stat a[href="${href}"]`)).toHaveCount(1);
      await page.goto("/fontes/");
      await expect(page.locator(`[data-home-sources] a[href="${href}"]`)).toHaveCount(1);
      await page.goto("/");
    }
  });

  for (const [slug, file] of Object.entries(ARTICLES)) {
    test(`artigo canônico sem reescrita: ${slug} (RQ-041)`, async ({ page }) => {
      const text = await pageText(page, `/artigos/${slug}/`);
      for (const line of canonicalLines(file)) expect(text, line).toContain(norm(line));
    });
  }

  test("os 4 artigos canônicos no hub e no prerender (RQ-041)", async ({ request }) => {
    for (const slug of Object.keys(ARTICLES)) expect((await request.get(`/artigos/${slug}/`)).status(), slug).toBe(200);
    const hub = await (await request.get("/admin/rotas/")).text();
    for (const slug of Object.keys(ARTICLES)) expect(hub, slug).toContain(`/artigos/${slug}/`);
  });

  test("/fontes/ lista as fontes do RC-SRC-001 com link (RQ-042)", async ({ page }) => {
    await page.goto("/fontes/");
    const links = page.locator("[data-sources] a");
    await expect(links).toHaveCount(11);
    for (const href of await links.evaluateAll((els) => els.map((e) => (e as HTMLAnchorElement).href))) {
      expect(href).toMatch(/^https:\/\//);
      expect(readFileSync(join(CANON, "02_REFERENCIAS/01_FONTES_WEB.txt"), "utf8")).toContain(href);
    }
  });

  test("conceitos próprios rotulados como do projeto (RQ-043)", async ({ page }) => {
    const note = norm('"Processo neuroadaptativo" e a cadeia específica "Risco Cognitivo → Compensação → Solução" permanecem conceitos metodológicos próprios do projeto');
    for (const path of ["/fontes/", "/sobre/", "/artigos/processos-neuroadaptativos/", "/artigos/tres-pilares-riscos-cognitivos/"]) {
      expect(await pageText(page, path), path).toContain(note);
    }
  });

  test("todo artigo termina com 'Próximo passo' e exatamente 1 CTA primário (RQ-044)", async ({ page }) => {
    for (const slug of PUBLISHED) {
      await page.goto(`/artigos/${slug}/`);
      const block = page.locator("[data-next-step]");
      await expect(block, slug).toHaveCount(1);
      await expect(block.locator("[data-cta=primary]"), slug).toHaveCount(1);
      const href = await block.locator("[data-cta=primary]").getAttribute("href");
      expect((await page.request.get(href!)).status(), `${slug} → ${href}`).toBe(200);
    }
  });

  test("JSON-LD BlogPosting com publisher e logo (RQ-045)", async ({ page }) => {
    for (const slug of PUBLISHED) {
      await page.goto(`/artigos/${slug}/`);
      const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
      const post = blocks.map((b) => JSON.parse(b)).find((b) => b["@type"] === "BlogPosting");
      expect(post, slug).toBeTruthy();
      for (const key of ["headline", "datePublished", "dateModified", "author", "image", "publisher"]) expect(post[key], `${slug}.${key}`).toBeTruthy();
      expect(post.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(post.publisher.logo.url).toMatch(/\/images\/logo-512\.png$/);
    }
  });

  test("todo artigo tem pilar, problemas citados no texto e nós do grafo existentes (RQ-046)", async () => {
    const graph = JSON.parse(readFileSync(join(ROOT, "app/data/graph/rc-graph.json"), "utf8"));
    const ids = new Set(graph.nodes.map((n: { id: string }) => n.id));
    const meta = readFileSync(join(ROOT, "app/data/article-meta.ts"), "utf8");
    for (const slug of PUBLISHED) {
      const block = meta.slice(meta.indexOf(`"${slug}": {`));
      const entry = block.slice(0, block.indexOf("\n  },") + 4);
      expect(entry, slug).toMatch(/pillar: "p[123]"/);
      for (const ref of [...entry.matchAll(/"((?:FRC|COG|EVT|IMP|CMP|CTL|MTH|SOL|EVD)-[A-Z0-9-]+)"/g)].map((m) => m[1])) {
        expect(ids.has(ref), `${slug}: ${ref}`).toBe(true);
      }
      const text = norm(readFileSync(join(ROOT, "content/artigos", `${slug}.mdx`), "utf8"));
      const stems: Record<string, string> = { atencao: "atenç", memoria: "memória", sobrecarga: "sobrecarga", interrupcoes: "interrup", decisao: "decis", organizacao: "organiz" };
      const problems = [...(entry.match(/problems: \[([^\]]*)\]/)?.[1] ?? "").matchAll(/"([a-z]+)"/g)].map((m) => m[1]);
      expect(problems.length, slug).toBeGreaterThan(0);
      for (const p of problems) expect(text, `${slug}: ${p}`).toContain(stems[p]);
    }
  });
});

test.describe("F · jornada (RQ-050…054)", () => {
  test("menu Artigos · Mapa · Ferramentas · Sobre igual no topo, no drawer e no rodapé (RQ-050)", async ({ page }) => {
    await page.setViewportSize({ width: 1363, height: 900 });
    await page.goto("/");
    const top = await page.locator('header nav[aria-label="Principal"] a').allTextContents();
    expect(top).toEqual(["Artigos", "Mapa", "Ferramentas", "Sobre"]);
    const footer = await page.locator("footer a").allTextContents();
    for (const label of top) expect(footer, label).toContain(label);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.locator("[data-menu-toggle]").click();
    const drawer = await page.locator("#site-menu a").allTextContents();
    for (const label of top) expect(drawer, label).toContain(label);
  });

  for (const path of EDITORIAL) {
    test(`quatro perguntas em ${path}: onde estou, o que significa, próxima ação (RQ-052)`, async ({ page }) => {
      await page.goto(path);
      const h1 = page.locator("main h1");
      await expect(h1).toHaveCount(1);
      // onde estou: eyebrow logo acima do h1
      const eyebrow = await h1.evaluate((el) => el.previousElementSibling?.textContent?.trim() ?? "");
      expect(eyebrow.length, "eyebrow").toBeGreaterThan(2);
      // o que significa: lead logo depois do h1
      const lead = await h1.evaluate((el) => el.nextElementSibling?.textContent?.trim() ?? "");
      expect(lead.length, "lead").toBeGreaterThan(20);
      // próxima ação: um CTA primário
      await expect(page.locator("main [data-cta=primary]").first()).toBeVisible();
    });
  }

  test("nenhuma região com dois CTAs primários (RQ-053)", async ({ page }) => {
    for (const path of EDITORIAL) {
      await page.goto(path);
      const counts = await page
        .locator("main section, main header, main article")
        .evaluateAll((els) => els.map((e) => [...e.querySelectorAll(":scope [data-cta=primary]")].filter((a) => a.closest("section, header, article") === e).length));
      expect(Math.max(0, ...counts), path).toBeLessThanOrEqual(1);
    }
  });

  test("chips de problema filtram a lista e são links compartilháveis (RQ-054)", async ({ page }) => {
    await page.setViewportSize({ width: 1363, height: 900 });
    await page.goto("/artigos/");
    const chips = page.locator("[data-problem-chips] a");
    await expect(chips).toHaveText(["Atenção", "Memória", "Sobrecarga", "Interrupções", "Decisão", "Organização"]);
    const all = await page.locator("[data-story-card]").count();
    await chips.filter({ hasText: "Sobrecarga" }).click();
    await expect(page).toHaveURL(/\?problema=sobrecarga$/);
    await expect.poll(() => page.locator("[data-story-card]").count()).toBeLessThan(all);
    const hrefs = await page.locator("[data-story-card] h2 a, [data-story-card] h3 a").evaluateAll((els) => els.map((e) => e.getAttribute("href")));
    expect(hrefs.sort()).toEqual(["/artigos/risco-cognitivo/", "/artigos/tres-pilares-riscos-cognitivos/"]);
    // o link compartilhado abre já filtrado
    await page.goto("/artigos/?problema=sobrecarga");
    await expect.poll(() => page.locator("[data-story-card]").count()).toBe(2);
  });
});
