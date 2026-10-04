import { data } from "react-router";

import type { Route } from "./+types/ferramentas.$type.$slug";

import { ItemDetail } from "@/features/store/components/item-detail";
import { typeBySegment } from "@/features/store/data/item-types";
import { getItem } from "@/features/store/data/repository";
import DefaultLayout from "@/layouts/DefaultLayout";
import { seo } from "@/lib/seo";

// Item detail: /ferramentas/:type/:slug (ex-/loja, ADR-14).
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
		title: item ? `${item.name} — Ferramentas cognitivas` : undefined,
		description: item?.description,
		pathname: location.pathname,
	});
};

export default function FerramentasItem({ params }: Route.ComponentProps) {
	const item = find(params.type, params.slug)!;
	return (
		<DefaultLayout>
			<section className="container max-w-5xl pt-12 pb-16 lg:pt-20 lg:pb-24">
				<ItemDetail item={item} />
			</section>
		</DefaultLayout>
	);
}
