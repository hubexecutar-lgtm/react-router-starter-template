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

/**
 * Artigos públicos durante a reconstrução (ADR-BLOG-JORNADA-ROTAS-001 §2.2, ADR-26): um exemplo do template de artigo.
 * Os outros MDX ficam no repositório, fora do prerender, do índice, do sitemap e dos links, e respondem 302 para
 * /artigos/ (loader e public/_redirects). Voltar a publicar = acrescentar o slug aqui e tirar o 302.
 */
export const PUBLIC_ARTICLES = ["riscos-cognitivos-guia"] as const;
export const isPublicArticle = (slug: string) => (PUBLIC_ARTICLES as readonly string[]).includes(slug);

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
  // Série "Riscos cognitivos" (RC-PUB-PACK-003, 2026-10-05): fundador + 4 artigos. Fontes = nós EVIDENCE do RC-SRC-002.
  "riscos-cognitivos-guia": {
    contentId: "RC-PUB-003-A00",
    pillar: "p1",
    problems: ["memoria", "decisao", "organizacao"],
    graphRefs: ["COG-MEMORIA-TRABALHO", "COG-CONTROLE-INIBITORIO", "COG-FLEXIBILIDADE", "FRC-DEPENDENCIA-MEMORIA", "CMP-EXTERNALIZACAO"],
    sources: ["EVD-DIAMOND-2013", "EVD-BOONSTRA-2005", "EVD-HARKIN-2016", "EVD-KIESEL-2010", "EVD-BURNETT-2026", "EVD-SONG-2021", "EVD-IBGE-2025"],
    published: "2026-10-05",
    // Ponte para o Mapa (ADR-BLOG-JORNADA-ROTAS-001 §2.1): o próximo artigo da série está fora do ar na reconstrução.
    next: { label: "Explore a memória de trabalho no Mapa Cognitivo", href: "/mapas/?foco=COG-MEMORIA-TRABALHO" },
  },
  "o-que-sao-riscos-cognitivos": {
    contentId: "RC-PUB-003-A01",
    pillar: "p1",
    problems: ["atencao", "memoria", "decisao", "organizacao"],
    graphRefs: ["COG-MEMORIA-TRABALHO", "COG-CONTROLE-INIBITORIO", "COG-FLEXIBILIDADE", "COG-PLANEJAMENTO"],
    sources: ["EVD-DIAMOND-2013", "EVD-BOONSTRA-2005", "EVD-SENKOWSKI-2024", "EVD-TOLI-2016", "EVD-BURNETT-2026"],
    published: "2026-10-05",
    next: { label: 'Leia "Por que tarefas simples podem ser cognitivamente difíceis de executar"', href: "/artigos/funcoes-executivas-demandas-risco/" },
  },
  "funcoes-executivas-demandas-risco": {
    contentId: "RC-PUB-003-A02",
    pillar: "p1",
    problems: ["memoria", "interrupcoes", "decisao"],
    graphRefs: ["COG-MEMORIA-TRABALHO", "COG-CONTROLE-INIBITORIO", "COG-FLEXIBILIDADE", "FRC-INTERRUPCOES"],
    sources: ["EVD-DIAMOND-2013", "EVD-BOONSTRA-2005", "EVD-SENKOWSKI-2024", "EVD-HARKIN-2016", "EVD-KIESEL-2010", "EVD-BURNETT-2026"],
    published: "2026-10-05",
    next: { label: 'Leia "Onde os riscos cognitivos aparecem no dia a dia"', href: "/artigos/riscos-cognitivos-rotina-estudos-trabalho/" },
  },
  "riscos-cognitivos-rotina-estudos-trabalho": {
    contentId: "RC-PUB-003-A03",
    pillar: "p1",
    problems: ["memoria", "decisao", "organizacao"],
    graphRefs: ["FRC-DEPENDENCIA-MEMORIA", "CMP-EXTERNALIZACAO", "CTL-CHECKPOINT"],
    sources: ["EVD-SOLANTO-2010", "EVD-HARKIN-2016", "EVD-TOLI-2016", "EVD-KIESEL-2010", "EVD-BURNETT-2026"],
    published: "2026-10-05",
    next: { label: 'Leia "6 estratégias para reduzir riscos cognitivos na execução"', href: "/artigos/estrategias-reduzir-riscos-cognitivos/" },
  },
  "estrategias-reduzir-riscos-cognitivos": {
    contentId: "RC-PUB-003-A04",
    pillar: "p3",
    problems: ["atencao", "memoria", "sobrecarga", "interrupcoes", "decisao", "organizacao"],
    graphRefs: ["CMP-EXTERNALIZACAO", "CTL-CHECKPOINT", "MTH-WIP-LIMITADO", "COG-PLANEJAMENTO"],
    sources: [
      "EVD-BOONSTRA-2005",
      "EVD-SENKOWSKI-2024",
      "EVD-SOLANTO-2010",
      "EVD-NAKASHIMA-2022",
      "EVD-LIDSTROM-2026",
      "EVD-HARKIN-2016",
      "EVD-TOLI-2016",
      "EVD-KIESEL-2010",
      "EVD-BURNETT-2026",
      "EVD-LIU-2026",
    ],
    published: "2026-10-05",
    next: { label: "Veja as 6 soluções nas Ferramentas cognitivas", href: "/ferramentas/solucoes/" },
  },
};
