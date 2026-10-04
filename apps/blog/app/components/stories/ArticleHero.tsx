// Hero do artigo (handoff): título (802 px de caixa) e subtítulo (596 px) centralizados, em h1 de 61,6864/62,0103.
// A referência usa foto escurecida de ponta a ponta com título branco. Aqui a arte é ilustração sobre fundo
// branco, então o hero é CLARO: texto escuro e a ilustração logo abaixo, na largura "larga" (1078,5 px).
// Divergência registrada em docs/audit/aud-web-002.
import type { Media } from "@/data/article-media";

export function ArticleHero({ title, lead, media }: { title: string; lead: string; media: Media | null }) {
	return (
		<header className="stories-container pt-[var(--ref-section-gap)]" data-article-hero>
			<div className="mx-auto flex max-w-[var(--ref-hero-title-w)] flex-col items-center gap-6 text-center">
				<h1 className="stories-h1">{title}</h1>
				{/* max-width inline: a regra global de medida (68ch, fora de camada) venceria uma classe utilitária */}
				<p className="stories-body text-muted-foreground" style={{ maxWidth: "var(--ref-hero-lead-w)" }}>
					{lead}
				</p>
			</div>
			{media && (
				<div className="mx-auto mt-[var(--ref-section-gap)] max-w-[var(--ref-wide-width)]">
					<img
						src={media.src}
						srcSet={media.srcSet}
						sizes={media.sizes}
						width={media.width}
						height={media.height}
						alt={media.alt}
						fetchPriority="high"
						className="aspect-video w-full object-contain"
					/>
				</div>
			)}
		</header>
	);
}
