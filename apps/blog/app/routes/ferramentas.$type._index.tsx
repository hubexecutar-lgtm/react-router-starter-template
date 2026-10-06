// Template de categoria das Ferramentas (ADR-BLOG-JORNADA-ROTAS-001 §2.2, ADR-26): /ferramentas/{tipo}/ no RC-DS-CF.
// As 9 rotas de tipo continuam pré-renderizadas (data/paths.ts). Tipo com item publicado mostra o catálogo do tipo
// (busca e área na URL); tipo sem item mostra um estado vazio honesto, com link para as soluções publicadas.
import { data } from "react-router";

import type { Route } from "./+types/ferramentas.$type._index";

import { Chips, EmptyState, PageHead, SectionHead } from "@/components/ds";
import { StoreCatalog } from "@/features/store/components/store-catalog";
import { ITEM_TYPES, typeBySegment, typeHref } from "@/features/store/data/item-types";
import { listItems } from "@/features/store/data/repository";
import DefaultLayout from "@/layouts/DefaultLayout";
import { seo } from "@/lib/seo";

export function loader({ params }: Route.LoaderArgs) {
	if (!typeBySegment(params.type)) throw data(null, { status: 404 });
	return null;
}

export const meta: Route.MetaFunction = ({ params, location }) => {
	const def = typeBySegment(params.type);
	return seo({
		title: def ? `${def.plural} — Ferramentas e Soluções` : undefined,
		description: def?.description,
		pathname: location.pathname,
	});
};

export default function FerramentasType({ params }: Route.ComponentProps) {
	const def = typeBySegment(params.type)!;
	const items = listItems();
	const own = items.filter((i) => i.type === def.type);
	const count = (type: string) => items.filter((i) => i.type === type).length;
	return (
		<DefaultLayout>
			<div className="ds-page" data-store-type={def.segment}>
				<PageHead
					crumbs={[{ label: "Ferramentas", href: "/ferramentas/" }, { label: def.plural }]}
					eyebrow={`Ferramentas · ${own.length ? `${own.length} ${own.length === 1 ? "item publicado" : "itens publicados"}` : "Em preparação"}`}
					title={def.plural}
					lead={def.description}
					notice={own.length ? "Template de categoria no design system novo; os itens listados são os publicados." : "Template de categoria no design system novo; este tipo ainda não tem item publicado."}
				>
					<nav aria-label="Outros tipos" style={{ marginTop: 24 }}>
						<Chips
							label="Tipos do catálogo"
							items={[
								{ label: "Todos", href: "/ferramentas/", count: items.length },
								...ITEM_TYPES.map((t) => ({
									label: t.plural,
									href: count(t.type) || t.type === def.type ? typeHref(t.type) : undefined,
									count: count(t.type) || undefined,
									current: t.type === def.type,
								})),
							]}
						/>
					</nav>
				</PageHead>

				<section className="ds-section" style={{ paddingTop: 0 }} aria-labelledby="itens">
					<SectionHead id="itens" label={def.label} heading={own.length ? "Itens publicados" : "Nenhum item publicado"} align="left" />
					{own.length ? (
						<StoreCatalog items={items} lockedType={def.type} />
					) : (
						<div data-testid="state-empty">
							<EmptyState
								level={3}
								title={`${def.plural}: em preparação`}
								text="Este tipo faz parte do catálogo, mas ainda não tem material publicado: só entram itens prontos e verificáveis. Comece pelas soluções, que já estão publicadas."
								action={{ label: "Ver as soluções publicadas", href: "/ferramentas/solucoes/" }}
							/>
						</div>
					)}
				</section>
			</div>
		</DefaultLayout>
	);
}
