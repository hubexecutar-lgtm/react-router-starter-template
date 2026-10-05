// Rodapé global na arquitetura Editorial Hybrid v4 (ADR-22): 4 colunas sobre Subtle (marca + 3 grupos de FOOTER_NAV),
// 14 px muted sobre cinza; 2 colunas abaixo de 900 px. O menu do topo se repete aqui (RQ-050).
import { FOOTER_NAV } from "./nav";

import { SITE_NAME, SITE_TAGLINE } from "@/consts";

export function SiteFooter({ inert = false }: { inert?: boolean }) {
	return (
		<footer className="hy-footer mt-[var(--hy-section)]" {...(inert ? { inert: true } : {})}>
			<div className="mx-auto max-w-[var(--hy-wide)] px-[var(--ref-gutter)]">
				<div className="hy-footer-cols">
					<div>
						<h2>
							<a href="/" className="!text-foreground font-bold uppercase">
								{SITE_NAME}
							</a>
						</h2>
						<p>{SITE_TAGLINE}</p>
					</div>
					{FOOTER_NAV.map((group) => (
						<nav key={group.title} aria-label={group.title}>
							<h2>{group.title}</h2>
							<ul>
								{group.items.map((item) => (
									<li key={item.href}>
										<a href={item.href}>{item.label}</a>
									</li>
								))}
							</ul>
						</nav>
					))}
				</div>
				<div className="flex flex-col gap-2 border-t border-[var(--border-default)] py-6 sm:flex-row sm:items-center sm:justify-between">
					<p>{SITE_NAME}</p>
					<p>
						<a href="/admin/">Painel interno</a>
					</p>
				</div>
			</div>
		</footer>
	);
}
