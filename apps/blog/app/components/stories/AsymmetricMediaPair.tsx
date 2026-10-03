// Par assimétrico de imagens (handoff): a maior (638 px) à esquerda e a menor (307 px) à direita, alinhadas pelo
// centro, cada uma com a própria legenda. Empilha no celular.
import type { Media } from "@/data/article-media";

type Item = { media: Media; caption?: string };

export function AsymmetricMediaPair({ left, right }: { left: Item; right: Item }) {
	const fig = (i: Item, className: string) => (
		<figure className={className}>
			<img
				src={i.media.src}
				srcSet={i.media.srcSet}
				sizes="(min-width: 1024px) 638px, 100vw"
				width={i.media.width}
				height={i.media.height}
				alt={i.media.alt}
				loading="lazy"
				className="aspect-video w-full object-contain"
			/>
			{i.caption && <figcaption className="stories-caption mt-3">{i.caption}</figcaption>}
		</figure>
	);
	return (
		<div className="stories-container mt-[var(--ref-section-gap)]">
			<div className="mx-auto grid max-w-[var(--ref-wide-width)] items-center gap-8 lg:grid-cols-[638px_307px] lg:justify-between">
				{fig(left, "")}
				{fig(right, "")}
			</div>
		</div>
	);
}
