// Home RC-HOME-002 (HOME-BRAIN-001): a home do esboço com o cérebro 3D ligado ao mapa. O loader projeta as
// capacidades dos seletores a partir do grafo (relações e link ?foco=) e vai para o HTML pré-renderizado.
// O RC-LP-001, que era a home (LANC-001 RQ-040), está em /comece/; a listagem de artigos, em /artigos/.
import type { Route } from "./+types/home";

import { Landing } from "@/components/landing/Landing";
import { RC_IMAGES } from "@/data/article-media";
import { HOME_HERO, HOME_MAP } from "@/data/home";
import { getBrainTopics } from "@/features/home-brain/topics.server";
import DefaultLayout from "@/layouts/DefaultLayout";
import { seo } from "@/lib/seo";
import homeCss from "@/styles/home.css?url";

/** Tokens e CSS próprios da home (ADR-23): só esta rota carrega. */
export const links: Route.LinksFunction = () => [{ rel: "stylesheet", href: homeCss }];

export const meta: Route.MetaFunction = ({ location }) =>
	seo({ title: undefined, description: HOME_HERO.lead[1], image: RC_IMAGES.binoculosMapaCerebral.landscape.src, pathname: location.pathname });

export function loader() {
	return { brainTopics: getBrainTopics(HOME_MAP.functions.map((f) => f.id)) };
}

export default function Page({ loaderData }: Route.ComponentProps) {
	return (
		<DefaultLayout>
			<Landing brainTopics={loaderData.brainTopics} />
		</DefaultLayout>
	);
}
