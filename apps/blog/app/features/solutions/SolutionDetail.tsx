// Página de uma solução em /ferramentas/solucoes/<slug>/ (RC-PUB-PACK-003, ADR-24), no template de item do RC-DS-CF
// (ADR-26, ADR-BLOG-JORNADA-ROTAS-001 §2.2): trilha, dor e um único CTA primário no PageHead; o card 2×2 do schema
// (classes solution-*, exceção semântica registrada no ADR-26) e o texto do MDX, com as fontes dele, no corpo do DS.
// Sem infográfico nesta versão: o v2.0 do pack diverge do texto v3.
import { solutionContent } from "./content";
import { SCHEMA_WORKFLOW, SCIENTIFIC_GUARDRAIL, type Solution } from "./data";
import { SolutionCard } from "./SolutionCard";

import { ArticleBody } from "@/components/article/ArticleBody";
import { Button, MoreLink, PageHead, SectionHead } from "@/components/ds";

/**
 * Leitura da série. O artigo 04 (estratégias) está fora do ar durante a reconstrução (302, ADR-26): o guia público
 * é a entrada da série.
 */
export const SERIES_HREF = "/artigos/riscos-cognitivos-guia/";

export function SolutionDetail({ solution }: { solution: Solution }) {
	const content = solutionContent(solution.slug);
	return (
		<>
			<article className="ds-page" data-solution={solution.slug}>
				<PageHead
					crumbs={[{ label: "Ferramentas", href: "/ferramentas/" }, { label: "Soluções", href: "/ferramentas/solucoes/" }, { label: solution.name }]}
					eyebrow={`${solution.id} · Solução`}
					title={solution.name}
					lead={solution.pain}
					notice="Template de item no design system novo; o card, o texto e as fontes são os publicados."
					actions={
						<Button href={SERIES_HREF} size="lg" data-cta="primary">
							Ler o guia da série
						</Button>
					}
				/>

				<div className="ds-section" style={{ paddingTop: 0 }}>
					<SolutionCard solution={solution} />
					<p className="solution-schema" aria-label="Schema da solução">
						{SCHEMA_WORKFLOW}
					</p>
					<p className="solution-guardrail">{SCIENTIFIC_GUARDRAIL}</p>
				</div>

				{/* Corpo do MDX sem reescrita: as seções dele (macro problema, processo, progresso e fontes) são os h2. */}
				{content && (
					<div className="ds-section">
						<div className="ds-reading" style={{ paddingInline: 0 }}>
							<ArticleBody Content={content.Content} />
						</div>
					</div>
				)}
			</article>

			<section className="ds-section" aria-labelledby="mais-solucoes" data-next-step>
				<SectionHead id="mais-solucoes" label="Próximo passo" heading="Continue pelas Ferramentas" align="left" />
				<p>
					<MoreLink href="/ferramentas/solucoes/">Ver as 6 soluções</MoreLink>
				</p>
				<p>
					<MoreLink href="/fontes/#fontes-cientificas">Ver todas as fontes científicas</MoreLink>
				</p>
			</section>
		</>
	);
}
