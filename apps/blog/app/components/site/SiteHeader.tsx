// Cabeçalho global do shell (LANC-001 RQ-020…022) sobre o Stories: barra de 64 px (--ref-header-h), gutter de
// 32 px (--ref-gutter) e régua inferior em box-shadow, como no handoff OPENAI-STORIES-DESIGN-001 (ADR-14).
// ≥ 900px: marca, Artigos · Mapa · Ferramentas · Sobre, e tema, e a trilha dos 3 pilares; sem menu.
// < 900px: marca, busca, tema e o botão do drawer (MobileDrawer). Esconde ao descer e volta ao subir,
// junto com a barra inferior (estado em shell.tsx). Renderizado no servidor: os links funcionam sem JS.
import { Menu } from "lucide-react";
import { useLocation } from "react-router";

import { PILLAR_TRAIL, PRIMARY_NAV, isActive } from "./nav";
import { useShell } from "./shell";

import { ThemeToggle } from "@/components/theme-toggle";
import { SITE_NAME, SITE_TAGLINE } from "@/consts";
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
				"bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50 shadow-[0_1px_0_var(--border-default)] backdrop-blur-[20px] backdrop-saturate-[1.8]",
				"transition-transform duration-[var(--dur-base)] ease-[var(--ease)] data-[hidden]:-translate-y-full",
			)}
		>
			<div className="stories-container flex h-[var(--ref-header-h)] items-center gap-2 sm:gap-4">
				<a href="/" className="flex min-h-11 min-w-0 shrink-0 items-center gap-3" aria-label={`${SITE_NAME} — página inicial`}>
					<span className="rc-display text-[0.95rem] leading-none tracking-[-0.02em] whitespace-nowrap uppercase min-[360px]:text-[1.1rem] sm:text-xl">
						{SITE_NAME}
					</span>
					<span className="hidden h-7 border-l border-[var(--border-strong)] xl:block" aria-hidden="true"></span>
					<span className="rc-eyebrow hidden max-w-[11rem] text-[0.625rem] leading-snug xl:block">{SITE_TAGLINE}</span>
				</a>

				<nav aria-label="Principal" className="ml-auto max-[899px]:hidden">
					<ul className="flex items-center gap-1">
						{PRIMARY_NAV.map((item) => {
							const active = isActive(pathname, item.href);
							return (
								<li key={item.href}>
									<a
										href={item.href}
										aria-current={active ? "page" : undefined}
										className={cn(
											"relative inline-flex h-11 items-center rounded-md px-3 text-[0.95rem] font-medium transition-colors",
											"hover:bg-[var(--surface-hover)] focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]",
											active
												? "text-primary after:bg-primary after:absolute after:inset-x-3 after:-bottom-[5px] after:h-0.5 after:rounded-full"
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

				{/* Trilha dos pilares inline na barra (RQ-020). Fica dentro dos 64 px do handoff Stories (ADR-14): uma faixa
				    própria abaixo do cabeçalho deslocaria a geometria medida da Home. Só em telas largas. */}
				{PILLAR_TRAIL.length > 0 && (
					<nav aria-label="Pilares" className="ml-2 border-l border-[var(--border-default)] pl-3 max-[1099px]:hidden" data-pillar-trail>
						<ul className="flex items-center gap-1">
							{PILLAR_TRAIL.map((item) => {
								const active = isActive(pathname, item.href);
								return (
									<li key={item.href}>
										<a
											href={item.href}
											aria-current={active ? "page" : undefined}
											className={cn(
												"inline-flex h-11 items-center rounded-md px-3 text-[0.8125rem] font-semibold tracking-[0.01em] transition-colors",
												"hover:bg-[var(--surface-hover)] focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]",
												active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
											)}
										>
											{item.label}
										</a>
									</li>
								);
							})}
						</ul>
					</nav>
				)}

				<div className="ml-auto flex items-center gap-0.5 sm:gap-1.5 min-[900px]:ml-2 min-[900px]:border-l min-[900px]:border-[var(--border-default)] min-[900px]:pl-3">
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

