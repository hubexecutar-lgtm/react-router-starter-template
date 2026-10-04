// Posição dos nós do Explorar, em pixels da própria tela (zoom 1), para que todo nó continue com alvo ≥ 44px
// (RQ-025/077). Radial (focus + context, RQ-070) a partir de 600px; abaixo, em camadas: o que chega ao foco acima,
// o que sai dele abaixo, em duas colunas. O modo "Por quê?" usa o dagre (camadas de cima para baixo).
import type { EdgeView, MapNode } from "@/lib/graph";

export const NODE_H = 56;
const GAP = 8;
const ROW_GAP = 72; // espaço para o rótulo da aresta entre as linhas

export type Placed = { id: string; x: number; y: number; w: number };
export type Layout = { nodes: Placed[]; width: number; height: number };

export function nodeWidth(width: number) {
	return Math.max(120, Math.min(176, Math.floor((width - GAP * 3) / 2)));
}

export function focusLayout(focusId: string, nodes: MapNode[], edges: EdgeView[], width: number): Layout {
	const w = nodeWidth(width);
	const others = nodes.filter((n) => n.id !== focusId);
	if (width >= 600) {
		const r = Math.min(240, width / 2 - w / 2 - GAP);
		const ry = Math.min(r, 200);
		const cx = width / 2;
		const cy = ry + NODE_H / 2 + GAP;
		const placed: Placed[] = [{ id: focusId, x: cx - w / 2, y: cy - NODE_H / 2, w }];
		others.forEach((n, i) => {
			const a = -Math.PI / 2 + (i * 2 * Math.PI) / Math.max(others.length, 1);
			placed.push({ id: n.id, x: cx + r * Math.cos(a) - w / 2, y: cy + ry * Math.sin(a) - NODE_H / 2, w });
		});
		return { nodes: placed, width, height: cy * 2 };
	}
	const incoming = others.filter((n) => edges.some((e) => e.source.id === n.id && e.target.id === focusId));
	const outgoing = others.filter((n) => !incoming.includes(n));
	const rows = (list: MapNode[]) => Math.ceil(list.length / 2);
	const grid = (list: MapNode[], top: number): Placed[] =>
		list.map((n, i) => {
			const col = i % 2;
			const row = Math.floor(i / 2);
			const alone = list.length % 2 === 1 && i === list.length - 1;
			const x = alone ? (width - w) / 2 : GAP + col * (w + GAP) + (width - 2 * w - 3 * GAP) / 2;
			return { id: n.id, x, y: top + row * (NODE_H + ROW_GAP), w };
		});
	const focusTop = GAP + rows(incoming) * (NODE_H + ROW_GAP);
	const placed = [...grid(incoming, GAP), { id: focusId, x: (width - w) / 2, y: focusTop, w }, ...grid(outgoing, focusTop + NODE_H + ROW_GAP)];
	const height = focusTop + NODE_H + (rows(outgoing) ? ROW_GAP + rows(outgoing) * (NODE_H + ROW_GAP) - ROW_GAP : 0) + GAP;
	return { nodes: placed, width, height };
}
