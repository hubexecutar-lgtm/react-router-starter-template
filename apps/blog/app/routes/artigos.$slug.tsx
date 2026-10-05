// Artigo (RC-FRONT-001): hero, coluna de leitura e MDX do autor sobre os tokens --ref-* do handoff
// OPENAI-STORIES-DESIGN-001. Só artigos com status "ready" existem; o resto é 404.
import { data, isRouteErrorResponse } from "react-router";

import type { Route } from "./+types/artigos.$slug";

import { NotFoundPage } from "@/components/site/NotFoundPage";
import { ArticleBody } from "@/components/stories/ArticleBody";
import { ArticleHero } from "@/components/stories/ArticleHero";
import { NextStep } from "@/components/stories/NextStep";
import { References } from "@/components/stories/References";
import { SITE_METADATA, SITE_NAME, SITE_URL } from "@/consts";
import { PILLARS, PROBLEMS } from "@/data/article-meta";
import { useTrackView } from "@/lib/analytics/track";
import DefaultLayout from "@/layouts/DefaultLayout";
import { getArticleContent, getStory } from "@/lib/articles";
import { seo } from "@/lib/seo";

export function loader({ params }: Route.LoaderArgs) {
	const story = getStory(params.slug);
	if (!story || !getArticleContent(params.slug)) throw data(null, { status: 404 });
	// Leituras relacionadas: o artigo canônico de cada pilar, menos o próprio e o destino do CTA primário.
	const related = (["p1", "p2", "p3"] as const)
		.map((p) => getStory(PILLARS[p].article))
		.filter((r): r is NonNullable<typeof r> => !!r && r.slug !== story.slug && r.href !== story.next.href)
		.map((r) => ({ href: r.href, title: r.title }));
	return { story, related };
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
	const { story, related } = loaderData;
	// O módulo MDX não passa pelo loader (não é serializável): é resolvido pelo slug, no cliente e no servidor.
	const Content = getArticleContent(story.slug)!;
	// RQ-111: leitura do artigo, com o problema principal ligado ao grafo (ADR-M04).
	const event = { stage: "ARTICLE", problem_id: PROBLEMS.find((p) => p.id === story.problems[0])?.node, asset_id: story.slug } as const;
	useTrackView({ ...event, action: "view" }, story.slug);
	return (
		<DefaultLayout>
			<article>
				<ArticleHero title={story.title} lead={story.description} media={story.hero} eyebrow={`Pilar · ${PILLARS[story.pillar].label}`} />
				<ArticleBody Content={Content} />
			</article>
			<References ids={story.sources} />
			<NextStep next={story.next} related={related} event={event} />
		</DefaultLayout>
	);
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	if (isRouteErrorResponse(error) && error.status === 404) return <NotFoundPage />;
	throw error;
}

