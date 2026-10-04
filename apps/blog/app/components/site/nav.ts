// Navegação global. Fonte única para cabeçalho, drawer, barra inferior e rodapé.
// Site do zero (ADR-13) + shell do LANC-001 sobre o Stories (AUD-ORDEM-001): só entram destinos que existem.
// Cada página nova entra aqui junto com a rota (ADR-06).
export interface NavItem {
  label: string;
  href: string;
}

/** Topo (≥ 900px). DEC-U6: Artigos · Mapa · Ferramentas · Sobre. */
export const PRIMARY_NAV: NavItem[] = [
  { label: "Artigos", href: "/artigos/" },
  { label: "Mapa", href: "/mapas/" },
  { label: "Ferramentas", href: "/ferramentas/" },
  { label: "Sobre", href: "/sobre/" },
];

/** Drawer (< 900px): Início, todos os destinos do topo, Fontes e as ferramentas publicadas. */
export const DRAWER_NAV: NavItem[] = [
  { label: "Início", href: "/" },
  ...PRIMARY_NAV,
  { label: "Fontes", href: "/fontes/" },
  { label: "Prisma de execução", href: "/prisma/" },
];

/** Barra inferior (< 900px). DEC-U6: Início · Mapa · Ferramentas. */
export const BOTTOM_NAV: NavItem[] = [
  { label: "Início", href: "/" },
  { label: "Mapa", href: "/mapas/" },
  { label: "Ferramentas", href: "/ferramentas/" },
];

/** Trilha dos pilares (RQ-020): os 3 pilares do RC-LP-001, cada um no seu artigo canônico. */
export const PILLAR_TRAIL: NavItem[] = [
  { label: "Riscos Cognitivos", href: "/artigos/riscos-cognitivos/" },
  { label: "Processos Neuroadaptativos", href: "/artigos/processos-neuroadaptativos/" },
  { label: "Ferramentas e Soluções", href: "/artigos/compensacao-cognitiva/" },
];

/** Rodapé-diretório: o mesmo menu do topo (RQ-050), mais Início, Fontes, os pilares e as ferramentas. */
export const FOOTER_NAV: { title: string; items: NavItem[] }[] = [
  { title: "Explorar", items: [{ label: "Início", href: "/" }, ...PRIMARY_NAV, { label: "Fontes", href: "/fontes/" }] },
  { title: "Os 3 pilares", items: PILLAR_TRAIL },
  { title: "Ferramentas", items: [{ label: "Prisma de execução", href: "/prisma/" }] },
];

export const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href);
