// Card de artigo em três variantes (mood boards 01, 02 e 04). Consome PostView, nunca copy fixa.
import { ArrowRight } from "lucide-react";

import { ArticleMeta } from "./ArticleMeta";
import { SURFACE_LINK } from "./surface";

import { type PostView, typeLabel } from "@/lib/posts";
import { cn } from "@/lib/utils";

export function ArticleCard({
	post,
	variant = "compact",
	index,
	headingLevel = 3,
}: {
	post: PostView;
	variant?: "feature" | "row" | "compact";
	index?: number;
	headingLevel?: 2 | 3;
}) {
	const H = `h${headingLevel}` as "h2" | "h3";

	if (variant === "feature") {
		return (
			<article className="group relative" data-territory={post.territory.slug}>
				{post.image && (
					<div className="overflow-hidden rounded-[var(--surface-radius-card)] border border-[var(--border-default)]">
						<img src={post.image} alt="" className="aspect-[16/9] w-full object-cover" loading="lazy" />
					</div>
				)}
				<p className="rc-eyebrow mt-6 flex flex-wrap items-center gap-3">
					<span className="text-primary">Artigo em destaque</span>
					<span aria-hidden="true" className="h-3 border-l border-[var(--border-strong)]"></span>
					<a href={`/temas/${post.territory.slug}/`} className="hover:text-foreground relative z-10">
						{post.territory.name}
					</a>
				</p>
				<H className="rc-display mt-3 text-4xl sm:text-5xl">
					<a href={post.href} className="after:absolute after:inset-0 focus-visible:underline">
						{post.title}
					</a>
				</H>
				<p className="rc-lead mt-4 max-w-2xl text-lg">{post.description}</p>
				<div className="mt-6 flex flex-wrap items-center justify-between gap-4">
					<ArticleMeta post={post} />
					<span className="rc-link inline-flex items-center gap-1.5 group-hover:underline">
						Ler artigo <ArrowRight className="size-4" aria-hidden="true" />
					</span>
				</div>
			</article>
		);
	}

	if (variant === "row") {
		return (
			<article
				className="group relative grid grid-cols-[3rem_1fr] gap-4 border-b border-[var(--border-default)] py-6 sm:grid-cols-[4rem_1fr]"
				data-territory={post.territory.slug}
			>
				<p
					className="rc-title text-muted-foreground-subtle border-r border-[var(--border-default)] text-3xl font-light tabular-nums sm:text-4xl"
					aria-hidden="true"
				>
					{String(index ?? 0).padStart(2, "0")}
				</p>
				<div>
					<p className="rc-eyebrow">{post.territory.name}</p>
					<H className="rc-title mt-2 text-xl sm:text-2xl">
						<a href={post.href} className="after:absolute after:inset-0 focus-visible:underline">
							{post.title}
						</a>
					</H>
					<div className="mt-3 flex flex-wrap items-center justify-between gap-3">
						<ArticleMeta post={post} />
						<span className="rc-link inline-flex items-center gap-1.5 text-sm group-hover:underline">
							Ler artigo <ArrowRight className="size-4" aria-hidden="true" />
						</span>
					</div>
				</div>
			</article>
		);
	}

	return (
		<article className={cn("group relative flex h-full gap-4 p-4", SURFACE_LINK)} data-territory={post.territory.slug}>
			{post.image && (
				<img src={post.image} alt="" className="size-24 shrink-0 rounded-[var(--radius-md)] object-cover sm:size-28" loading="lazy" />
			)}
			<div className="flex min-w-0 flex-col">
				<p className="rc-eyebrow text-primary">
					{typeLabel(post.type)} · {post.territory.role}
				</p>
				<H className="rc-title mt-2 text-lg">
					<a
						href={post.href}
						className="after:absolute after:inset-0 after:rounded-[var(--surface-radius-card)] focus-visible:underline"
					>
						{post.title}
					</a>
				</H>
				<p className="text-muted-foreground mt-1.5 line-clamp-3 text-sm leading-relaxed">{post.description}</p>
				<ArticleMeta post={post} showId={false} className="mt-auto pt-3" />
			</div>
		</article>
	);
}
