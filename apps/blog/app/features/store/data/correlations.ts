// Ferramentas na Teia (LANC-001 PR-L, RQ-121; ADAPTER-SOLUTION-STORE-001, MIGRATION_PLAN N7).
// Só ferramentas publicadas entram aqui, cada uma com a citação que sustenta a referência. Os itens do catálogo
// ainda são dados de exemplo (mock-items.ts) e por isso não recebem correlation_refs: nada é inventado.
import type { CorrelationRefs } from "@/lib/graph/adapters/correlation-refs";

export type ToolCorrelation = { id: string; name: string; href: string; refs: CorrelationRefs };

export const TOOL_CORRELATIONS: ToolCorrelation[] = [
	{
		id: "prisma",
		name: "Prisma de execução",
		href: "/prisma/",
		refs: {
			compensation_refs: [
				{
					ref: "CMP-EXTERNALIZACAO",
					provenance_class: "D_INTERNAL",
					via: "app/features/prisma/PrismaIntro.tsx (RC-PWA-PRISMA-PRD-001)",
					quote: "Solução · Externalização cognitiva",
				},
			],
		},
	},
];
