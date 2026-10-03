// Rodapé global. RC-FRONT-001: fundo branco e gutter de 32 px do handoff (OPENAI-STORIES-DESIGN-001).
// As cinco colunas de navegação do handoff dependem de páginas que ainda não existem: os grupos vêm de
// FOOTER_NAV (nav.ts, hoje vazio) e o rodapé cresce junto com o site.
import { FOOTER_NAV } from "./nav";

import { SITE_NAME, SITE_TAGLINE } from "@/consts";

export function SiteFooter() {
	return (
		<footer className="mt-[var(--ref-section-gap)] border-t border-[var(--border-default)]">
			<div className="stories-container grid gap-12 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)]">
				<div className="max-w-sm">
					<a href="/" className="rc-display text-2xl uppercase tracking-[-0.02em]">
						{SITE_NAME}
					</a>
					<p className="stories-body text-muted-foreground mt-3">{SITE_TAGLINE}</p>
				</div>
				{FOOTER_NAV.map((group) => (
					<nav key={group.title} aria-label={group.title}>
						<p className="rc-eyebrow">{group.title}</p>
						<ul className="mt-4 space-y-2.5">
							{group.items.map((item) => (
								<li key={item.href}>
									<a
										href={item.href}
										className="text-foreground hover:text-primary inline-flex min-h-6 items-center text-[length:var(--text-small)] transition-colors"
									>
										{item.label}
									</a>
								</li>
							))}
						</ul>
					</nav>
				))}
			</div>
			<div className="border-t border-[var(--border-default)]">
				<div className="stories-container flex flex-col gap-2 py-6 sm:flex-row sm:items-center sm:justify-between">
					<p className="rc-meta">{SITE_NAME}</p>
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
