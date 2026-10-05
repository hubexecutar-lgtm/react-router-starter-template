import { data } from "react-router";


import type { Route } from "./+types/ferramentas.$type.$slug";

import { solutionBySlug } from "@/features/solutions/data";
import { SolutionDetail } from "@/features/solutions/SolutionDetail";
import { ItemDetail } from "@/features/store/components/item-detail";
import { typeBySegment } from "@/features/store/data/item-types";
import { getItem } from "@/features/store/data/repository";
import DefaultLayout from "@/layouts/DefaultLayout";
import { useTrackView } from "@/lib/analytics/track";
import { seo } from "@/lib/seo";

// Item detail: /ferramentas/:type/:slug (ex-/loja, ADR-16). Soluções (/ferramentas/solucoes/:slug, ADR-24) têm página
// própria: card 2×2 do schema + texto do MDX.
const find = (type: string, slug: string) => {
	const def = typeBySegment(type);
	return def ? getItem(def.type, slug) : undefined;
};

export function loader({ params }: Route.LoaderArgs) {
	if (!find(params.type, params.slug)) throw data(null, { status: 404 });
	return null;
}

export const meta: Route.MetaFunction = ({ params, location }) => {
	const item = find(params.type, params.slug);
	return seo({
		title: item ? `${item.name} — ${item.type === "solution" ? "Soluções" : "Ferramentas cognitivas"}` : undefined,
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
			<section className="stories-container max-w-[var(--ref-wide-width)] pt-12 pb-16 lg:pt-[88px] lg:pb-24">
				<ItemDetail item={item} />
			</section>
		</DefaultLayout>
	);
}
