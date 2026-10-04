// Navegação global (mood boards 01, 04 e 07). Fonte única para cabeçalho e rodapé.
export interface NavItem {
  label: string;
  href: string;
}

// Menu do lançamento (LANC-001 DEC-U6 / CF-12): topo Artigos · Mapa · Ferramentas · Sobre.
export const PRIMARY_NAV: NavItem[] = [
  { label: "Artigos", href: "/blog/" },
  { label: "Mapa", href: "/mapas/" },
  { label: "Ferramentas", href: "/ferramentas/" },
  { label: "Sobre", href: "/about/" },
];

/** Drawer (< 900px): todos os destinos do topo + Temas, Guias, Evidências e Buscar (UIX §2). */
export const DRAWER_NAV: NavItem[] = [
  { label: "Início", href: "/" },
  ...PRIMARY_NAV,
  { label: "Temas", href: "/temas/" },
  { label: "Guias", href: "/guias/" },
  { label: "Evidências", href: "/evidencias/" },
  { label: "Buscar", href: "/buscar/" },
];

/** Barra inferior (< 900px): Início · Mapa · Ferramentas (DEC-U6, RQ-021). */
export const BOTTOM_NAV: NavItem[] = [
  { label: "Início", href: "/" },
  { label: "Mapa", href: "/mapas/" },
  { label: "Ferramentas", href: "/ferramentas/" },
];

/**
 * Trilha inline do desktop (RQ-020): os 3 pilares do RC-LP-001. Destinos provisórios nos temas mais
 * próximos; o PR-E do LANC-001 aponta cada pilar para o seu artigo canônico.
 */
export const PILLAR_TRAIL: NavItem[] = [
  { label: "Riscos cognitivos", href: "/temas/fatores-de-risco-cognitivo/" },
  { label: "Processos neuroadaptativos", href: "/temas/gestao-do-risco-cognitivo/" },
  { label: "Compensação e soluções", href: "/temas/controles-cognitivos/" },
];

export const FOOTER_NAV: { title: string; items: NavItem[] }[] = [
  {
    title: "Explorar",
    items: DRAWER_NAV.filter((i) => i.href !== "/" && i.href !== "/about/"),
  },
  {
    title: "Projeto",
    items: [
      { label: "Sobre", href: "/about/" },
      { label: "Perguntas frequentes", href: "/faq/" },
      { label: "Acesso e formatos", href: "/pricing/" },
      { label: "Receber novidades", href: "/signup/" },
      { label: "Contato", href: "/contact/" },
      { label: "Privacidade", href: "/privacy/" },
    ],
  },
  {
    title: "Ferramentas",
    items: [
      { label: "Prisma", href: "/prisma/" },
      { label: "Hub Editorial", href: "/hub-editorial/" },
      { label: "Catálogo de skills", href: "/skills/" },
      { label: "Feed RSS", href: "/rss.xml" },
    ],
  },
];

export const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href);
