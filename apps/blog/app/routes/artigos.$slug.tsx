// Artigo (ADR-BLOG-JORNADA-ROTAS-001 §2.2, ADR-26): um único template no RC-DS-CF, com os slots que a análise do artigo da
// monday.com destaca (meta com tempo de leitura, sumário de H2, pontos principais e FAQ só quando o conteúdo existe),
// sem chamadas comerciais no meio do texto. Durante a reconstrução só PUBLIC_ARTICLES é público; os outros MDX prontos
// respondem 302 para /artigos/ e o MDX fica intacto. Slug inexistente = 404.
import { data, isRouteErrorResponse, redirect } from "react-router";

import type { Route } from "./+types/artigos.$slug";

import { ArticleBody } from "@/components/article/ArticleBody";
import { References } from "@/components/article/References";
import { ArticleMeta, Breadcrumb, Card, CardGrid, DemoNotice, KeyPoints, MoreLink, SectionHead, Toc } from "@/components/ds";
import { NotFoundPage } from "@/components/site/NotFoundPage";
import { SITE_METADATA, SITE_NAME, SITE_URL } from "@/consts";
import { ARTICLE_META, PILLARS, PROBLEMS } from "@/data/article-meta";
import { SOLUTIONS } from "@/features/solutions/data";
import DefaultLayout from "@/layouts/DefaultLayout";
import { track, useTrackView } from "@/lib/analytics/track";
import { articleToc, getArticleContent, getStory, isRetiredArticle, readingMinutes } from "@/lib/articles";
import { RC_GRAPH, nodeById } from "@/lib/graph";
import { seo } from "@/lib/seo";

export function loader({ params }: Route.LoaderArgs) {
	if (isRetiredArticle(params.slug)) throw redirect("/artigos/", 302);
	const story = getStory(params.slug);
	if (!story || !getArticleContent(params.slug)) throw data(null, { status: 404 });
	const meta = ARTICLE_META[story.slug];
	// Ponte para o Mapa (ADR §2.1): os nós cognitivos do artigo abrem o cérebro com o foco.
	const mapLinks = meta.graphRefs
		.map((id) => nodeById(RC_GRAPH, id))
		.filter((n): n is NonNullable<typeof n> => !!n)
		.map((n) => ({ id: n.id, label: n.label, href: n.type === "COGNITIVE_CAPACITY" ? `/mapas/?foco=${n.id}` : `/mapas/explorar/?foco=${n.id}` }));
	// Soluções relacionadas: as que trabalham as mesmas funções cognitivas do artigo (nome da função no schema).
	const labels = new Set(mapLinks.map((m) => m.label.toLocaleLowerCase("pt-BR")));
	const solutions = SOLUTIONS.filter((s) => s.functions.some((f) => labels.has(f.name.toLocaleLowerCase("pt-BR"))))
		.slice(0, 3)
		.map((s) => ({ href: `/ferramentas/solucoes/${s.slug}/`, name: s.name, text: s.yellow12 }));
	return { story, toc: articleToc(story.slug), minutes: readingMinutes(story.slug), mapLinks, solutions, pillar: PILLARS[story.pillar].label };
}

export const meta: Route.MetaFunction = ({ data: loaded, location }) => {
	if (!loaded) return seo({ title: "Página não encontrada", pathname: location.pathname, noindex: true });
	const { story } = loaded;
	const image = story.hero.landscape.src;
	const url = new URL(story.href, SITE_URL).href;
	return [
		...seo({ title: story.title, description: story.description, image, pathname: location.pathname }),
		{
			"script:ld+json": {
				"@context": "https://schema.org",
				"@type": "BlogPosting",
				headline: story.title,
				description: story.description,
				image: new URL(image, SITE_URL).href,
				datePublished: story.date,
				dateModified: story.date,
				author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
				publisher: {
					"@type": "Organization",
					name: SITE_NAME,
					logo: { "@type": "ImageObject", url: new URL(SITE_METADATA.logo.url, SITE_URL).href },
				},
				mainEntityOfPage: url,
				identifier: story.contentId,
			},
		},
	];
};

export default function Article({ loaderData }: Route.ComponentProps) {
	const { story, toc, minutes, mapLinks, solutions, pillar } = loaderData;
	// O módulo MDX não passa pelo loader (não é serializável): é resolvido pelo slug, no cliente e no servidor.
	const Content = getArticleContent(story.slug)!;
	// RQ-111: leitura do artigo, com o problema principal ligado ao grafo (ADR-M04).
	const event = { stage: "ARTICLE", problem_id: PROBLEMS.find((p) => p.id === story.problems[0])?.node, asset_id: story.slug } as const;
	useTrackView({ ...event, action: "view" }, story.slug);
	return (
		<DefaultLayout>
			<article className="ds-page" data-article>
				<header className="ds-pagehead" data-align="left">
					<Breadcrumb items={[{ label: "Início", href: "/" }, { label: "Blog", href: "/artigos/" }, { label: story.title }]} />
					<DemoNotice>Este é o artigo de exemplo do template novo; os demais voltam conforme forem reconstruídos.</DemoNotice>
					<p className="ds-eyebrow">{pillar}</p>
					<h1>{story.title}</h1>
					<p className="ds-pagehead-lead">{story.description}</p>
					<ArticleMeta publisher={SITE_NAME} date={story.date ?? undefined} minutes={minutes} id={/^RC-/.test(story.contentId) ? story.contentId : undefined} />
				</header>
				<div className="ds-article">
					<Toc items={toc} />
					<div>
						<KeyPoints items={[]} />
						<ArticleBody Content={Content} />
					</div>
				</div>
			</article>

			<References ids={story.sources} />

			{/* Ponte para o Mapa Cognitivo e para as soluções (jornada do ADR §2.1); um único CTA primário. */}
			<section className="ds-section" aria-labelledby="proximo-passo" data-next-step>
				<SectionHead id="proximo-passo" label="Próximo passo" heading="Leve a leitura para o Mapa" align="left" />
				<p className="ds-pagehead-actions" style={{ marginTop: 0, marginBottom: 32 }}>
					<a
						href={story.next.href}
						data-cta="primary"
						className="ds-btn"
						data-variant="primary"
						data-size="lg"
						onClick={() => track({ ...event, action: "cta" })}
					>
						{story.next.label}
					</a>
				</p>
				{mapLinks.length > 0 && (
					<nav aria-label="Conceitos deste artigo no Mapa" className="ds-chips" style={{ marginBottom: 40 }}>
						{mapLinks.map((m) => (
							<a key={m.id} href={m.href} className="ds-chip">
								{m.label}
							</a>
						))}
					</nav>
				)}
				{solutions.length > 0 && (
					<CardGrid cols={3} label="Soluções relacionadas">
						{solutions.map((s) => (
							<Card key={s.href} href={s.href} eyebrow="Solução" title={s.name} text={s.text} cta="Ver a solução" />
						))}
					</CardGrid>
				)}
				<p className="ds-more">
					<MoreLink href="/artigos/">Voltar ao Blog</MoreLink>
				</p>
			</section>
		</DefaultLayout>
	);
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	if (isRouteErrorResponse(error) && error.status === 404) return <NotFoundPage />;
	throw error;
}
