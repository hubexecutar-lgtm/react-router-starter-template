// Hub de rotas e links — fonte única (ADR-06, docs/design-system/ROUTES-HUB-WORKFLOW-001.md).
//
// Toda nova rota em app/routes.ts, ferramenta estática em public/*/index.html e todo link
// gerado ou compartilhado (preview, deploy, QR) entra aqui, no mesmo PR.
// `npm run routes:check` falha se uma rota existir e não estiver registrada (ou vice-versa).

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

const SRC = "ADR-13 (site do zero)";

export const ROUTES: HubEntry[] = [
  // ---------------------------------------------------------------- Site
  { id: "home", title: "Página inicial", description: "Home provisória do site novo.", group: "Site", kind: "route", path: "/", exposure: "public", addedAt: "2026-10-03", source: SRC },

  // ---------------------------------------------------------------- Interno (admin)
  { id: "admin", title: "Painel", group: "Interno (admin)", kind: "route", path: "/admin/", description: "Painel de acesso às ferramentas.", exposure: "internal", addedAt: "2026-09-30", source: SRC },
  { id: "admin-design-system", title: "Design System", group: "Interno (admin)", kind: "route", path: "/admin/design-system/", description: "Mood board, storyboard, tokens, callouts, dados, plain text e componentes.", exposure: "internal", addedAt: "2026-09-30", source: SRC },
  { id: "admin-relatorio-exemplo", title: "Relatório de exemplo", group: "Interno (admin)", kind: "route", path: "/admin/relatorio-exemplo/", description: "Markdown + PlainTextPanel + AsciiDiagram (ADR-05).", exposure: "internal", addedAt: "2026-09-30", source: SRC },
  { id: "admin-rotas", title: "Rotas e links (QR)", group: "Interno (admin)", kind: "route", path: "/admin/rotas/", description: "Este hub.", exposure: "internal", addedAt: "2026-09-30", source: SRC },
  { id: "admin-handoff", title: "Handoff — Knowledge Work Skills", group: "Interno (admin)", kind: "route", path: "/admin/handoff/", description: "Estado canônico da adaptação de HANDOFF-KNOWLEDGE-WORK-SKILLS-001 (upstream Anthropic) e da campanha de copy.", exposure: "internal", addedAt: "2026-09-30", source: "PR HANDOFF-KNOWLEDGE-WORK-SKILLS-001 (branch claude/loving-galileo-scxrjz)" },
];
