// O grafo canônico lido do disco, para specs que importam a lib sem o alias "@/".
import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { CorrelationGraph } from "../app/lib/graph/types";

export const RC_GRAPH_FOR_TESTS: CorrelationGraph = JSON.parse(readFileSync(join(process.cwd(), "app/data/graph/rc-graph.json"), "utf8"));
