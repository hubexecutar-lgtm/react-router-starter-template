// /mapas/explorar/:fatorId/ (LANC-001 SCR-03, RQ-072): o detalhe do fator como página compartilhável, no RC-DS-CF
// (ADR-26, DS-CF-001-mapa). A trilha e "Voltar ao mapa" levam ao Explorar com ?foco=, então a seleção é preservada.
import { data } from "react-router";

import type { Route } from "./+types/mapas.explorar.$fatorId";

import { Button, PageHead, SectionHead } from "@/components/ds";
import { RelationCounts, RelationTabs, SourceQuote, TypeBadge, WhyChain, type NodeLink } from "@/features/mapa/parts";
import DefaultLayout from "@/layouts/DefaultLayout";
import { NODE_TYPES, RC_GRAPH, exploreHref, factorHref, factorIds, idFromParam, nodeById } from "@/lib/graph";
import { seo } from "@/lib/seo";

const factor = (param: string | undefined) => {
	const id = idFromParam(param ?? "");
	return factorIds(RC_GRAPH).includes(id) ? nodeById(RC_GRAPH, id) : null;
};

export function loader({ params }: Route.LoaderArgs) {
	if (!factor(params.fatorId)) throw data(null, { status: 404 });
	return null;
}

export const meta: Route.MetaFunction = ({ params, location }) => {
	const node = factor(params.fatorId);
	return seo({
		title: node ? `${node.label} — Mapa causal` : undefined,
		description: node ? `${node.label}: ${NODE_TYPES[node.visual].label.toLocaleLowerCase("pt-BR")} no mapa causal do Risco Cognitivo, com causas, impactos, soluções e evidências.` : undefined,
		pathname: location.pathname,
	});
};

const pageLink: NodeLink = (n, children) => (
	<a href={factorHref(n.id)} className="ds-inline-link">
		{children}
	</a>
);

export default function Fator({ params }: Route.ComponentProps) {
	const node = factor(params.fatorId)!;
	const back = exploreHref(node.id);
	return (
		<DefaultLayout>
			<article className="ds-page pb-16">
				<PageHead
					crumbs={[{ label: "Mapa Cognitivo", href: "/mapas/" }, { label: "Explorar", href: back }, { label: node.label }]}
					eyebrow={`Mapa causal · ${NODE_TYPES[node.visual].label}`}
					title={node.label}
					lead="Causas, impactos, soluções e evidências registradas no grafo para este fator. Relação inferida aparece como inferida."
					notice="Template de detalhe do fator no design system novo; as relações e as fontes vêm do grafo real."
					actions={
						<Button href={back} size="lg" data-cta="primary" data-back-to-map="">
							Voltar ao mapa
						</Button>
					}
				>
					<div className="mt-8 grid gap-4">
						<TypeBadge type={node.visual} />
						<SourceQuote node={node} />
						<RelationCounts id={node.id} />
					</div>
				</PageHead>

				<section className="ds-section" style={{ paddingTop: 0 }} aria-labelledby="relacoes">
					<SectionHead id="relacoes" label="Grafo" heading="Relações" align="left" />
					<RelationTabs id={node.id} nodeLink={pageLink} />
				</section>
				<section className="ds-section" aria-labelledby="porque">
					<SectionHead id="porque" label="Cadeia" heading="Por quê?" lead="O que leva a este fator e o que pode compensá-lo." align="left" />
					<WhyChain id={node.id} nodeLink={pageLink} />
				</section>
			</article>
		</DefaultLayout>
	);
}
