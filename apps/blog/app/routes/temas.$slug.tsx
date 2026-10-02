// Página de território (TAX-RC-*): função, pergunta central, inclui / não confundir e artigos.
import { ArrowLeft, ArrowRight } from "lucide-react";
import { data } from "react-router";

import type { Route } from "./+types/temas.$slug";

import { ArticleCard } from "@/components/editorial/ArticleCard";
import { SURFACE } from "@/components/editorial/surface";
import DefaultLayout from "@/layouts/DefaultLayout";
import { TERRITORIES, territoryHref } from "@/lib/editorial";
import { getPosts } from "@/lib/posts.server";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export function loader({ params }: Route.LoaderArgs) {
	const i = TERRITORIES.findIndex((t) => t.slug === params.slug);
	if (i < 0) throw data(null, { status: 404 });
	const territory = TERRITORIES[i];
	return {
		territory,
		posts: getPosts().filter((p) => p.territory.slug === territory.slug),
		prev: TERRITORIES[i - 1] ?? null,
		next: TERRITORIES[i + 1] ?? null,
	};
}

export const meta: Route.MetaFunction = ({ data: d, location }) =>
	seo({
		title: d?.territory.name,
		description: d ? `${d.territory.name} (${d.territory.role}): ${d.territory.question}` : undefined,
		pathname: location.pathname,
	});

const pill = "bg-background rounded-full border border-[var(--border-default)] px-3 py-1 text-sm";

export default function Page({ loaderData }: Route.ComponentProps) {
	const { territory, posts, prev, next } = loaderData;
	return (
		<DefaultLayout>
			<section className="container pt-12 pb-10 lg:pt-20" aria-labelledby="tema-title">
				<p className="rc-eyebrow">
					<a href="/temas/" className="hover:text-foreground">
						Temas
					</a>{" "}
					/ {territory.id} · {territory.role}
				</p>
				<h1 id="tema-title" className="rc-display mt-4 text-5xl sm:text-6xl lg:text-7xl">
					{territory.name}
				</h1>
				<p className="rc-lead mt-5 max-w-2xl text-xl sm:text-2xl">{territory.question}</p>
			</section>

			<section className="container grid gap-4 md:grid-cols-2" aria-label="Escopo do território">
				<div className={cn(SURFACE, "p-6")}>
					<p className="rc-eyebrow">Inclui</p>
					<ul className="mt-4 flex flex-wrap gap-2">
						{territory.includes.map((x) => (
							<li key={x} className={pill}>
								{x}
							</li>
						))}
					</ul>
				</div>
				<div className={cn(SURFACE, "p-6")}>
					<p className="rc-eyebrow">Não confundir com</p>
					<ul className="mt-4 flex flex-wrap gap-2">
						{territory.notToConfuse.map((x) => (
							<li key={x} className={pill}>
								{x}
							</li>
						))}
					</ul>
				</div>
			</section>

			<section className="container mt-14" aria-labelledby="tema-artigos">
				<h2 id="tema-artigos" className="rc-title text-2xl sm:text-3xl">
					Artigos neste tema
				</h2>
				{posts.length > 0 ? (
					<div className="mt-6 grid gap-4 md:grid-cols-2">
						{posts.map((p) => (
							<ArticleCard key={p.id} post={p} variant="compact" />
						))}
					</div>
				) : (
					<p className="text-muted-foreground mt-4">Ainda não há artigos publicados neste território.</p>
				)}
			</section>

			<nav
				className="container mt-16 flex flex-wrap justify-between gap-4 border-t border-[var(--border-default)] pt-8"
				aria-label="Territórios vizinhos"
			>
				{prev ? (
					<a href={territoryHref(prev)} className="rc-link inline-flex items-center gap-2">
						<ArrowLeft className="size-4" aria-hidden="true" /> {prev.name}
					</a>
				) : (
					<span />
				)}
				{next && (
					<a href={territoryHref(next)} className="rc-link inline-flex items-center gap-2">
						{next.name} <ArrowRight className="size-4" aria-hidden="true" />
					</a>
				)}
			</nav>
		</DefaultLayout>
	);
}
