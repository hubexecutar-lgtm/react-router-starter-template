// Card de artigo = tile do Editorial Hybrid v4 (ADR-22): superfície Subtle, raio 2, padding 48, à esquerda; a
// ilustração 16:9 no topo, o rótulo do pilar em mono, o título (36, peso 500), o lead e "Ler artigo ↗" no pé.
// O tile inteiro é UM link (o título), esticado por ::after; nenhum link dentro de outro link; sem sombra.
import { PILLARS } from "@/data/article-meta";
import type { StoryView } from "@/lib/articles";

export function StoryMeta({ story, className }: { story: StoryView; className?: string }) {
	const parts = [story.category, story.date ? formatDate(story.date) : null].filter(Boolean);
	if (!parts.length) return null;
	return <p className={className}>{parts.join(" · ")}</p>;
}

/** AAAA-MM-DD → "9 de set. de 2026" (pt-BR, como na referência). */
export function formatDate(iso: string) {
	return new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(
		new Date(`${iso}T00:00:00Z`),
	);
}

/** Rótulo do tile: "P1 — Riscos Cognitivos" (pilar do RC-LP-001) ou a categoria. */
export function storyEyebrow(story: StoryView) {
	const pillar = story.pillar ? PILLARS[story.pillar] : null;
	return pillar ? `${story.pillar.toUpperCase()} — ${pillar.label}` : story.category;
}

export function StoryCard({
	story,
	headingLevel = 3,
	priority = false,
}: {
	story: StoryView;
	headingLevel?: 2 | 3;
	/** Imagem acima da dobra: carrega cedo (LCP). */
	priority?: boolean;
}) {
	const H = `h${headingLevel}` as "h2" | "h3";
	const media = story.card;
	return (
		<article className="hy-tile group" data-story-card data-category={story.category}>
			{media && (
				<div className="hy-tile-media aspect-video">
					<img
						src={media.src}
						srcSet={media.srcSet}
						sizes="(min-width: 1024px) 520px, 100vw"
						width={media.width}
						height={media.height}
						alt={media.alt}
						loading={priority ? "eager" : "lazy"}
						fetchPriority={priority ? "high" : "auto"}
						className="size-full object-cover"
					/>
				</div>
			)}
			<p className="hy-eyebrow">{storyEyebrow(story)}</p>
			<H>
				<a href={story.href} className="after:absolute after:inset-0 focus-visible:underline focus-visible:outline-none">
					{story.title}
				</a>
			</H>
			{story.description && <p>{story.description}</p>}
			<span className="hy-more group-hover:underline" aria-hidden="true">
				Ler artigo ↗
			</span>
		</article>
	);
}
