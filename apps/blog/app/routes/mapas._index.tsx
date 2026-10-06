// Home do Mapa Cognitivo (ADR-BLOG-JORNADA-ROTAS-001 §2.2, ADR-26): o mesmo cérebro da Home em tamanho principal
// (`BrainHero variant="full"`), que gira, seleciona funções executivas e abre o card completo, lendo e gravando `?foco=`.
// Abaixo, os modos de exploração do mapa causal, a legenda dos tipos de nó, as outras capacidades do grafo e o
// Personalizar. O mapa é projeção do grafo canônico da Teia (ADR-M04): não cria evidência nem localização anatômica.
import type { Route } from "./+types/mapas._index";

import { Button, Card, CardGrid, Chips, MoreLink, PageHead, SectionHead } from "@/components/ds";
import { MAP_BRAIN } from "@/data/mapa-brain";
import { BrainHero } from "@/features/home-brain/BrainHero";
import { getBrainTopics } from "@/features/home-brain/topics.server";
import { MAP_LEAD } from "@/features/mapa/copy";
import DefaultLayout from "@/layouts/DefaultLayout";
import { MODES, NODE_TYPES, RC_GRAPH, allEdgeViews, exploreHref, factorIds, nodeById } from "@/lib/graph";
import { seo } from "@/lib/seo";

const MODE_TEXT: Record<(typeof MODES)[number]["id"], string> = {
	problemas: "Fatores de demanda, capacidades, eventos e impactos: de onde vem a dificuldade e onde ela aparece.",
	solucoes: "Compensações, controles, métodos e soluções: o que o sistema pode assumir no lugar da pessoa.",
	evidencias: "As fontes que sustentam cada fator, as mesmas da página Fontes.",
};

export const meta: Route.MetaFunction = ({ location }) => seo({ title: "Mapa Cognitivo", description: MAP_LEAD, pathname: location.pathname });

export function loader() {
	const brainIds = MAP_BRAIN.functions.map((f) => f.id);
	// Capacidades do grafo fora das 4 do cérebro: entram como atalhos para o Explorar (só as do mapa público).
	const capacities = factorIds(RC_GRAPH)
		.map((id) => nodeById(RC_GRAPH, id)!)
		.filter((n) => n.type === "COGNITIVE_CAPACITY" && !brainIds.includes(n.id))
		.map((n) => ({ id: n.id, label: n.label }));
	const edges = allEdgeViews(RC_GRAPH);
	return {
		brainTopics: getBrainTopics(brainIds),
		capacities,
		stats: { factors: factorIds(RC_GRAPH).length, edges: edges.length, inferred: edges.filter((e) => e.inferred).length },
	};
}

export default function Mapas({ loaderData }: Route.ComponentProps) {
	const { brainTopics, capacities, stats } = loaderData;
	return (
		<DefaultLayout>
			<div className="ds-page">
				<PageHead
					eyebrow="Risco Cognitivo · Mapa Cognitivo"
					title="Mapa Cognitivo"
					lead="Selecione uma função executiva no cérebro para abrir o card dela; as setas do teclado trocam de função. Depois, siga para as relações no mapa causal."
					notice="O Mapa Cognitivo está em reconstrução no design system novo; o cérebro, o grafo e as fontes são reais."
					actions={
						<>
							<Button href="/mapas/explorar/" size="lg" data-cta="primary">
								Explorar o mapa causal
							</Button>
							<Button href="/mapas/personalizar/" size="lg" variant="outline">
								Personalizar por onde começar
							</Button>
						</>
					}
				/>

				{/* O mesmo cérebro da Home (DS-CF-001 §5), em tamanho principal; lê e grava ?foco=. */}
				<div className="ds-section" style={{ paddingTop: 0 }}>
					<BrainHero topics={brainTopics} variant="full" copy={MAP_BRAIN} />
				</div>

				<section className="ds-section" aria-labelledby="modos">
					<SectionHead id="modos" label="Modos" heading="Três modos de exploração" lead="Cada modo é um filtro sobre o mesmo grafo; o fator no centro não muda." align="left" />
					<CardGrid cols={3} label="Modos de exploração" data-map-mode-cards="">
						{MODES.map((m) => (
							<Card
								key={m.id}
								href={`/mapas/explorar/?modo=${m.id}`}
								eyebrow={<span aria-hidden="true">{m.types.map((t) => NODE_TYPES[t].glyph).join(" ")}</span>}
								title={m.label}
								text={MODE_TEXT[m.id]}
								cta="Explorar"
							/>
						))}
					</CardGrid>
				</section>

				<section className="ds-section" aria-labelledby="como-ler">
					<SectionHead
						id="como-ler"
						label="Legenda"
						heading="Como ler o mapa"
						lead={`São ${stats.factors} fatores e ${stats.edges} relações. Cada tipo de fator tem uma forma e um nome; cada relação tem um rótulo em texto. Traço tracejado marca relação inferida: ${stats.inferred} das ${stats.edges} ainda são inferidas e aparecem assim em todo o site.`}
						align="left"
					/>
					<ul className="ds-mapa-legend" data-map-legend>
						{Object.entries(NODE_TYPES).map(([k, t]) => (
							<li key={k}>
								<span aria-hidden="true">{t.glyph}</span>
								{t.label}
							</li>
						))}
					</ul>
				</section>

				{capacities.length > 0 && (
					<section className="ds-section" aria-labelledby="capacidades" data-map-capacities>
						<SectionHead
							id="capacidades"
							label="Capacidades"
							heading="Outras capacidades cognitivas"
							lead="O grafo tem outras capacidades além das quatro do cérebro. Abra uma delas no centro do mapa causal."
							align="left"
						/>
						<Chips label="Capacidades cognitivas do grafo" items={capacities.map((c) => ({ label: c.label, href: exploreHref(c.id) }))} />
					</section>
				)}

				<section className="ds-section" aria-labelledby="personalizar">
					<SectionHead
						id="personalizar"
						label="Personalizar"
						heading="Comece pelo que pesa no seu trabalho"
						lead="Escolha focos e interesses em três passos. Muda só a ordem e o destaque do mapa, nunca as relações, e fica neste navegador."
						align="left"
					/>
					<p className="flex flex-wrap gap-x-6">
						<MoreLink href="/mapas/personalizar/">Personalizar o mapa</MoreLink>
						<MoreLink href="/fontes/">Ver as fontes</MoreLink>
					</p>
				</section>
			</div>
		</DefaultLayout>
	);
}
