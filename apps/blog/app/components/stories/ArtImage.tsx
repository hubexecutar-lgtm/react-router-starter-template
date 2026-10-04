// Ilustração com art direction (LANC-001 RQ-032/033): retrato 9:16 no mobile, 16:9 no desktop, width/height
// explícitos (sem CLS). `priority` só na primeira dobra; o resto carrega sob demanda.
import type { ArtDirected } from "@/data/article-media";
import { cn } from "@/lib/utils";

export function ArtImage({ media, priority = false, className }: { media: ArtDirected; priority?: boolean; className?: string }) {
	return (
		<picture>
			<source
				media="(max-width: 767px)"
				srcSet={media.portrait.srcSet}
				sizes={media.portrait.sizes}
				width={media.portrait.width}
				height={media.portrait.height}
			/>
			<img
				src={media.landscape.src}
				srcSet={media.landscape.srcSet}
				sizes={media.landscape.sizes}
				width={media.landscape.width}
				height={media.landscape.height}
				alt={media.landscape.alt}
				fetchPriority={priority ? "high" : undefined}
				loading={priority ? "eager" : "lazy"}
				decoding="async"
				className={cn("aspect-video w-full object-contain max-md:mx-auto max-md:aspect-[9/16] max-md:max-h-[100svh] max-md:w-auto", className)}
			/>
		</picture>
	);
}
