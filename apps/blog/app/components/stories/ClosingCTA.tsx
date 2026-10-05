// CTA final no padrão do Editorial Hybrid v4 (ADR-22): painel Subtle, título, apoio e duas ações (botão primário e
// secundário do híbrido). Props por conteúdo; a cópia de produção vem do autor.
export type CtaLink = { label: string; href: string; primary?: boolean };

export function ClosingCTA({ title, description, links }: { title: string; description?: string; links: CtaLink[] }) {
	return (
		<section className="stories-container mt-[var(--ref-section-gap)]" aria-label={title}>
			<div className="rc-surface bg-[var(--surface-subtle)] flex flex-col items-center gap-6 rounded-[var(--hy-radius)] px-6 py-20 text-center">
				<h2 className="stories-h2 max-w-[18ch]">{title}</h2>
				{description && <p className="stories-body text-muted-foreground max-w-[var(--ref-hero-lead-w)]">{description}</p>}
				<div className="flex flex-wrap items-center justify-center gap-3">
					{links.map((l) => (
						<a
							key={l.href + l.label}
							href={l.href}
							className={l.primary ? "hy-btn-primary" : "hy-btn-secondary"}
						>
							{l.label}
						</a>
					))}
				</div>
			</div>
		</section>
	);
}
