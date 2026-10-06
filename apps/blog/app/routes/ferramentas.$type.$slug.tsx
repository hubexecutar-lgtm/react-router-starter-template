import { data, redirect } from "react-router";

import type { Route } from "./+types/ferramentas.$type.$slug";

import { solutionBySlug } from "@/features/solutions/data";
import { SolutionDetail } from "@/features/solutions/SolutionDetail";
import { ItemDetail } from "@/features/store/components/item-detail";
import { typeBySegment } from "@/features/store/data/item-types";
import { RETIRED_ITEM_PATHS, getItem } from "@/features/store/data/repository";
import DefaultLayout from "@/layouts/DefaultLayout";
import { useTrackView } from "@/lib/analytics/track";
import { seo } from "@/lib/seo";

// Template de item (ADR-BLOG-JORNADA-ROTAS-001 §2.2, ADR-26): /ferramentas/:type/:slug/ no RC-DS-CF. Soluções
// (/ferramentas/solucoes/:slug/, ADR-24) usam o SolutionDetail (card 2×2 do schema + texto do MDX); outros tipos, o
// ItemDetail. Itens de exemplo retirados respondem 302 para /ferramentas/; slug inexistente = 404.
const find = (type: string, slug: string) => {
	const def = typeBySegment(type);
	return def ? getItem(def.type, slug) : undefined;
};

export function loader({ params }: Route.LoaderArgs) {
	// Itens de exemplo saíram do catálogo (ADR-26): as URLs já publicadas respondem 302 para /ferramentas/.
	if (RETIRED_ITEM_PATHS.includes(`/ferramentas/${params.type}/${params.slug}/`)) throw redirect("/ferramentas/", 302);
	if (!find(params.type, params.slug)) throw data(null, { status: 404 });
	return null;
}

export const meta: Route.MetaFunction = ({ params, location }) => {
	const item = find(params.type, params.slug);
	return seo({
		title: item ? `${item.name} — ${item.type === "solution" ? "Soluções" : "Ferramentas e Soluções"}` : undefined,
		description: item?.type === "solution" ? item.context : item?.description,
		pathname: location.pathname,
	});
};

export default function FerramentasItem({ params }: Route.ComponentProps) {
	const item = find(params.type, params.slug)!;
	useTrackView({ stage: "TOOL", action: "view", asset_id: params.slug }, `${params.type}/${params.slug}`);
	const solution = item.type === "solution" ? solutionBySlug(item.slug) : undefined;
	if (solution)
		return (
			<DefaultLayout>
				<SolutionDetail solution={solution} />
			</DefaultLayout>
		);
	return (
		<DefaultLayout>
			<ItemDetail item={item} />
		</DefaultLayout>
	);
}
