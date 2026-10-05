// Bloco correlation_refs dos adapters da Teia (ADAPTER_QUICK_FRAMEWORK / ADAPTER_SOLUTION_STORE, v0.1.0).
// O registro de origem fica intacto: o adapter só acrescenta este bloco. Toda referência aponta para um nó do grafo
// e carrega como foi obtida; ligação por correspondência de texto é sempre E_INFERRED (nunca vira evidência).
import type { CorrelationGraph, ProvenanceClass } from "../types";

export const REF_FIELDS = [
  "problem_refs",
  "concept_refs",
  "operational_function_refs",
  "cognitive_capacity_refs",
  "factor_refs",
  "claim_refs",
  "evidence_refs",
  "method_refs",
  "compensation_refs",
  "control_refs",
  "capability_refs",
  "asset_refs",
] as const;
export type RefField = (typeof REF_FIELDS)[number];

export type CorrelationRef = {
  /** ID de um nó do grafo canônico. */
  ref: string;
  provenance_class: ProvenanceClass;
  /** De onde veio: seção do registro de origem, campo ou documento. */
  via: string;
  /** Trecho literal que sustenta a referência, quando explícita. */
  quote?: string;
};

export type CorrelationRefs = Partial<Record<RefField, CorrelationRef[]>>;

/** Candidata a solução: só nós SOLUTION que já existem no grafo; nada é criado (ADAPTER-QF-001). */
export type SolutionCandidate = { solution_id: string; via_compensation: string };

/** Campo de destino de cada tipo de nó. */
export const FIELD_BY_TYPE: Record<string, RefField> = {
  PROBLEM: "problem_refs",
  CONCEPT: "concept_refs",
  OPERATIONAL_FUNCTION: "operational_function_refs",
  COGNITIVE_CAPACITY: "cognitive_capacity_refs",
  RISK_FACTOR: "factor_refs",
  OPERATIONAL_IMPACT: "problem_refs",
  CLAIM: "claim_refs",
  EVIDENCE: "evidence_refs",
  METHOD: "method_refs",
  COMPENSATION: "compensation_refs",
  CONTROL: "control_refs",
  CAPABILITY: "capability_refs",
  ASSET: "asset_refs",
};

/** Referências que apontam para nós inexistentes (deve ser vazio; teste "todo correlation_ref aponta para nó"). */
export function danglingRefs(graph: CorrelationGraph, refs: CorrelationRefs, candidates: SolutionCandidate[] = []): string[] {
  const ids = new Set(graph.nodes.map((n) => n.id));
  const bad = Object.values(refs)
    .flat()
    .filter((r) => r && !ids.has(r.ref))
    .map((r) => r!.ref);
  for (const c of candidates) {
    if (!ids.has(c.solution_id)) bad.push(c.solution_id);
    if (!ids.has(c.via_compensation)) bad.push(c.via_compensation);
  }
  return bad;
}

/** Soluções do grafo que implementam alguma das compensações referenciadas. */
export function solutionCandidates(graph: CorrelationGraph, refs: CorrelationRefs): SolutionCandidate[] {
  const comps = new Set((refs.compensation_refs ?? []).map((r) => r.ref));
  const solutions = new Set(graph.nodes.filter((n) => n.type === "SOLUTION").map((n) => n.id));
  return graph.edges
    .filter((e) => e.type === "IMPLEMENTS" && comps.has(e.target) && solutions.has(e.source))
    .map((e) => ({ solution_id: e.source, via_compensation: e.target }));
}
