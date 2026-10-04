// Explorar o mapa causal (LANC-001 SCR-02, RQ-070…080). O HTML pré-renderizado já traz o recorte inicial, a Lista
// e todas as relações em texto; o canvas (React Flow) entra depois da hidratação, em lazy load (RQ-079).
// Estado na URL: ?foco= (nó selecionado, compartilhável e preservado ao voltar da página do fator), ?modo= e ?tipo=.
import { Crosshair } from "lucide-react";
import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";

import type { MapMode } from "./CausalMap.client";
import { FactorSheet, type Snap } from "./FactorSheet";
import { EdgeSentence, TypeBadge, WhyChain, type NodeLink } from "./parts";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { cn } from "@/lib/utils";

const CausalMap = lazy(() => import("./CausalMap.client"));

const CHIP =
	"focus-visible:ring-ring/50 inline-flex min-h-11 items-center gap-1.5 rounded-[var(--radius-pill)] border px-4 text-sm font-medium outline-none focus-visible:ring-[3px]";
const chipClass = (on: boolean) =>
	cn(CHIP, on ? "border-[var(--graph-node-border-selected)] bg-[var(--graph-node-bg)] text-foreground" : "border-[var(--border-default)] text-muted-foreground hover:text-foreground");

const isMode = (v: string | null): v is ModeId => MODES.some((m) => m.id === v);
const isType = (v: string): v is VisualType => (VISUAL_TYPES as readonly string[]).includes(v);

/** Recorte inicial em texto (sem JS e antes do canvas): os mesmos nós, como links para as páginas dos fatores. */
function StaticNodes({ nodes, focusId }: { nodes: MapNode[]; focusId: string }) {
	return (
		<ul className="flex min-h-[360px] flex-wrap content-start items-start gap-3 py-4" data-map-static>
			{nodes.map((n) => (
				<li key={n.id}>
					<a
						href={factorHref(n.id)}
						data-map-node={n.id}
						data-node-type={n.visual}
						className={cn(
							"focus-visible:ring-ring/50 flex min-h-12 items-center gap-2 rounded-[var(--radius-node)] border-2 bg-[var(--graph-node-bg)] px-3 text-sm font-medium outline-none focus-visible:ring-[3px]",
							n.id === focusId ? "border-[var(--graph-node-border-selected)] font-semibold" : "border-[var(--graph-node-border)]",
						)}
					>
						<span aria-hidden="true">{NODE_TYPES[n.visual].glyph}</span>
						{n.label}
						<span className="sr-only">, {NODE_TYPES[n.visual].label}</span>
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

	const fromUrl = q("foco");
	const focusId = fromUrl && nodeById(RC_GRAPH, fromUrl) ? fromUrl : DEFAULT_FOCUS;
	// Tocar no fundo (ou Esc) limpa a seleção, mas o foco continua no centro.
	const [cleared, setCleared] = useState(false);
	const selectedId = fromUrl && nodeById(RC_GRAPH, fromUrl) && !cleared ? fromUrl : null;
	const mode = isMode(q("modo")) ? (q("modo") as ModeId) : null;
	const typeParam = (q("tipo") ?? "").split(",").filter(isType);
	const types: readonly VisualType[] = typeParam.length ? typeParam : mode ? MODES.find((m) => m.id === mode)!.types : [];

	const [snap, setSnap] = useState<Snap>("collapsed");
	const [why, setWhy] = useState(false);
	const [tab, setTab] = useState("mapa");

	const view = useMemo(() => visibleGraph(RC_GRAPH, focusId, types), [focusId, types.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps
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
			onClick={() => {
				select(n.id);
				setTab("mapa");
			}}
			className="text-primary focus-visible:ring-ring/50 rounded-sm font-medium underline underline-offset-4 outline-none hover:no-underline focus-visible:ring-[3px]"
		>
			{children}
		</button>
	);
	const pageLink: NodeLink = (n, children) => (
		<a href={factorHref(n.id)} className="text-primary underline underline-offset-4 hover:no-underline">
			{children}
		</a>
	);

	const selected = selectedId ? nodeById(RC_GRAPH, selectedId) : null;
	const shown = why ? whyNodes : view.nodes;
	const shownEdges = why ? [...chain.causes, ...chain.compensations] : view.edges;
	const status = selected
		? `${selected.label} selecionado, ${NODE_TYPES[selected.visual].label}. ${shown.length} fatores no mapa.`
		: `Toque em um fator para ver as relações. ${shown.length} fatores no mapa.`;

	return (
		<div className={cn("stories-container pb-16", selected && "max-[899px]:pb-[200px]")}>
			<div className="mx-auto max-w-[var(--ref-wide-width)]">
				<header className="pt-12 lg:pt-[88px]">
					<p className="stories-meta text-muted-foreground">Mapa causal · Explorar</p>
					<h1 className="stories-h2 mt-3">Explorar</h1>
					<p className="stories-body text-muted-foreground mt-[var(--ref-block-gap)] max-w-[var(--ref-hero-lead-w)]">
						Um fator no centro e as relações mais próximas. Toque em um fator para trazê-lo ao centro e ver causas, impactos, soluções e
						evidências.
					</p>
				</header>

				<nav aria-label="Modos do mapa" className="mt-8 flex flex-wrap gap-2" data-map-modes>
					<Link to={href({ modo: null, tipo: null })} preventScrollReset replace aria-current={!mode && !typeParam.length ? "true" : undefined} className={chipClass(!mode && !typeParam.length)}>
						Todos
					</Link>
					{MODES.map((m) => (
						<Link key={m.id} to={href({ modo: m.id, tipo: null })} preventScrollReset replace aria-current={mode === m.id && !typeParam.length ? "true" : undefined} className={chipClass(mode === m.id && !typeParam.length)}>
							{m.label}
						</Link>
					))}
				</nav>
				<nav aria-label="Tipos de fator" className="mt-3 flex flex-wrap gap-2" data-type-chips>
					{typesHere.map((t) => {
						const on = typeParam.includes(t);
						const next = on ? typeParam.filter((x) => x !== t) : [...typeParam, t];
						return (
							<Link key={t} to={href({ tipo: next.join(",") || null, modo: null })} preventScrollReset replace aria-current={on ? "true" : undefined} data-type-chip={t} className={chipClass(on)}>
								<span aria-hidden="true">{NODE_TYPES[t].glyph}</span>
								{NODE_TYPES[t].label}
							</Link>
						);
					})}
				</nav>

				<div className="mt-8 grid gap-6 min-[900px]:grid-cols-[minmax(0,1fr)_360px] min-[900px]:items-start">
					<Tabs value={tab} onValueChange={setTab} className="min-w-0 gap-4">
						<div className="flex flex-wrap items-center justify-between gap-3">
							<TabsList aria-label="Visualização" className="h-auto">
								<TabsTrigger value="mapa" className="min-h-11 px-4">
									Mapa causal
								</TabsTrigger>
								<TabsTrigger value="lista" className="min-h-11 px-4" data-tab-list>
									Lista
								</TabsTrigger>
							</TabsList>
							<button type="button" aria-pressed={why} onClick={() => setWhy((w) => !w)} data-why-toggle className={chipClass(why)}>
								Por quê?
							</button>
						</div>

						<TabsContent value="mapa" forceMount className="data-[state=inactive]:hidden">
							<p aria-live="polite" className="stories-caption text-muted-foreground flex min-h-11 items-center gap-2" data-map-status>
								<Crosshair className="size-4 shrink-0" aria-hidden="true" />
								<span>{status}</span>
							</p>
							<div className="rc-cell rc-surface overflow-hidden">
								{hydrated ? (
									<Suspense fallback={<StaticNodes nodes={shown} focusId={focusId} />}>
										<CausalMap
											focusId={focusId}
											nodes={shown}
											edges={shownEdges}
											selectedId={selectedId}
											mode={mapMode}
											onSelect={select}
											onClear={clear}
											label={`Mapa causal centrado em ${nodeById(RC_GRAPH, focusId)!.label}`}
										/>
									</Suspense>
								) : (
									<StaticNodes nodes={shown} focusId={focusId} />
								)}
							</div>
							{view.hidden > 0 && !why && (
								<p className="stories-caption text-muted-foreground mt-3">
									Mais {view.hidden} {view.hidden === 1 ? "relação fica" : "relações ficam"} fora deste recorte; todas estão na Lista.
								</p>
							)}
							{why && (
								<section aria-labelledby="porque-titulo" className="mt-6">
									<h2 id="porque-titulo" className="text-lg font-semibold">
										Por quê? {nodeById(RC_GRAPH, focusId)!.label}
									</h2>
									<div className="mt-3">
										<WhyChain id={focusId} nodeLink={selectLink} />
									</div>
								</section>
							)}
						</TabsContent>

						<TabsContent value="lista" forceMount className="data-[state=inactive]:hidden" data-map-list>
							<section aria-labelledby="recorte-titulo">
								<h2 id="recorte-titulo" className="text-lg font-semibold">
									Neste recorte
								</h2>
								<ul className="mt-3 space-y-3">
									{shown.map((n) => (
										<li key={n.id} className="flex flex-wrap items-baseline gap-x-3">
											{pageLink(n, n.label)}
											<TypeBadge type={n.visual} />
										</li>
									))}
								</ul>
								<ul className="stories-body mt-6 space-y-3">
									{shownEdges.map((e) => (
										<li key={e.id}>
											<EdgeSentence edge={e} nodeLink={pageLink} />
										</li>
									))}
								</ul>
							</section>
							<section aria-labelledby="todas-titulo" className="mt-10">
								<h2 id="todas-titulo" className="text-lg font-semibold">
									Todas as relações do mapa
								</h2>
								<ul className="stories-body mt-3 space-y-3" data-all-relations>
									{allEdgeViews(RC_GRAPH).map((e) => (
										<li key={e.id}>
											<EdgeSentence edge={e} nodeLink={pageLink} />
										</li>
									))}
								</ul>
							</section>
						</TabsContent>
					</Tabs>

					{selected && <FactorSheet key={selected.id} node={selected} snap={snap} onSnap={setSnap} onClose={clear} nodeLink={selectLink} />}
				</div>
			</div>
		</div>
	);
}
