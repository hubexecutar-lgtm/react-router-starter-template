// Canvas do mapa causal (LANC-001 RQ-070/075/076/079). Carregado só no navegador e só em /mapas/explorar/, por
// React.lazy no ExploreView: React Flow e dagre não entram no bundle das outras rotas.
// Nó = <button> de 48px com forma + rótulo (pele em ds-mapa.css, camada --graph-*); aresta = traço (sólido/tracejado) + rótulo em texto. Tocar ou Enter
// seleciona; tocar no fundo limpa. Pan e pinça existem, mas nada depende deles (nem de hover).
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import dagre from "@dagrejs/dagre";
import {
	BaseEdge,
	EdgeLabelRenderer,
	Handle,
	MarkerType,
	Position,
	ReactFlow,
	ReactFlowProvider,
	getStraightPath,
	useNodesInitialized,
	useReactFlow,
	type Edge,
	type EdgeProps,
	type Node,
	type NodeProps,
} from "@xyflow/react";

import "@xyflow/react/dist/base.css";

import { NODE_H, focusLayout, nodeWidth, type Layout } from "./layout";

import { NODE_TYPES, type EdgeView, type MapNode } from "@/lib/graph";

export type MapMode = { kind: "focus" } | { kind: "why"; causes: EdgeView[]; compensations: EdgeView[] };

type NodeData = { node: MapNode; w: number; focus: boolean; selected: boolean; dim: boolean; preferred: boolean; onSelect: (id: string) => void };
type EdgeData = { view: EdgeView; active: boolean; dim: boolean; weight: number; targetW: number };

function MapNodeView({ data }: NodeProps<Node<NodeData>>) {
	const t = NODE_TYPES[data.node.visual];
	return (
		<>
			<Handle type="target" position={Position.Top} isConnectable={false} className="rc-map-handle" />
			<button
				type="button"
				data-map-node={data.node.id}
				data-node-type={data.node.visual}
				aria-pressed={data.selected}
				aria-label={`${data.node.label}, ${t.label}${data.preferred ? ", seu interesse" : ""}`}
				data-preferred={data.preferred || undefined}
				data-focus={data.focus || undefined}
				onClick={(e) => {
					e.stopPropagation();
					data.onSelect(data.node.id);
				}}
				style={{ width: data.w, height: NODE_H, opacity: data.dim ? "var(--graph-dim-opacity)" : undefined }}
				className="rc-map-node nodrag nopan flex items-center gap-2 px-3 py-1.5"
			>
				<span aria-hidden="true" className="rc-map-glyph shrink-0">
					{t.glyph}
				</span>
				<span className="line-clamp-2 min-w-0 flex-1 break-words">{data.node.label}</span>
				{data.preferred && (
					<span aria-hidden="true" className="rc-map-star shrink-0" data-preferred-mark>
						★
					</span>
				)}
			</button>
			<Handle type="source" position={Position.Bottom} isConnectable={false} className="rc-map-handle" />
		</>
	);
}

function MapEdgeView({ sourceX, sourceY, targetX, targetY, data, markerEnd }: EdgeProps<Edge<EdgeData>>) {
	const d = data!;
	// A seta para na borda do nó de destino (as alças ficam no centro): direção da relação sem depender de cor.
	const dx = targetX - sourceX;
	const dy = targetY - sourceY;
	const t = Math.min(dx ? (d.targetW / 2 + 4) / Math.abs(dx) : Infinity, dy ? (NODE_H / 2 + 4) / Math.abs(dy) : Infinity, 1);
	const [path, labelX, labelY] = getStraightPath({ sourceX, sourceY, targetX: targetX - dx * t, targetY: targetY - dy * t });
	return (
		<>
			<BaseEdge
				path={path}
				markerEnd={markerEnd}
				style={{
					stroke: d.active ? "var(--graph-edge-active)" : "var(--graph-edge)",
					strokeWidth: d.weight,
					strokeDasharray: d.view.dashed ? "6 4" : undefined,
					opacity: d.dim ? "var(--graph-dim-opacity)" : undefined,
				}}
			/>
			<EdgeLabelRenderer>
				<span
					data-edge-label={d.view.id}
					data-dashed={d.view.dashed || undefined}
					style={{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`, opacity: d.dim ? "var(--graph-dim-opacity)" : undefined }}
					className="rc-map-edge-label pointer-events-none absolute px-1.5"
				>
					{d.view.label}
					{d.view.inferred && " (inferido)"}
				</span>
			</EdgeLabelRenderer>
		</>
	);
}

const NODE_TYPES_RF = { factor: MapNodeView };
const EDGE_TYPES_RF = { relation: MapEdgeView };

/** "Por quê?" em camadas: causas acima do foco, compensações abaixo (as arestas delas são invertidas no layout). */
function whyLayout(focusId: string, nodes: MapNode[], causes: EdgeView[], compensations: EdgeView[], width: number): Layout {
	const w = nodeWidth(width);
	const g = new dagre.graphlib.Graph();
	g.setGraph({ rankdir: "TB", nodesep: 16, ranksep: 72, marginx: 16, marginy: 16 });
	g.setDefaultEdgeLabel(() => ({}));
	for (const n of nodes) g.setNode(n.id, { width: w, height: NODE_H });
	for (const e of causes) g.setEdge(e.source.id, e.target.id);
	for (const e of compensations) g.setEdge(e.target.id, e.source.id);
	if (!nodes.length) g.setNode(focusId, { width: w, height: NODE_H });
	dagre.layout(g);
	const placed = g.nodes().map((id) => {
		const p = g.node(id);
		return { id, x: p.x - w / 2, y: p.y - NODE_H / 2, w };
	});
	const graph = g.graph();
	return { nodes: placed, width: Math.max(width, graph.width ?? width), height: graph.height ?? NODE_H * 2 };
}

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type Props = {
	focusId: string;
	nodes: MapNode[];
	edges: EdgeView[];
	selectedId: string | null;
	mode: MapMode;
	onSelect: (id: string) => void;
	onClear: () => void;
	label: string;
	/** Interesses do Personalizar (RQ-090): só destaque, nunca filtro. */
	preferred?: string[];
};

function Canvas({ focusId, nodes, edges, selectedId, mode, onSelect, onClear, label, preferred = [] }: Props) {
	const wrap = useRef<HTMLDivElement>(null);
	const [width, setWidth] = useState(0);
	const flow = useReactFlow();

	useLayoutEffect(() => {
		const el = wrap.current!;
		setWidth(el.clientWidth);
		const ro = new ResizeObserver(() => setWidth(el.clientWidth));
		ro.observe(el);
		return () => ro.disconnect();
	}, []);

	const layout = useMemo(() => {
		if (!width) return null;
		return mode.kind === "why" ? whyLayout(focusId, nodes, mode.causes, mode.compensations, width) : focusLayout(focusId, nodes, edges, width);
	}, [focusId, nodes, edges, mode, width]);

	const active = selectedId ?? null;
	const linked = (id: string) => mode.kind === "why" || !active || id === active || edges.some((e) => (e.source.id === active && e.target.id === id) || (e.target.id === active && e.source.id === id));

	// Ordem do DOM (e do Tab) = ordem do recorte: foco, interesses do Personalizar, resto; a posição vem do layout.
	const order = (id: string) => nodes.findIndex((n) => n.id === id);
	const rfNodes: Node<NodeData>[] = [...(layout?.nodes ?? [])].sort((a, b) => order(a.id) - order(b.id)).map((p) => {
		const node = nodes.find((n) => n.id === p.id)!;
		return {
			id: p.id,
			type: "factor",
			position: { x: p.x, y: p.y },
			data: { node, w: p.w, focus: p.id === focusId, selected: p.id === active, dim: !linked(p.id), preferred: preferred.includes(p.id), onSelect },
			draggable: false,
			selectable: false,
			focusable: false,
		};
	});
	const rfEdges: Edge<EdgeData>[] = edges.map((e) => {
		const on = !!active && (e.source.id === active || e.target.id === active);
		return {
			id: e.id,
			source: e.source.id,
			target: e.target.id,
			type: "relation",
			markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16, color: on ? "var(--graph-edge-active)" : "var(--graph-edge)" },
			focusable: false,
			selectable: false,
			data: { view: e, active: on, dim: mode.kind === "focus" && !!active && !on, weight: e.label === "aumenta" ? 2.5 : e.label === "reduz" || e.label === "trata" ? 2 : 1.25, targetW: layout?.nodes.find((p) => p.id === e.target.id)?.w ?? 0 },
		};
	});

	// Recentra a cada troca de foco, filtro ou modo (RQ-070), sem animação com reduced-motion.
	const measured = useNodesInitialized();
	useEffect(() => {
		if (!layout || !measured) return;
		const id = requestAnimationFrame(() => flow.fitView({ padding: 0.02, minZoom: 0.4, maxZoom: 1, duration: reducedMotion() ? 0 : 300 }));
		return () => cancelAnimationFrame(id);
	}, [layout, flow, measured]);

	return (
		<div
			ref={wrap}
			data-map-canvas
			data-map-ready={layout ? "" : undefined}
			className="rc-map relative w-full"
			style={{ height: layout ? Math.min(layout.height, 720) : 360 }}
		>
			{layout && (
				<ReactFlow
					aria-label={label}
					nodes={rfNodes}
					edges={rfEdges}
					nodeTypes={NODE_TYPES_RF}
					edgeTypes={EDGE_TYPES_RF}
					onPaneClick={onClear}
					fitView
					fitViewOptions={{ padding: 0.02, minZoom: 0.4, maxZoom: 1 }}
					minZoom={0.4}
					maxZoom={2}
					nodesDraggable={false}
					nodesConnectable={false}
					elementsSelectable={false}
					nodesFocusable={false}
					edgesFocusable={false}
					zoomOnScroll={false}
					zoomOnDoubleClick={false}
					preventScrolling={false}
					panOnDrag
					zoomOnPinch
					proOptions={{ hideAttribution: true }}
				/>
			)}
		</div>
	);
}

export default function CausalMap(props: Props) {
	return (
		<ReactFlowProvider>
			<Canvas {...props} />
		</ReactFlowProvider>
	);
}
