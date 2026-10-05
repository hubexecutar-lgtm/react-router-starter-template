// Listagem de artigos na arquitetura Editorial Hybrid v4 (ADR-22): introdução de seção (eyebrow + h1), barra de
// categorias/ordenação e chips de problema, tiles em 2 colunas e "Carregar mais". Recebe as histórias por props,
// então a mesma composição serve a /artigos/ e à página de fixtures (/admin/stories-fixtures/).
import { useMemo, useState } from "react";

import { useSearchParams } from "react-router";

import { useTrackView } from "@/lib/analytics/track";

import { LoadMore } from "./LoadMore";
import { StoriesToolbar, type SortKey } from "./StoriesToolbar";
import { StoryCard } from "./StoryCard";

import { PROBLEMS, type ProblemId } from "@/data/article-meta";
import type { StoryView } from "@/lib/articles";

const FIRST_BATCH = 8; // 4 linhas de 2 tiles
const STEP = 8;
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
	// RQ-111: a listagem (estágio BLOG), com o problema escolhido nos chips. Só na listagem real, não nas fixtures.
	useTrackView(problems ? { stage: "BLOG", action: "view", problem_id: PROBLEMS.find((p) => p.id === problem)?.node } : null, problem);
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
	const page = shown.slice(0, visible);
	const hasMore = shown.length > visible;

	const setParam = (key: string, value: string, fallback: string) => {
		const next = new URLSearchParams(params);
		if (value && value !== fallback) next.set(key, value);
		else next.delete(key);
		setParams(next, { preventScrollReset: true });
		setVisible(FIRST_BATCH);
	};

	return (
		<div className="hy-wide pt-[var(--hy-section)]">
			<div>
				<header className="hy-section-intro">
					<p className="hy-eyebrow">Risco Cognitivo · {title}</p>
					<h1 className="stories-h2">{title}</h1>
				</header>
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
				<div className="mt-10" aria-live="polite">
					{page.length ? (
						<>
							<div className="hy-tile-grid" role="list" data-story-grid>
								{page.map((s, i) => (
									<div key={s.slug} role="listitem">
										<StoryCard story={s} headingLevel={2} priority={i < 2} />
									</div>
								))}
							</div>
							{hasMore && (
								<div className="mt-12">
									<LoadMore onClick={() => setVisible((v) => v + STEP)} />
								</div>
							)}
						</>
					) : (
						<p className="stories-body text-muted-foreground">Nenhum artigo neste filtro.</p>
					)}
				</div>
			</div>
		</div>
	);
}
