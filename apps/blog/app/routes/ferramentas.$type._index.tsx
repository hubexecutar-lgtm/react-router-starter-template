import { data } from "react-router";

import type { Route } from "./+types/ferramentas.$type._index";

import { StoreCatalog } from "@/features/store/components/store-catalog";
import { typeBySegment } from "@/features/store/data/item-types";
import { listItems } from "@/features/store/data/repository";
import DefaultLayout from "@/layouts/DefaultLayout";
import { seo } from "@/lib/seo";

// Catalog with a fixed type: /ferramentas/{skills,agentes,…} (ex-/loja, ADR-14).
export function loader({ params }: Route.LoaderArgs) {
	if (!typeBySegment(params.type)) throw data(null, { status: 404 });
	return null;
}

export const meta: Route.MetaFunction = ({ params, location }) => {
	const def = typeBySegment(params.type);
	return seo({
		title: def ? `${def.plural} — Ferramentas cognitivas` : undefined,
		description: def?.description,
		pathname: location.pathname,
	});
};

export default function FerramentasType({ params }: Route.ComponentProps) {
	const def = typeBySegment(params.type)!;
	return (
		<DefaultLayout>
			<section className="container max-w-5xl pt-12 pb-16 lg:pt-20 lg:pb-24">
				<StoreCatalog items={listItems()} lockedType={def.type} />
			</section>
		</DefaultLayout>
	);
}
