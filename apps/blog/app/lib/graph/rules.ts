// Regras do 06-DATA-SPEC-GRAFO-CAUSAL §5 (2–7) e da Teia (VALIDATION-TEIA-001) que o JSON Schema não cobre.
// A regra 1 (schema) roda com Ajv em tests/graph.spec.ts. Funções puras: sem import de JSON nem alias.
import { MAX_VISIBLE_NODES, PRIVATE_NODE_TYPES, neighborhood, publicMap } from "./project";
import type { CorrelationGraph } from "./types";

/** Documentos canônicos que um nó pode citar como origem (RQ-062). */
export const CANONICAL_SOURCES = ["RC-LP-001", "RC-ART-P1-001", "RC-ART-P2-001", "RC-ART-P3-001", "RC-ART-MASTER-001", "RC-SRC-001", "RC-HOME-002"];

const NUMBER = /\d|%/;

export function graphViolations(graph: CorrelationGraph): string[] {
  const out: string[] = [];
  const nodeIds = new Set<string>();
  // 2. IDs estáveis e únicos; arestas apontam para nós existentes.
  for (const n of graph.nodes) {
    if (nodeIds.has(n.id)) out.push(`2: nó duplicado ${n.id}`);
    nodeIds.add(n.id);
    if (!/^[A-Z]{2,4}(-[A-Z0-9]+)+$/.test(n.id)) out.push(`2: id fora do padrão ${n.id}`);
  }
  const edgeIds = new Set<string>();
  for (const e of graph.edges) {
    if (edgeIds.has(e.id) || nodeIds.has(e.id)) out.push(`2: aresta duplicada ${e.id}`);
    edgeIds.add(e.id);
    if (!nodeIds.has(e.source)) out.push(`2: ${e.id} parte de nó inexistente ${e.source}`);
    if (!nodeIds.has(e.target)) out.push(`2: ${e.id} chega a nó inexistente ${e.target}`);
    if (e.source === e.target) out.push(`2: ${e.id} é um laço`);
    // 3. Toda aresta tem proveniência e status.
    if (!e.epistemic?.provenance_class || !e.status) out.push(`3: ${e.id} sem provenance_class ou status`);
    // 5. Relação não explícita = E_INFERRED + PROPOSED; explícita traz o trecho de origem.
    const inferred = e.epistemic?.provenance_class === "E_INFERRED";
    if (inferred && e.status !== "PROPOSED") out.push(`5: ${e.id} inferida deve ser PROPOSED`);
    if (inferred && ["FACT", "OFFICIAL_GUIDANCE"].includes(e.epistemic.claim_role)) out.push(`5: ${e.id} inferida marcada como ${e.epistemic.claim_role}`);
    if (inferred && e.type === "SUPPORTED_BY") out.push(`5: ${e.id} inferida não pode ser evidência`);
    if (!inferred && !(e.source_ref && e.source_quote)) out.push(`5: ${e.id} não inferida sem source_ref/source_quote`);
    // 4. Nenhum número sem evidência.
    for (const key of ["value", "metric", "weight", "effect_size"]) {
      if (key in e && !e.evidence_refs.length) out.push(`4: ${e.id} tem ${key} sem evidence_refs`);
    }
    if (e.type === "SUPPORTED_BY" && !e.evidence_refs.includes(e.target)) out.push(`4: ${e.id} SUPPORTED_BY sem a evidência em evidence_refs`);
    for (const ref of e.evidence_refs) if (!nodeIds.has(ref)) out.push(`4: ${e.id} cita evidência inexistente ${ref}`);
  }
  for (const n of graph.nodes) {
    // 4. Métrica ou número exige evidence_refs (fontes EVIDENCE citam a própria norma, ex.: ISO 31000:2018).
    const numeric = n.type === "METRIC" || "value" in n || (n.type !== "EVIDENCE" && NUMBER.test(n.label));
    if (numeric && !n.evidence_refs?.length) out.push(`4: ${n.id} tem número sem evidence_refs`);
    // 6. Todo nó cita um documento canônico de origem.
    if (!n.source_refs.some((r) => CANONICAL_SOURCES.includes(r))) out.push(`6: ${n.id} sem documento canônico em source_refs`);
    if (!n.source_quote) out.push(`6: ${n.id} sem source_quote`);
    if (PRIVATE_NODE_TYPES.includes(n.type)) out.push(`CF-06: ${n.id} ${n.type} não entra no grafo público`);
  }
  // 7. Projeção: nó focal + vizinhos ≤ 8, para qualquer nó do mapa.
  for (const n of publicMap(graph).nodes) {
    const view = neighborhood(graph, n.id);
    if (view.nodes.length > MAX_VISIBLE_NODES) out.push(`7: ${n.id} abre com ${view.nodes.length} nós`);
  }
  return out;
}
