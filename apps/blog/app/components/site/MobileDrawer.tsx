// Drawer do mobile (< 900px), LANC-001 RQ-021/023/025: painel à direita com largura min(84vw,360px),
// todos os destinos + Temas, Guias, Evidências e Buscar. Diálogo modal: foco preso, Esc fecha, o foco
// volta ao botão do menu e o resto da página fica inert (DefaultLayout). Fechado, não existe no DOM.
import { useEffect, useRef } from "react";

import { X } from "lucide-react";
import { useLocation } from "react-router";

import { DRAWER_NAV, isActive } from "./nav";
import { useShell } from "./shell";

import { cn } from "@/lib/utils";

export function MobileDrawer() {
	const { pathname } = useLocation();
	const { drawerOpen, closeDrawer } = useShell();
	const panel = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!drawerOpen) return;
		const root = panel.current!;
		root.querySelector<HTMLElement>("a[aria-current], a, button")?.focus();
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				e.preventDefault();
				closeDrawer();
				return;
			}
			if (e.key !== "Tab") return;
			const items = [...root.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")];
			const first = items[0];
			const last = items[items.length - 1];
			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault();
				first.focus();
			}
		};
		document.addEventListener("keydown", onKey);
		const overflow = document.documentElement.style.overflow;
		document.documentElement.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", onKey);
			document.documentElement.style.overflow = overflow;
		};
	}, [drawerOpen, closeDrawer]);

	if (!drawerOpen) return null;

	return (
		<div className="fixed inset-0 z-[70] min-[900px]:hidden" data-drawer>
			<div className="rc-drawer-backdrop absolute inset-0 bg-black/40" aria-hidden="true" onClick={() => closeDrawer()} />
			<div
				ref={panel}
				id="site-menu"
				role="dialog"
				aria-modal="true"
				aria-label="Menu"
				className="rc-drawer bg-background absolute inset-y-0 right-0 flex w-[min(84vw,360px)] flex-col shadow-[var(--shadow-overlay)]"
				data-menu
			>
				<div className="flex h-[var(--ref-header-h)] shrink-0 items-center justify-between border-b border-[var(--border-default)] pr-2 pl-5">
					<p className="rc-eyebrow">Menu</p>
					<button
						type="button"
						onClick={() => closeDrawer()}
						className="inline-flex size-11 items-center justify-center rounded-md transition-colors hover:bg-[var(--surface-hover)] focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]"
					>
						<X className="size-5" aria-hidden="true" />
						<span className="sr-only">Fechar menu</span>
					</button>
				</div>
				<nav aria-label="Principal (menu)" className="overflow-y-auto overscroll-contain">
					<ul className="flex flex-col px-5 py-2">
						{DRAWER_NAV.map((item) => {
							const active = isActive(pathname, item.href);
							return (
								<li key={item.href} className="border-b border-[var(--border-subtle)] last:border-0">
									<a
										href={item.href}
										aria-current={active ? "page" : undefined}
										onClick={() => closeDrawer({ restoreFocus: false })}
										className={cn(
											"flex min-h-12 items-center text-lg font-medium outline-none focus-visible:underline",
											active ? "text-primary" : "text-foreground",
										)}
									>
										{item.label}
									</a>
								</li>
							);
						})}
					</ul>
				</nav>
			</div>
		</div>
	);
}
