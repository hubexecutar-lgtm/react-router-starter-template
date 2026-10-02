// Hub de rotas e links — fonte única (ADR-06, docs/design-system/ROUTES-HUB-WORKFLOW-001.md).
//
// Toda nova rota em app/routes.ts, ferramenta estática em public/*/index.html e todo link
// gerado ou compartilhado (preview, deploy, QR) entra aqui, no mesmo PR.
// `npm run routes:check` falha se uma rota existir e não estiver registrada (ou vice-versa).
// Os artigos de content/blog são listados automaticamente pela página /admin/rotas/.

export const ROUTE_GROUPS = [
  "Site",
  "Blog",
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

const SRC = "PR #1 (branch claude/youthful-archimedes-qksrsl)";

export const ROUTES: HubEntry[] = [
  // ---------------------------------------------------------------- Site
  { id: "home", title: "Página inicial", group: "Site", kind: "route", path: "/", exposure: "public", addedAt: "2026-09-30", source: SRC },
  { id: "about", title: "Sobre", group: "Site", kind: "route", path: "/about/", exposure: "public", addedAt: "2026-09-30", source: SRC },
  { id: "contact", title: "Contato", group: "Site", kind: "route", path: "/contact/", exposure: "public", addedAt: "2026-09-30", source: SRC },
  { id: "faq", title: "Perguntas frequentes", group: "Site", kind: "route", path: "/faq/", exposure: "public", addedAt: "2026-09-30", source: SRC },
  { id: "pricing", title: "Acesso e formatos", description: "URL preservada do template; conteúdo aberto e canais do banco editorial.", group: "Site", kind: "route", path: "/pricing/", exposure: "public", addedAt: "2026-09-30", source: SRC },
  { id: "loja", title: "Loja", group: "Site", kind: "route", path: "/loja/", description: "Catálogo de skills, agentes, prompts, e-books, PDFs, ferramentas HTML, workbooks e assets (ADR-08). Categorias em /loja/:tipo/ e itens em /loja/:tipo/:slug/.", exposure: "public", addedAt: "2026-10-01", source: SRC },
  { id: "privacy", title: "Privacidade", group: "Site", kind: "route", path: "/privacy/", exposure: "public", addedAt: "2026-09-30", source: SRC },

  // ---------------------------------------------------------------- Blog
  { id: "blog-index", title: "Artigos — explore por assunto", group: "Blog", kind: "route", path: "/blog/", description: "Arquivo com filtro por território (?tema=<slug>). Antigos /blog/post-1…5/ redirecionam (public/_redirects).", exposure: "public", addedAt: "2026-09-30", source: SRC },

  { id: "temas", title: "Mapa de temas", group: "Blog", kind: "route", path: "/temas/", description: "Os 8 territórios TAX-RC do banco editorial. Cada um em /temas/:slug/.", exposure: "public", addedAt: "2026-10-01", source: "HANDOFF-RC-GLOBAL-DESIGN-CONTENT-001" },
  { id: "mapas", title: "Mapas e modelos", group: "Blog", kind: "route", path: "/mapas/", description: "Framework de Risco Cognitivo como mapa conceitual em plain text.", exposure: "public", addedAt: "2026-10-01", source: "HANDOFF-RC-GLOBAL-DESIGN-CONTENT-001" },
  { id: "guias", title: "Guias e ferramentas", group: "Blog", kind: "route", path: "/guias/", description: "Modelo de análise e primeiros passos por território.", exposure: "public", addedAt: "2026-10-01", source: "HANDOFF-RC-GLOBAL-DESIGN-CONTENT-001" },
  { id: "evidencias", title: "Evidências", group: "Blog", kind: "route", path: "/evidencias/", description: "Banco de evidências EVD-RC com autor, ano, link e classe epistêmica.", exposure: "public", addedAt: "2026-10-01", source: "HANDOFF-RC-GLOBAL-DESIGN-CONTENT-001" },
  { id: "buscar", title: "Busca e navegação", group: "Blog", kind: "route", path: "/buscar/", description: "Busca client-side em artigos, temas e evidências (?q=).", exposure: "public", addedAt: "2026-10-01", source: "HANDOFF-RC-GLOBAL-DESIGN-CONTENT-001" },

  // ---------------------------------------------------------------- Ferramentas públicas
  { id: "hub-editorial", title: "Hub Editorial", group: "Ferramentas públicas", kind: "route", path: "/hub-editorial/", description: "Painel de gestão do pipeline editorial.", exposure: "public", addedAt: "2026-09-30", source: SRC },
  { id: "skills", title: "Catálogo de Skills EXECUTAR", group: "Ferramentas públicas", kind: "route", path: "/skills/", description: "Catálogo navegável com busca e filtros.", exposure: "public", addedAt: "2026-09-30", source: SRC },
  { id: "catalogo-offline", title: "Catálogo EXECUTAR (offline)", group: "Ferramentas públicas", kind: "route", path: "/catalogo-offline/", description: "Versão offline do catálogo, com detalhamento 3P.", exposure: "public", addedAt: "2026-09-30", source: SRC },

  // ---------------------------------------------------------------- Sistema
  { id: "login", title: "Acesso (sem contas de leitor)", description: "URL preservada; noindex.", group: "Sistema", kind: "route", path: "/login/", exposure: "public", addedAt: "2026-09-30", source: SRC },
  { id: "signup", title: "Receber novidades", description: "Newsletter desativada até haver provedor; noindex.", group: "Sistema", kind: "route", path: "/signup/", exposure: "public", addedAt: "2026-09-30", source: SRC },
  { id: "rss", title: "Feed RSS", group: "Sistema", kind: "route", path: "/rss.xml", description: "Endpoint, não página.", exposure: "public", addedAt: "2026-09-30", source: SRC },
  { id: "sitemap", title: "Sitemap", group: "Sistema", kind: "route", path: "/sitemap-index.xml", description: "Gerado por app/routes/sitemap-index[.]xml.ts.", exposure: "public", addedAt: "2026-09-30", source: SRC },
  { id: "sitemap-0", title: "Sitemap (páginas)", group: "Sistema", kind: "route", path: "/sitemap-0.xml", description: "Lista de páginas referenciada pelo sitemap-index.", exposure: "public", addedAt: "2026-10-02", source: "EXECUTAR-MONOREPO-BLOG-001" },

  // ---------------------------------------------------------------- Interno (admin)
  { id: "admin", title: "Painel", group: "Interno (admin)", kind: "route", path: "/admin/", description: "Painel de acesso às ferramentas.", exposure: "internal", addedAt: "2026-09-30", source: SRC },
  { id: "admin-design-system", title: "Design System", group: "Interno (admin)", kind: "route", path: "/admin/design-system/", description: "Mood board, storyboard, tokens, callouts, dados, plain text e componentes.", exposure: "internal", addedAt: "2026-09-30", source: SRC },
  { id: "admin-relatorio-exemplo", title: "Relatório de exemplo", group: "Interno (admin)", kind: "route", path: "/admin/relatorio-exemplo/", description: "Markdown + PlainTextPanel + AsciiDiagram (ADR-05).", exposure: "internal", addedAt: "2026-09-30", source: SRC },
  { id: "admin-rotas", title: "Rotas e links (QR)", group: "Interno (admin)", kind: "route", path: "/admin/rotas/", description: "Este hub.", exposure: "internal", addedAt: "2026-09-30", source: SRC },
  { id: "admin-handoff", title: "Handoff — Knowledge Work Skills", group: "Interno (admin)", kind: "route", path: "/admin/handoff/", description: "Estado canônico da adaptação de HANDOFF-KNOWLEDGE-WORK-SKILLS-001 (upstream Anthropic) e da campanha de copy.", exposure: "internal", addedAt: "2026-09-30", source: "PR HANDOFF-KNOWLEDGE-WORK-SKILLS-001 (branch claude/loving-galileo-scxrjz)" },
];
