// Busca e navegação (mood board 08). Índice gerado no prerender a partir da coleção e do
// banco editorial; a busca roda no navegador. Sem JavaScript, o formulário e os temas
// continuam navegáveis.
import { type KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";

import { Search } from "lucide-react";

import type { Route } from "./+types/buscar";

import { SURFACE } from "@/components/editorial/surface";
import { AsciiDiagram } from "@/components/plain";
import { TERRITORY_TREE } from "@/data/editorial/framework";
import DefaultLayout from "@/layouts/DefaultLayout";
import { EVIDENCE, TERRITORIES, evidenceYear, territoryHref } from "@/lib/editorial";
import { typeLabel } from "@/lib/posts";
import { getPosts } from "@/lib/posts.server";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

type Kind = "artigo" | "tema" | "evidencia";
type Item = { kind: Kind; id: string; title: string; text: string; tags: string[]; href: string; meta: string; date: string };

export function loader() {
	const posts = getPosts();
	const index: Item[] = [
		...posts.map((p) => ({
			kind: "artigo" as const,
			id: p.contentId ?? p.id,
			title: p.title,
			text: p.description,
			tags: [...p.tags, p.territory.name],
			href: p.href,
			meta: `${typeLabel(p.type)} · ${p.minutes} min de leitura`,
			date: p.pubDate.toISOString().slice(0, 10),
		})),
		...TERRITORIES.map((t) => ({
			kind: "tema" as const,
			id: t.id,
			title: t.name,
			text: t.question,
			tags: [...t.includes, t.role],
			href: territoryHref(t),
			meta: `Tema · ${t.role}`,
			date: "",
		})),
		...EVIDENCE.map((e) => ({
			kind: "evidencia" as const,
			id: e.id,
			title: e.title,
			text: e.supports,
			tags: [e.author, e.institution, e.type],
			href: `/evidencias/#${e.id}`,
			meta: `Evidência · ${e.author} · ${evidenceYear(e)}`,
			date: e.date,
		})),
	];
	const tagCount = new Map<string, number>();
	posts.flatMap((p) => p.tags).forEach((t) => tagCount.set(t, (tagCount.get(t) ?? 0) + 1));
	const suggestions = [...tagCount.entries()]
		.sort((a, b) => b[1] - a[1])
		.slice(0, 6)
		.map(([t]) => t);
	return { index, suggestions };
}

export const meta: Route.MetaFunction = ({ location }) =>
	seo({ title: "Buscar", description: "Busque artigos, temas e evidências do Risco Cognitivo.", pathname: location.pathname });

const LABEL: Record<Kind, string> = { artigo: "Artigo", tema: "Tema", evidencia: "Evidência" };
const TABS = [
	{ id: "todos", label: "Todos" },
	{ id: "artigo", label: "Artigos" },
	{ id: "tema", label: "Temas" },
	{ id: "evidencia", label: "Evidências" },
] as const;
type Tab = (typeof TABS)[number]["id"];

const norm = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

function score(item: Item, terms: string[]) {
	if (!terms.length) return 1;
	const title = norm(item.title);
	const text = norm(item.text);
	const tags = norm(item.tags.join(" "));
	const id = norm(item.id);
	let total = 0;
	for (const t of terms) {
		const s = (title.includes(t) ? 6 : 0) + (tags.includes(t) ? 3 : 0) + (text.includes(t) ? 1 : 0) + (id.includes(t) ? 4 : 0);
		if (!s) return 0;
		total += s;
	}
	return total;
}

const setQueryInUrl = (q: string) => {
	const url = new URL(location.href);
	if (q) url.searchParams.set("q", q);
	else url.searchParams.delete("q");
	history.replaceState(history.state, "", url);
};

export default function Page({ loaderData }: Route.ComponentProps) {
	const { index, suggestions } = loaderData;
	const [query, setQuery] = useState("");
	const [tab, setTab] = useState<Tab>("todos");
	const [sort, setSort] = useState<"relevancia" | "recentes">("relevancia");
	const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

	// A página é pré-renderizada sem query: o termo da URL entra depois da hidratação.
	useEffect(() => {
		setQuery(new URL(location.href).searchParams.get("q") ?? "");
	}, []);

	const scored = useMemo(() => {
		const terms = norm(query.trim()).split(/\s+/).filter(Boolean);
		return index.map((i) => ({ i, s: score(i, terms) })).filter((x) => x.s > 0);
	}, [index, query]);
	const counts = Object.fromEntries(
		TABS.map((t) => [t.id, t.id === "todos" ? scored.length : scored.filter((x) => x.i.kind === t.id).length]),
	) as Record<Tab, number>;
	const shown = scored
		.filter((x) => tab === "todos" || x.i.kind === tab)
		.sort((a, b) => (sort === "recentes" ? b.i.date.localeCompare(a.i.date) : b.s - a.s));

	const onTabKey = (e: KeyboardEvent, i: number) => {
		const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
		if (!d) return;
		const n = (i + d + TABS.length) % TABS.length;
		setTab(TABS[n].id);
		tabRefs.current[n]?.focus();
	};

	return (
		<DefaultLayout>
			<div className="container grid grid-cols-1 gap-10 pt-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14 lg:pt-20">
				<section aria-labelledby="busca-title" className="min-w-0">
					<p className="rc-eyebrow">Buscar conhecimento</p>
					<h1 id="busca-title" className="rc-display mt-4 text-5xl sm:text-6xl">
						Busca e navegação
					</h1>
					<p className="rc-lead mt-5 max-w-2xl text-lg">
						Encontre artigos, temas e evidências e navegue pela arquitetura do framework.
					</p>

					<form
						action="/buscar/"
						method="get"
						role="search"
						className="focus-within:ring-ring/50 mt-8 flex gap-2 rounded-[var(--surface-radius-card)] border border-[var(--border-strong)] p-1.5 focus-within:ring-[3px]"
						data-search-form
						onSubmit={(e) => {
							e.preventDefault();
							setQueryInUrl(query.trim());
						}}
					>
						<label htmlFor="q" className="sr-only">
							Termo de busca
						</label>
						<Search className="text-muted-foreground ml-2 size-5 shrink-0 self-center" aria-hidden="true" />
						<input
							id="q"
							name="q"
							type="search"
							autoComplete="off"
							placeholder="Ex.: interrupções, checklist, ISO 31000"
							className="h-11 min-w-0 flex-1 bg-transparent px-2 text-lg outline-none"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
						/>
						<button
							type="submit"
							className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring/50 h-11 shrink-0 rounded-md px-5 font-medium outline-none focus-visible:ring-[3px]"
						>
							Buscar
						</button>
					</form>
					<div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
						<span className="text-muted-foreground">Sugestões:</span>
						{suggestions.map((s) => (
							<a
								key={s}
								href={`/buscar/?q=${encodeURIComponent(s)}`}
								data-suggest={s}
								className="inline-flex h-8 items-center rounded-full bg-[var(--surface-hover)] px-3 transition-colors hover:bg-[var(--surface-selected)]"
								onClick={(e) => {
									e.preventDefault();
									setQuery(s);
									setQueryInUrl(s);
								}}
							>
								{s}
							</a>
						))}
					</div>

					<div className="mt-10 flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border-default)]">
						<div role="tablist" aria-label="Tipo de resultado" className="-mb-px flex gap-1 overflow-x-auto">
							{TABS.map((t, i) => (
								<button
									key={t.id}
									ref={(el) => {
										tabRefs.current[i] = el;
									}}
									type="button"
									role="tab"
									id={`tab-${t.id}`}
									aria-selected={tab === t.id}
									aria-controls="resultados"
									tabIndex={tab === t.id ? 0 : -1}
									data-tab={t.id}
									onClick={() => setTab(t.id)}
									onKeyDown={(e) => onTabKey(e, i)}
									className="aria-selected:border-primary aria-selected:text-primary text-foreground focus-visible:ring-ring/50 h-11 shrink-0 border-b-2 border-transparent px-3 font-medium outline-none focus-visible:ring-[3px]"
								>
									{t.label} (<span data-count={t.id}>{counts[t.id]}</span>)
								</button>
							))}
						</div>
						<label className="mb-2 flex items-center gap-2 text-sm">
							<span className="text-muted-foreground">Ordenar por</span>
							<select
								data-sort
								value={sort}
								onChange={(e) => setSort(e.target.value as typeof sort)}
								className="border-input bg-background focus-visible:ring-ring/50 h-9 rounded-md border px-2 text-sm outline-none focus-visible:ring-[3px]"
							>
								<option value="relevancia">Mais relevantes</option>
								<option value="recentes">Mais recentes</option>
							</select>
						</label>
					</div>

					<p className="sr-only" aria-live="polite" data-status>
						{`${shown.length} resultado${shown.length === 1 ? "" : "s"}`}
					</p>
					<div id="resultados" role="tabpanel" aria-labelledby={`tab-${tab}`} data-tabpanel>
						<ol className="divide-y divide-[var(--border-default)]" data-results>
							{shown.length ? (
								shown.map(({ i }) => (
									<li key={`${i.kind}-${i.id}`} className="py-5">
										<p className="rc-eyebrow">
											<span className="text-primary">{LABEL[i.kind]}</span> · <span>{i.id}</span>
										</p>
										<h2 className="rc-title mt-2 text-xl">
											<a href={i.href} className="hover:underline">
												{i.title}
											</a>
										</h2>
										<p className="text-muted-foreground mt-1.5 leading-relaxed">{i.text}</p>
										<p className="rc-meta mt-2">{i.meta}</p>
									</li>
								))
							) : (
								<li className="text-muted-foreground py-8">
									Nenhum resultado para “{query.trim()}”. Tente outro termo ou navegue pelos{" "}
									<a className="rc-link" href="/temas/">
										temas
									</a>
									.
								</li>
							)}
						</ol>
					</div>
				</section>

				<aside className="flex flex-col gap-6 lg:pt-10" aria-label="Navegação por temas">
					<div className={cn(SURFACE, "p-5")}>
						<p className="rc-eyebrow flex items-center justify-between">
							<span>Arquitetura</span>
							<a href="/temas/" className="rc-link tracking-normal normal-case">
								Mapa completo
							</a>
						</p>
						<div className="mt-4">
							<AsciiDiagram
								id="MAP-TERRITORIES-002"
								kind="tree"
								title="Territórios"
								source={TERRITORY_TREE}
								fontSize="sm"
								density="compact"
							/>
						</div>
					</div>
					<div className={cn(SURFACE, "p-5")}>
						<p className="rc-eyebrow">Temas relacionados</p>
						<ul className="mt-4 flex flex-wrap gap-2">
							{TERRITORIES.map((t) => (
								<li key={t.id}>
									<a
										href={territoryHref(t)}
										className="bg-background hover:text-primary inline-flex h-8 items-center rounded-full border border-[var(--border-default)] px-3 text-sm"
									>
										{t.short}
									</a>
								</li>
							))}
						</ul>
					</div>
				</aside>
			</div>
		</DefaultLayout>
	);
}
