// Cabeçalho do artigo na arquitetura Editorial Hybrid v4 (ADR-22): centrado em 900 px, rótulo do pilar em mono, título
// em 46,8432 (peso 500), lead em 21 e a linha de metadados; a ilustração vem logo abaixo, na largura larga (1078,5).
import { ArtImage } from "./ArtImage";

import type { ArtDirected } from "@/data/article-media";

export function ArticleHero({
	title,
	lead,
	media,
	eyebrow,
	meta,
}: {
	title: string;
	lead: string;
	media: ArtDirected;
	/** Onde estou (RQ-052): o pilar do artigo. */
	eyebrow?: string;
	/** ID do conteúdo e data, em mono. */
	meta?: string;
}) {
	return (
		<header className="px-[var(--ref-gutter)] pt-[var(--hy-section)]" data-article-hero>
			<div className="hy-article-header rc-hero-reveal">
				{eyebrow && <p className="hy-eyebrow">{eyebrow}</p>}
				<h1>{title}</h1>
				<p className="hy-lead" data-article-lead>
					{lead}
				</p>
				{meta && (
					<p className="hy-eyebrow mt-6" data-article-meta>
						{meta}
					</p>
				)}
			</div>
			{/* Todo artigo tem imagem (DEC-U7, RQ-032): retrato 9:16 até 100svh no mobile, 16:9 largo no desktop. */}
			<figure className="mx-auto max-w-[var(--hy-shell)]" data-article-image>
				<ArtImage media={media} priority />
			</figure>
		</header>
	);
}
