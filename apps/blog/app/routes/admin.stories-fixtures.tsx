// Fixtures de comparação (RC-FRONT-001): a composição completa da Home e os blocos de artigo do handoff com
// DADOS SINTÉTICOS, para validar grade, destaque, paginação e blocos que o conteúdo real ainda não usa
// (citação, carrossel, par assimétrico, figura, CTA). Interna, noindex; nada daqui vira conteúdo do site.
import type { Route } from "./+types/admin.stories-fixtures";

import { AsymmetricMediaPair } from "@/components/stories/AsymmetricMediaPair";
import { ClosingCTA } from "@/components/stories/ClosingCTA";
import { FigureBlock } from "@/components/stories/FigureBlock";
import { MediaCarousel } from "@/components/stories/MediaCarousel";
import { QuoteBlock } from "@/components/stories/QuoteBlock";
import { StoriesHome } from "@/components/stories/StoriesHome";
import { ARTICLE_MEDIA, SHARE_IMAGE } from "@/data/article-media";
import DefaultLayout from "@/layouts/DefaultLayout";
import type { StoryView } from "@/lib/articles";
import { seo } from "@/lib/seo";

const IMAGES = [ARTICLE_MEDIA["risco-cognitivo"].card, SHARE_IMAGE];
const CATEGORIES = ["Categoria A", "Categoria B", "Categoria C"];

const FIXTURES: StoryView[] = Array.from({ length: 22 }, (_, i) => {
	const n = String(i + 1).padStart(2, "0");
	return {
		slug: `fixture-${n}`,
		href: "#fixtures",
		title: `Título sintético ${n}: uma história com título de duas ou três linhas para medir quebra`,
		description: "Descrição sintética.",
		category: CATEGORIES[i % CATEGORIES.length],
		date: `2026-${String(12 - (i % 12)).padStart(2, "0")}-${String((i % 27) + 1).padStart(2, "0")}`,
		card: IMAGES[i % IMAGES.length],
		hero: IMAGES[i % IMAGES.length],
	};
});

export const meta: Route.MetaFunction = ({ location }) =>
	seo({
		title: "Fixtures Stories",
		description: "Composição de comparação com dados sintéticos.",
		pathname: location.pathname,
		noindex: true,
	});

export default function StoriesFixtures() {
	const [a, b] = IMAGES;
	return (
		<DefaultLayout>
			<div className="stories-container pt-8">
				<p className="rc-eyebrow">
					<a href="/admin/" className="hover:underline">
						Painel
					</a>{" "}
					/ Fixtures Stories
				</p>
				<p className="stories-caption text-muted-foreground mt-1">Dados sintéticos: nada daqui é conteúdo do site.</p>
			</div>
			<section aria-label="Home (fixture)">
				<StoriesHome stories={FIXTURES} title="Artigos (fixture)" />
			</section>
			<section aria-label="Blocos de artigo (fixture)" className="pb-[var(--ref-section-gap)]">
				<QuoteBlock text="Citação sintética para medir o bloco de citação centralizado." attribution="Atribuição sintética" />
				<MediaCarousel
					label="Carrossel sintético"
					slides={[
						{ media: a, caption: "Legenda sintética do primeiro slide." },
						{ media: b, caption: "Legenda sintética do segundo slide." },
						{ media: a, caption: "Legenda sintética do terceiro slide." },
					]}
				/>
				<AsymmetricMediaPair
					left={{ media: a, caption: "Legenda sintética da imagem maior." }}
					right={{ media: b, caption: "Legenda sintética da imagem menor." }}
				/>
				<FigureBlock media={b} caption="Legenda sintética da imagem larga." />
				<ClosingCTA
					title="Título sintético do CTA final"
					description="Texto de apoio sintético."
					links={[
						{ label: "Ação principal", href: "#fixtures", primary: true },
						{ label: "Ação secundária", href: "#fixtures" },
					]}
				/>
			</section>
		</DefaultLayout>
	);
}
