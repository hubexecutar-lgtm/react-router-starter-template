// Home "Stories" (handoff OPENAI-STORIES-DESIGN-001): título, barra de categorias/ordenação, bloco editorial
// (destaque + pilha), grade de quatro colunas e "Carregar mais". Recebe as histórias por props, então a
// mesma composição serve à Home real e à página de fixtures (/admin/stories-fixtures/).
// Medidas desktop (1363 px): título em y=152, barra em y=222, destaque em y=326; cada gap vem de tokens --ref-*.
import { useMemo, useState } from "react";

import { useSearchParams } from "react-router";

import { FeaturedStories } from "./FeaturedStories";
import { LoadMore } from "./LoadMore";
import { StoriesToolbar, type SortKey } from "./StoriesToolbar";
import { StoryGrid } from "./StoryGrid";

import { PROBLEMS, type ProblemId } from "@/data/article-meta";
import type { StoryView } from "@/lib/articles";

const FIRST_BATCH = 16; // destaque + 3 empilhadas + 12 na grade (lote inicial da referência)
const STEP = 12;
const ALL_SORTS: SortKey[] = ["date_desc", "date_asc", "title_asc", "title_desc"];

function sortStories(list: StoryView[], sort: SortKey) {
	const byTitle = (a: StoryView, b: StoryView) => a.title.localeCompare(b.title, "pt-BR");
	// desempate por slug: paginação estável, sem duplicar cards
	const tie = (a: StoryView, b: StoryView) => a.slug.localeCompare(b.slug);
	const byDate = (a: StoryView, b: StoryView) => (a.date ?? "").localeCompare(b.date ?? "");
	const out = [...list];
	if (sort === "title_asc") return out.sort((a, b) => byTitle(a, b) || tie(a, b));
	if (sort === "title_desc") return out.sort((a, b) => byTitle(b, a) || tie(a, b));
	if (sort === "date_asc") return out.sort((a, b) => byDate(a, b) || tie(a, b));
	return out.sort((a, b) => byDate(b, a) || tie(a, b));
}

export function StoriesHome({
	stories,
	title = "Artigos",
	problems = false,
}: {
	stories: StoryView[];
	title?: string;
	/** Mostra os chips de problema (RQ-054); a página de fixtures não usa. */
	problems?: boolean;
}) {
	const [params, setParams] = useSearchParams();
	const [visible, setVisible] = useState(FIRST_BATCH);

	const categories = useMemo(() => [...new Set(stories.map((s) => s.category))], [stories]);
	const hasDates = stories.some((s) => s.date);
	const sorts = hasDates ? ALL_SORTS : ALL_SORTS.filter((k) => k.startsWith("title"));
	const defaultSort: SortKey = hasDates ? "date_desc" : "title_asc";

	const cat = params.get("categoria") ?? "";
	const active = categories.includes(cat) ? cat : "";
	const asked = params.get("ordem") as SortKey | null;
	const sort = asked && sorts.includes(asked) ? asked : defaultSort;

	const askedProblem = params.get("problema") ?? "";
	const problem = (PROBLEMS.some((p) => p.id === askedProblem) ? askedProblem : "") as ProblemId | "";
	const problemHref = (id: ProblemId | "") => {
		const next = new URLSearchParams(params);
		if (id) next.set("problema", id);
		else next.delete("problema");
		const q = next.toString();
		return q ? `?${q}` : "?";
	};

	const shown = useMemo(
		() =>
			sortStories(
				stories.filter((s) => (!active || s.category === active) && (!problem || s.problems.includes(problem))),
				sort,
			),
		[stories, active, problem, sort],
	);
	const [featured, ...rest] = shown;
	const stack = rest.slice(0, 3);
	const grid = rest.slice(3, visible - 1);
	const hasMore = shown.length > visible;

	const setParam = (key: string, value: string, fallback: string) => {
		const next = new URLSearchParams(params);
		if (value && value !== fallback) next.set(key, value);
		else next.delete(key);
		setParams(next, { preventScrollReset: true });
		setVisible(FIRST_BATCH);
	};

	return (
		<div className="stories-container pt-12 lg:pt-[88px]">
			<h1 className="stories-h2">{title}</h1>
			<div className="mt-4">
				<StoriesToolbar
					categories={categories}
					active={active}
					sort={sort}
					sorts={sorts}
					onCategory={(c) => setParam("categoria", c, "")}
					onSort={(k) => setParam("ordem", k, defaultSort)}
					problem={problem}
					problemHref={problems ? problemHref : undefined}
				/>
			</div>
			<div className="mt-16" aria-live="polite">
				{featured ? (
					<>
						<FeaturedStories featured={featured} stack={stack} />
						{grid.length > 0 && (
							<div className="mt-[var(--ref-card-gap-y)]">
								<StoryGrid stories={grid} />
							</div>
						)}
						{hasMore && (
							<div className="mt-[var(--ref-card-gap-y)]">
								<LoadMore onClick={() => setVisible((v) => v + STEP)} />
							</div>
						)}
					</>
				) : (
					<p className="stories-body text-muted-foreground">Nenhum artigo neste filtro.</p>
				)}
			</div>
		</div>
	);
}
