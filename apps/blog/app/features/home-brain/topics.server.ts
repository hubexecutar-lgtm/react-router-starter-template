// Projeção das capacidades do grafo para a home (HOME-BRAIN-001), no loader: o mesmo rc-graph.json do mapa.
// Só leitura: nenhum nó, relação ou localização anatômica nova sai daqui.
import type { BrainTopic } from "./types";

import { RC_GRAPH, exploreHref, nodeById, relationsFor } from "@/lib/graph";

export function getBrainTopics(ids: string[]): BrainTopic[] {
	return ids.flatMap((id) => {
		const node = nodeById(RC_GRAPH, id);
		if (!node || node.type !== "COGNITIVE_CAPACITY") return [];
		const { causes, solutions, impacts, evidence } = relationsFor(RC_GRAPH, id);
		const edges = [...causes, ...solutions, ...impacts].filter((edge, i, all) => all.findIndex((other) => other.id === edge.id) === i);
		return [
			{
				id,
				label: node.label,
				href: exploreHref(id),
				relations: edges.map((edge) => ({ id: edge.id, sentence: edge.sentence, inferred: edge.inferred })),
				sources: evidence.map((source) => ({ id: source.id, label: source.label })),
			},
		];
	});
}
