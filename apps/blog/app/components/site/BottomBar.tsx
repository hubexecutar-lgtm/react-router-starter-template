// Barra inferior do mobile (< 900px), LANC-001 RQ-021/022/025: Início · Mapa · Ferramentas, alvos ≥ 44px.
// Esconde e volta junto com o cabeçalho (estado em shell.tsx). Pele do RC-DS-CF: `ds-bottombar` (DS-CF-001-prisma §2.8).
import { House, Map, Wrench, type LucideIcon } from "lucide-react";
import { useLocation } from "react-router";

import { BOTTOM_NAV, isActive } from "./nav";
import { useShell } from "./shell";

import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = { "/": House, "/mapas/": Map, "/ferramentas/": Wrench };
const COLS = ["", "grid-cols-1", "grid-cols-2", "grid-cols-3", "grid-cols-4"];

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
				"ds-bottombar fixed inset-x-0 bottom-0 z-40 pb-[env(safe-area-inset-bottom)] backdrop-blur-[18px] backdrop-saturate-[1.6] min-[900px]:hidden",
				"transition-transform duration-[var(--dur-base)] ease-[var(--ease)] data-[hidden]:translate-y-full",
			)}
		>
			<ul className={cn("grid h-[var(--bottombar-h)]", COLS[BOTTOM_NAV.length])}>
				{BOTTOM_NAV.map((item) => {
					const active = isActive(pathname, item.href);
					const Icon = ICONS[item.href];
					return (
						<li key={item.href} className="flex">
							<a
								href={item.href}
								aria-current={active ? "page" : undefined}
								className="flex min-h-11 w-full flex-col items-center justify-center gap-1"
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
