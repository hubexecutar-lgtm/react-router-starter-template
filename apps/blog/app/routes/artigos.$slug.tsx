// Artigo (RC-FRONT-001): hero, coluna de leitura e MDX do autor sobre os tokens --ref-* do handoff
// OPENAI-STORIES-DESIGN-001. Só artigos com status "ready" existem; o resto é 404.
import { data, isRouteErrorResponse } from "react-router";

import type { Route } from "./+types/artigos.$slug";

import { ChevronLink } from "@/components/layout/ChevronLink";
import { NotFoundPage } from "@/components/site/NotFoundPage";
import { ArticleBody } from "@/components/stories/ArticleBody";
import { ArticleHero } from "@/components/stories/ArticleHero";
import { SITE_NAME, SITE_URL } from "@/consts";
import { SHARE_IMAGE } from "@/data/article-media";
import DefaultLayout from "@/layouts/DefaultLayout";
import { getArticleContent, getStory } from "@/lib/articles";
import { seo } from "@/lib/seo";

export function loader({ params }: Route.LoaderArgs) {
	const story = getStory(params.slug);
	if (!story || !getArticleContent(params.slug)) throw data(null, { status: 404 });
	return { story };
}

export const meta: Route.MetaFunction = ({ data: loaded, location }) => {
	if (!loaded) return seo({ title: "Página não encontrada", pathname: location.pathname, noindex: true });
	const { story } = loaded;
	const image = story.hero?.src ?? SHARE_IMAGE.src;
	const url = new URL(story.href, SITE_URL).href;
	return [
		...seo({ title: story.title, description: story.description, image, pathname: location.pathname }),
		{
			"script:ld+json": {
				"@context": "https://schema.org",
				"@type": "Article",
				headline: story.title,
				description: story.description,
				image: new URL(image, SITE_URL).href,
				author: { "@type": "Organization", name: SITE_NAME },
				publisher: { "@type": "Organization", name: SITE_NAME },
				mainEntityOfPage: url,
			},
		},
	];
};

export default function Article({ loaderData }: Route.ComponentProps) {
	const { story } = loaderData;
	// O módulo MDX não passa pelo loader (não é serializável): é resolvido pelo slug, no cliente e no servidor.
	const Content = getArticleContent(story.slug)!;
	return (
		<DefaultLayout>
			<article>
				<ArticleHero title={story.title} lead={story.description} media={story.hero} />
				<ArticleBody Content={Content} />
			</article>
			<div className="stories-container mt-[var(--ref-section-gap)]">
				<div className="mx-auto max-w-[var(--ref-reading-width)]">
					<ChevronLink href="/">Todos os artigos</ChevronLink>
				</div>
			</div>
		</DefaultLayout>
	);
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	if (isRouteErrorResponse(error) && error.status === 404) return <NotFoundPage />;
	throw error;
}

