// Descoberta de ferramentas por problema + compensação (LANC-001 PR-L, RQ-121). O problema de uma ferramenta não é
// declarado: sai do grafo, a partir das compensações que ela referencia (compensação → o que ela reduz → o que isso
// aumenta). Como passa por relações do grafo, o resultado herda a proveniência delas (inferida quando alguma é).
import { edgeSemantics, publicMap } from "./project";
import type { CorrelationGraph } from "./types";
import type { CorrelationRefs } from "./adapters/correlation-refs";

export type DerivedProblem = { node: string; inferred: boolean };

/** Nós-problema alcançados a partir das compensações: alvo direto ou um passo adiante pelo que o alvo aumenta. */
export function problemsReached(graph: CorrelationGraph, refs: CorrelationRefs, problemNodes: readonly string[]): DerivedProblem[] {
  const { edges } = publicMap(graph);
  const inferred = (id: string) => edges.find((e) => e.id === id)!.epistemic.provenance_class === "E_INFERRED";
  const out = new Map<string, boolean>();
  for (const c of refs.compensation_refs ?? []) {
    for (const e of edges.filter((x) => x.source === c.ref && edgeSemantics(x)!.relation === "decreases")) {
      if (problemNodes.includes(e.target)) out.set(e.target, (out.get(e.target) ?? true) && inferred(e.id));
      for (const f of edges.filter((x) => x.source === e.target && ["increases", "contributes_to"].includes(edgeSemantics(x)!.relation))) {
        if (problemNodes.includes(f.target)) out.set(f.target, (out.get(f.target) ?? true) && (inferred(e.id) || inferred(f.id)));
      }
    }
  }
  return [...out].map(([node, inf]) => ({ node, inferred: inf }));
}
