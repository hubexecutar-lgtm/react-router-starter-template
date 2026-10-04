// Metadados editoriais dos artigos (LANC-001 PR-E/PR-F), por slug. O MDX guarda só o texto (canônico ou do autor);
// pilar, problemas, nós do grafo, fontes, data e "Próximo passo" ficam aqui, fora do texto.
// Regras (tests/content.spec.ts): todo artigo publicado tem entrada; cada problema declarado aparece no texto;
// graphRefs e sources existem em app/data/graph/rc-graph.json.
import type { Pillar } from "./article-media";

/** Problemas do índice por problemas (RQ-054), ligados aos nós do grafo canônico (ADR-M04). */
export const PROBLEMS = [
  { id: "atencao", label: "Atenção", node: "COG-ATENCAO", stem: "atenç" },
  { id: "memoria", label: "Memória", node: "COG-MEMORIA", stem: "memória" },
  { id: "sobrecarga", label: "Sobrecarga", node: "FRC-SOBRECARGA", stem: "sobrecarga" },
  { id: "interrupcoes", label: "Interrupções", node: "FRC-INTERRUPCOES", stem: "interrup" },
  { id: "decisao", label: "Decisão", node: "COG-DECISAO", stem: "decis" },
  { id: "organizacao", label: "Organização", node: "FRC-INFORMACAO-MAL-ORGANIZADA", stem: "organiz" },
] as const;
export type ProblemId = (typeof PROBLEMS)[number]["id"];

/** Os 3 pilares do RC-LP-001 (RQ-046), com o artigo canônico de cada um. */
export const PILLARS: Record<Pillar, { label: string; question: string; article: string }> = {
  p1: {
    label: "Riscos Cognitivos",
    question: "O que está tornando a execução mais difícil e onde essa dificuldade está surgindo?",
    article: "riscos-cognitivos",
  },
  p2: {
    label: "Processos Neuroadaptativos",
    question: "Reconhecer um problema não basta.",
    article: "processos-neuroadaptativos",
  },
  p3: {
    label: "Ferramentas e Soluções",
    question: "O que o sistema pode assumir para que a pessoa não precise administrar mentalmente tudo o que o trabalho exige?",
    article: "compensacao-cognitiva",
  },
};

export type NextStep = { label: string; href: string };

export type ArticleMeta = {
  /** ID do documento canônico (RC-ART-*) ou do conteúdo do autor. */
  contentId: string;
  pillar: Pillar;
  problems: ProblemId[];
  /** Nós do grafo canônico ligados ao artigo (RQ-046). */
  graphRefs: string[];
  /** Nós EVIDENCE (RC-SRC-001) citados como referências (RQ-042). */
  sources: string[];
  /** Data de publicação no site (AAAA-MM-DD). */
  published: string;
  /** CTA primário do bloco "Próximo passo" (RQ-044): o CTA do próprio texto canônico, quando existe. */
  next: NextStep;
};

export const ARTICLE_META: Record<string, ArticleMeta> = {
  "riscos-cognitivos": {
    contentId: "RC-ART-P1-001",
    pillar: "p1",
    problems: ["atencao", "memoria", "interrupcoes", "decisao", "organizacao"],
    graphRefs: ["FRC-INTERRUPCOES", "FRC-DEPENDENCIA-MEMORIA", "FRC-TAREFA-AMBIGUA", "COG-ATENCAO", "EVT-ERRO"],
    sources: ["EVD-ISO-31000", "EVD-ISO-10075-2", "EVD-W3C-COGA", "EVD-ALTMANN-TRAFTON"],
    published: "2026-10-04",
    next: {
      label: 'Leia "Processos neuroadaptativos: o que são e como redesenhar o trabalho"',
      href: "/artigos/processos-neuroadaptativos/",
    },
  },
  "processos-neuroadaptativos": {
    contentId: "RC-ART-P2-001",
    pillar: "p2",
    problems: ["memoria", "interrupcoes", "decisao"],
    graphRefs: ["MTH-RUNBOOK", "MTH-WIP-LIMITADO", "CTL-CHECKLIST", "FRC-DEPENDENCIAS-OCULTAS"],
    sources: ["EVD-PMI-PM", "EVD-IBM-BPM", "EVD-OMG-BPMN", "EVD-ISO-31000"],
    published: "2026-10-04",
    next: {
      label: 'Leia "Compensação e soluções: como transformar análise em ferramenta"',
      href: "/artigos/compensacao-cognitiva/",
    },
  },
  "compensacao-cognitiva": {
    contentId: "RC-ART-P3-001",
    pillar: "p3",
    problems: ["atencao", "memoria", "interrupcoes", "decisao"],
    graphRefs: ["CMP-EXTERNALIZACAO", "CMP-REDUCAO", "CMP-EXPLICITACAO", "CMP-AUTOMACAO", "CTL-CHECKPOINT"],
    sources: ["EVD-GILBERT-OFFLOADING", "EVD-AWS-RUNBOOKS", "EVD-ALTMANN-TRAFTON"],
    published: "2026-10-04",
    next: {
      label: "Conheça as ferramentas e veja como essa metodologia pode ser aplicada na prática",
      href: "/ferramentas/",
    },
  },
  "tres-pilares-riscos-cognitivos": {
    contentId: "RC-ART-MASTER-001",
    pillar: "p1",
    problems: ["atencao", "memoria", "sobrecarga", "interrupcoes", "decisao", "organizacao"],
    graphRefs: ["FRC-SOBRECARGA", "FRC-INTERRUPCOES", "CMP-EXTERNALIZACAO", "MTH-RUNBOOK"],
    sources: [
      "EVD-ISO-31000",
      "EVD-ISO-10075-2",
      "EVD-PMI-PM",
      "EVD-IBM-BPM",
      "EVD-OMG-BPMN",
      "EVD-W3C-COGA",
      "EVD-AWS-RUNBOOKS",
    ],
    published: "2026-10-04",
    // O texto MASTER não tem CTA; vale o do RC-LP-001 ("Comece por…").
    next: { label: 'Comece por "Riscos cognitivos: o que são, como surgem e por que importam"', href: "/artigos/riscos-cognitivos/" },
  },
  "risco-cognitivo": {
    contentId: "risco-cognitivo.mdx (autor, PR #19)",
    pillar: "p1",
    problems: ["atencao", "memoria", "sobrecarga", "interrupcoes", "decisao", "organizacao"],
    graphRefs: ["COG-ATENCAO", "COG-MEMORIA", "FRC-SOBRECARGA"],
    sources: ["EVD-ISO-31000", "EVD-ISO-10075-2", "EVD-W3C-COGA"],
    published: "2026-10-03",
    next: { label: 'Comece por "Riscos cognitivos: o que são, como surgem e por que importam"', href: "/artigos/riscos-cognitivos/" },
  },
};
