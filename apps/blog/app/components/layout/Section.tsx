// Seção da anatomia de página (ADR-12, referência developer.apple.com/programs): cabeçalho com
// eyebrow, h2, lead curto e link "Saiba mais ›", seguido do conteúdo. O ritmo vertical entre
// seções vem de --space-section; nenhum texto fica solto fora de uma seção.
import type { ReactNode } from "react";

import { ChevronLink } from "./ChevronLink";

import { cn } from "@/lib/utils";

export function Section({
	id,
	eyebrow,
	title,
	lead,
	link,
	level = 2,
	srTitle = false,
	className,
	children,
}: {
	id: string;
	eyebrow?: string;
	title: string;
	lead?: ReactNode;
	link?: { href: string; label: string };
	level?: 2 | 3;
	/** Título só para leitores de tela (a seção já é óbvia visualmente). */
	srTitle?: boolean;
	className?: string;
	children?: ReactNode;
}) {
	const H = `h${level}` as "h2" | "h3";
	return (
		<section aria-labelledby={id} className={cn("container mt-[var(--space-section)]", className)}>
			{srTitle ? (
				<H id={id} className="sr-only">
					{title}
				</H>
			) : (
				<header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
					<div className="min-w-0">
						{eyebrow && <p className="rc-eyebrow">{eyebrow}</p>}
						<H id={id} className="rc-title mt-2 text-[length:var(--text-h2)]">
							{title}
						</H>
						{lead && <p className="rc-lead mt-3 text-lg">{lead}</p>}
					</div>
					{link && <ChevronLink href={link.href}>{link.label}</ChevronLink>}
				</header>
			)}
			{children && <div className={srTitle ? undefined : "mt-8"}>{children}</div>}
		</section>
	);
}
