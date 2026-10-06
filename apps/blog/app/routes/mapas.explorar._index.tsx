// /mapas/explorar/ (LANC-001 SCR-02, RQ-070…080): o mapa causal interativo, no RC-DS-CF (ADR-26, DS-CF-001-mapa).
import type { Route } from "./+types/mapas.explorar._index";

import { ExploreView } from "@/features/mapa/ExploreView";
import DefaultLayout from "@/layouts/DefaultLayout";
import { seo } from "@/lib/seo";

export const meta: Route.MetaFunction = ({ location }) =>
	seo({
		title: "Explorar o mapa causal",
		description: "Um fator no centro e as relações mais próximas: causas, impactos, soluções e evidências.",
		pathname: location.pathname,
	});

export default function MapasExplorar() {
	return (
		<DefaultLayout>
			<ExploreView />
		</DefaultLayout>
	);
}
