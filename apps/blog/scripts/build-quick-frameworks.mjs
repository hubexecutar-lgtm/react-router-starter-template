// Quick Frameworks → artigos do blog (HANDOFF-RC-GLOBAL-DESIGN-CONTENT-001, Fase 5).
//
// Fonte: app/data/editorial/quick-frameworks/CNT-RC-*.md, no template da skill
// executar-block-quick-frameworks (tools/executar-block-quick-frameworks), validados por
// scripts/validate_output.py. Este script gera, de forma idempotente:
//   1. content/blog/<slug>.mdx — mesma ordem de seções; Mermaid convertido 1:1 em
//      ```ascii (ADR-05: o site nunca renderiza Mermaid); Aviso em <Callout>; síntese
//      do infográfico em ```plain; fontes como links.
//   2. app/data/editorial/seed.json — upsert de content, production, seo e visuals por
//      Content_ID (não apaga nem duplica registros).
// `node scripts/build-quick-frameworks.mjs --check` falha se algo gerado estiver defasado.
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SRC = "app/data/editorial/quick-frameworks";
const BLOG = "content/blog";
const SEED = "app/data/editorial/seed.json";
const WPM = 200; // mesma regra de app/lib/reading-time.ts

// Imagens dos artigos (ADR-12): só ilustrações sem texto do banco (docs/banco-imagens). Hoje nenhum
// artigo tem ilustração própria; a hierarquia tipográfica e o halftone ocupam o espaço visual.
const IMAGES = {};

// ------------------------------------------------------------------ parsing
export function parseRecord(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error("registro sem frontmatter");
  const meta = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim();
    if (v.startsWith("[")) v = v.slice(1, -1).split(",").map((s) => s.trim()).filter(Boolean);
    else v = v.replace(/^"(.*)"$/, "$1");
    meta[kv[1]] = v;
  }
  return { meta, body: m[2] };
}

function sections(body) {
  const out = [];
  let cur = null;
  for (const line of body.split("\n")) {
    const h = line.match(/^##\s+(\d+)\.\s+(.+)$/);
    if (h) {
      cur = { n: Number(h[1]), title: h[2].trim(), lines: [] };
      out.push(cur);
    } else if (cur) cur.lines.push(line);
  }
  return out.map((s) => ({ ...s, text: s.lines.join("\n").trim() }));
}

// ------------------------------------------------------------------ Mermaid → ASCII
function parseFlowchart(src) {
  const labels = new Map();
  const edges = [];
  const node = (tok) => {
    const m = tok.trim().match(/^(\w+)(?:\[(.+)\])?$/);
    if (!m) throw new Error(`nó Mermaid não reconhecido: ${tok}`);
    if (m[2]) labels.set(m[1], m[2]);
    return m[1];
  };
  for (const line of src.split("\n").slice(1)) {
    if (!line.trim()) continue;
    const [a, b] = line.split("-->");
    if (b === undefined) throw new Error(`linha Mermaid não suportada: ${line}`);
    edges.push([node(a), node(b)]);
  }
  return { labels, edges, label: (id) => labels.get(id) ?? id };
}

function box(text, width) {
  const pad = width - [...text].length;
  return [`┌${"─".repeat(width + 2)}┐`, `│ ${text}${" ".repeat(pad)} │`, `└${"─".repeat(width + 2)}┘`];
}

/** Cadeia linear vira caixas empilhadas; grafo não linear vira lista de arestas. */
export function mermaidToAscii(src) {
  const { edges, label } = parseFlowchart(src);
  const linear = edges.every(([a], i) => i === 0 || edges[i - 1][1] === a);
  if (linear) {
    const order = [edges[0][0], ...edges.map(([, b]) => b)];
    const width = Math.max(...order.map((id) => [...label(id)].length));
    const mid = Math.floor((width + 4) / 2);
    const lines = [];
    order.forEach((id, i) => {
      if (i > 0) lines.push(" ".repeat(mid) + "│", " ".repeat(mid) + "▼");
      lines.push(...box(label(id), width));
    });
    return lines.join("\n");
  }
  const width = Math.max(...edges.map(([a]) => [...label(a)].length));
  return edges
    .map(([a, b]) => `${label(a)}${" ".repeat(width - [...label(a)].length)}  ──▶  ${label(b)}`)
    .join("\n");
}

// ------------------------------------------------------------------ MDX
const yaml = (v) => JSON.stringify(v);
const words = (t) =>
  t
    .replace(/```[\s\S]*?```/g, " ")
    .split(/\s+/)
    .filter((w) => /[\p{L}\p{N}]/u.test(w)).length;

function convertBody(meta, secs) {
  let diagram = 0;
  const parts = [];
  for (const s of secs) {
    let text = s.text;
    text = text.replace(/```mermaid\n([\s\S]*?)```/g, (_, src) => {
      diagram += 1;
      const isNext = s.title.startsWith("Next");
      return [
        "```ascii",
        `id: ${meta.contentId}-${isNext ? "NEXT" : "SISTEMA"}`,
        `kind: flowchart`,
        `title: ${isNext ? "Next 01-02-03" : "Visão do sistema"}`,
        mermaidToAscii(src.trim()),
        "```",
      ].join("\n");
    });
    if (s.title === "Aviso") {
      text = `<Callout variant="attention" subject="Aviso" message=${yaml(text.replace(/\s+/g, " "))} />`;
    }
    if (s.title === "Fontes e aprofundamento") {
      text = text.replace(/^- (.+?) — (.+) — (https:\/\/\S+)$/gm, "- [$1]($3) — $2");
    }
    if (s.title.startsWith("Infográfico")) {
      const lines = text.split("\n").map((l) => l.replace(/\*\*/g, ""));
      text = [
        "```plain",
        `id: ${meta.contentId}-INFOGRAFICO`,
        "kind: definition",
        "title: Briefing do infográfico 16:9",
        ...lines,
        "```",
      ].join("\n");
    }
    parts.push(`## ${s.n}. ${s.title}\n\n${text}`);
  }
  if (diagram < 2) throw new Error(`${meta.contentId}: Mermaid ausente`);
  return parts.join("\n\n");
}

export function toMdx(record) {
  const { meta, body } = parseRecord(record);
  const secs = sections(body);
  const content = convertBody(meta, secs);
  const fm = [
    "---",
    `title: ${yaml(meta.title)}`,
    `seoTitle: ${yaml(meta.seoTitle)}`,
    `description: ${yaml(meta.description)}`,
    `pubDate: ${yaml(meta.pubDate)}`,
    ...(IMAGES[meta.contentId] ? [`image: ${yaml(IMAGES[meta.contentId])}`] : []),
    `authorName: "Risco Cognitivo"`,
    `contentId: ${meta.contentId}`,
    `territory: ${meta.territory}`,
    `type: artigo`,
    `tags: ${yaml(meta.tags)}`,
    `evidence: ${yaml(meta.evidence)}`,
    "---",
  ].join("\n");
  const header = [
    "{/* Gerado por scripts/build-quick-frameworks.mjs a partir de",
    `    app/data/editorial/quick-frameworks/${meta.contentId}.md — não edite à mão. */}`,
  ].join("\n");
  return `${fm}\n\n${header}\n\nimport { Callout } from '@/components/ui/callout';\n\n${content}\n`;
}

// ------------------------------------------------------------------ seed upsert
function upsert(rows, key, value, row) {
  const i = rows.findIndex((r) => r[key] === value);
  if (i >= 0) rows[i] = { ...rows[i], ...row };
  else rows.push(row);
}

export function updateSeed(seedJson, records) {
  const data = JSON.parse(seedJson);
  const db = data.seed;
  const taxonomy = Object.fromEntries(db.taxonomy.map((t) => [t.Slug.replace(/\//g, ""), t]));
  for (const rec of records) {
    const { meta, body } = parseRecord(rec);
    const secs = sections(body);
    const get = (t) => secs.find((s) => s.title.startsWith(t))?.text ?? "";
    const tax = taxonomy[meta.territory];
    const bodyWords = words(body);
    const minutes = Math.max(1, Math.ceil(bodyWords / WPM));
    const isNew = !db.content.some((c) => c.Content_ID === meta.contentId);
    const contentRow = {
      Content_ID: meta.contentId,
      Titulo_final: meta.title,
      Status_editorial: "PUBLICADO",
      Proxima_acao: "Revisão humana do texto e das fontes (Quick Framework v1.0.0)",
      N_Evidencias: meta.evidence.length,
      N_Publicacoes: 1,
    };
    if (isNew) {
      Object.assign(contentRow, {
        Titulo_trabalho: meta.title,
        Tipo: "Artigo",
        Rota_editorial: tax.Rota_pilar,
        Pilar: tax.Funcao,
        Objetivo: `Responder: ${tax.Pergunta_central}`,
        Audiencia: "Profissionais interessados em cognição, decisão e trabalho",
        Pergunta_central: tax.Pergunta_central,
        Tese: get("Contexto").split(". ").slice(-1)[0],
        CTA: "Ler o próximo território",
        Prioridade: "MÉDIA",
        Owner: "Não determinado",
        Prazo_original: "",
        Previsao_atual: "",
        Bloqueio: "",
        N_Argumentos: 0,
        N_Ativos: 1,
      });
    }
    upsert(db.content, "Content_ID", meta.contentId, contentRow);
    upsert(db.production, "Content_ID", meta.contentId, {
      Content_ID: meta.contentId,
      Titulo: meta.title,
      Status: "PUBLICADO",
      Resumo_lead: meta.description,
      Outline: secs.map((s) => s.title).join("; "),
      Introducao: get("Contexto"),
      Dev1: get("Problema existente"),
      Dev2: get("Problema solucionado"),
      Dev3: get("Processo"),
      Conclusao: get("Progresso esperado"),
      Chars_titulo: [...meta.title].length,
      Chars_corpo: [...body].length,
      Palavras_corpo: bodyWords,
      Leitura_min: minutes,
      Claims: meta.evidence.length,
      Claims_evid: meta.evidence.length,
      Cobertura_pct: 1,
    });
    upsert(db.seo, "Content_ID", meta.contentId, {
      Content_ID: meta.contentId,
      Slug: `/blog/${meta.slug}/`,
      SEO_Title: meta.seoTitle,
      Chars_title: [...meta.seoTitle].length,
      Meta_description: meta.description,
      Chars_meta: [...meta.description].length,
      Keyword_principal: tax.Rota_pilar.toLowerCase(),
      Links_entrada: `/temas/${meta.territory}/`,
      Links_saida: "/temas/",
      Status: "PUBLICADO",
    });
    const visualId = `VIS-RC-QF-${meta.contentId.slice(-4)}`;
    upsert(db.visuals, "Visual_ID", visualId, {
      Visual_ID: visualId,
      Content_ID: meta.contentId,
      Asset_ID: "",
      Tipo: "Infográfico",
      Nome: `Quick Framework 16:9 — ${meta.title}`,
      Funcao_visual: "Sintetizar problema, processo e progresso",
      Brief_visual: get("Infográfico").replace(/\*\*/g, "").replace(/\n/g, " "),
      Status: "BRIEF",
      Owner: "Não determinado",
      Prazo: "",
      Link_drive: "",
      Fonte_direitos: "",
      Notas: "Gerado do briefing da seção 12 do Quick Framework.",
    });
  }
  return JSON.stringify(data, null, 2) + "\n";
}

// ------------------------------------------------------------------ main
export function outputs() {
  const files = readdirSync(SRC).filter((f) => /^CNT-RC-\d{4}\.md$/.test(f)).sort();
  const records = files.map((f) => readFileSync(join(SRC, f), "utf8"));
  const result = records.map((r) => {
    const { meta } = parseRecord(r);
    return [join(BLOG, `${meta.slug}.mdx`), toMdx(r)];
  });
  result.push([SEED, updateSeed(readFileSync(SEED, "utf8"), records)]);
  return result;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const check = process.argv.includes("--check");
  const stale = [];
  for (const [path, content] of outputs()) {
    const current = existsSync(path) ? readFileSync(path, "utf8") : null;
    if (current === content) continue;
    if (check) stale.push(path);
    else writeFileSync(path, content);
  }
  if (check && stale.length) {
    console.error(`Defasado (rode node scripts/build-quick-frameworks.mjs):\n  ${stale.join("\n  ")}`);
    process.exit(1);
  }
  console.log(check ? "quick frameworks em dia" : "quick frameworks gerados");
}
