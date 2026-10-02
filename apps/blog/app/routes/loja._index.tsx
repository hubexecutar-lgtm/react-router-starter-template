import type { Route } from "./+types/loja._index";

import { StoreCatalog } from "@/features/store/components/store-catalog";
import { listItems } from "@/features/store/data/repository";
import DefaultLayout from "@/layouts/DefaultLayout";
import { seo } from "@/lib/seo";

// Store Hub (ADR-STORE-ROUTES-UI-001). Was src/pages/loja/index.astro in the original blog
// (branch claude/trusting-gates-go053v).
export const meta: Route.MetaFunction = ({ location }) =>
	seo({
		title: "Loja",
		description: "Descubra skills, prompts, e-books e ferramentas para apoiar sua execução.",
		pathname: location.pathname,
	});

export default function Loja() {
	return (
		<DefaultLayout>
			<section className="container max-w-5xl pt-12 pb-16 lg:pt-20 lg:pb-24">
				<StoreCatalog items={listItems()} />
			</section>
		</DefaultLayout>
	);
}
