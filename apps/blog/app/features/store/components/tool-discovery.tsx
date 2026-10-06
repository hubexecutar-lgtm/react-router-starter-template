// Encontrar ferramentas por problema e compensação (LANC-001 PR-L, RQ-121), no RC-DS-CF (ADR-26): chips com
// aria-pressed e cards do DS. Lê as ferramentas publicadas na Teia (data/correlations.ts); o problema vem do grafo,
// a partir da compensação (lib/graph/discovery.ts).
// Função operacional e encaixe (fit) ainda não têm nós no grafo: aparecem como pendentes, sem filtro inventado.
import { useEffect, useMemo, useState } from "react";

import { TOOL_CORRELATIONS } from "../data/correlations";

import { Card, CardGrid, EmptyState, SectionHead } from "@/components/ds";
import { PROBLEMS, type ProblemId } from "@/data/article-meta";
import { RC_GRAPH, nodeById } from "@/lib/graph";
import { problemsReached } from "@/lib/graph/discovery";
import { buildRegistries } from "@/lib/graph/registries";

const REGISTRIES = buildRegistries(RC_GRAPH, PROBLEMS);
const PROBLEM_NODES = PROBLEMS.map((p) => p.node);

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
		<section className="ds-section" aria-labelledby="descoberta" data-tool-discovery>
			<SectionHead
				id="descoberta"
				label="Por problema"
				heading="Encontrar por problema"
				lead="Ferramentas publicadas, ligadas ao mapa causal pela compensação que aplicam. O problema vem do mapa, não de rótulo."
				align="left"
			/>

			<div className="ds-facets">
				<div className="ds-facet-group">
					<h3 id="descoberta-problemas">Problema</h3>
					<nav aria-labelledby="descoberta-problemas" className="ds-chips" data-discovery-problems>
						{PROBLEMS.map((p) => (
							<button
								key={p.id}
								type="button"
								aria-pressed={problem === p.id}
								className="ds-chip"
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
				</div>
				<div className="ds-facet-group">
					<h3 id="descoberta-compensacoes">Compensação</h3>
					<nav aria-labelledby="descoberta-compensacoes" className="ds-chips" data-discovery-compensations>
						{REGISTRIES.compensations.entries.map((c) => (
							<button
								key={c.id}
								type="button"
								aria-pressed={compensation === c.id}
								className="ds-chip"
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
				</div>
			</div>
			<p className="ds-tools-note">Função operacional e encaixe: a definir com o OWNER da Teia.</p>

			<div aria-live="polite" style={{ marginTop: 32 }}>
				{results.length ? (
					<CardGrid cols={2} label="Ferramentas encontradas" data-discovery-results="">
						{results.map((t) => (
							<Card
								key={t.id}
								href={t.href}
								eyebrow={t.href.startsWith("/ferramentas/solucoes/") ? "Solução" : "Ferramenta interativa"}
								title={t.name}
								cta="Abrir"
								data-tool={t.id}
								meta={
									<dl className="ds-dl">
										<div>
											<dt>Compensação</dt>
											<dd>{t.compensations.map((id) => nodeById(RC_GRAPH, id)!.label).join(", ")}</dd>
										</div>
										<div>
											<dt>Problema no mapa</dt>
											<dd>
												{t.problems.map((p, i) => (
													<span key={p.node}>
														{i > 0 && ", "}
														{nodeById(RC_GRAPH, p.node)!.label}
														{p.inferred && " (inferido)"}
													</span>
												))}
											</dd>
										</div>
									</dl>
								}
							/>
						))}
					</CardGrid>
				) : (
					<div data-discovery-empty>
						<EmptyState
							level={3}
							title="Nenhuma ferramenta publicada para esta combinação"
							text="Ainda não há ferramenta ligada a este problema e a esta compensação no mapa. Desmarque um dos filtros ou veja as soluções publicadas."
							action={{ label: "Ver as soluções publicadas", href: "/ferramentas/solucoes/" }}
						/>
					</div>
				)}
			</div>
		</section>
	);
}
