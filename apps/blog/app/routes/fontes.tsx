// Fontes (LANC-001 RQ-042/043): as fontes do RC-SRC-001 com link, agrupadas pelo tema que sustentam, e a nota de
// governança literal. Substitui o antigo /evidencias (removido no reset do ADR-13).
import type { Route } from "./+types/fontes";

import { ChevronLink } from "@/components/layout/ChevronLink";
import DefaultLayout from "@/layouts/DefaultLayout";
import { GOVERNANCE_NOTE, SOURCES } from "@/data/sources";
import { seo } from "@/lib/seo";

export const meta: Route.MetaFunction = ({ location }) =>
	seo({ title: "Fontes", description: GOVERNANCE_NOTE[0], pathname: location.pathname });

export default function Fontes() {
	return (
		<DefaultLayout>
			<header className="stories-container pt-12 lg:pt-[88px]">
				<div className="rc-hero-reveal mx-auto max-w-[var(--ref-wide-width)]">
					<p className="stories-meta text-muted-foreground">Risco Cognitivo · Fontes</p>
					<h1 className="stories-h2 mt-3">Fontes</h1>
					<p className="stories-body text-muted-foreground mt-[var(--ref-block-gap)] max-w-[var(--ref-hero-lead-w)]">{GOVERNANCE_NOTE[0]}</p>
					<a
						href="/artigos/"
						data-cta="primary"
						className="bg-foreground text-background focus-visible:ring-ring/50 mt-[var(--ref-block-gap)] inline-flex min-h-11 items-center rounded-[var(--ref-pill-radius)] px-6 py-2 text-sm font-medium outline-none focus-visible:ring-[3px]"
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
							<li key={s.id} className="rc-cell rc-surface flex flex-col gap-2 p-6">
								<p className="stories-meta text-muted-foreground">{s.topic}</p>
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
