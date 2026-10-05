// Os artigos de content/artigos (status ready) são listados sozinhos pela página /admin/rotas/.
// Hub de rotas e links — fonte única (ADR-06, docs/design-system/ROUTES-HUB-WORKFLOW-001.md).
//
// Toda nova rota em app/routes.ts, ferramenta estática em public/*/index.html e todo link
// gerado ou compartilhado (preview, deploy, QR) entra aqui, no mesmo PR.
// `npm run routes:check` falha se uma rota existir e não estiver registrada (ou vice-versa).

export const ROUTE_GROUPS = [
  "Site",
  "Artigos",
  "Ferramentas públicas",
  "Sistema",
  "Interno (admin)",
  "Estados de teste",
  "Links gerados",
] as const;
export type RouteGroup = (typeof ROUTE_GROUPS)[number];

export type Exposure = "public" | "internal" | "test";

export interface HubEntry {
  /** Identificador estável e único (kebab-case). */
  id: string;
  title: string;
  group: RouteGroup;
  /** `route` = caminho deste site; `link` = URL externa ou gerada (preview, deploy, compartilhamento). */
  kind: "route" | "link";
  /** Caminho com barra inicial e final (`/blog/`). Obrigatório para `route`. */
  path?: string;
  /** URL https absoluta. Obrigatório para `link`. */
  url?: string;
  description?: string;
  /** `internal` = existe no build sem guarda de autenticação (ex.: /admin/*). */
  exposure: Exposure;
  owner?: string;
  /** Data de inclusão (AAAA-MM-DD). */
  addedAt: string;
  /** PR, commit ou nota que originou a rota/link. */
  source?: string;
}

/** Host de produção. Sobrescreva com PUBLIC_ROUTES_BASE_URL — nunca use preview de branch nos QRs. */
export const DEFAULT_BASE_URL = "https://react-router-starter-template.hub-executar.workers.dev";

export function baseUrl(env?: string): string {
  return (env || DEFAULT_BASE_URL).replace(/\/+$/, "");
}

export function absoluteUrl(entry: Pick<HubEntry, "kind" | "path" | "url">, base = baseUrl()): string {
  if (entry.kind === "link") return entry.url ?? "";
  return `${base}${entry.path ?? "/"}`;
}

const SRC = "ADR-13 (site do zero)";

export const ROUTES: HubEntry[] = [
  // ---------------------------------------------------------------- Site
  { id: "home", title: "Página inicial", description: "Texto canônico RC-LP-001 (3 pilares, por onde começar) sobre o Stories (LANC-001 RQ-040).", group: "Site", kind: "route", path: "/", exposure: "public", addedAt: "2026-10-03", source: SRC },
  { id: "artigos", title: "Artigos", description: "Listagem Stories (destaque, grade, carregar mais) com filtro por problema (?problema=, RQ-054). Era a home até o LANC-001 PR-E.", group: "Site", kind: "route", path: "/artigos/", exposure: "public", addedAt: "2026-10-04", source: "LANC-001 G1" },
  { id: "fontes", title: "Fontes", description: "As fontes do RC-SRC-001 com link e o tema que sustentam (RQ-042); conceitos próprios do projeto rotulados (RQ-043).", group: "Site", kind: "route", path: "/fontes/", exposure: "public", addedAt: "2026-10-04", source: "LANC-001 G1" },
  { id: "sobre", title: "Sobre", description: "O projeto, seus princípios e o que é conceito próprio, com trechos dos textos canônicos (RQ-050).", group: "Site", kind: "route", path: "/sobre/", exposure: "public", addedAt: "2026-10-04", source: "LANC-001 G1" },
  { id: "mapas", title: "Mapa causal", group: "Site", kind: "route", path: "/mapas/", description: "Entrada do mapa causal (projeção do grafo canônico da Teia, ADR-M04): os modos Problemas, Soluções e Evidências e a legenda (RQ-080).", exposure: "public", addedAt: "2026-10-04", source: "LANC-001 PR-H" },
  { id: "mapas-explorar", title: "Explorar o mapa causal", group: "Site", kind: "route", path: "/mapas/explorar/", description: "Mapa causal interativo (RQ-070…079): foco + até 8 nós, bottom sheet, Lista, filtros por tipo e Por quê?. Cada fator tem página própria em /mapas/explorar/ seguido do ID.", exposure: "public", addedAt: "2026-10-04", source: "LANC-001 PR-H" },
  { id: "mapas-personalizar", title: "Personalizar o mapa causal", group: "Site", kind: "route", path: "/mapas/personalizar/", description: "Focos de trabalho, interesses e Mostrar evidências em 3 passos (RQ-090). Muda só a ordem e o destaque; fica no navegador, sem conta.", exposure: "public", addedAt: "2026-10-05", source: "LANC-001 PR-I" },
  { id: "ferramentas", title: "Ferramentas cognitivas", group: "Site", kind: "route", path: "/ferramentas/", description: "Ferramentas cognitivas sobre o layout Stories (ADR-16): skills, agentes, prompts, e-books, PDFs, ferramentas HTML, workbooks e assets. Categorias em /ferramentas/:tipo/ e itens em /ferramentas/:tipo/:slug/; /loja/* responde 301.", exposure: "public", addedAt: "2026-10-04", source: "LANC-001 PR-J1 / AUD-ORDEM-001" },

  // ---------------------------------------------------------------- Ferramentas públicas
  { id: "prisma", title: "Prisma de execução", description: "Primeira solução das Ferramentas cognitivas (externalização cognitiva): formulário, folha A4 e PDF, local-first e instalável (PWA). Manifest e service worker em /prisma/.", group: "Ferramentas públicas", kind: "route", path: "/prisma/", exposure: "public", addedAt: "2026-10-04", source: "RC-PWA-PRISMA-SPECS v1.0.0 (ADR-17)" },

  // ---------------------------------------------------------------- Interno (admin)
  { id: "admin", title: "Painel", group: "Interno (admin)", kind: "route", path: "/admin/", description: "Painel de acesso às ferramentas.", exposure: "internal", addedAt: "2026-09-30", source: SRC },
  { id: "admin-design-system", title: "Design System", group: "Interno (admin)", kind: "route", path: "/admin/design-system/", description: "Mood board, storyboard, tokens, callouts, dados, plain text e componentes.", exposure: "internal", addedAt: "2026-09-30", source: SRC },
  { id: "admin-relatorio-exemplo", title: "Relatório de exemplo", group: "Interno (admin)", kind: "route", path: "/admin/relatorio-exemplo/", description: "Markdown + PlainTextPanel + AsciiDiagram (ADR-05).", exposure: "internal", addedAt: "2026-09-30", source: SRC },
  { id: "admin-stories-fixtures", title: "Fixtures Stories", group: "Interno (admin)", kind: "route", path: "/admin/stories-fixtures/", description: "Home e blocos de artigo com dados sintéticos (noindex).", exposure: "internal", addedAt: "2026-10-03", source: SRC },
  { id: "admin-rotas", title: "Rotas e links (QR)", group: "Interno (admin)", kind: "route", path: "/admin/rotas/", description: "Este hub.", exposure: "internal", addedAt: "2026-09-30", source: SRC },
  { id: "admin-handoff", title: "Handoff — Knowledge Work Skills", group: "Interno (admin)", kind: "route", path: "/admin/handoff/", description: "Estado canônico da adaptação de HANDOFF-KNOWLEDGE-WORK-SKILLS-001 (upstream Anthropic) e da campanha de copy.", exposure: "internal", addedAt: "2026-09-30", source: "PR HANDOFF-KNOWLEDGE-WORK-SKILLS-001 (branch claude/loving-galileo-scxrjz)" },
];
