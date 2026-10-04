// Barra inferior do mobile (< 900px), LANC-001 RQ-021/022/025: Início · Mapa · Ferramentas, alvos ≥ 44px.
// Esconde e volta junto com o cabeçalho (estado em shell.tsx).
import { House, Map, Wrench, type LucideIcon } from "lucide-react";
import { useLocation } from "react-router";

import { BOTTOM_NAV, isActive } from "./nav";
import { useShell } from "./shell";

import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = { "/": House, "/mapas/": Map, "/ferramentas/": Wrench };

export function BottomBar({ inert = false }: { inert?: boolean }) {
	const { pathname } = useLocation();
	const { chromeHidden } = useShell();
	return (
		<nav
			aria-label="Navegação inferior"
			data-chrome
			data-bottom-bar
			{...(inert ? { inert: true } : {})}
			data-hidden={chromeHidden || undefined}
			className={cn(
				"bg-background/95 supports-[backdrop-filter]:bg-background/80 fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border-default)] pb-[env(safe-area-inset-bottom)] backdrop-blur-[18px] backdrop-saturate-[1.6] min-[900px]:hidden",
				"transition-transform duration-[var(--dur-base)] ease-[var(--ease)] data-[hidden]:translate-y-full",
			)}
		>
			<ul className="grid h-[var(--bottombar-h)] grid-cols-3">
				{BOTTOM_NAV.map((item) => {
					const active = isActive(pathname, item.href);
					const Icon = ICONS[item.href];
					return (
						<li key={item.href} className="flex">
							<a
								href={item.href}
								aria-current={active ? "page" : undefined}
								className={cn(
									"flex min-h-11 w-full flex-col items-center justify-center gap-1 text-xs font-semibold outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:ring-inset",
									active ? "text-primary" : "text-foreground",
								)}
							>
								<Icon className="size-5" aria-hidden="true" />
								{item.label}
							</a>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
