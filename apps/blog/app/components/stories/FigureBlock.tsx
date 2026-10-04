// Figura do artigo (handoff): imagem larga (1078,5 px) ou na coluna de leitura (637,5 px), com legenda de
// 14/22,96 centrada abaixo. Imagem sempre com width/height, `alt` e srcset; só a de abertura é eager.
import type { Media } from "@/data/article-media";
import { cn } from "@/lib/utils";

export function FigureBlock({
	media,
	caption,
	variant = "wide",
	eager = false,
}: {
	media: Media;
	caption?: string;
	variant?: "wide" | "reading";
	eager?: boolean;
}) {
	return (
		<figure
			className={cn(
				"stories-container mt-[var(--ref-section-gap)]",
			)}
		>
			<div className={cn("mx-auto", variant === "wide" ? "max-w-[var(--ref-wide-width)]" : "max-w-[var(--ref-reading-width)]")}>
				<img
					src={media.src}
					srcSet={media.srcSet}
					sizes={media.sizes}
					width={media.width}
					height={media.height}
					alt={media.alt}
					loading={eager ? "eager" : "lazy"}
					className="aspect-video w-full object-contain"
				/>
				{caption && <figcaption className="stories-caption mt-3 text-center">{caption}</figcaption>}
			</div>
		</figure>
	);
}
