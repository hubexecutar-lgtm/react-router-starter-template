// Faixa de categorias (Editorial Hybrid v4, ADR-22): logo abaixo do cabeçalho, com "Todos os artigos" e os 3 pilares
// do RC-LP-001 (RQ-020). Rola na horizontal no celular; o item da página atual leva a régua de ação.
import { useLocation } from "react-router";

import { PILLAR_TRAIL, isActive } from "./nav";

const ITEMS = [{ label: "Todos os artigos", href: "/artigos/" }, ...PILLAR_TRAIL];

export function CategoryRail({ inert = false }: { inert?: boolean }) {
	const { pathname } = useLocation();
	// "Todos os artigos" só fica ativo na listagem; num artigo, o ativo é o pilar dele.
	const current = (href: string) => (href === "/artigos/" ? pathname === "/artigos/" : isActive(pathname, href));
	return (
		<nav aria-label="Pilares" className="hy-category-rail" data-pillar-trail {...(inert ? { inert: true } : {})}>
			<ul>
				{ITEMS.map((item) => (
					<li key={item.href}>
						<a href={item.href} aria-current={current(item.href) ? "page" : undefined} className="focus-visible:ring-ring/50 rounded-sm outline-none focus-visible:ring-[3px]">
							{item.label}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
}
