// Fontes (LANC-001 RQ-042/043; ADR-BLOG-JORNADA-ROTAS-001 §2.2): índice de fontes verificáveis no RC-DS-CF (ADR-26,
// DS-CF-001-prisma §3). As fontes do RC-SRC-001, as científicas do RC-SRC-002 e as da página inicial (RC-HOME-002), cada
// uma com âncora igual ao seu ID (o SolutionCard linka /fontes/#<id>), e a nota de governança literal.
import type { Route } from "./+types/fontes";

import { Button, MoreLink, PageHead, SectionHead } from "@/components/ds";
import { HOME_SOURCES } from "@/data/home";
import { GOVERNANCE_NOTE, SOURCES } from "@/data/sources";
import { SCIENTIFIC_SOURCES } from "@/data/sources-scientific";
import DefaultLayout from "@/layouts/DefaultLayout";
import { seo } from "@/lib/seo";

export const meta: Route.MetaFunction = ({ location }) =>
	seo({ title: "Fontes", description: GOVERNANCE_NOTE[0], pathname: location.pathname });

/** Item da lista: rótulo (tema, autores ou canônico) e o link para a fonte. */
function SourceItem({ id, eyebrow, label, url, meta }: { id: string; eyebrow: string; label: string; url: string; meta?: string }) {
	return (
		<li id={id}>
			<p className="ds-card-eyebrow">{eyebrow}</p>
			<a href={url} rel="noopener" className="ds-link" style={{ minHeight: 44 }}>
				{label}
			</a>
			{meta && <p className="ds-card-meta">{meta}</p>}
		</li>
	);
}

export default function Fontes() {
	return (
		<DefaultLayout>
			<div className="ds-page">
				<PageHead
					eyebrow="Risco Cognitivo · Fontes"
					title="Fontes"
					lead={GOVERNANCE_NOTE[0]}
					notice="Índice no design system novo. Todas as fontes listadas são reais e têm link verificável."
					actions={
						<Button href="/artigos/" size="lg" data-cta="primary">
							Ler os artigos
						</Button>
					}
				/>

				<section className="ds-section" style={{ paddingTop: 0 }} aria-labelledby="lista-fontes">
					<SectionHead id="lista-fontes" label="RC-SRC-001" heading="Fontes de referência" lead="Referências do RC-SRC-001, cada uma com o tema que sustenta." align="left" />
					<ul className="ds-list ds-reading" style={{ paddingInline: 0, marginInline: 0 }} data-sources>
						{SOURCES.map((s) => (
							<SourceItem key={s.id} id={s.id} eyebrow={s.topic} label={s.label} url={s.url} />
						))}
					</ul>
				</section>

				<section className="ds-section" aria-labelledby="fontes-cientificas">
					<SectionHead
						id="fontes-cientificas"
						label="RC-SRC-002"
						heading="Fontes científicas"
						lead="Estudos que sustentam a série sobre riscos cognitivos e as soluções. Sustentam mecanismos e componentes, não validam clinicamente as soluções."
						align="left"
					/>
					<ul className="ds-list ds-reading" style={{ paddingInline: 0, marginInline: 0 }} data-scientific-sources>
						{SCIENTIFIC_SOURCES.map((s) => (
							<SourceItem
								key={s.id}
								id={s.id}
								eyebrow={`${s.authors} · ${s.year}${s.pmid ? ` · PMID ${s.pmid}` : ""}`}
								label={s.title}
								url={s.url}
								meta={s.journal}
							/>
						))}
					</ul>
				</section>

				<section className="ds-section" aria-labelledby="fontes-home">
					<SectionHead id="fontes-home" label="RC-HOME-002" heading="Dados da página inicial" lead="Fontes primárias dos números citados em Sobre." align="left" />
					<ul className="ds-list ds-reading" style={{ paddingInline: 0, marginInline: 0 }} data-home-sources>
						{HOME_SOURCES.map((s) => (
							<SourceItem key={s.id} id={s.id} eyebrow="RC-HOME-002" label={s.label} url={s.url} />
						))}
					</ul>
				</section>

				<section className="ds-section" style={{ paddingBottom: "var(--cf-section-gap)" }} aria-labelledby="conceitos">
					<SectionHead id="conceitos" label="Governança" heading="Conceitos do projeto" align="left" />
					<div className="ds-prose-block" data-governance-note>
						<p>{GOVERNANCE_NOTE[1]}</p>
					</div>
					<p style={{ marginTop: 16, display: "flex", flexWrap: "wrap", columnGap: 24 }}>
						<MoreLink href="/sobre/">Sobre o projeto</MoreLink>
						<MoreLink href="/mapas/">Explorar o Mapa Cognitivo</MoreLink>
					</p>
				</section>
			</div>
		</DefaultLayout>
	);
}
