// Rodapé global no padrão da cloudflare.com (ADR-25): wordmark espaçado, colunas com rótulo 13/500 e links 16 px, faixa
// de pontos e barra final com © e links. O menu do topo se repete aqui (RQ-050).
import { FOOTER_NAV } from "./nav";

import { SITE_NAME, SITE_TAGLINE } from "@/consts";

export function SiteFooter({ inert = false }: { inert?: boolean }) {
	return (
		<footer className="cf-footer" {...(inert ? { inert: true } : {})}>
			<div className="cf-footer-grid">
				<div>
					<a href="/" className="cf-logo" aria-label={`${SITE_NAME} — página inicial`}>
						<span className="cf-wordmark">{SITE_NAME}</span>
					</a>
					<p className="cf-footer-tagline">{SITE_TAGLINE}</p>
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
			<div className="cf-dots" aria-hidden="true" />
			<div className="cf-footer-bottom">
				<p>
					© {new Date().getFullYear()} {SITE_NAME} · EXECUTAR
				</p>
				<p>
					<a href="/fontes/">Fontes</a> · <a href="/sobre/">Sobre</a> · <a href="/admin/">Painel interno</a>
				</p>
			</div>
		</footer>
	);
}
