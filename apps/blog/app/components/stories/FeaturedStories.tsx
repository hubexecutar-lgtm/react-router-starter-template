// Bloco editorial da Home (handoff): destaque de três colunas à esquerda e até três histórias empilhadas na
// quarta coluna. NÃO é uma grade de cards iguais: o espaço em branco sob o destaque faz parte da composição.
import { StoryCard } from "./StoryCard";

import type { StoryView } from "@/lib/articles";

export function FeaturedStories({ featured, stack }: { featured: StoryView; stack: StoryView[] }) {
	return (
		<div className="grid gap-x-[var(--ref-grid-gap)] gap-y-[var(--ref-card-gap-y)] lg:grid-cols-4" data-featured-stories>
			<div className="lg:col-span-3">
				<StoryCard story={featured} size="feature" headingLevel={2} priority />
			</div>
			{stack.length > 0 && (
				<div className="flex flex-col gap-[var(--ref-card-gap-y)] sm:grid sm:grid-cols-2 lg:col-span-1 lg:flex">
					{stack.map((s) => (
						<StoryCard key={s.slug} story={s} />
					))}
				</div>
			)}
		</div>
	);
}
