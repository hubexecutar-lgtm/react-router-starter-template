// /mapas/explorar/:fatorId/ (LANC-001 SCR-03, RQ-072): o detalhe do fator como página compartilhável.
// "Voltar ao mapa" leva ao Explorar com ?foco=, então a seleção é preservada.
import { ArrowLeft } from "lucide-react";
import { data } from "react-router";

import type { Route } from "./+types/mapas.explorar.$fatorId";

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
	<a href={factorHref(n.id)} className="text-primary underline underline-offset-4 hover:no-underline">
		{children}
	</a>
);

export default function Fator({ params }: Route.ComponentProps) {
	const node = factor(params.fatorId)!;
	return (
		<DefaultLayout>
			<article className="stories-container pb-16">
				<div className="mx-auto max-w-[var(--ref-reading-width)]">
					<header className="pt-12 lg:pt-[88px]">
						<a
							href={exploreHref(node.id)}
							data-back-to-map
							className="text-primary focus-visible:ring-ring/50 inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-control)] text-sm font-semibold outline-none focus-visible:ring-[3px]"
						>
							<ArrowLeft className="size-4" aria-hidden="true" />
							Voltar ao mapa
						</a>
						<TypeBadge type={node.visual} className="mt-6 flex" />
						<h1 className="stories-h2 mt-3">{node.label}</h1>
						<SourceQuote node={node} className="mt-[var(--ref-block-gap)]" />
						<div className="mt-[var(--ref-block-gap)]">
							<RelationCounts id={node.id} />
						</div>
						<a
							href={exploreHref(node.id)}
							data-cta="primary"
							className="bg-foreground text-background focus-visible:ring-ring/50 mt-[var(--ref-block-gap)] inline-flex min-h-11 items-center rounded-[var(--ref-pill-radius)] px-6 py-2 text-sm font-medium outline-none focus-visible:ring-[3px]"
						>
							Ver no mapa
						</a>
					</header>
					<section aria-labelledby="relacoes" className="mt-[var(--ref-card-gap-y)]">
						<h2 id="relacoes" className="stories-h2">
							Relações
						</h2>
						<div className="mt-[var(--ref-block-gap)]">
							<RelationTabs id={node.id} nodeLink={pageLink} />
						</div>
					</section>
					<section aria-labelledby="porque" className="mt-[var(--ref-card-gap-y)]">
						<h2 id="porque" className="stories-h2">
							Por quê?
						</h2>
						<div className="mt-[var(--ref-block-gap)]">
							<WhyChain id={node.id} nodeLink={pageLink} />
						</div>
					</section>
				</div>
			</article>
		</DefaultLayout>
	);
}
