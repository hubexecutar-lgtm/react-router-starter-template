// Navegação global. Fonte única para cabeçalho, drawer, barra inferior e rodapé.
// Site do zero (ADR-13) + shell do LANC-001 sobre o Stories (AUD-ORDEM-001): só entram destinos que existem.
// Cada página nova entra aqui junto com a rota (ADR-06).
export interface NavItem {
  label: string;
  href: string;
}

/** Topo (≥ 900px). DEC-U6: Artigos · Mapa · Ferramentas · Sobre. */
export const PRIMARY_NAV: NavItem[] = [
  { label: "Blog", href: "/artigos/" },
  { label: "Mapa", href: "/mapas/" },
  { label: "Ferramentas", href: "/ferramentas/" },
  { label: "Sobre", href: "/sobre/" },
];

/** Drawer (< 900px): Início, Comece por aqui (RC-LP-001), todos os destinos do topo, Fontes e as ferramentas publicadas. */
export const DRAWER_NAV: NavItem[] = [
  { label: "Início", href: "/" },
  { label: "Comece por aqui", href: "/comece/" },
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

/** Rodapé-diretório (ADR-25/26): o menu do topo (RQ-050), as áreas da jornada, as ferramentas e o projeto, em 4 colunas.
 *  A trilha dos pilares saiu com o DS antigo (ADR-26): os artigos canônicos estão em reconstrução (302). */
export const FOOTER_NAV: { title: string; items: NavItem[] }[] = [
  { title: "Explorar", items: [{ label: "Início", href: "/" }, ...PRIMARY_NAV] },
  {
    title: "Jornada",
    items: [
      { label: "Blog", href: "/artigos/" },
      { label: "Mapa Cognitivo", href: "/mapas/" },
      { label: "Ferramentas e Soluções", href: "/ferramentas/" },
    ],
  },
  {
    title: "Ferramentas",
    items: [
      { label: "Prisma de execução", href: "/prisma/" },
      { label: "Soluções", href: "/ferramentas/solucoes/" },
      { label: "Personalizar o mapa", href: "/mapas/personalizar/" },
    ],
  },
  {
    title: "Projeto",
    items: [
      { label: "Comece por aqui", href: "/comece/" },
      { label: "Guia: riscos cognitivos", href: "/artigos/riscos-cognitivos-guia/" },
      { label: "Fontes", href: "/fontes/" },
    ],
  },
];

export const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href);
