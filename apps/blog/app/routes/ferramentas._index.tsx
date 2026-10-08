// Home de Ferramentas e Soluções (ADR-BLOG-JORNADA-ROTAS-001 §2.2, ADR-26): um layout demonstrativo no RC-DS-CF com
// descoberta por tipo, problema, função executiva e contexto e um catálogo reduzido só de itens reais: as 6 soluções
// (repository.listItems()) e o Prisma como ferramenta interativa (data/correlations.ts). Tipo sem item = "em preparação",
// sem link. Estado na URL: ?q=, ?tipo=, ?area=, ?estado= (catálogo) e ?problema=, ?compensacao= (ADR-21).
import type { Route } from "./+types/ferramentas._index";

import { Button, Card, CardGrid, Chips, MoreLink, PageHead, SectionHead } from "@/components/ds";
import { SITE_NAME } from "@/consts";
import { FACETS } from "@/data/taxonomy";
import { SOLUTIONS } from "@/features/solutions/data";
import { StoreCatalog } from "@/features/store/components/store-catalog";
import { ToolDiscovery } from "@/features/store/components/tool-discovery";
import { TOOL_CORRELATIONS } from "@/features/store/data/correlations";
import { listItems } from "@/features/store/data/repository";
import DefaultLayout from "@/layouts/DefaultLayout";
import { seo } from "@/lib/seo";

const DESCRIPTION = "Soluções e ferramentas para apoiar a execução do trabalho cognitivo, por tipo, problema, função executiva e contexto.";

/** Ferramenta interativa publicada: o Prisma (texto da própria página, /prisma/). */
const PRISMA = TOOL_CORRELATIONS.find((t) => t.id === "prisma")!;

/** Funções executivas que as soluções exigem (campo `functions` do schema), com quantas soluções trabalham cada uma. */
const FUNCTIONS = [...new Set(SOLUTIONS.flatMap((s) => s.functions.map((f) => f.name)))]
	.map((name) => ({ name, count: SOLUTIONS.filter((s) => s.functions.some((f) => f.name === name)).length }))
	.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "pt-BR"));

/** Contextos da taxonomia (§3): cada solução traz a aplicação "Nos estudos" e "No trabalho"; rotina ainda não tem item. */
const CONTEXT_COUNT: Record<string, number> = {
	trabalho: SOLUTIONS.filter((s) => s.work).length,
	estudos: SOLUTIONS.filter((s) => s.study).length,
};
const CONTEXTS = FACETS.find((f) => f.id === "contextos")!.values;

export const meta: Route.MetaFunction = ({ location }) => seo({ title: "Ferramentas e Soluções", description: DESCRIPTION, pathname: location.pathname });

export default function Ferramentas() {
	return (
		<DefaultLayout>
			<div className="ds-page">
				<PageHead
					eyebrow={`${SITE_NAME} · Ferramentas`}
					title="Ferramentas e Soluções"
					lead="O que você pode aplicar: soluções publicadas e uma ferramenta interativa, organizadas por tipo, problema, função executiva e contexto."
					notice="O catálogo está em reconstrução: só aparecem itens publicados; os outros tipos estão em preparação."
					actions={
						<>
							<Button href="/ferramentas/solucoes/" size="lg" data-cta="primary">
								Ver as soluções
							</Button>
							<Button href={PRISMA.href} size="lg" variant="outline">
								Abrir o Prisma
							</Button>
							<Button href="/ferramentas/processo-de-trabalho/" size="lg" variant="outline">
								Processo de Trabalho + Prisma
							</Button>
						</>
					}
				/>

				<section className="ds-section" style={{ paddingTop: 0 }} aria-labelledby="catalogo">
					<SectionHead id="catalogo" label="Por tipo" heading="Catálogo" lead="Busque pelo nome, pela função executiva ou pelo tipo." align="left" />
					<StoreCatalog items={listItems()} />
				</section>

				<section className="ds-section" aria-labelledby="interativa" data-store-interactive>
					<SectionHead id="interativa" label="Ferramenta interativa" heading="Faça o exercício no navegador" align="left" />
					<CardGrid cols={2} label="Ferramentas interativas">
						<Card
							href={PRISMA.href}
							eyebrow="Ferramenta interativa"
							size="lg"
							title={PRISMA.name}
							text="Preencha o formulário, revise seu Prisma e exporte uma página A4 para usar onde precisar."
							meta="Sem conta; os dados ficam neste dispositivo."
							cta="Abrir o Prisma"
							data-tool-card="prisma"
						/>
						<Card
							href="/ferramentas/processo-de-trabalho/"
							eyebrow="Protótipo demonstrativo"
							title="Processo de Trabalho + Prisma"
							text="Experimente o fluxo de intake e as duas visualizações no navegador. Esta versão ainda não implementa PWA nem QR funcional."
							cta="Abrir protótipo"
							data-tool-card="processo-de-trabalho-prisma"
						/>
						<Card
							href="/mapas/"
							eyebrow="Antes de escolher"
							title="Veja no Mapa como os fatores se ligam"
							text="O Mapa Cognitivo mostra a relação entre demanda, função executiva, risco e solução."
							cta="Abrir o Mapa"
						/>
					</CardGrid>
				</section>

				<ToolDiscovery />

				<section className="ds-section" aria-labelledby="por-funcao" data-store-facets>
					<SectionHead id="por-funcao" label="Por função executiva e contexto" heading="Encontre pelo que a tarefa exige" align="left" />
					<div className="ds-facets">
						<div className="ds-facet-group">
							<h3>Função executiva</h3>
							<Chips
								label="Função executiva"
								items={FUNCTIONS.map((f) => ({ label: f.name, count: f.count, href: `/ferramentas/?q=${encodeURIComponent(f.name)}#catalogo` }))}
							/>
						</div>
						<div className="ds-facet-group">
							<h3>Contexto</h3>
							<Chips
								label="Contexto"
								items={CONTEXTS.map((c) => ({
									label: c.label,
									count: CONTEXT_COUNT[c.id] || undefined,
									href: CONTEXT_COUNT[c.id] ? "/ferramentas/solucoes/" : undefined,
								}))}
							/>
						</div>
					</div>
					<p className="ds-more" style={{ textAlign: "left", marginInline: 0 }}>
						<MoreLink href="/artigos/riscos-cognitivos-guia/">Entender as funções executivas no guia</MoreLink>
					</p>
				</section>
			</div>
		</DefaultLayout>
	);
}
