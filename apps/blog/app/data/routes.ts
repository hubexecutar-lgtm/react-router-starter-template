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
export const DEFAULT_BASE_URL = "https://risco-cognitivo-blog.executar-rotina-8b7.workers.dev";

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
  { id: "pricing", title: "Preços", group: "Site", kind: "route", path: "/pricing/", exposure: "public", addedAt: "2026-09-30", source: SRC },
  { id: "privacy", title: "Privacidade", group: "Site", kind: "route", path: "/privacy/", exposure: "public", addedAt: "2026-09-30", source: SRC },

  // ---------------------------------------------------------------- Blog
  { id: "blog-index", title: "Blog — início", group: "Blog", kind: "route", path: "/blog/", description: "Home editorial com territórios e artigos.", exposure: "public", addedAt: "2026-09-30", source: SRC },

  { id: "loja", title: "Loja", group: "Site", kind: "route", path: "/loja/", description: "Store Hub: skills, agentes, prompts, e-books, PDFs, HTML, workbooks e assets (dados de exemplo). Catálogos em /loja/<tipo>/ e detalhe em /loja/<tipo>/<slug>/.", exposure: "public", addedAt: "2026-10-02", source: "Risco-cognitivo-blog@c3a4219 (claude/trusting-gates-go053v)" },

  // ---------------------------------------------------------------- Ferramentas públicas
  { id: "hub-editorial", title: "Hub Editorial", group: "Ferramentas públicas", kind: "route", path: "/hub-editorial/", description: "Painel de gestão do pipeline editorial.", exposure: "public", addedAt: "2026-09-30", source: SRC },
  { id: "skills", title: "Catálogo de Skills EXECUTAR", group: "Ferramentas públicas", kind: "route", path: "/skills/", description: "Catálogo navegável com busca e filtros.", exposure: "public", addedAt: "2026-09-30", source: SRC },
  { id: "catalogo-offline", title: "Catálogo EXECUTAR (offline)", group: "Ferramentas públicas", kind: "route", path: "/catalogo-offline/", description: "Versão offline do catálogo, com detalhamento 3P.", exposure: "public", addedAt: "2026-09-30", source: SRC },

  // ---------------------------------------------------------------- Sistema
  { id: "login", title: "Login", group: "Sistema", kind: "route", path: "/login/", exposure: "public", addedAt: "2026-09-30", source: SRC },
  { id: "signup", title: "Cadastro", group: "Sistema", kind: "route", path: "/signup/", exposure: "public", addedAt: "2026-09-30", source: SRC },
  { id: "rss", title: "Feed RSS", group: "Sistema", kind: "route", path: "/rss.xml", description: "Endpoint, não página.", exposure: "public", addedAt: "2026-09-30", source: SRC },
  { id: "sitemap", title: "Sitemap", group: "Sistema", kind: "route", path: "/sitemap-index.xml", description: "Gerado por app/routes/sitemap-index[.]xml.ts.", exposure: "public", addedAt: "2026-09-30", source: SRC },
  { id: "sitemap-0", title: "Sitemap (páginas)", group: "Sistema", kind: "route", path: "/sitemap-0.xml", description: "Lista de páginas referenciada pelo sitemap-index.", exposure: "public", addedAt: "2026-10-02", source: "EXECUTAR-MONOREPO-BLOG-001" },

  // ---------------------------------------------------------------- Interno (admin)
  { id: "admin", title: "Painel", group: "Interno (admin)", kind: "route", path: "/admin/", description: "Painel de acesso às ferramentas.", exposure: "internal", addedAt: "2026-09-30", source: SRC },
  { id: "admin-design-system", title: "Design System", group: "Interno (admin)", kind: "route", path: "/admin/design-system/", description: "Mood board, storyboard, tokens, callouts, dados, plain text e componentes.", exposure: "internal", addedAt: "2026-09-30", source: SRC },
  { id: "admin-relatorio-exemplo", title: "Relatório de exemplo", group: "Interno (admin)", kind: "route", path: "/admin/relatorio-exemplo/", description: "Markdown + PlainTextPanel + AsciiDiagram (ADR-05).", exposure: "internal", addedAt: "2026-09-30", source: SRC },
  { id: "admin-rotas", title: "Rotas e links (QR)", group: "Interno (admin)", kind: "route", path: "/admin/rotas/", description: "Este hub.", exposure: "internal", addedAt: "2026-09-30", source: SRC },
];
