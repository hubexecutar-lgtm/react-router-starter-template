// Rodapé global: faixa de halftone, régua fina, wordmark, colunas de navegação e linha mono (mood boards 05 e 07).
import { FOOTER_NAV } from "./nav";

import { DotField } from "@/components/editorial/DotField";
import { SITE_NAME, SITE_TAGLINE } from "@/consts";

export function SiteFooter() {
	return (
		<footer className="mt-24 lg:mt-32">
			{/* faixa de halftone orgânico acima do rodapé: área sem texto (ADR-12) */}
			<div className="container">
				<DotField cols={64} rows={5} seed={21} fade="none" className="block h-16 w-full sm:h-20" />
			</div>
			<div className="container grid gap-12 border-t border-[var(--border-default)] py-14 md:grid-cols-[1.4fr_repeat(3,1fr)] lg:py-16">
				<div className="max-w-sm">
					<a href="/" className="rc-display text-2xl uppercase tracking-[-0.02em]">
						{SITE_NAME}
					</a>
					<p className="rc-lead mt-3">{SITE_TAGLINE}</p>
					<p className="text-muted-foreground mt-4 text-sm leading-relaxed">
						Fatores, exposição, eventos, controles e indicadores do trabalho cognitivo — com fontes à vista e
						distinção clara entre evidência e framework próprio.
					</p>
				</div>
				{FOOTER_NAV.map((group) => (
					<nav key={group.title} aria-label={group.title}>
						<p className="rc-eyebrow">{group.title}</p>
						<ul className="mt-4 space-y-2.5">
							{group.items.map((item) => (
								<li key={item.href}>
									<a href={item.href} className="text-foreground hover:text-primary inline-flex min-h-6 items-center text-[0.95rem] transition-colors">
										{item.label}
									</a>
								</li>
							))}
						</ul>
					</nav>
				))}
			</div>
			<div className="border-t border-[var(--border-default)]">
				<div className="container flex flex-col gap-2 py-6 sm:flex-row sm:items-center sm:justify-between">
					<p className="rc-meta">{SITE_NAME} / Pensamento melhor, decisões mais claras.</p>
					<p className="rc-meta">
						<a href="/admin/" className="hover:text-foreground transition-colors">
							Painel interno
						</a>
					</p>
				</div>
			</div>
		</footer>
	);
}
