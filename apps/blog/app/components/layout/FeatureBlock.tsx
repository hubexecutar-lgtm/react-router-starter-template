// Bloco de recurso (anatomia Apple Developer Programs): ícone ou ilustração, título, parágrafo de
// 2–3 frases e link "Saiba mais ›". Em grade (cards-célula) ou em linha com mídia (FeatureRow).
import type { ReactNode } from "react";

import type { LucideIcon } from "lucide-react";

import { ChevronLink } from "./ChevronLink";

import { cn } from "@/lib/utils";

type Link = { href: string; label: string };

export function FeatureBlock({
	icon: Icon,
	eyebrow,
	title,
	children,
	link,
	level = 3,
	className,
}: {
	icon?: LucideIcon;
	eyebrow?: ReactNode;
	title: string;
	children: ReactNode;
	link?: Link;
	level?: 2 | 3;
	className?: string;
}) {
	const H = `h${level}` as "h2" | "h3";
	return (
		<article className={cn("rc-cell rc-surface flex h-full flex-col p-6", className)}>
			{Icon && (
				<span className="bg-background text-primary mb-5 inline-flex size-11 items-center justify-center rounded-[var(--table-radius)]">
					<Icon className="size-5" aria-hidden="true" />
				</span>
			)}
			{eyebrow && <p className="rc-eyebrow mb-2">{eyebrow}</p>}
			<H className="rc-title text-[length:var(--text-h3)]">{title}</H>
			<div className="text-muted-foreground mt-3 leading-relaxed">{children}</div>
			{link && (
				<div className="mt-auto pt-5">
					<ChevronLink href={link.href}>{link.label}</ChevronLink>
				</div>
			)}
		</article>
	);
}

/** Linha de recurso com mídia ao lado (alternando lados), como as seções do Apple Developer Programs. */
export function FeatureRow({
	id,
	eyebrow,
	title,
	children,
	link,
	media,
	reverse = false,
}: {
	id: string;
	eyebrow?: string;
	title: string;
	children: ReactNode;
	link?: Link;
	media: ReactNode;
	reverse?: boolean;
}) {
	return (
		<section aria-labelledby={id} className="container mt-[var(--space-section)]">
			<div className={cn("grid items-center gap-10 lg:grid-cols-2 lg:gap-16 [&>*]:min-w-0", reverse && "lg:[&>*:first-child]:order-2")}>
				<div>
					{eyebrow && <p className="rc-eyebrow">{eyebrow}</p>}
					<h2 id={id} className="rc-title mt-2 text-[length:var(--text-h2)]">
						{title}
					</h2>
					<div className="rc-lead mt-4 space-y-4 text-lg">{children}</div>
					{link && (
						<div className="mt-6">
							<ChevronLink href={link.href}>{link.label}</ChevronLink>
						</div>
					)}
				</div>
				<div>{media}</div>
			</div>
		</section>
	);
}
