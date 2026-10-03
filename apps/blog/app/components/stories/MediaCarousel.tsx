// Carrossel de imagens (handoff): slide central de 1136 px com as bordas dos vizinhos visíveis, setas de 32 px
// (cápsula) acima à direita do centro e legenda abaixo. Rolagem nativa com scroll-snap; as setas usam
// scrollBy e têm nome acessível. Sem autoplay; reduced-motion respeitado (behavior "auto").
import { useRef } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import type { Media } from "@/data/article-media";

export type Slide = { media: Media; caption?: string };

export function MediaCarousel({ label, slides }: { label: string; slides: Slide[] }) {
	const track = useRef<HTMLUListElement>(null);
	const go = (dir: -1 | 1) => {
		const el = track.current;
		if (!el) return;
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: reduce ? "auto" : "smooth" });
	};
	const btn =
		"text-foreground/60 hover:text-foreground focus-visible:ring-ring/50 inline-flex size-8 items-center justify-center rounded-full outline-none focus-visible:ring-[3px]";
	return (
		<section aria-roledescription="carrossel" aria-label={label} className="mt-[var(--ref-section-gap)]">
			<div className="mb-4 flex justify-center gap-0">
				<button type="button" className={btn} aria-label="Slide anterior" onClick={() => go(-1)}>
					<ChevronLeft className="size-5" aria-hidden="true" />
				</button>
				<button type="button" className={btn} aria-label="Próximo slide" onClick={() => go(1)}>
					<ChevronRight className="size-5" aria-hidden="true" />
				</button>
			</div>
			<ul
				ref={track}
				tabIndex={0}
				aria-label={`${label}: slides`}
				className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-[calc((100%-min(1136px,100%-2*var(--ref-gutter)))/2)] [scroll-padding-inline:calc((100%-min(1136px,100%-2*var(--ref-gutter)))/2)]"
			>
				{slides.map((s, i) => (
					<li
						key={s.media.src + i}
						className="w-[min(1136px,100%-2*var(--ref-gutter))] shrink-0 snap-center"
						aria-roledescription="slide"
						aria-label={`${i + 1} de ${slides.length}`}
					>
						<img
							src={s.media.src}
							srcSet={s.media.srcSet}
							sizes="(min-width: 1200px) 1136px, 100vw"
							width={s.media.width}
							height={s.media.height}
							alt={s.media.alt}
							loading="lazy"
							className="aspect-video w-full object-contain"
						/>
						{s.caption && <p className="stories-caption mx-auto mt-3 max-w-[524px] text-center">{s.caption}</p>}
					</li>
				))}
			</ul>
		</section>
	);
}
