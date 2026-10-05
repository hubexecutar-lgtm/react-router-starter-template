// /mapas/personalizar/ (LANC-001 SCR-04, RQ-090): focos de trabalho, interesses e "Mostrar evidências", guardados
// só neste navegador.
import type { Route } from "./+types/mapas.personalizar";

import { Personalize } from "@/features/mapa/Personalize";
import DefaultLayout from "@/layouts/DefaultLayout";
import { seo } from "@/lib/seo";

export const meta: Route.MetaFunction = ({ location }) =>
	seo({
		title: "Personalizar o mapa causal",
		description: "Escolha focos de trabalho e interesses para o mapa causal. Muda só a ordem e o destaque, e fica neste navegador.",
		pathname: location.pathname,
	});

export default function MapasPersonalizar() {
	return (
		<DefaultLayout>
			<Personalize />
		</DefaultLayout>
	);
}
