// Cabeçalho global no padrão da cloudflare.com (ADR-25): 72 px, marca à esquerda (binóculo + wordmark espaçado), menu
// no centro (Blog · Mapa · Ferramentas · Sobre, 16/500) e, à direita, tema + pílulas "Fontes" e "Comece por aqui".
// < 900px: marca, tema e o botão do drawer (MobileDrawer). Esconde ao descer e volta ao subir, junto com a barra
// inferior (estado em shell.tsx). Renderizado no servidor: os links funcionam sem JS.
import { Menu } from "lucide-react";
import { useLocation } from "react-router";

import { PRIMARY_NAV, isActive } from "./nav";
import { useShell } from "./shell";

import { ThemeToggle } from "@/components/theme-toggle";
import { SITE_NAME } from "@/consts";

export function SiteHeader({ inert = false }: { inert?: boolean }) {
	const { pathname } = useLocation();
	const { drawerOpen, openDrawer, chromeHidden } = useShell();

	return (
		<header
			data-site-header
			{...(inert ? { inert: true } : {})}
			data-chrome
			data-hidden={chromeHidden || undefined}
			className="cf-header transition-transform duration-[var(--dur-base)] ease-[var(--ease)] data-[hidden]:-translate-y-full"
		>
			<div className="cf-header-bar">
				<a href="/" className="cf-logo" aria-label={`${SITE_NAME} — página inicial`}>
					<img src="/favicon/favicon-96x96.png" width={26} height={26} alt="" />
					<span className="cf-wordmark">{SITE_NAME}</span>
				</a>

				<nav aria-label="Principal" className="cf-nav">
					<ul>
						{PRIMARY_NAV.map((item) => (
							<li key={item.href}>
								<a href={item.href} aria-current={isActive(pathname, item.href) ? "page" : undefined}>
									{item.label}
								</a>
							</li>
						))}
					</ul>
				</nav>

				<div className="cf-header-actions">
					<ThemeToggle />
					<a href="/fontes/" className="cf-btn">
						Fontes
					</a>
					<a href="/comece/" className="cf-btn">
						Comece por aqui
					</a>
					<button
						type="button"
						className="ds-iconbtn min-[900px]:hidden"
						aria-expanded={drawerOpen}
						aria-controls="site-menu"
						aria-haspopup="dialog"
						data-menu-toggle
						onClick={openDrawer}
					>
						<Menu aria-hidden="true" />
						<span className="sr-only">Abrir menu</span>
					</button>
				</div>
			</div>
		</header>
	);
}
