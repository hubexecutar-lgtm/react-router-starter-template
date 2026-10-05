// Fontes (LANC-001 RQ-042/043): as fontes do RC-SRC-001 com link, agrupadas pelo tema que sustentam, e a nota de
// governança literal. Substitui o antigo /evidencias (removido no reset do ADR-13). Os dados da home (RC-HOME-002)
// têm a própria lista, com as fontes primárias dos números.
import type { Route } from "./+types/fontes";

import { ChevronLink } from "@/components/layout/ChevronLink";
import { HOME_SOURCES } from "@/data/home";
import { GOVERNANCE_NOTE, SOURCES } from "@/data/sources";
import { SCIENTIFIC_SOURCES } from "@/data/sources-scientific";
import DefaultLayout from "@/layouts/DefaultLayout";
import { seo } from "@/lib/seo";

export const meta: Route.MetaFunction = ({ location }) =>
	seo({ title: "Fontes", description: GOVERNANCE_NOTE[0], pathname: location.pathname });

export default function Fontes() {
	return (
		<DefaultLayout>
			<header className="stories-container pt-[var(--hy-section)]">
				<div className="rc-hero-reveal mx-auto max-w-[var(--ref-wide-width)]">
					<p className="hy-eyebrow">Risco Cognitivo · Fontes</p>
					<h1 className="stories-h2 mt-3">Fontes</h1>
					<p className="hy-lead mt-[var(--ref-block-gap)] max-w-[60ch]">{GOVERNANCE_NOTE[0]}</p>
					<a
						href="/artigos/"
						data-cta="primary"
						className="hy-btn-primary mt-[var(--ref-block-gap)]"
					>
						Ler os artigos
					</a>
				</div>
			</header>
			<section className="stories-container mt-[var(--ref-card-gap-y)]" aria-labelledby="lista-fontes">
				<div className="mx-auto max-w-[var(--ref-wide-width)]">
					<h2 id="lista-fontes" className="sr-only">
						Lista de fontes
					</h2>
					<ul className="grid gap-[var(--ref-grid-gap)] md:grid-cols-2" data-sources>
						{SOURCES.map((s) => (
							<li key={s.id} className="hy-tile hy-tile--compact gap-2">
								<p className="hy-eyebrow">{s.topic}</p>
								<a href={s.url} rel="noopener" className="stories-body text-primary font-medium underline underline-offset-4 hover:no-underline">
									{s.label}
								</a>
							</li>
						))}
					</ul>
				</div>
			</section>
			<section className="stories-container mt-[var(--ref-section-gap)]" aria-labelledby="fontes-cientificas">
				<div className="mx-auto max-w-[var(--ref-wide-width)]">
					<h2 id="fontes-cientificas" className="stories-h2">
						Fontes científicas
					</h2>
					<p className="stories-body mt-[var(--ref-block-gap)] max-w-[60ch] text-muted-foreground">
						Estudos que sustentam a série sobre riscos cognitivos e as soluções. Sustentam mecanismos e componentes, não
						validam clinicamente as soluções.
					</p>
					<ul className="mt-[var(--ref-block-gap)] grid gap-[var(--ref-grid-gap)] md:grid-cols-2" data-scientific-sources>
						{SCIENTIFIC_SOURCES.map((s) => (
							<li key={s.id} id={s.id} className="hy-tile hy-tile--compact gap-2">
								<p className="hy-eyebrow">
									{s.authors} · {s.year}
									{s.pmid ? ` · PMID ${s.pmid}` : ""}
								</p>
								<a href={s.url} rel="noopener" className="stories-body text-primary font-medium underline underline-offset-4 hover:no-underline">
									{s.title}
								</a>
								<p className="text-[15px] text-muted-foreground">{s.journal}</p>
							</li>
						))}
					</ul>
				</div>
			</section>
			<section className="stories-container mt-[var(--ref-section-gap)]" aria-labelledby="fontes-home">
				<div className="mx-auto max-w-[var(--ref-wide-width)]">
					<h2 id="fontes-home" className="stories-h2">
						Dados da página inicial
					</h2>
					<ul className="mt-[var(--ref-block-gap)] grid gap-[var(--ref-grid-gap)] md:grid-cols-2" data-home-sources>
						{HOME_SOURCES.map((s) => (
							<li key={s.id} className="hy-tile hy-tile--compact gap-2">
								<p className="hy-eyebrow">RC-HOME-002</p>
								<a href={s.url} rel="noopener" className="stories-body text-primary font-medium underline underline-offset-4 hover:no-underline">
									{s.label}
								</a>
							</li>
						))}
					</ul>
				</div>
			</section>
			<section className="stories-container mt-[var(--ref-section-gap)]" aria-labelledby="conceitos">
				<div className="mx-auto max-w-[var(--ref-reading-width)]">
					<h2 id="conceitos" className="stories-h2">
						Conceitos do projeto
					</h2>
					<p className="stories-body mt-[var(--ref-block-gap)]" data-governance-note>
						{GOVERNANCE_NOTE[1]}
					</p>
					<ChevronLink href="/sobre/" className="mt-[var(--ref-block-gap)]">
						Sobre o projeto
					</ChevronLink>
				</div>
			</section>
		</DefaultLayout>
	);
}
