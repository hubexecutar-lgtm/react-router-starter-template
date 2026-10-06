// Explorar o mapa causal (LANC-001 SCR-02, RQ-070…080). O HTML pré-renderizado já traz o recorte inicial, a Lista
// e todas as relações em texto; o canvas (React Flow) entra depois da hidratação, em lazy load (RQ-079).
// Estado na URL: ?foco= (nó selecionado, compartilhável e preservado ao voltar da página do fator), ?modo= e ?tipo=.
import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Crosshair } from "lucide-react";
import { Link, useSearchParams } from "react-router";

import type { MapMode } from "./CausalMap.client";
import { FactorSheet, type Snap } from "./FactorSheet";
import { MapTabs } from "./MapTabs";
import { EdgeSentence, TypeBadge, WhyChain, type NodeLink } from "./parts";
import { clearPrefs, loadPrefs, preferredFirst, preferredFocus, type MapPrefs } from "./prefs";

import { Badge, Button, Frame, PageHead } from "@/components/ds";
import { MAP_BRAIN } from "@/data/mapa-brain";
import { track } from "@/lib/analytics/track";
import {
	DEFAULT_FOCUS,
	MODES,
	NODE_TYPES,
	RC_GRAPH,
	VISUAL_TYPES,
	allEdgeViews,
	chainFor,
	factorHref,
	neighborhood,
	nodeById,
	visibleGraph,
	type MapNode,
	type ModeId,
	type VisualType,
} from "@/lib/graph";

const CausalMap = lazy(() => import("./CausalMap.client"));

const isMode = (v: string | null): v is ModeId => MODES.some((m) => m.id === v);
const isType = (v: string): v is VisualType => (VISUAL_TYPES as readonly string[]).includes(v);
/** Volta à Home do Mapa com o foco quando ele é uma das funções do cérebro (o BrainHero lê ?foco=). */
const brainHref = (id: string) => (MAP_BRAIN.functions.some((f) => f.id === id) ? `/mapas/?foco=${encodeURIComponent(id)}` : "/mapas/");

/** Recorte inicial em texto (sem JS e antes do canvas): os mesmos nós, como links para as páginas dos fatores. */
function StaticNodes({ nodes, focusId, preferred = [] }: { nodes: MapNode[]; focusId: string; preferred?: string[] }) {
	return (
		<ul className="rc-map-static" data-map-static>
			{nodes.map((n) => (
				<li key={n.id}>
					<a href={factorHref(n.id)} data-map-node={n.id} data-node-type={n.visual} aria-current={n.id === focusId ? "true" : undefined} className="rc-map-static-node">
						<span aria-hidden="true">{NODE_TYPES[n.visual].glyph}</span>
						{n.label}
						<span className="sr-only">
							, {NODE_TYPES[n.visual].label}
							{preferred.includes(n.id) && ", seu interesse"}
						</span>
						{preferred.includes(n.id) && (
							<span aria-hidden="true" className="rc-map-star">
								★
							</span>
						)}
					</a>
				</li>
			))}
		</ul>
	);
}

export function ExploreView() {
	const [params, setParams] = useSearchParams();
	// O HTML é pré-renderizado sem query: a URL só é lida depois de hidratar, para não divergir do servidor.
	const [hydrated, setHydrated] = useState(false);
	useEffect(() => setHydrated(true), []);
	const q = (k: string) => (hydrated ? params.get(k) : null);

	// Personalizar (RQ-090): lido só no navegador; muda o foco inicial, a ordem e o destaque, nunca os fatos.
	const [prefs, setPrefs] = useState<MapPrefs | null>(null);
	useEffect(() => setPrefs(loadPrefs()), []);
	const preferred = prefs?.interesses ?? [];

	const fromUrl = q("foco");
	const focusId = fromUrl && nodeById(RC_GRAPH, fromUrl) ? fromUrl : (preferredFocus(prefs) ?? DEFAULT_FOCUS);
	// Tocar no fundo (ou Esc) limpa a seleção, mas o foco continua no centro.
	const [cleared, setCleared] = useState(false);
	const selectedId = fromUrl && nodeById(RC_GRAPH, fromUrl) && !cleared ? fromUrl : null;
	const mode = isMode(q("modo")) ? (q("modo") as ModeId) : null;
	const typeParam = (q("tipo") ?? "").split(",").filter(isType);
	const types: readonly VisualType[] = typeParam.length ? typeParam : mode ? MODES.find((m) => m.id === mode)!.types : [];

	const [snap, setSnap] = useState<Snap>("collapsed");
	const [why, setWhy] = useState(false);
	const [tab, setTab] = useState("mapa");

	const view = useMemo(() => {
		const v = visibleGraph(RC_GRAPH, focusId, types, { evidence: prefs?.evidencias });
		return { ...v, nodes: [v.nodes[0], ...preferredFirst(v.nodes.slice(1), prefs)] };
	}, [focusId, types.join(","), prefs]);
	const typesHere = useMemo(() => [...new Set(neighborhood(RC_GRAPH, focusId).nodes.map((n) => nodeById(RC_GRAPH, n.id)!.visual))], [focusId]);
	const chain = useMemo(() => chainFor(RC_GRAPH, focusId), [focusId]);
	const mapMode: MapMode = useMemo(() => (why ? { kind: "why", ...chain } : { kind: "focus" }), [why, chain]);
	const whyNodes = useMemo(() => {
		const ids = new Set([focusId, ...[...chain.causes, ...chain.compensations].flatMap((e) => [e.source.id, e.target.id])]);
		return [...ids].map((id) => nodeById(RC_GRAPH, id)!);
	}, [focusId, chain]);

	const href = (patch: Record<string, string | null>) => {
		const next = new URLSearchParams(hydrated ? params : undefined);
		for (const [k, v] of Object.entries(patch)) {
			if (v) next.set(k, v);
			else next.delete(k);
		}
		const s = next.toString();
		return s ? `?${s}` : "?";
	};

	const select = useCallback(
		(id: string) => {
			// RQ-111: escolha de um fator no mapa (estágio TOOL), com o ID no campo do seu tipo.
			const kind = nodeById(RC_GRAPH, id)?.visual;
			const field = kind === "compensation" ? "solution_id" : kind === "capacity" ? "capability_id" : kind === "evidence" ? "asset_id" : "problem_id";
			track({ stage: "TOOL", action: "select", [field]: id });
			setSnap("collapsed");
			setCleared(false);
			setParams(
				(prev) => {
					const next = new URLSearchParams(prev);
					next.set("foco", id);
					return next;
				},
				{ replace: true, preventScrollReset: true },
			);
		},
		[setParams],
	);
	// Ao fechar o sheet (Esc, ✕ ou toque no fundo), o foco do teclado volta ao nó que estava selecionado.
	const restore = useRef<string | null>(null);
	const clear = useCallback(() => {
		restore.current = selectedId;
		setCleared(true);
	}, [selectedId]);
	useEffect(() => {
		if (selectedId || !restore.current) return;
		document.querySelector<HTMLElement>(`[data-map-canvas] [data-map-node="${restore.current}"]`)?.focus();
		restore.current = null;
	}, [selectedId]);

	const selectLink: NodeLink = (n, children) => (
		<button
			type="button"
			className="ds-inline-link"
			onClick={() => {
				select(n.id);
				setTab("mapa");
			}}
		>
			{children}
		</button>
	);
	const pageLink: NodeLink = (n, children) => (
		<a href={factorHref(n.id)} className="ds-inline-link">
			{children}
		</a>
	);

	const selected = selectedId ? nodeById(RC_GRAPH, selectedId) : null;
	const shown = why ? whyNodes : view.nodes;
	const shownEdges = why ? [...chain.causes, ...chain.compensations] : view.edges;
	const status = selected
		? `${selected.label} selecionado, ${NODE_TYPES[selected.visual].label}. ${shown.length} fatores no mapa.`
		: `Toque em um fator para ver as relações. ${shown.length} fatores no mapa.`;
	const all = !mode && !typeParam.length;

	return (
		<div className="ds-page">
			<PageHead
				crumbs={[{ label: "Mapa Cognitivo", href: brainHref(focusId) }, { label: "Explorar" }]}
				eyebrow="Mapa Cognitivo · Explorar"
				title="Explorar relações"
				lead="Um fator no centro e as relações mais próximas. Toque em um fator para trazê-lo ao centro e ver causas, impactos, soluções e evidências."
				notice="O Explorar está em reconstrução no design system novo; o grafo, as relações e as fontes são reais."
			/>

			<div className={`ds-container pb-16${selected ? " max-[899px]:pb-[216px]" : ""}`}>
				<p className="ds-mapa-prefs" data-prefs-bar>
					{prefs ? (
						<>
							<span>Mapa personalizado neste navegador.</span>
							<a href="/mapas/personalizar/" className="ds-link">
								Editar
							</a>
							<Button
								variant="ghost"
								data-reset-prefs=""
								onClick={() => {
									clearPrefs();
									setPrefs(null);
								}}
							>
								Restaurar padrão
							</Button>
						</>
					) : (
						<a href="/mapas/personalizar/" className="ds-link">
							Personalizar por onde começar <span aria-hidden="true">›</span>
						</a>
					)}
				</p>

				<nav aria-label="Modos do mapa" className="mt-6" data-map-modes>
					<ul className="ds-chips">
						<li>
							<Link to={href({ modo: null, tipo: null })} preventScrollReset replace aria-current={all ? "true" : undefined} className="ds-chip">
								Todos
							</Link>
						</li>
						{MODES.map((m) => (
							<li key={m.id}>
								<Link to={href({ modo: m.id, tipo: null })} preventScrollReset replace aria-current={mode === m.id && !typeParam.length ? "true" : undefined} className="ds-chip">
									{m.label}
								</Link>
							</li>
						))}
					</ul>
				</nav>
				<nav aria-label="Tipos de fator" className="mt-3" data-type-chips>
					<ul className="ds-chips">
						{typesHere.map((t) => {
							const on = typeParam.includes(t);
							const next = on ? typeParam.filter((x) => x !== t) : [...typeParam, t];
							return (
								<li key={t}>
									<Link to={href({ tipo: next.join(",") || null, modo: null })} preventScrollReset replace aria-current={on ? "true" : undefined} data-type-chip={t} className="ds-chip">
										<span aria-hidden="true">{NODE_TYPES[t].glyph}</span>
										{NODE_TYPES[t].label}
									</Link>
								</li>
							);
						})}
					</ul>
				</nav>

				<div className="mt-8 grid gap-6 min-[900px]:grid-cols-[minmax(0,1fr)_360px] min-[900px]:items-start">
					<MapTabs
						label="Visualização"
						value={tab}
						onValueChange={setTab}
						forceMount
						listEnd={
							<button type="button" aria-pressed={why} onClick={() => setWhy((w) => !w)} data-why-toggle className="ds-chip">
								Por quê?
							</button>
						}
						items={[
							{
								value: "mapa",
								label: "Mapa causal",
								content: (
									<>
										<p aria-live="polite" className="ds-mapa-status" data-map-status>
											<Crosshair size={16} className="shrink-0" aria-hidden="true" />
											<span>{status}</span>
										</p>
										<Frame>
											<div className="ds-mapa-canvas">
												{hydrated ? (
													<Suspense fallback={<StaticNodes nodes={shown} focusId={focusId} preferred={preferred} />}>
														<CausalMap
															focusId={focusId}
															nodes={shown}
															preferred={preferred}
															edges={shownEdges}
															selectedId={selectedId}
															mode={mapMode}
															onSelect={select}
															onClear={clear}
															label={`Mapa causal centrado em ${nodeById(RC_GRAPH, focusId)!.label}`}
														/>
													</Suspense>
												) : (
													<StaticNodes nodes={shown} focusId={focusId} preferred={preferred} />
												)}
											</div>
										</Frame>
										{view.hidden > 0 && !why && (
											<p className="ds-mapa-note">
												Mais {view.hidden} {view.hidden === 1 ? "relação fica" : "relações ficam"} fora deste recorte; todas estão na Lista.
											</p>
										)}
										{why && (
											<section aria-labelledby="porque-titulo" className="mt-6">
												<h2 id="porque-titulo" className="ds-mapa-subhead">
													Por quê? {nodeById(RC_GRAPH, focusId)!.label}
												</h2>
												<div className="mt-4">
													<WhyChain id={focusId} nodeLink={selectLink} />
												</div>
											</section>
										)}
									</>
								),
							},
							{
								value: "lista",
								label: "Lista",
								trigger: { "data-tab-list": "" },
								panel: { "data-map-list": "" },
								content: (
									<>
										<section aria-labelledby="recorte-titulo">
											<h2 id="recorte-titulo" className="ds-mapa-subhead">
												Neste recorte
											</h2>
											<ul className="ds-mapa-nodes mt-4">
												{shown.map((n) => (
													<li key={n.id}>
														{pageLink(n, n.label)}
														<TypeBadge type={n.visual} />
														{preferred.includes(n.id) && (
															<Badge variant="accent">
																<span aria-hidden="true">★</span> seu interesse
															</Badge>
														)}
													</li>
												))}
											</ul>
											<ul className="ds-sentences mt-6">
												{shownEdges.map((e) => (
													<li key={e.id}>
														<EdgeSentence edge={e} nodeLink={pageLink} />
													</li>
												))}
											</ul>
										</section>
										<section aria-labelledby="todas-titulo" className="mt-10">
											<h2 id="todas-titulo" className="ds-mapa-subhead">
												Todas as relações do mapa
											</h2>
											<ul className="ds-sentences mt-4" data-all-relations>
												{allEdgeViews(RC_GRAPH).map((e) => (
													<li key={e.id}>
														<EdgeSentence edge={e} nodeLink={pageLink} />
													</li>
												))}
											</ul>
										</section>
									</>
								),
							},
						]}
					/>

					{selected && <FactorSheet key={selected.id} node={selected} snap={snap} onSnap={setSnap} onClose={clear} nodeLink={selectLink} />}
				</div>
			</div>
		</div>
	);
}
