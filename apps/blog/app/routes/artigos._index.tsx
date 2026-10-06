// Home do Blog (ADR-BLOG-JORNADA-ROTAS-001 §2.2, ADR-26): índice editorial no RC-DS-CF com destaque, facetas da
// taxonomia (§3) e caminhos de leitura. O filtro é ?tema=<id>, aplicado depois da hidratação (a página é pré-renderizada);
// faceta sem artigo aparece como "em preparação", sem rota. Durante a reconstrução só o artigo de exemplo é público.
import { useSearchParams } from "react-router";

import type { Route } from "./+types/artigos._index";

import { Button, Card, CardGrid, Chips, EmptyState, MoreLink, PageHead, SectionHead } from "@/components/ds";
import { SITE_DESCRIPTION, SITE_NAME } from "@/consts";
import { SHARE_IMAGE } from "@/data/article-media";
import { PILLARS } from "@/data/article-meta";
import { ARTICLE_FACETS, FACETS, facetValue } from "@/data/taxonomy";
import DefaultLayout from "@/layouts/DefaultLayout";
import { useTrackView } from "@/lib/analytics/track";
import { getStories, readingMinutes } from "@/lib/articles";
import { seo } from "@/lib/seo";

export function loader() {
	return {
		stories: getStories().map((s) => ({
			slug: s.slug,
			href: s.href,
			title: s.title,
			description: s.description,
			pillar: PILLARS[s.pillar].label,
			minutes: readingMinutes(s.slug),
			facets: ARTICLE_FACETS[s.slug] ?? [],
		})),
	};
}

export const meta: Route.MetaFunction = ({ location }) =>
	seo({ title: "Blog", description: SITE_DESCRIPTION, image: SHARE_IMAGE.src, pathname: location.pathname });

export default function Page({ loaderData }: Route.ComponentProps) {
	const { stories } = loaderData;
	const [params] = useSearchParams();
	const tema = params.get("tema") ?? "";
	const current = facetValue(tema);
	const shown = current ? stories.filter((s) => s.facets.includes(tema)) : stories;
	const count = (id: string) => stories.filter((s) => s.facets.includes(id)).length;
	useTrackView({ stage: "BLOG", action: "view" }, tema || "blog");
	const [featured, ...rest] = shown;
	return (
		<DefaultLayout>
			<div className="ds-page">
				<PageHead
					eyebrow={`${SITE_NAME} · Blog`}
					title="Blog"
					lead="Leituras sobre riscos cognitivos, funções executivas e estratégias de apoio, organizadas por tema, perfil e contexto."
					notice="O Blog está em reconstrução: por enquanto um artigo de exemplo mostra o template novo."
					actions={
						featured && (
							<Button href={featured.href} size="lg" data-cta="primary">
								Ler o guia de riscos cognitivos
							</Button>
						)
					}
				/>

				<section className="ds-section" style={{ paddingTop: 0 }} aria-labelledby="temas" data-blog-facets>
					<SectionHead id="temas" label="Temas" heading="Encontre o que se aplica a você" align="left" />
					<div className="ds-facets">
						{FACETS.map((f) => (
							<div key={f.id} className="ds-facet-group">
								<h3>{f.label}</h3>
								<Chips
									label={f.label}
									items={f.values.map((v) => ({
										label: v.label,
										href: count(v.id) ? (tema === v.id ? "/artigos/" : `/artigos/?tema=${v.id}`) : undefined,
										count: count(v.id) || undefined,
										current: tema === v.id,
									}))}
								/>
							</div>
						))}
					</div>
				</section>

				<section className="ds-section" aria-labelledby="leituras" data-blog-list>
					<SectionHead id="leituras" label={current ? `Tema: ${current.label}` : "Destaque"} heading={current ? `Artigos sobre ${current.label.toLocaleLowerCase("pt-BR")}` : "Para começar"} align="left" />
					{featured ? (
						<CardGrid cols={2} label="Artigos">
							<Card
								href={featured.href}
								eyebrow={featured.pillar}
								size="lg"
								title={featured.title}
								text={featured.description}
								meta={`${featured.minutes} min de leitura`}
								cta="Ler artigo"
								data-story-card=""
							/>
							{rest.length ? (
								rest.map((s) => <Card key={s.slug} href={s.href} eyebrow={s.pillar} title={s.title} text={s.description} meta={`${s.minutes} min de leitura`} cta="Ler artigo" data-story-card="" />)
							) : (
								<Card href="/mapas/" eyebrow="Caminho de leitura" title="Do artigo ao Mapa Cognitivo" text="Depois do guia, explore no Mapa como memória de trabalho, controle inibitório e flexibilidade se relacionam com demandas e estratégias." cta="Abrir o Mapa" />
							)}
						</CardGrid>
					) : (
						<EmptyState
							title={`Nenhum artigo sobre ${current?.label.toLocaleLowerCase("pt-BR") ?? "este tema"} ainda`}
							text="Este tema está na taxonomia, mas os artigos dele ainda estão em reconstrução. Comece pelo guia geral."
							action={{ label: "Ver todos os artigos", href: "/artigos/" }}
						/>
					)}
					<p className="ds-more">
						<MoreLink href="/fontes/">Ver as fontes usadas nos artigos</MoreLink>
					</p>
				</section>
			</div>
		</DefaultLayout>
	);
}
