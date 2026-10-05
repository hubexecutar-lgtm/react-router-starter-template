// Página de uma solução em /ferramentas/solucoes/<slug>/ (RC-PUB-PACK-003, ADR-24): cabeçalho com a dor, card 2×2
// do schema e o texto do MDX. Sem infográfico nesta versão: o v2.0 do pack diverge do texto v3.
import { ArrowLeft } from "lucide-react";

import { solutionContent } from "./content";
import { SCHEMA_WORKFLOW, SCIENTIFIC_GUARDRAIL, type Solution } from "./data";
import { SolutionCard } from "./SolutionCard";

import { ChevronLink } from "@/components/layout/ChevronLink";
import { ArticleBody } from "@/components/stories/ArticleBody";


export const SERIES_HREF = "/artigos/estrategias-reduzir-riscos-cognitivos/";

export function SolutionDetail({ solution }: { solution: Solution }) {
	const content = solutionContent(solution.slug);
	return (
		<article data-solution={solution.slug}>
			<header className="hy-article-header pt-12 lg:pt-[88px]">
				<a href="/ferramentas/solucoes/" className="rc-link inline-flex min-h-11 items-center gap-1 text-[15px]">
					<ArrowLeft size={16} aria-hidden="true" />
					Voltar para Soluções
				</a>
				<p className="hy-eyebrow mt-6">
					{solution.id} · Gestão e Controle de Riscos Cognitivos · Solução
				</p>
				<h1>{solution.name}</h1>
				<p className="hy-lead mx-auto">{solution.pain}</p>
				<div className="hy-actions">
					<a href={SERIES_HREF} data-cta="primary" className="hy-btn-primary">
						Ler as 6 estratégias
					</a>
				</div>
			</header>
			<div className="stories-container">
				<div className="mx-auto max-w-[var(--ref-wide-width)]">
					<SolutionCard solution={solution} />
					<p className="solution-schema" aria-label="Schema da solução">
						{SCHEMA_WORKFLOW}
					</p>
					<p className="solution-guardrail">{SCIENTIFIC_GUARDRAIL}</p>
				</div>
			</div>
			{content && <ArticleBody Content={content.Content} />}
			<div className="stories-container pb-[var(--hy-section)]">
				<div className="hy-article">
					<ChevronLink href="/fontes/#fontes-cientificas">Ver todas as fontes científicas</ChevronLink>
				</div>
			</div>
		</article>
	);
}
