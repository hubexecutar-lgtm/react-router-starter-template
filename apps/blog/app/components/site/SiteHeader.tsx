// Cabeçalho global do shell (LANC-001 RQ-020…022) na arquitetura Editorial Hybrid v4 (ADR-22): barra de 64 px
// (--ref-header-h), marca à esquerda e links à direita em 14 px, na largura do híbrido (1440). A trilha dos 3 pilares
// saiu da barra e virou a faixa de categorias logo abaixo (CategoryRail).
// ≥ 900px: marca, Artigos · Mapa · Ferramentas · Sobre, e tema; sem menu.
// < 900px: marca, busca, tema e o botão do drawer (MobileDrawer). Esconde ao descer e volta ao subir,
// junto com a barra inferior (estado em shell.tsx). Renderizado no servidor: os links funcionam sem JS.
import { Menu } from "lucide-react";
import { useLocation } from "react-router";

import { PRIMARY_NAV, isActive } from "./nav";
import { useShell } from "./shell";

import { ThemeToggle } from "@/components/theme-toggle";
import { SITE_NAME } from "@/consts";
import { cn } from "@/lib/utils";

const iconButton =
	"inline-flex size-11 items-center justify-center rounded-md transition-colors hover:bg-[var(--surface-hover)] focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]";

export function SiteHeader({ inert = false }: { inert?: boolean }) {
	const { pathname } = useLocation();
	const { drawerOpen, openDrawer, chromeHidden } = useShell();

	return (
		<header
			data-site-header
			{...(inert ? { inert: true } : {})}
			data-chrome
			data-hidden={chromeHidden || undefined}
			className={cn(
				"bg-background sticky top-0 z-50 shadow-[0_1px_0_var(--border-default)]",
				"transition-transform duration-[var(--dur-base)] ease-[var(--ease)] data-[hidden]:-translate-y-full",
			)}
		>
			<div className="mx-auto flex h-[var(--ref-header-h)] w-full max-w-[var(--hy-wide)] items-center gap-2 px-[var(--ref-gutter)] sm:gap-4">
				<a href="/" className="flex min-h-11 min-w-0 shrink-0 items-center gap-3" aria-label={`${SITE_NAME} — página inicial`}>
					<span className="text-foreground text-[14px] leading-none font-bold tracking-[-0.02em] whitespace-nowrap uppercase sm:text-[16px]">
						{SITE_NAME}
					</span>
				</a>

				<nav aria-label="Principal" className="ml-auto max-[899px]:hidden">
					<ul className="flex items-center gap-[20px] lg:gap-[26px]">
						{PRIMARY_NAV.map((item) => {
							const active = isActive(pathname, item.href);
							return (
								<li key={item.href}>
									<a
										href={item.href}
										aria-current={active ? "page" : undefined}
										className={cn(
											"relative inline-flex h-11 items-center rounded-sm text-[14px] transition-colors",
											"hover:text-primary focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]",
											active
												? "text-primary after:bg-primary after:absolute after:inset-x-0 after:-bottom-[5px] after:h-0.5 after:rounded-full"
												: "text-foreground",
										)}
									>
										{item.label}
									</a>
								</li>
							);
						})}
					</ul>
				</nav>

				<div className="ml-auto flex items-center gap-0.5 sm:gap-1.5 min-[900px]:ml-4">
					<ThemeToggle />
					<button
						type="button"
						className={cn(iconButton, "min-[900px]:hidden")}
						aria-expanded={drawerOpen}
						aria-controls="site-menu"
						aria-haspopup="dialog"
						data-menu-toggle
						onClick={openDrawer}
					>
						<Menu className="size-5" aria-hidden="true" />
						<span className="sr-only">Abrir menu</span>
					</button>
				</div>
			</div>

		</header>
	);
}

