// Encontrar ferramentas por problema e compensação (LANC-001 PR-L, RQ-121). Lê as ferramentas publicadas na Teia
// (data/correlations.ts); o problema vem do grafo, a partir da compensação (lib/graph/discovery.ts).
// Função operacional e encaixe (fit) ainda não têm nós no grafo: aparecem como pendentes, sem filtro inventado.
import { useEffect, useMemo, useState } from "react";

import { TOOL_CORRELATIONS } from "../data/correlations";

import { PROBLEMS, type ProblemId } from "@/data/article-meta";
import { RC_GRAPH, nodeById } from "@/lib/graph";
import { problemsReached } from "@/lib/graph/discovery";
import { buildRegistries } from "@/lib/graph/registries";
import { cn } from "@/lib/utils";

const REGISTRIES = buildRegistries(RC_GRAPH, PROBLEMS);
const PROBLEM_NODES = PROBLEMS.map((p) => p.node);

const CHIP =
	"focus-visible:ring-ring/50 inline-flex min-h-11 items-center rounded-[var(--radius-pill)] border px-4 text-sm font-medium outline-none focus-visible:ring-[3px]";
const chip = (on: boolean) =>
	cn(CHIP, on ? "border-[var(--graph-node-border-selected)] bg-[var(--graph-node-bg)] text-foreground" : "border-[var(--border-default)] text-muted-foreground hover:text-foreground");

const TOOLS = TOOL_CORRELATIONS.map((t) => ({
	...t,
	compensations: (t.refs.compensation_refs ?? []).map((r) => r.ref),
	problems: problemsReached(RC_GRAPH, t.refs, PROBLEM_NODES),
}));

export function ToolDiscovery() {
	const [problem, setProblem] = useState<ProblemId | null>(null);
	const [compensation, setCompensation] = useState<string | null>(null);

	// Estado na URL (?problema=, ?compensacao=), lido só no cliente, como o catálogo faz com os filtros dele.
	useEffect(() => {
		const p = new URLSearchParams(window.location.search);
		const pr = p.get("problema");
		if (PROBLEMS.some((x) => x.id === pr)) setProblem(pr as ProblemId);
		const c = p.get("compensacao");
		if (c && REGISTRIES.compensations.entries.some((e) => e.id === c)) setCompensation(c);
	}, []);
	const update = (k: string, v: string | null) => {
		const p = new URLSearchParams(window.location.search);
		if (v) p.set(k, v);
		else p.delete(k);
		const qs = p.toString();
		window.history.replaceState(null, "", window.location.pathname + (qs ? `?${qs}` : ""));
	};

	const problemNode = problem ? PROBLEMS.find((p) => p.id === problem)!.node : null;
	const results = useMemo(
		() => TOOLS.filter((t) => (!problemNode || t.problems.some((p) => p.node === problemNode)) && (!compensation || t.compensations.includes(compensation))),
		[problemNode, compensation],
	);

	return (
		<section className="mt-[var(--ref-section-gap)]" aria-labelledby="descoberta" data-tool-discovery>
			<h2 id="descoberta" className="stories-h2">
				Encontrar por problema
			</h2>
			<p className="stories-body text-muted-foreground mt-3 max-w-[var(--ref-hero-lead-w)]">
				Ferramentas publicadas, ligadas ao mapa causal pela compensação que aplicam. O problema vem do mapa, não de rótulo.
			</p>

			<div className="mt-6 space-y-3">
				<nav aria-label="Problema" className="flex flex-wrap gap-2" data-discovery-problems>
					{PROBLEMS.map((p) => (
						<button
							key={p.id}
							type="button"
							aria-pressed={problem === p.id}
							className={chip(problem === p.id)}
							onClick={() => {
								const next = problem === p.id ? null : p.id;
								setProblem(next);
								update("problema", next);
							}}
						>
							{p.label}
						</button>
					))}
				</nav>
				<nav aria-label="Compensação" className="flex flex-wrap gap-2" data-discovery-compensations>
					{REGISTRIES.compensations.entries.map((c) => (
						<button
							key={c.id}
							type="button"
							aria-pressed={compensation === c.id}
							className={chip(compensation === c.id)}
							onClick={() => {
								const next = compensation === c.id ? null : c.id;
								setCompensation(next);
								update("compensacao", next);
							}}
						>
							{c.label}
						</button>
					))}
				</nav>
				<p className="stories-caption text-muted-foreground">Função operacional e encaixe: a definir com o OWNER da Teia.</p>
			</div>

			<div aria-live="polite" className="mt-8">
				{results.length ? (
					<ul className="grid gap-[var(--ref-grid-gap)] md:grid-cols-2" data-discovery-results>
						{results.map((t) => (
							<li key={t.id} className="rc-cell rc-surface flex flex-col gap-3 p-6" data-tool={t.id}>
								<a href={t.href} className="text-primary text-xl font-semibold underline underline-offset-4 hover:no-underline">
									{t.name}
								</a>
								<dl className="stories-body grid gap-1">
									<div className="flex flex-wrap gap-x-2">
										<dt className="text-muted-foreground">Compensação:</dt>
										<dd>{t.compensations.map((id) => nodeById(RC_GRAPH, id)!.label).join(", ")}</dd>
									</div>
									<div className="flex flex-wrap gap-x-2">
										<dt className="text-muted-foreground">Problema no mapa:</dt>
										<dd>
											{t.problems.map((p, i) => (
												<span key={p.node}>
													{i > 0 && ", "}
													{nodeById(RC_GRAPH, p.node)!.label}
													{p.inferred && <span className="text-muted-foreground"> (inferido)</span>}
												</span>
											))}
										</dd>
									</div>
								</dl>
							</li>
						))}
					</ul>
				) : (
					<p className="stories-body text-muted-foreground" data-discovery-empty>
						Nenhuma ferramenta publicada para esta combinação ainda.
					</p>
				)}
			</div>
		</section>
	);
}
