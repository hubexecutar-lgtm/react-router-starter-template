// Navegação global. Fonte única para cabeçalho, drawer, barra inferior e rodapé.
// Site do zero (ADR-13) + shell do LANC-001 sobre o Stories (AUD-ORDEM-001): só entram destinos que existem.
// Cada página nova entra aqui junto com a rota (ADR-06). Quando o mapa voltar (PR-H), "Mapa" entra no topo
// e na barra inferior (DEC-U6); "Sobre" entra quando a página existir.
export interface NavItem {
  label: string;
  href: string;
}

/** Topo (≥ 900px). DEC-U6: Artigos · Mapa · Ferramentas · Sobre — hoje Artigos (a Home Stories) e Ferramentas. */
export const PRIMARY_NAV: NavItem[] = [
  { label: "Artigos", href: "/" },
  { label: "Ferramentas", href: "/ferramentas/" },
];

/** Drawer (< 900px): todos os destinos do topo + as ferramentas publicadas. */
export const DRAWER_NAV: NavItem[] = [...PRIMARY_NAV, { label: "Prisma de execução", href: "/prisma/" }];

/** Barra inferior (< 900px). DEC-U6: Início · Mapa · Ferramentas — o Mapa entra com o PR-H. */
export const BOTTOM_NAV: NavItem[] = [
  { label: "Início", href: "/" },
  { label: "Ferramentas", href: "/ferramentas/" },
];

/**
 * Trilha inline do desktop (RQ-020): os 3 pilares do RC-LP-001. Só entram pilares com destino publicado; o PR-E
 * do LANC-001 publica os artigos canônicos e completa a trilha.
 */
export const PILLAR_TRAIL: NavItem[] = [{ label: "Riscos cognitivos", href: "/artigos/risco-cognitivo/" }];

export const FOOTER_NAV: { title: string; items: NavItem[] }[] = [
  { title: "Explorar", items: PRIMARY_NAV },
  {
    title: "Ferramentas",
    items: [
      { label: "Ferramentas cognitivas", href: "/ferramentas/" },
      { label: "Prisma de execução", href: "/prisma/" },
    ],
  },
];

export const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href);
