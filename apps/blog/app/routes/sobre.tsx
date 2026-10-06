// Sobre (ADR-BLOG-JORNADA-ROTAS-001 §2.2, ADR-26): autor, projeto, princípios e limites, e o método completo do
// RC-HOME-002 (dados, risco, exigências, problemas, método, apoio), que saiu da Home por decisão do usuário (2026-10-06).
// Os princípios são trechos literais dos canônicos (RC-LP-001, RC-ART-P1-001, RC-SRC-001), cada um com a origem (RQ-043).
import type { Route } from "./+types/sobre";

import { Button, Dots, MoreLink, PageHead, SectionHead } from "@/components/ds";
import { MethodSections } from "@/components/landing/MethodSections";
import { RC_IMAGES } from "@/data/article-media";
import { LANDING } from "@/data/landing";
import { GOVERNANCE_NOTE } from "@/data/sources";
import DefaultLayout from "@/layouts/DefaultLayout";
import { seo } from "@/lib/seo";

const para = (section: number, index: number) => {
	const b = LANDING.sections[section].blocks[index];
	return "p" in b ? b.p : "";
};

/** Trechos literais, com o documento de origem. */
const PRINCIPLES = [
	{ text: para(0, 1), source: "RC-LP-001" },
	{ text: para(0, 2), source: "RC-LP-001" },
	{ text: "Risco cognitivo não deve ser usado para transformar uma pessoa em problema.", source: "RC-ART-P1-001" },
	{ text: "Ele deve ajudar a examinar o trabalho.", source: "RC-ART-P1-001" },
];

export const meta: Route.MetaFunction = ({ location }) =>
	seo({ title: "Sobre", description: para(0, 0), image: RC_IMAGES.cerebroUrbanoMaoB.landscape.src, pathname: location.pathname });

export default function Sobre() {
	return (
		<DefaultLayout>
			<div className="ds-page">
				<PageHead
					eyebrow="Risco Cognitivo · Sobre"
					title="Sobre o projeto"
					lead={para(0, 0)}
					notice="Página institucional no design system novo; o método completo da Home está logo abaixo."
					actions={
						<Button href="/artigos/riscos-cognitivos-guia/" size="lg" data-cta="primary">
							Ler o guia de riscos cognitivos
						</Button>
					}
				/>

				<section className="ds-section" style={{ paddingTop: 0 }} aria-labelledby="principios" data-sobre="principios">
					<SectionHead id="principios" label="Princípios" heading="Princípios" align="left" />
					<ul className="ds-list ds-reading" style={{ paddingInline: 0, marginInline: 0 }}>
						{PRINCIPLES.map((p) => (
							<li key={p.text}>
								<p style={{ fontSize: 18 }}>{p.text}</p>
								<p className="ds-card-eyebrow">{p.source}</p>
							</li>
						))}
					</ul>
				</section>

				<section className="ds-section" aria-labelledby="conceitos-proprios" data-sobre="limites">
					<SectionHead id="conceitos-proprios" label="Limites" heading="Conceitos do projeto" align="left" />
					<div className="ds-prose-block" data-governance-note>
						{GOVERNANCE_NOTE.map((l) => (
							<p key={l}>{l}</p>
						))}
					</div>
					<p className="ds-more">
						<MoreLink href="/fontes/">Ver todas as fontes</MoreLink>
					</p>
				</section>

				<Dots />
				{/* O método (RC-HOME-002 completo, fora da Home). */}
				<MethodSections />
			</div>
		</DefaultLayout>
	);
}
