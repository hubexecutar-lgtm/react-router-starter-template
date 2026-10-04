// Grafo canônico do Risco Cognitivo (LANC-001 PR-G, ADR-M04). Fica no blog até um segundo app consumir (RQ-064).
import data from "@/data/graph/rc-graph.json";

import type { CorrelationGraph } from "./types";

export const RC_GRAPH = data as CorrelationGraph;

export * from "./project";
export * from "./types";
