import type { Route } from "./+types/ferramentas._index";

import { StoreCatalog } from "@/features/store/components/store-catalog";
import { ToolDiscovery } from "@/features/store/components/tool-discovery";
import { listItems } from "@/features/store/data/repository";
import DefaultLayout from "@/layouts/DefaultLayout";
import { seo } from "@/lib/seo";

// Ferramentas cognitivas (ADR-16, LANC-001 RQ-100/103): o antigo hub da Loja (ADR-STORE-ROUTES-UI-001),
// com o mesmo catálogo. /loja/* responde 301 para cá (public/_redirects).
export const meta: Route.MetaFunction = ({ location }) =>
	seo({
		title: "Ferramentas cognitivas",
		description: "Skills, prompts, checklists, workbooks e ferramentas para apoiar a execução do trabalho cognitivo.",
		pathname: location.pathname,
	});

export default function Ferramentas() {
	return (
		<DefaultLayout>
			<section className="stories-container max-w-[var(--ref-wide-width)] pt-12 pb-16 lg:pt-[88px] lg:pb-24">
				<StoreCatalog items={listItems()} />
				<ToolDiscovery />
			</section>
		</DefaultLayout>
	);
}
