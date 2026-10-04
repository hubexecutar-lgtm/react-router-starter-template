// Navegação global (mood boards 01, 04 e 07). Fonte única para cabeçalho e rodapé.
export interface NavItem {
  label: string;
  href: string;
}

export const PRIMARY_NAV: NavItem[] = [
  { label: "Artigos", href: "/blog/" },
  { label: "Temas", href: "/temas/" },
  { label: "Mapas", href: "/mapas/" },
  { label: "Guias", href: "/guias/" },
  { label: "Evidências", href: "/evidencias/" },
  { label: "Ferramentas", href: "/ferramentas/" },
  { label: "Sobre", href: "/about/" },
];

export const FOOTER_NAV: { title: string; items: NavItem[] }[] = [
  {
    title: "Explorar",
    items: [...PRIMARY_NAV.slice(0, 5), { label: "Buscar", href: "/buscar/" }],
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
      { label: "Hub Editorial", href: "/hub-editorial/" },
      { label: "Catálogo de skills", href: "/skills/" },
      { label: "Feed RSS", href: "/rss.xml" },
    ],
  },
];

export const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href);
