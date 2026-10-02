// Cabeçalho global (mood boards 01, 04, 07 e 09): barra plana sobre o canvas,
// wordmark tipográfico + tagline mono, item ativo em azul sublinhado, busca e tema.
// Renderizado no servidor: a navegação funciona sem JavaScript.
import { useEffect, useRef, useState } from "react";

import { Menu, Search, X } from "lucide-react";
import { useLocation } from "react-router";

import { PRIMARY_NAV, isActive } from "./nav";

import { ThemeToggle } from "@/components/theme-toggle";
import { SITE_NAME, SITE_TAGLINE } from "@/consts";
import { cn } from "@/lib/utils";

const iconButton =
	"inline-flex size-10 items-center justify-center rounded-md transition-colors hover:bg-[var(--surface-hover)] focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]";

export function SiteHeader() {
	const { pathname } = useLocation();
	const [open, setOpen] = useState(false);
	const toggleRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setOpen(false);
				toggleRef.current?.focus();
			}
		};
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [open]);

	return (
		<header className="bg-background/95 supports-[backdrop-filter]:bg-background/85 sticky top-0 z-50 border-b border-[var(--border-default)] backdrop-blur">
			<div className="container flex h-16 items-center gap-2 sm:gap-4 lg:h-[4.5rem]">
				<a href="/" className="flex min-h-10 min-w-0 shrink-0 items-center gap-3" aria-label={`${SITE_NAME} — página inicial`}>
					<span className="rc-display text-[0.95rem] leading-none tracking-[-0.02em] whitespace-nowrap uppercase min-[360px]:text-[1.1rem] sm:text-xl">
						{SITE_NAME}
					</span>
					<span className="hidden h-7 border-l border-[var(--border-strong)] xl:block" aria-hidden="true"></span>
					<span className="rc-eyebrow hidden max-w-[11rem] text-[0.625rem] leading-snug xl:block">{SITE_TAGLINE}</span>
				</a>

				<nav aria-label="Principal" className="ml-auto max-lg:hidden">
					<ul className="flex items-center gap-1">
						{PRIMARY_NAV.map((item) => {
							const active = isActive(pathname, item.href);
							return (
								<li key={item.href}>
									<a
										href={item.href}
										aria-current={active ? "page" : undefined}
										className={cn(
											"relative inline-flex h-10 items-center rounded-md px-3 text-[0.95rem] font-medium transition-colors",
											"hover:bg-[var(--surface-hover)] focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]",
											active
												? "text-primary after:bg-primary after:absolute after:inset-x-3 after:-bottom-[13px] after:h-0.5 after:rounded-full lg:after:-bottom-[17px]"
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

				<div className="ml-auto flex items-center gap-0.5 sm:gap-1.5 lg:ml-2 lg:border-l lg:border-[var(--border-default)] lg:pl-3">
					<a
						href="/buscar/"
						className={cn(iconButton, isActive(pathname, "/buscar/") ? "text-primary" : "text-foreground")}
						aria-label="Buscar no blog"
					>
						<Search className="size-5" aria-hidden="true" />
					</a>
					<ThemeToggle />
					<button
						ref={toggleRef}
						type="button"
						className={cn(iconButton, "lg:hidden")}
						aria-expanded={open}
						aria-controls="site-menu"
						data-menu-toggle
						onClick={() => setOpen((o) => !o)}
					>
						{open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
						<span className="sr-only">{open ? "Fechar menu" : "Abrir menu"}</span>
					</button>
				</div>
			</div>

			<nav
				id="site-menu"
				aria-label="Principal (menu)"
				className={cn("border-t border-[var(--border-default)] lg:hidden", !open && "hidden")}
				data-menu
			>
				<ul className="container flex flex-col py-2">
					{PRIMARY_NAV.map((item) => {
						const active = isActive(pathname, item.href);
						return (
							<li key={item.href} className="border-b border-[var(--border-subtle)] last:border-0">
								<a
									href={item.href}
									aria-current={active ? "page" : undefined}
									className={cn("flex min-h-12 items-center text-lg font-medium", active ? "text-primary" : "text-foreground")}
								>
									{item.label}
								</a>
							</li>
						);
					})}
				</ul>
			</nav>
		</header>
	);
}
