// Card de história (handoff OPENAI-STORIES-DESIGN-001). Dois tamanhos:
//  - "small": imagem quadrada (306,75 px no desktop), título e linha de metadados;
//  - "feature": imagem 16:9 (968,25 × 544,64), título no tamanho do h2 e metadados.
// O card inteiro é UM link (o título), esticado por ::after; nenhum link dentro de outro link.
// Sem sombra nem contorno nos cards editoriais (handoff); foco visível no link do título.
import type { StoryView } from "@/lib/articles";
import { cn } from "@/lib/utils";

export function StoryMeta({ story, className }: { story: StoryView; className?: string }) {
	const parts = [story.category, story.date ? formatDate(story.date) : null].filter(Boolean);
	if (!parts.length) return null;
	return <p className={cn("stories-meta", className)}>{parts.join(" · ")}</p>;
}

/** AAAA-MM-DD → "9 de set. de 2026" (pt-BR, como na referência). */
export function formatDate(iso: string) {
	return new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(
		new Date(`${iso}T00:00:00Z`),
	);
}

export function StoryCard({
	story,
	size = "small",
	headingLevel = 3,
	priority = false,
}: {
	story: StoryView;
	size?: "small" | "feature";
	headingLevel?: 2 | 3;
	/** Imagem acima da dobra: carrega cedo (LCP). */
	priority?: boolean;
}) {
	const H = `h${headingLevel}` as "h2" | "h3";
	const media = story.card;
	const feature = size === "feature";
	return (
		<article className="group relative flex flex-col" data-story-card={size}>
			<div
				className={cn(
					"overflow-hidden rounded-[var(--ref-control-radius)] bg-[var(--surface-subtle)]",
					feature ? "aspect-video w-full" : "aspect-square w-full",
				)}
			>
				{media && (
					<img
						src={media.src}
						srcSet={media.srcSet}
						sizes={feature ? "(min-width: 1024px) 968px, 100vw" : "(min-width: 1024px) 307px, 50vw"}
						width={media.width}
						height={media.height}
						alt={media.alt}
						loading={priority ? "eager" : "lazy"}
						fetchPriority={priority ? "high" : "auto"}
						className="size-full object-cover"
					/>
				)}
			</div>
			<H
				className={cn(
					feature
						? "stories-h2 mt-[var(--ref-grid-gap)]"
						: "mt-4 text-[17.8554px] leading-[23.4881px] font-normal tracking-[-0.178554px] text-balance",
				)}
			>
				<a
					href={story.href}
					className="after:absolute after:inset-0 focus-visible:underline focus-visible:outline-none"
				>
					{story.title}
				</a>
			</H>
			<StoryMeta story={story} className={feature ? "mt-[var(--ref-grid-gap)]" : "mt-4"} />
		</article>
	);
}
