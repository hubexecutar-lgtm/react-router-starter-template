// Grade inferior da Home (handoff): quatro colunas no desktop (cards de 306,75 px, gap de 24 px), duas no
// tablet e uma no celular (proposta responsiva, ainda sem medida na referência).
import { StoryCard } from "./StoryCard";

import type { StoryView } from "@/lib/articles";

export function StoryGrid({ stories }: { stories: StoryView[] }) {
	if (!stories.length) return null;
	return (
		<ul
			className="grid gap-x-[var(--ref-grid-gap)] gap-y-[var(--ref-card-gap-y)] sm:grid-cols-2 lg:grid-cols-4"
			data-story-grid
		>
			{stories.map((s) => (
				<li key={s.slug}>
					<StoryCard story={s} />
				</li>
			))}
		</ul>
	);
}
