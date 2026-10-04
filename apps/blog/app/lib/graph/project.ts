// Projeção do grafo da Teia para o mapa causal (06-DATA-SPEC-GRAFO-CAUSAL §2–4). Projeção não é fonte.
import type { CorrelationGraph, GraphEdge, GraphNode } from "./types";

/** Os 9 tipos visuais da spec RC-MOBILE-CAUSAL-MAP-UI-001. */
export const VISUAL_TYPES = ["context", "demand", "capacity", "vulnerability", "risk", "event", "impact", "compensation", "evidence"] as const;
export type VisualType = (typeof VISUAL_TYPES)[number];

/** Nunca no mapa público (CF-06): a Teia restringe a associação baseada em evidência. */
export const PRIVATE_NODE_TYPES = ["NEURODIVERGENCE_PROFILE"];

const BY_TYPE: Record<string, VisualType> = {
  OBJECTIVE: "context",
  CONTEXT: "context",
  RISK_FACTOR: "demand",
  COGNITIVE_CAPACITY: "capacity",
  VULNERABILITY: "vulnerability",
  EXPOSURE: "risk",
  RISK: "risk",
  COMPENSATION: "compensation",
  CONTROL: "compensation",
  METHOD: "compensation",
  SOLUTION: "compensation",
  EVIDENCE: "evidence",
  CLAIM: "evidence",
};

/** Tipo visual do nó, ou null quando o nó fica fora do mapa público (METRIC, LEARNING, perfis…). */
export function visualType(node: GraphNode): VisualType | null {
  if (PRIVATE_NODE_TYPES.includes(node.type)) return null;
  if (node.type === "OPERATIONAL_IMPACT") {
    // CF-16: evento operacional = OPERATIONAL_IMPACT + tag stage:event, sem mudar o schema.
    if (node.tags?.includes("stage:event")) return "event";
    return "impact";
  }
  return BY_TYPE[node.type] ?? null;
}

export type Relation = "increases" | "contributes_to" | "decreases" | "moderates" | "associated_with" | "implements";
export type EdgeSemantics = { relation: Relation; polarity: "positive" | "negative" | "unknown" | "neutral"; dashed: boolean; label: string };

const RELATIONS: Record<string, Omit<EdgeSemantics, "dashed">> = {
  INCREASES_DEMAND_ON: { relation: "increases", polarity: "positive", label: "aumenta" },
  CONTRIBUTES_TO: { relation: "contributes_to", polarity: "positive", label: "contribui para" },
  MAY_PRODUCE: { relation: "contributes_to", polarity: "positive", label: "pode produzir" },
  MITIGATES: { relation: "decreases", polarity: "negative", label: "reduz" },
  ADDRESSES: { relation: "decreases", polarity: "negative", label: "trata" },
  MODULATES: { relation: "moderates", polarity: "unknown", label: "modula" },
  ASSOCIATED_WITH: { relation: "associated_with", polarity: "neutral", label: "associado a" },
  IMPLEMENTS: { relation: "implements", polarity: "neutral", label: "implementa" },
};

/** Semântica da aresta no mapa (§3). SUPPORTED_BY não vira aresta: vira lista de evidências. */
export function edgeSemantics(edge: GraphEdge): EdgeSemantics | null {
  const base = RELATIONS[edge.type];
  if (!base) return null;
  const inferred = edge.epistemic.provenance_class === "E_INFERRED";
  return { ...base, dashed: inferred || base.relation === "associated_with", label: inferred ? `${base.label} (inferido)` : base.label };
}

export type EvidenceLevel = "strong" | "moderate" | "framework" | "hypothesis" | "unknown";

/** Nível de evidência exibido (§4): derivado, nunca digitado. "framework" = conceito do projeto (RQ-043). */
export function evidenceLevel(edge: GraphEdge): EvidenceLevel {
  const { provenance_class: p, claim_role: r } = edge.epistemic;
  if (p === "E_INFERRED" || r === "HYPOTHESIS") return "hypothesis";
  if (p === "D_INTERNAL" && (r === "FRAMEWORK" || r === "PRODUCT_DECISION")) return "framework";
  if (!edge.evidence_refs.length) return "unknown";
  if (p === "A_OBSERVED" || p === "B_PRIMARY") return "strong";
  if (p === "C_PUBLISHED") return "moderate";
  return "unknown";
}

/** Evidências de um nó: alvos das arestas SUPPORTED_BY que partem dele. */
export function evidenceFor(graph: CorrelationGraph, nodeId: string): GraphNode[] {
  const ids = graph.edges.filter((e) => e.type === "SUPPORTED_BY" && e.source === nodeId).map((e) => e.target);
  return graph.nodes.filter((n) => ids.includes(n.id));
}

/** Nós e arestas que entram no mapa público. */
export function publicMap(graph: CorrelationGraph) {
  const nodes = graph.nodes.filter((n) => visualType(n) !== null);
  const ids = new Set(nodes.map((n) => n.id));
  const edges = graph.edges.filter((e) => edgeSemantics(e) && ids.has(e.source) && ids.has(e.target) && e.status !== "REJECTED" && e.status !== "DEPRECATED");
  return { nodes, edges };
}

/** Limite da carga inicial do mapa: nó focal + vizinhos (RQ-070). */
export const MAX_VISIBLE_NODES = 8;

/**
 * Vizinhança de um nó focal no mapa público, com no máximo `limit` nós (focal incluído).
 * Vizinhos com relação explícita vêm antes dos inferidos; empate pela ordem do grafo.
 */
export function neighborhood(graph: CorrelationGraph, focalId: string, limit = MAX_VISIBLE_NODES) {
  const map = publicMap(graph);
  const focal = map.nodes.find((n) => n.id === focalId);
  if (!focal) throw new Error(`Nó focal fora do mapa público: ${focalId}`);
  const incident = map.edges
    .filter((e) => e.source === focalId || e.target === focalId)
    .sort((a, b) => Number(a.epistemic.provenance_class === "E_INFERRED") - Number(b.epistemic.provenance_class === "E_INFERRED"));
  const ids = [focalId];
  for (const e of incident) {
    const other = e.source === focalId ? e.target : e.source;
    if (!ids.includes(other) && ids.length < limit) ids.push(other);
  }
  const nodes = ids.map((id) => map.nodes.find((n) => n.id === id)!);
  const edges = map.edges.filter((e) => ids.includes(e.source) && ids.includes(e.target));
  return { focal, nodes, edges, hidden: incident.length - (ids.length - 1) };
}
