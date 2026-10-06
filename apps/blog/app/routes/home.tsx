// Home (ADR-BLOG-JORNADA-ROTAS-001 §2.2, ADR-26): apresenta o problema, orienta e mostra a prévia de Blog, Mapa e
// Ferramentas. O loader projeta as capacidades do cérebro (o mesmo do /mapas/) e as prévias com conteúdo real.
// O resto do RC-HOME-002 está em /sobre/; o RC-LP-001, em /comece/.
import type { Route } from "./+types/home";

import { Landing, type HomePreview } from "@/components/landing/Landing";
import { RC_IMAGES } from "@/data/article-media";
import { HOME_HERO, HOME_MAP } from "@/data/home";
import { getBrainTopics } from "@/features/home-brain/topics.server";
import { SOLUTIONS } from "@/features/solutions/data";
import DefaultLayout from "@/layouts/DefaultLayout";
import { getStories } from "@/lib/articles";
import { seo } from "@/lib/seo";

export const meta: Route.MetaFunction = ({ location }) =>
	seo({ title: undefined, description: HOME_HERO.lead[1], image: RC_IMAGES.binoculosMapaCerebral.landscape.src, pathname: location.pathname });

export function loader() {
	const guide = getStories()[0];
	const preview: HomePreview = {
		article: guide ? { title: guide.title, description: guide.description, href: guide.href } : null,
		tools: [
			{ name: "Prisma de execução", text: "Organize uma meta em uma folha A4 local, sem conta, e imprima ou salve em PDF.", href: "/prisma/", kind: "Ferramenta interativa" },
			...SOLUTIONS.slice(0, 3).map((s) => ({ name: s.name, text: s.yellow12, href: `/ferramentas/solucoes/${s.slug}/`, kind: "Solução" })),
		],
	};
	return { brainTopics: getBrainTopics(HOME_MAP.functions.map((f) => f.id)), preview };
}

export default function Page({ loaderData }: Route.ComponentProps) {
	return (
		<DefaultLayout>
			<Landing brainTopics={loaderData.brainTopics} preview={loaderData.preview} />
		</DefaultLayout>
	);
}
