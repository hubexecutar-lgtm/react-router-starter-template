// CTA final (handoff): painel cinza claro, largura ampla, título, apoio e duas ações (principal em cápsula
// preta). Props por conteúdo; a cópia de produção vem do autor.
import { cn } from "@/lib/utils";

export type CtaLink = { label: string; href: string; primary?: boolean };

export function ClosingCTA({ title, description, links }: { title: string; description?: string; links: CtaLink[] }) {
	return (
		<section className="stories-container mt-[var(--ref-section-gap)]" aria-label={title}>
			<div className="rc-surface bg-[var(--surface-subtle)] flex flex-col items-center gap-6 rounded-[var(--ref-control-radius)] px-6 py-20 text-center">
				<h2 className="stories-h2 max-w-[18ch]">{title}</h2>
				{description && <p className="stories-body text-muted-foreground max-w-[var(--ref-hero-lead-w)]">{description}</p>}
				<div className="flex flex-wrap items-center justify-center gap-3">
					{links.map((l) => (
						<a
							key={l.href + l.label}
							href={l.href}
							className={cn(
								"focus-visible:ring-ring/50 inline-flex h-10 items-center rounded-[var(--ref-pill-radius)] px-6 text-sm font-medium outline-none focus-visible:ring-[3px]",
								l.primary ? "bg-foreground text-background" : "border-input bg-background text-foreground border",
							)}
						>
							{l.label}
						</a>
					))}
				</div>
			</div>
		</section>
	);
}
