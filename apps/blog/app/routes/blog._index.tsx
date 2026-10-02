// Arquivo de artigos (mood board 04): "Explore por assunto", filtro por território,
// destaque à esquerda e lista numerada à direita. Tudo vem da coleção + banco editorial.
import type { Route } from "./+types/blog._index";

import { ArticleCard } from "@/components/editorial/ArticleCard";
import { FilterChips } from "@/components/editorial/FilterChips";
import DefaultLayout from "@/layouts/DefaultLayout";
import { TERRITORIES } from "@/lib/editorial";
import { getPosts } from "@/lib/posts.server";
import { seo } from "@/lib/seo";

export function loader() {
	return { posts: getPosts() };
}

export const meta: Route.MetaFunction = ({ location }) =>
	seo({
		title: "Artigos",
		description:
			"Artigos do Risco Cognitivo por território: fatores, exposição, eventos, controles, indicadores, gestão e framework.",
		pathname: location.pathname,
	});

export default function BlogIndex({ loaderData }: Route.ComponentProps) {
	const { posts } = loaderData;
	const [featured, ...rest] = posts;
	const options = TERRITORIES.filter((t) => posts.some((p) => p.territory.slug === t.slug)).map((t) => ({
		slug: t.slug,
		label: t.short,
	}));

	return (
		<DefaultLayout>
			<section className="container pt-12 pb-10 lg:pt-20" aria-labelledby="blog-title">
				<p className="rc-eyebrow">Explorar</p>
				<div className="mt-4 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
					<div>
						<h1 id="blog-title" className="rc-display text-5xl sm:text-6xl lg:text-7xl">
							Explore por assunto
						</h1>
						<p className="rc-lead mt-5 max-w-2xl text-lg sm:text-xl">
							Artigos e ensaios sobre como a cognição participa da formação do risco — e sobre o que reduz,
							mede e acompanha esse risco no trabalho.
						</p>
					</div>
				</div>
				<div className="mt-8">
					<FilterChips options={options} label="Filtrar artigos por território" />
				</div>
			</section>

			<section className="container" data-filter-scope aria-label="Artigos">
				<div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
					<div>{featured && <ArticleCard post={featured} variant="feature" headingLevel={2} />}</div>
					<div className="lg:border-l lg:border-[var(--border-default)] lg:pl-10">
						<h2 className="sr-only">Todos os artigos</h2>
						{rest.map((post, i) => (
							<ArticleCard key={post.id} post={post} variant="row" index={i + 2} headingLevel={3} />
						))}
						<p data-filter-empty hidden className="text-muted-foreground py-6">
							Nenhum outro artigo neste território ainda.
						</p>
					</div>
				</div>
			</section>
		</DefaultLayout>
	);
}
