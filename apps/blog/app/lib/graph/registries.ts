// Registries canônicos da Teia (LANC-001 PR-L, RQ-122; MIGRATION_PLAN N1). Cada registry é uma projeção do grafo
// por tipo de nó, nunca uma lista paralela: um nó novo no grafo entra sozinho no registry do seu tipo.
// Os registries sem nó no grafo ficam vazios e marcados como pendentes: preencher exige nós novos com citação,
// e isso passa pelo OWNER da Teia (ADR-M04, ADR-17). Funções puras: sem import de JSON nem alias.
import type { CorrelationGraph, GraphNode } from "./types";

export type RegistryEntry = { id: string; label: string; source_refs: string[] };
export type Registry = { node_types: string[]; entries: RegistryEntry[]; pending?: string };

/** Os 8 registries do N1, com os tipos do CORRELATION_RECORD de onde cada um sai. */
export const REGISTRY_TYPES = {
  problems: ["PROBLEM"],
  operational_functions: ["OPERATIONAL_FUNCTION"],
  cognitive_capacities: ["COGNITIVE_CAPACITY"],
  factors: ["RISK_FACTOR"],
  compensations: ["COMPENSATION"],
  controls: ["CONTROL", "METHOD"],
  capabilities: ["CAPABILITY"],
  app_features: ["APP_FEATURE"],
} as const;
export type RegistryName = keyof typeof REGISTRY_TYPES;

/** Problema do índice editorial (RQ-054) ligado a um nó do grafo. */
export type ProblemLink = { id: string; label: string; node: string };

const PENDING = "Sem nós no grafo: preencher exige nós novos com citação e passa pelo OWNER da Teia (ADR-M04).";

const entry = (n: GraphNode): RegistryEntry => ({ id: n.id, label: n.label, source_refs: n.source_refs });

/**
 * Monta os registries. O grafo do Risco Cognitivo ainda não tem nós PROBLEM: os problemas são os do índice
 * editorial (`problems`, de app/data/article-meta.ts), cada um apontando para o nó que o representa.
 */
export function buildRegistries(graph: CorrelationGraph, problems: readonly ProblemLink[] = []): Record<RegistryName, Registry> {
  const out = {} as Record<RegistryName, Registry>;
  for (const [name, types] of Object.entries(REGISTRY_TYPES) as [RegistryName, readonly string[]][]) {
    const entries = graph.nodes.filter((n) => types.includes(n.type)).map(entry);
    out[name] = { node_types: [...types], entries, ...(entries.length ? {} : { pending: PENDING }) };
  }
  if (!out.problems.entries.length && problems.length) {
    const byId = new Map(graph.nodes.map((n) => [n.id, n]));
    out.problems = {
      node_types: ["PROBLEM"],
      entries: problems.map((p) => ({ id: p.node, label: p.label, source_refs: byId.get(p.node)?.source_refs ?? [] })),
    };
  }
  return out;
}

/** IDs de todos os registries, para validar referências cruzadas. */
export const registryIds = (r: Record<RegistryName, Registry>) => new Set(Object.values(r).flatMap((x) => x.entries.map((e) => e.id)));
