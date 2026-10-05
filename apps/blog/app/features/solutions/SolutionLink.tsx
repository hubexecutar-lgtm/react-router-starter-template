// Link do artigo 04 da série para a página da solução (/ferramentas/solucoes/<slug>/). Ocupa o lugar do infográfico
// v2.0 do pack, que diverge do texto v3 (RC-PUB-PACK-003, ADR-24).
import { solutionBySlug } from "./data";

import { ChevronLink } from "@/components/layout/ChevronLink";


export const solutionHref = (slug: string) => `/ferramentas/solucoes/${slug}/`;

export function SolutionLink({ slug }: { slug: string }) {
	const solution = solutionBySlug(slug);
	if (!solution) throw new Error(`SolutionLink: solução "${slug}" não existe em app/features/solutions/data.ts`);
	return (
		<p data-solution-link={slug}>
			<ChevronLink href={solutionHref(slug)}>Ver a solução completa: {solution.name}</ChevronLink>
		</p>
	);
}
