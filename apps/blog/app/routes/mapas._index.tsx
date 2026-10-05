// Mapa causal (LANC-001 PR-H): porta de entrada do mapa, com os 3 modos (RQ-080). O mapa é uma projeção do grafo
// canônico da Teia (ADR-M04): não cria evidência, e o que é inferido aparece como inferido.
import type { Route } from "./+types/mapas._index";

import { ChevronLink } from "@/components/layout/ChevronLink";
import DefaultLayout from "@/layouts/DefaultLayout";
import { MODES, NODE_TYPES, RC_GRAPH, allEdgeViews, factorIds } from "@/lib/graph";
import { seo } from "@/lib/seo";

const LEAD = "Os fatores que tornam a execução mais difícil, o que eles afetam e o que pode compensá-los, ligados por relações com fonte.";

const MODE_TEXT: Record<(typeof MODES)[number]["id"], string> = {
	problemas: "Fatores de demanda, capacidades, eventos e impactos: de onde vem a dificuldade e onde ela aparece.",
	solucoes: "Compensações, controles, métodos e soluções: o que o sistema pode assumir no lugar da pessoa.",
	evidencias: "As fontes que sustentam cada fator, as mesmas da página Fontes.",
};

export const meta: Route.MetaFunction = ({ location }) => seo({ title: "Mapa causal", description: LEAD, pathname: location.pathname });

export default function Mapas() {
	const edges = allEdgeViews(RC_GRAPH);
	const inferred = edges.filter((e) => e.inferred).length;
	return (
		<DefaultLayout>
			<header className="stories-container pt-12 lg:pt-[88px]">
				<div className="rc-hero-reveal mx-auto max-w-[var(--ref-wide-width)]">
					<p className="stories-meta text-muted-foreground">Risco Cognitivo · Mapa causal</p>
					<h1 className="stories-h2 mt-3">Mapa causal</h1>
					<p className="stories-body text-muted-foreground mt-[var(--ref-block-gap)] max-w-[var(--ref-hero-lead-w)]">{LEAD}</p>
					<a
						href="/mapas/explorar/"
						data-cta="primary"
						className="bg-foreground text-background focus-visible:ring-ring/50 mt-[var(--ref-block-gap)] inline-flex min-h-11 items-center rounded-[var(--ref-pill-radius)] px-6 py-2 text-sm font-medium outline-none focus-visible:ring-[3px]"
					>
						Explorar o mapa
					</a>
				</div>
			</header>
			<section className="stories-container mt-[var(--ref-card-gap-y)]" aria-labelledby="modos">
				<div className="mx-auto max-w-[var(--ref-wide-width)]">
					<h2 id="modos" className="stories-h2">
						Três modos
					</h2>
					<ul className="mt-[var(--ref-block-gap)] grid gap-[var(--ref-grid-gap)] md:grid-cols-3" data-map-mode-cards>
						{MODES.map((m) => (
							<li key={m.id} className="rc-cell rc-surface flex flex-col gap-3 p-6">
								<p className="stories-meta text-muted-foreground" aria-hidden="true">
									{m.types.map((t) => NODE_TYPES[t].glyph).join(" ")}
								</p>
								<h3 className="text-xl font-semibold">{m.label}</h3>
								<p className="stories-body">{MODE_TEXT[m.id]}</p>
								<ChevronLink href={`/mapas/explorar/?modo=${m.id}`} className="mt-auto">
									Saiba mais
								</ChevronLink>
							</li>
						))}
					</ul>
				</div>
			</section>
			<section className="stories-container mt-[var(--ref-section-gap)]" aria-labelledby="como-ler">
				<div className="mx-auto max-w-[var(--ref-reading-width)]">
					<h2 id="como-ler" className="stories-h2">
						Como ler o mapa
					</h2>
					<p className="stories-body mt-[var(--ref-block-gap)]">
						São {factorIds(RC_GRAPH).length} fatores e {edges.length} relações. Cada tipo de fator tem uma forma e um nome; cada relação tem um
						rótulo em texto. Traço tracejado marca relação inferida: {inferred} das {edges.length} ainda são inferidas e aparecem assim em todo
						o site.
					</p>
					<ul className="stories-body mt-[var(--ref-block-gap)] grid gap-2 sm:grid-cols-2" data-map-legend>
						{Object.entries(NODE_TYPES).map(([k, t]) => (
							<li key={k} className="flex items-center gap-2">
								<span aria-hidden="true" className="w-5 text-center">
									{t.glyph}
								</span>
								{t.label}
							</li>
						))}
					</ul>
					<div className="mt-[var(--ref-block-gap)] flex flex-wrap gap-x-6">
						<ChevronLink href="/mapas/personalizar/">Personalizar por onde começar</ChevronLink>
						<ChevronLink href="/fontes/">Ver as fontes</ChevronLink>
					</div>
				</div>
			</section>
		</DefaultLayout>
	);
}
