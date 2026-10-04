// Hero do artigo (handoff): título (802 px de caixa) e subtítulo (596 px) centralizados, em h1 de 61,6864/62,0103.
// A referência usa foto escurecida de ponta a ponta com título branco. Aqui a arte é ilustração sobre fundo
// branco, então o hero é CLARO: texto escuro e a ilustração logo abaixo, na largura "larga" (1078,5 px).
// Divergência registrada em docs/audit/aud-web-002.
import { ArtImage } from "./ArtImage";

import type { ArtDirected } from "@/data/article-media";

export function ArticleHero({
	title,
	lead,
	media,
	eyebrow,
}: {
	title: string;
	lead: string;
	media: ArtDirected;
	/** Onde estou (RQ-052): o pilar do artigo. */
	eyebrow?: string;
}) {
	return (
		<header className="stories-container pt-[var(--ref-section-gap)]" data-article-hero>
			<div className="rc-hero-reveal mx-auto flex max-w-[var(--ref-hero-title-w)] flex-col items-center gap-6 text-center">
				{eyebrow && <p className="stories-meta text-muted-foreground">{eyebrow}</p>}
				<h1 className="stories-h1">{title}</h1>
				{/* max-width inline: a regra global de medida (68ch, fora de camada) venceria uma classe utilitária */}
				<p className="stories-body text-muted-foreground" style={{ maxWidth: "var(--ref-hero-lead-w)" }} data-article-lead>
					{lead}
				</p>
			</div>
			{/* Todo artigo tem imagem (DEC-U7, RQ-032): retrato 9:16 até 100svh no mobile, 16:9 largo no desktop.
			    Art direction por <picture>; as duas composições foram recompostas sem cortar (scripts/rc-images.mjs). */}
			<figure className="mx-auto mt-[var(--ref-section-gap)] max-w-[var(--ref-wide-width)] max-md:mt-12" data-article-image>
				<ArtImage media={media} priority />
			</figure>
		</header>
	);
}
