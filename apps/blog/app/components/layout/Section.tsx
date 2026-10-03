// Seção da anatomia de página (ADR-12, referência developer.apple.com/programs): cabeçalho com
// eyebrow, h2, lead curto e link "Saiba mais ›", seguido do conteúdo. O ritmo vertical entre
// seções vem de --space-section; nenhum texto fica solto fora de uma seção.
// AUD-WEB-001: `align="center"` empilha o cabeçalho centralizado com o link abaixo do lead (como as
// seções de uma coluna da referência); `band` pinta a seção de ponta a ponta em Subtle (rc-band).
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
	align = "start",
	band = false,
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
	align?: "start" | "center";
	/** Faixa Subtle de ponta a ponta (alternância de fundos da anatomia). */
	band?: boolean;
	className?: string;
	children?: ReactNode;
}) {
	const H = `h${level}` as "h2" | "h3";
	const center = align === "center";
	const body = (
		<>
			{srTitle ? (
				<H id={id} className="sr-only">
					{title}
				</H>
			) : (
				<header
					className={cn(
						"flex gap-x-8 gap-y-3",
						center ? "flex-col items-center text-center" : "flex-wrap items-end justify-between",
					)}
				>
					<div className={cn("min-w-0", center && "flex flex-col items-center")}>
						{eyebrow && <p className="rc-eyebrow">{eyebrow}</p>}
						<H id={id} className="rc-title mt-2 text-[length:var(--text-h2)]">
							{title}
						</H>
						{lead && <p className={cn("rc-lead mt-3 text-lg", center && "mx-auto")}>{lead}</p>}
					</div>
					{link && <ChevronLink href={link.href}>{link.label}</ChevronLink>}
				</header>
			)}
			{children && <div className={srTitle ? undefined : center ? "mt-10" : "mt-8"}>{children}</div>}
		</>
	);
	if (band) {
		return (
			<section aria-labelledby={id} className={cn("rc-band", className)}>
				<div className="container">{body}</div>
			</section>
		);
	}
	return (
		<section aria-labelledby={id} className={cn("container mt-[var(--space-section)]", className)}>
			{body}
		</section>
	);
}
