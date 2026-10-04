import { expect, test } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

// Conteúdo editorial e integração dos dados (HANDOFF-RC-GLOBAL-DESIGN-CONTENT-001).
// `npm run content:check` roda este arquivo; ele também entra em `npm run test:visual`.
const ROOT = process.cwd();
const DIST = join(ROOT, "build/client");
const QF_DIR = join(ROOT, "app/data/editorial/quick-frameworks");
const VALIDATOR = join(ROOT, "tools/executar-block-quick-frameworks/scripts/validate_output.py");
const seed = JSON.parse(readFileSync(join(ROOT, "app/data/editorial/seed.json"), "utf8"));

function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((n) => {
    const f = join(dir, n);
    return statSync(f).isDirectory() ? walk(f) : [f];
  });
}
const html = walk(DIST).filter((f) => f.endsWith(".html"));
const blog = walk(join(ROOT, "content/blog")).filter((f) => /\.mdx?$/.test(f));
const frontmatter = (f: string) => readFileSync(f, "utf8").match(/^---\n([\s\S]*?)\n---/)![1];

test.describe("fonte única e arquivos gerados", () => {
  test("artigos gerados, seed do Hub e tokens das ferramentas estão em dia", () => {
    for (const script of ["scripts/build-quick-frameworks.mjs", "scripts/export-surface-tokens.mjs"]) {
      expect(() => execFileSync("node", [script, "--check"], { cwd: ROOT, stdio: "pipe" }), script).not.toThrow();
    }
    const js = readFileSync(join(ROOT, "public/hub-editorial/seed.js"), "utf8");
    const embedded = JSON.parse(js.slice(js.indexOf("=") + 1).trim().replace(/;$/, ""));
    expect(embedded, "public/hub-editorial/seed.js defasado: rode node scripts/sync-editorial-seed.mjs").toEqual(seed);
    const hub = readFileSync(join(ROOT, "public/hub-editorial/index.html"), "utf8");
    expect(hub).toContain('<script src="./seed.js"></script>');
    expect(hub, "o Hub não pode voltar a ter seed inline").not.toMatch(/window\.__SEED__ = \{/);
  });

  test("ferramentas autônomas consomem /ds/surfaces.css sem hex neutro próprio", () => {
    for (const tool of ["hub-editorial", "skills", "catalogo-offline"]) {
      const src = readFileSync(join(ROOT, "public", tool, "index.html"), "utf8");
      expect(src, tool).toContain('href="/ds/surfaces.css"');
      expect(src.match(/#(f5f5f7|e2e2e6|fbfbfb|e5e5e5|f8f8f8|ebebeb)\b/gi) ?? [], `${tool}: neutro fora do token`).toEqual([]);
    }
  });

  test("IDs do banco são únicos", () => {
    const keys: Record<string, string> = {
      content: "Content_ID",
      arguments: "Argument_ID",
      evidence: "Evidence_ID",
      taxonomy: "Taxonomy_ID",
      backlog: "Idea_ID",
      visuals: "Visual_ID",
      decisions: "Decision_ID",
    };
    for (const [mod, key] of Object.entries(keys)) {
      const ids = seed.seed[mod].map((r: Record<string, string>) => r[key]);
      expect(new Set(ids).size, `${mod}: IDs duplicados`).toBe(ids.length);
    }
  });
});

test.describe("artigos", () => {
  const qf = readdirSync(QF_DIR).filter((f) => f.endsWith(".md"));

  test("todo Quick Framework passa no validador da skill", () => {
    expect(qf.length).toBeGreaterThanOrEqual(8);
    for (const f of qf) {
      const out = execFileSync("python3", [VALIDATOR, join(QF_DIR, f)], { encoding: "utf8" });
      expect(out, f).toContain("STATUS: VERIFIED");
    }
  });

  test("território, conteúdo e evidências de cada artigo existem no banco", () => {
    const slugs = seed.seed.taxonomy.map((t: { Slug: string }) => t.Slug.replace(/\//g, ""));
    const contentIds = seed.seed.content.map((c: { Content_ID: string }) => c.Content_ID);
    const evidenceIds = seed.seed.evidence.map((e: { Evidence_ID: string }) => e.Evidence_ID);
    for (const f of blog) {
      const fm = frontmatter(f);
      const name = relative(ROOT, f);
      expect(slugs, `${name}: território`).toContain(fm.match(/^territory:\s*(\S+)/m)?.[1]);
      const cid = fm.match(/^contentId:\s*(\S+)/m)?.[1];
      if (cid) expect(contentIds, `${name}: contentId`).toContain(cid);
      for (const id of fm.match(/EVD-RC-\d{4}/g) ?? []) expect(evidenceIds, `${name}: ${id}`).toContain(id);
    }
  });

  test("o site nunca renderiza Mermaid (ADR-05)", () => {
    for (const f of blog) expect(readFileSync(f, "utf8"), relative(ROOT, f)).not.toContain("```mermaid");
  });
});

test.describe("build publicado", () => {
  test.skip(html.length === 0, "rode npm run build antes");

  test("nenhuma página contém copy de template", () => {
    const banned = /Mainline|lorem ipsum|John Doe|Jane Doe|shadcnblocks|Supermainline|Roba Ventures/i;
    const offenders = html.filter((f) => banned.test(readFileSync(f, "utf8"))).map((f) => relative(DIST, f));
    expect(offenders).toEqual([]);
  });

  test("todas as páginas declaram pt-BR", () => {
    const offenders = html
      .filter((f) => !/<html[^>]*lang="pt-BR"/.test(readFileSync(f, "utf8")))
      .map((f) => relative(DIST, f));
    expect(offenders).toEqual([]);
  });

  test("links internos apontam para páginas existentes ou redirecionadas", () => {
    const redirects = new Set(
      readFileSync(join(ROOT, "public/_redirects"), "utf8")
        .split("\n")
        .filter((l) => l.startsWith("/"))
        .map((l) => l.split(/\s+/)[0]),
    );
    const exists = (path: string) => {
      const clean = decodeURI(path.split(/[?#]/)[0]);
      if (!clean || redirects.has(clean)) return true;
      const target = join(DIST, clean);
      return existsSync(target) && statSync(target).isFile() ? true : existsSync(join(target, "index.html"));
    };
    const broken: string[] = [];
    for (const f of html) {
      for (const m of readFileSync(f, "utf8").matchAll(/href="(\/[^"]*)"/g)) {
        if (m[1].startsWith("//")) continue;
        if (!exists(m[1])) broken.push(`${relative(DIST, f)} → ${m[1]}`);
      }
    }
    expect([...new Set(broken)]).toEqual([]);
  });

  test("nenhum link interno para /loja (ADR-14, RQ-103)", () => {
    const offenders = html.filter((f) => /href="\/loja[/"?#]/.test(readFileSync(f, "utf8"))).map((f) => relative(DIST, f));
    expect(offenders).toEqual([]);
  });

  test("redirecionamentos dos posts de demonstração levam a artigos existentes", () => {
    const lines = readFileSync(join(ROOT, "public/_redirects"), "utf8").split("\n").filter((l) => l.startsWith("/"));
    expect(lines.length).toBeGreaterThan(0);
    for (const l of lines) {
      const [, to, code] = l.split(/\s+/);
      expect(code).toBe("301");
      // /loja/* → /ferramentas/:splat (ADR-14): the splat target must exist as a section.
      const base = to.replace(/:splat$/, "");
      expect(existsSync(join(DIST, base, "index.html")), to).toBe(true);
    }
  });
});

test.describe("navegação editorial", () => {
  test("filtro por território em /blog/ esconde os outros artigos e pode voltar", async ({ page }) => {
    await page.goto("/blog/");
    const items = page.locator("[data-filter-scope] [data-territory]");
    const total = await items.count();
    expect(total).toBeGreaterThan(2);
    await page.locator("[data-chip=controles-cognitivos]").click();
    await expect(page.locator("[data-chip=controles-cognitivos]")).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("[data-filter-scope] [data-territory]:visible")).toHaveCount(1);
    await expect(page).toHaveURL(/tema=controles-cognitivos/);
    await page.locator("[data-chip=todos]").click();
    await expect(page.locator("[data-filter-scope] [data-territory]:visible")).toHaveCount(total);
  });

  test("busca encontra artigos, temas e evidências e filtra por aba", async ({ page }) => {
    await page.goto("/buscar/?q=checklist");
    await expect(page.locator("#q")).toHaveValue("checklist");
    const results = page.locator("[data-results] > li");
    await expect(results.first()).toContainText(/checklist/i);
    await page.getByRole("tab", { name: /Evidências/ }).click();
    await expect(results.first()).toContainText("Evidência");
    await page.locator("#q").fill("zzz-inexistente");
    await expect(results.first()).toContainText("Nenhum resultado");
  });

  test("busca da home leva a /buscar/ com o termo", async ({ page }) => {
    await page.goto("/");
    await page.locator("#home-search").fill("exposição");
    await page.locator("#home-search").press("Enter");
    await expect(page).toHaveURL(/\/buscar\/\?q=exposi/);
    await expect(page.locator("[data-results] > li").first()).toContainText(/Exposição/i);
  });

  test("menu móvel abre, fecha com Esc e devolve o foco", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const toggle = page.locator("[data-menu-toggle]");
    await toggle.click();
    await expect(page.locator("#site-menu")).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(page.locator("#site-menu")).toBeHidden();
    await expect(toggle).toBeFocused();
  });

  test("artigo mostra território, tempo de leitura, evidências e leitura seguinte", async ({ page }) => {
    await page.goto("/blog/o-que-e-risco-cognitivo/");
    await expect(page.locator("h1")).toHaveText("O que é risco cognitivo?");
    await expect(page.locator(".rc-meta").first()).toContainText(/min de leitura/);
    await expect(page.locator("#evidencias-artigo")).toBeVisible();
    await expect(page.locator("[aria-labelledby=leia-tambem] a")).toHaveCount(2);
    await expect(page.locator("pre, [data-plain]").filter({ hasText: "Erro tratado como causa" }).first()).toBeVisible();
  });
});
