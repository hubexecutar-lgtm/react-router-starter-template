// Leitura do mapa causal para a interface (LANC-001 PR-H, RQ-070…080): relações de um nó, cadeia "Por quê?",
// frases das arestas e presets de modo. Funções puras sobre a projeção pública (project.ts); nada aqui cria evidência.
import { MAX_VISIBLE_NODES, edgeSemantics, evidenceFor, neighborhood, publicMap, visualType, type VisualType } from "./project";
import type { CorrelationGraph, GraphEdge, GraphNode } from "./types";

/** Nó focal quando a URL não traz `?foco=`: o "Perda de contexto" do wireframe SCR-02. */
export const DEFAULT_FOCUS = "EVT-PERDA-CONTEXTO";

/** Forma + rótulo por tipo visual (04-UIX-SPEC §5, RQ-076): o tipo nunca depende só da cor. */
export const NODE_TYPES: Record<VisualType, { glyph: string; label: string }> = {
  context: { glyph: "●", label: "Contexto" },
  demand: { glyph: "◆", label: "Fator de demanda" },
  capacity: { glyph: "■", label: "Capacidade cognitiva" },
  vulnerability: { glyph: "▲", label: "Vulnerabilidade" },
  risk: { glyph: "!", label: "Risco" },
  event: { glyph: "✦", label: "Evento" },
  impact: { glyph: "⬢", label: "Impacto" },
  compensation: { glyph: "✓", label: "Compensação" },
  evidence: { glyph: "○", label: "Evidência" },
};

/** Modos do mapa (RQ-080): presets de filtro por tipo sobre o mesmo grafo. */
export const MODES = [
  { id: "problemas", label: "Problemas", types: ["demand", "capacity", "risk", "event", "impact"] },
  { id: "solucoes", label: "Soluções", types: ["compensation"] },
  { id: "evidencias", label: "Evidências", types: ["evidence"] },
] as const satisfies readonly { id: string; label: string; types: readonly VisualType[] }[];
export type ModeId = (typeof MODES)[number]["id"];

const POSITIVE = new Set(["increases", "contributes_to"]);
const REDUCING = new Set(["decreases", "implements"]);

export type MapNode = GraphNode & { visual: VisualType };

export function nodeById(graph: CorrelationGraph, id: string): MapNode | null {
  const node = graph.nodes.find((n) => n.id === id);
  const visual = node ? visualType(node) : null;
  return node && visual ? { ...node, visual } : null;
}

/** Nós com página própria em /mapas/explorar/:fatorId (as evidências ficam em /fontes/). */
export function factorIds(graph: CorrelationGraph): string[] {
  return publicMap(graph)
    .nodes.filter((n) => visualType(n) !== "evidence")
    .map((n) => n.id);
}

export const factorHref = (id: string) => `/mapas/explorar/${id.toLowerCase()}/`;
export const exploreHref = (id: string) => `/mapas/explorar/?foco=${encodeURIComponent(id)}`;
/** O segmento da URL vem em minúsculas; o ID canônico, em maiúsculas. */
export const idFromParam = (param: string) => param.toUpperCase();

export type EdgeView = { id: string; source: MapNode; target: MapNode; label: string; inferred: boolean; dashed: boolean; sentence: string };

/** A aresta em frase (RQ-073): "Interrupções aumenta Atenção (inferido)". */
export function edgeView(graph: CorrelationGraph, edge: GraphEdge): EdgeView {
  const sem = edgeSemantics(edge)!;
  const source = nodeById(graph, edge.source)!;
  const target = nodeById(graph, edge.target)!;
  const inferred = edge.epistemic.provenance_class === "E_INFERRED";
  const label = sem.label.replace(" (inferido)", "");
  return {
    id: edge.id,
    source,
    target,
    label,
    inferred,
    dashed: sem.dashed,
    sentence: `${source.label} ${label} ${target.label}${inferred ? " (inferido)" : ""}`,
  };
}

/** Todas as arestas do mapa público, em frase. */
export function allEdgeViews(graph: CorrelationGraph): EdgeView[] {
  return publicMap(graph).edges.map((e) => edgeView(graph, e));
}

/**
 * Relações de um nó, separadas nas abas do sheet (RQ-071). Toda aresta incidente cai em exatamente uma aba:
 * causas = o que aumenta ou contribui para o nó; soluções = o que o reduz ou o implementa; impactos = tudo o que
 * parte dele. Evidências vêm das arestas SUPPORTED_BY.
 */
export function relationsFor(graph: CorrelationGraph, id: string) {
  const { edges } = publicMap(graph);
  const views = edges.filter((e) => e.source === id || e.target === id).map((e) => edgeView(graph, e));
  const rel = (v: EdgeView) => edgeSemantics(edges.find((e) => e.id === v.id)!)!.relation;
  return {
    causes: views.filter((v) => v.target.id === id && POSITIVE.has(rel(v))),
    solutions: views.filter((v) => v.target.id === id && REDUCING.has(rel(v))),
    impacts: views.filter((v) => v.source.id === id),
    evidence: evidenceFor(graph, id),
  };
}

/**
 * Modo "Por quê?" (RQ-078): a cadeia de causas acima do nó (subindo pelas arestas que aumentam ou contribuem) e as
 * compensações abaixo (subindo pelas que reduzem ou implementam). Busca em largura, sem repetir aresta.
 */
export function chainFor(graph: CorrelationGraph, id: string) {
  const { edges } = publicMap(graph);
  const walk = (kinds: Set<string>) => {
    const out: GraphEdge[] = [];
    const queue = [id];
    const seen = new Set(queue);
    while (queue.length) {
      const current = queue.shift()!;
      for (const e of edges) {
        if (e.target !== current || !kinds.has(edgeSemantics(e)!.relation)) continue;
        out.push(e);
        if (!seen.has(e.source)) {
          seen.add(e.source);
          queue.push(e.source);
        }
      }
    }
    return out.map((e) => edgeView(graph, e));
  };
  return { causes: walk(POSITIVE), compensations: walk(REDUCING) };
}

/**
 * O que o mapa mostra (RQ-070/074/080): o nó focal e seus vizinhos (≤ 8), filtrados por tipo. O foco nunca sai
 * pelo filtro, então o filtro reduz nós sem quebrar o foco.
 */
export function visibleGraph(graph: CorrelationGraph, focusId: string, types?: readonly VisualType[]) {
  const hood = neighborhood(graph, focusId);
  const keep = (n: GraphNode) => n.id === focusId || !types?.length || types.includes(visualType(n)!);
  const nodes = hood.nodes.filter(keep).map((n) => nodeById(graph, n.id)!);
  const ids = new Set(nodes.map((n) => n.id));
  const edges = hood.edges.filter((e) => ids.has(e.source) && ids.has(e.target)).map((e) => edgeView(graph, e));
  // Evidência não é aresta causal (SUPPORTED_BY, §3): no modo Evidências, as fontes do foco entram como nós
  // ligados por "sustentado por", sem passar do limite de nós.
  if (types?.includes("evidence")) {
    for (const ev of evidenceFor(graph, focusId)) {
      if (nodes.length >= MAX_VISIBLE_NODES) break;
      const source = nodes[0];
      const target = nodeById(graph, ev.id)!;
      nodes.push(target);
      edges.push({
        id: `${focusId}->${ev.id}`,
        source,
        target,
        label: "sustentado por",
        inferred: false,
        dashed: false,
        sentence: `${source.label} sustentado por ${target.label}`,
      });
    }
  }
  return { focus: nodeById(graph, focusId)!, nodes, edges, hidden: hood.hidden };
}
