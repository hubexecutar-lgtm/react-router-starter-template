// Página de artigo (mood board 03): eyebrow território/tipo, título display, lead, meta mono,
// corpo em prosa e coluna lateral com pergunta do território, leitura seguinte, assuntos e evidências.
import { ChevronRight } from "lucide-react";
import { data } from "react-router";

import type { Route } from "./+types/blog.$slug";

import { ArticleMeta } from "@/components/editorial/ArticleMeta";
import { EvidenceTable } from "@/components/editorial/EvidenceTable";
import { SURFACE, SURFACE_LINK } from "@/components/editorial/surface";
import { AsciiDiagram, PlainTextPanel } from "@/components/plain";
import { Callout } from "@/components/ui/callout";
import DefaultLayout from "@/layouts/DefaultLayout";
import { getPostContent } from "@/lib/content";
import { evidenceFor, territoryHref } from "@/lib/editorial";
import { formatDate, typeLabel } from "@/lib/posts";
import { getPosts } from "@/lib/posts.server";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export function loader({ params }: Route.LoaderArgs) {
	const all = getPosts();
	const post = all.find((p) => p.id === params.slug);
	if (!post) throw data(null, { status: 404 });
	const byOrder = [...all].sort(
		(a, b) => a.territory.order - b.territory.order || a.pubDate.valueOf() - b.pubDate.valueOf(),
	);
	const idx = byOrder.findIndex((p) => p.id === post.id);
	const next = [...byOrder.slice(idx + 1), ...byOrder.slice(0, idx)].slice(0, 2);
	return { post, next };
}

export const meta: Route.MetaFunction = ({ data: d, location }) =>
	seo({
		title: d ? (d.post.seoTitle ?? d.post.title) : undefined,
		description: d?.post.description,
		image: d?.post.image,
		pathname: location.pathname,
	});

export default function Page({ loaderData, params }: Route.ComponentProps) {
	const { post, next } = loaderData;
	const Content = getPostContent(params.slug)!;
	const evidence = evidenceFor(post.evidence);

	return (
		<DefaultLayout>
			<article className="container pt-10 lg:pt-16" aria-labelledby="article-title">
				<div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
					<div className="min-w-0">
						<header>
							<p className="rc-eyebrow flex flex-wrap gap-2">
								<a href={territoryHref(post.territory)} className="text-primary hover:underline">
									{post.territory.name}
								</a>
								<span aria-hidden="true">/</span>
								<span className="text-primary">{typeLabel(post.type)}</span>
							</p>
							<h1 id="article-title" className="rc-display mt-4 text-4xl sm:text-5xl lg:text-6xl">
								{post.title}
							</h1>
							<p className="rc-lead mt-6 text-lg sm:text-xl">{post.description}</p>
							<ArticleMeta post={post} className="mt-6" />
							{post.updatedDate && <p className="rc-meta mt-2">Atualizado em {formatDate(post.updatedDate)}</p>}
							{post.image && (
								<img
									src={post.image}
									alt={post.imageAlt ?? ""}
									className="mt-8 aspect-[16/9] w-full rc-cell object-cover"
								/>
							)}
						</header>

						<div className="rc-prose prose prose-lg dark:prose-invert mt-10 max-w-[var(--editorial-measure)]">
							<Content components={{ AsciiDiagram, PlainTextPanel, Callout }} />
						</div>

						{evidence.length > 0 && (
							<section className="mt-14" aria-labelledby="evidencias-artigo">
								<p className="rc-eyebrow">Evidências do banco editorial</p>
								<h2 id="evidencias-artigo" className="rc-title mt-2 text-2xl">
									Fontes citadas neste artigo
								</h2>
								<div className="mt-6">
									<EvidenceTable items={evidence} caption={`Evidências citadas em ${post.title}`} compact />
								</div>
								<p className="text-muted-foreground mt-3 text-sm">
									Registros completos em{" "}
									<a href="/evidencias/" className="rc-link">
										Evidências
									</a>
									.
								</p>
							</section>
						)}
					</div>

					<aside className="flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start" aria-label="Contexto do artigo">
						<div className={cn(SURFACE, "p-6")}>
							<p className="rc-eyebrow text-primary">Pergunta do território</p>
							<p className="rc-title mt-3 text-2xl">{post.territory.question}</p>
							<p className="text-muted-foreground mt-3 text-sm">
								{post.territory.name} · {post.territory.role}. Não confundir com:{" "}
								{post.territory.notToConfuse.join(", ")}.
							</p>
						</div>

						{next.length > 0 && (
							<nav aria-labelledby="leia-tambem">
								<p id="leia-tambem" className="rc-eyebrow">
									Leia também
								</p>
								<ul className="mt-4 flex flex-col gap-3">
									{next.map((p) => (
										<li key={p.id}>
											<a href={p.href} className={cn("group flex items-start justify-between gap-3 p-4", SURFACE_LINK)}>
												<span>
													<span className="rc-eyebrow text-primary block">{p.territory.short}</span>
													<span className="rc-title mt-1.5 block text-base">{p.title}</span>
													<span className="rc-meta mt-2 block">{p.minutes} min</span>
												</span>
												<ChevronRight className="text-primary mt-1 size-4 shrink-0" aria-hidden="true" />
											</a>
										</li>
									))}
								</ul>
							</nav>
						)}

						{post.tags.length > 0 && (
							<div>
								<p className="rc-eyebrow">Assuntos</p>
								<ul className="mt-4 flex flex-wrap gap-2">
									{post.tags.map((tag) => (
										<li key={tag}>
											<a
												href={`/buscar/?q=${encodeURIComponent(tag)}`}
												className="text-foreground inline-flex h-8 items-center rounded-full bg-[var(--surface-hover)] px-3 text-sm transition-colors hover:bg-[var(--surface-selected)]"
											>
												{tag}
											</a>
										</li>
									))}
								</ul>
							</div>
						)}
					</aside>
				</div>
			</article>
		</DefaultLayout>
	);
}
