// Formato CORRELATION_RECORD da Teia Única (ADR-M04), schema em app/data/graph/CORRELATION_RECORD.schema.json.
export type ProvenanceClass = "A_OBSERVED" | "B_PRIMARY" | "C_PUBLISHED" | "D_INTERNAL" | "E_INFERRED";
export type ClaimRole = "FACT" | "OFFICIAL_GUIDANCE" | "SYNTHESIS" | "FRAMEWORK" | "HYPOTHESIS" | "PRODUCT_DECISION" | "RECOMMENDATION";

export type GraphNode = {
  id: string;
  type: string;
  label: string;
  status: "DRAFT" | "PROPOSED" | "DEFINED" | "VALIDATED" | "DEPRECATED";
  source_refs: string[];
  /** Trecho literal do texto de origem (RC-*) que sustenta o nó. */
  source_quote?: string;
  native_ids?: Record<string, string>;
  tags?: string[];
  evidence_refs?: string[];
  url?: string;
  [key: string]: unknown;
};

export type GraphEdge = {
  id: string;
  type: string;
  source: string;
  target: string;
  status: "PROPOSED" | "VALIDATED" | "REJECTED" | "DEPRECATED";
  epistemic: { provenance_class: ProvenanceClass; claim_role: ClaimRole; native_class?: string | null };
  evidence_refs: string[];
  limitations?: string[];
  /** Documento e trecho literal que tornam a relação explícita (ausentes quando E_INFERRED). */
  source_ref?: string;
  source_quote?: string;
  [key: string]: unknown;
};

export type CorrelationGraph = {
  schema_version: "0.1.0";
  example_id?: string;
  note?: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
};
