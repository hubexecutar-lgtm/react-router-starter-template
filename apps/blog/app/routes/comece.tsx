// Comece por aqui (HOME-BRAIN-001): o texto canônico RC-LP-001 (LANC-001 RQ-040), sem reescrita, que era a home até
// a home nova do esboço (RC-HOME-002) entrar. Mesma composição do híbrido (ADR-22), agora em rota própria.
import type { Route } from "./+types/comece";

import { CanonicalLanding } from "@/components/landing/CanonicalLanding";
import { RC_IMAGES } from "@/data/article-media";
import { LANDING } from "@/data/landing";
import DefaultLayout from "@/layouts/DefaultLayout";
import { seo } from "@/lib/seo";

const lead = LANDING.sections[0].blocks[0];

export const meta: Route.MetaFunction = ({ location }) =>
	seo({ title: "Comece por aqui", description: "p" in lead ? lead.p : "", image: RC_IMAGES.binoculosMapaCerebral.landscape.src, pathname: location.pathname });

export default function Comece() {
	return (
		<DefaultLayout>
			<CanonicalLanding />
		</DefaultLayout>
	);
}
