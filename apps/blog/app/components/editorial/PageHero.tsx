// Hero das páginas (anatomia Apple Developer Programs, ADR-12): eyebrow, h1, lead curto e ações
// à esquerda; à direita a arte — ilustração sem texto do banco ou só o halftone orgânico.
// No mobile a arte vira uma faixa compacta abaixo do texto (nunca atrás dele).
import type { ReactNode } from "react";

import { HeroArt, type HeroImage } from "./HeroArt";

export function PageHero({
	eyebrow,
	title,
	lead,
	id = "page-title",
	image,
	seed = 5,
	children,
}: {
	eyebrow: string;
	title: string;
	lead?: string;
	id?: string;
	/** Ilustração sem texto (`IMAGES` em HeroArt); sem ela, só o halftone. */
	image?: HeroImage;
	seed?: number;
	children?: ReactNode;
}) {
	return (
		<section className="container pt-12 pb-10 lg:pt-20" aria-labelledby={id}>
			<div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-16 [&>*]:min-w-0">
				<div className="rc-hero-reveal">
					<p className="rc-eyebrow">{eyebrow}</p>
					<h1 id={id} className="rc-display mt-4 text-[clamp(2.25rem,11vw,3rem)] hyphens-auto sm:text-6xl lg:text-7xl">
						{title}
					</h1>
					{lead && <p className="rc-lead mt-5 text-lg sm:text-xl">{lead}</p>}
					{children}
				</div>
				<HeroArt
					image={image}
					seed={seed}
					className={image ? "w-full max-lg:max-w-md" : "w-full max-lg:aspect-[6/1] max-lg:max-h-24"}
				/>
			</div>
		</section>
	);
}
