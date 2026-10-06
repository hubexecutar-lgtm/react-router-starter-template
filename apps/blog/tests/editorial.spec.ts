import { expect, test, type Page } from "@playwright/test";
import { createHash } from "node:crypto";
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
const ALL_MDX = readdirSync(join(ROOT, "content/artigos")).map((f) => f.replace(/\.mdx$/, ""));
// ADR-26: na reconstrução só PUBLIC_ARTICLES é público; os outros MDX ficam intactos (hash abaixo) e respondem 302.
const PUBLISHED = ["riscos-cognitivos-guia"];
const RETIRED = ALL_MDX.filter((s) => !PUBLISHED.includes(s));
const EDITORIAL = ["/", "/fontes/", "/sobre/", "/mapas/", "/artigos/", "/ferramentas/", "/comece/", ...PUBLISHED.map((s) => `/artigos/${s}/`)];
/** SHA-256 dos MDX em main @ 42481ac: o conteúdo oculto é preservado byte a byte. */
const MDX_SHA256: Record<string, string> = {
  "compensacao-cognitiva": "b275e236373b827d1107dab6204b9c52b1cda85acd1c0c38ceb04c19abf3c5d2",
  "estrategias-reduzir-riscos-cognitivos": "475fb61203c034f039324ffc0ac7802bfd4be9c0ab667916e7aae39e867234a0",
  "funcoes-executivas-demandas-risco": "3df66a3150c355953bd48013481bb026798a595754976f9f52f5fc5219e0dbcc",
  "o-que-sao-riscos-cognitivos": "408c2c0727b9be0c753081bae72c8e405acad840148579e8737ff75e97e6c673",
  "processos-neuroadaptativos": "bbed8b6367e0fa2e58366d61a59564eb6c60bc219fd744efc1918137eb0b5d0a",
  "risco-cognitivo": "b8d0a7bc677326e9752370e911074a4f5d8146276edeff3e7a8a4cab6f4cdf2c",
  "riscos-cognitivos-guia": "79e62f49d61c7afc1033203621f7c9bf91690c24650c681e5f995ed3aa6e2874",
  "riscos-cognitivos-rotina-estudos-trabalho": "cef492a904a280f95655101445611413c94b26a5145ad7b0676de753373c889d",
  "riscos-cognitivos": "df35e1c2f80f544b878cc56630c55e7d3517893e764cfff1ab513586e49a4fd1",
  "tres-pilares-riscos-cognitivos": "49cc2a26347bde7f9d47b05cf2a09e361969f03c7c692f36c314c5f971ac6959",
};

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

  // ADR-26: as ilustrações azuis (RC_*) ficam no banco (RQ-030), mas não entram nos layouts do DS novo.
  for (const path of ["/", "/artigos/", "/artigos/riscos-cognitivos-guia/", "/sobre/", "/comece/"]) {
    test(`nenhuma ilustração da identidade antiga em ${path} (ADR-26)`, async ({ page }) => {
      await page.goto(path);
      const art = await page.locator("main img").evaluateAll((els) => els.map((e) => (e as HTMLImageElement).getAttribute("src") ?? "").filter((src) => /\/images\/(?!logo)/.test(src)));
      expect(art).toEqual([]);
      await expect(page.locator("[data-article-image], [data-dot-field]")).toHaveCount(0);
    });
  }

  for (const path of ["/", "/artigos/riscos-cognitivos-guia/", "/sobre/"]) {
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

  test("RC-HOME-002 sem reescrita: hero e prévias na Home, método completo em /sobre/ (ADR-26)", async ({ page }) => {
    // textContent: as explicações das 4 funções estão no HTML, só a selecionada fica visível.
    await page.goto("/");
    const home = norm((await page.locator("main").textContent()) ?? "");
    const homeOrder = await page.locator("[data-home-section]").evaluateAll((els) => els.map((e) => e.getAttribute("data-home-section")));
    expect(homeOrder).toEqual(["Hero", "Mapa", "Trilha", "Blog", "Ferramentas", "CTA"]);
    await expect(page.locator("[data-cta=primary]")).toHaveCount(1);
    // ADR-26: não há mais camada própria da home; o acento é o do DS transversal.
    expect(await page.evaluate(() => [...document.querySelectorAll<HTMLLinkElement>("link[rel=stylesheet]")].some((l) => /\/home[-.][^/]*\.css$/.test(l.href)))).toBe(false);
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--cf-accent").trim())).toBe("#ff5e1f");
    await page.goto("/sobre/");
    const sobre = norm((await page.locator("main").textContent()) ?? "");
    const sobreOrder = await page.locator("[data-home-section]").evaluateAll((els) => els.map((e) => e.getAttribute("data-home-section")));
    expect(sobreOrder).toEqual(["Dados", "Risco", "Exigências", "Problemas", "Método", "Apoio"]);
    const text = `${home} ${sobre}`;
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
  });

  test("os números do RC-HOME-002 citam a fonte primária, também listada em /fontes/", async ({ page }) => {
    await page.goto("/sobre/");
    for (const href of ["https://educa.ibge.gov.br/jovens/materias-especiais/22700-censo-2022-contou-2-4-milhoes-de-pessoas-diagnosticadas-com-autismo-no-brasil.html", "https://doi.org/10.7189/jogh.11.04009"]) {
      await expect(page.locator(`.ds-quote a[href="${href}"]`)).toHaveCount(1);
      await page.goto("/fontes/");
      await expect(page.locator(`[data-home-sources] a[href="${href}"]`)).toHaveCount(1);
      await page.goto("/sobre/");
    }
  });

  test("artigos fora do ar na reconstrução: MDX intacto, 302 para /artigos/, fora do prerender e do hub (ADR-26)", async ({ request }) => {
    for (const slug of ALL_MDX) {
      const sha = createHash("sha256").update(readFileSync(join(ROOT, "content/artigos", `${slug}.mdx`))).digest("hex");
      expect(sha, slug).toBe(MDX_SHA256[slug]);
    }
    const redirects = readFileSync(join(ROOT, "public/_redirects"), "utf8");
    for (const slug of RETIRED) {
      const res = await request.get(`/artigos/${slug}/`, { maxRedirects: 0 });
      expect(res.status(), slug).toBe(302);
      expect(res.headers().location, slug).toMatch(/\/artigos\/$/);
      expect(redirects, slug).toMatch(new RegExp(`^/artigos/${slug}/\\s+/artigos/\\s+302$`, "m"));
      expect(existsSync(join(ROOT, "build/client/artigos", slug)), slug).toBe(false);
    }
    for (const slug of PUBLISHED) expect((await request.get(`/artigos/${slug}/`)).status(), slug).toBe(200);
    expect((await request.get("/artigos/nao-existe/", { maxRedirects: 0 })).status()).toBe(404);
  });

  // RQ-041: os 4 canônicos continuam sem reescrita no MDX (fora do ar na reconstrução, ADR-26).
  for (const [slug, file] of Object.entries(ARTICLES)) {
    test(`artigo canônico preservado no MDX: ${slug} (RQ-041)`, () => {
      const mdx = norm(readFileSync(join(ROOT, "content/artigos", `${slug}.mdx`), "utf8").replace(/[*_#>`]/g, " "));
      for (const line of canonicalLines(file)) expect(mdx, line).toContain(norm(line.replace(/[*_#>`]/g, " ")));
    });
  }

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
    for (const path of ["/fontes/", "/sobre/", "/artigos/riscos-cognitivos-guia/"]) {
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
    for (const slug of ALL_MDX) {
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
  test("menu Blog · Mapa · Ferramentas · Sobre igual no topo, no drawer e no rodapé (RQ-050, ADR-26)", async ({ page }) => {
    await page.setViewportSize({ width: 1363, height: 900 });
    await page.goto("/");
    const top = await page.locator('header nav[aria-label="Principal"] a').allTextContents();
    expect(top).toEqual(["Blog", "Mapa", "Ferramentas", "Sobre"]);
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

  test("facetas do Blog: tema com artigo é link compartilhável; tema sem artigo fica em preparação (ADR §3, ADR-26)", async ({ page }) => {
    await page.setViewportSize({ width: 1363, height: 900 });
    await page.goto("/artigos/");
    const facets = page.locator("[data-blog-facets]");
    for (const group of ["Neurodivergências e perfis", "Funções cognitivas", "Domínios de conhecimento", "Contextos"]) await expect(facets.getByRole("heading", { name: group })).toBeVisible();
    await facets.getByRole("link", { name: /TDAH/ }).click();
    await expect(page).toHaveURL(/\?tema=tdah$/);
    await expect(page.locator("[data-story-card] h3 a")).toHaveAttribute("href", "/artigos/riscos-cognitivos-guia/");
    await expect(facets.getByRole("link", { name: /Dislexia/ })).toHaveCount(0);
    await expect(facets.getByText(/Dislexia/)).toBeVisible();
    await page.goto("/artigos/?tema=dislexia");
    await expect(page.locator("[data-empty]")).toBeVisible();
    await expect(page.locator("[data-empty] a")).toHaveAttribute("href", "/artigos/");
  });
});
