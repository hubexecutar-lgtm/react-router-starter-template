// Navegação global. Fonte única para cabeçalho e rodapé.
// Site do zero (ADR-13): sem páginas públicas além da home, então não há itens. Cada página nova
// entra aqui junto com a rota.
export interface NavItem {
  label: string;
  href: string;
}

export const PRIMARY_NAV: NavItem[] = [];

export const FOOTER_NAV: { title: string; items: NavItem[] }[] = [
  { title: "Ferramentas", items: [{ label: "Prisma de execução", href: "/prisma/" }] },
];

export const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href);
