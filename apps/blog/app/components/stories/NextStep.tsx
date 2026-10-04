// "Próximo passo" no fim de todo artigo (LANC-001 RQ-044/RQ-053): exatamente 1 CTA primário (o do próprio texto
// canônico, ou o degrau seguinte da escada de CTA) e leituras relacionadas como links de texto.
import { ChevronLink } from "@/components/layout/ChevronLink";
import type { NextStep as Next } from "@/data/article-meta";

export function NextStep({ next, related }: { next: Next; related: { href: string; title: string }[] }) {
	return (
		<section className="stories-container mt-[var(--ref-section-gap)]" aria-labelledby="proximo-passo" data-next-step>
			<div className="rc-surface mx-auto flex max-w-[var(--ref-wide-width)] flex-col items-center gap-6 rounded-[var(--ref-control-radius)] bg-[var(--surface-subtle)] px-6 py-16 text-center">
				<p className="stories-meta text-muted-foreground">Próximo passo</p>
				<h2 id="proximo-passo" className="stories-h2 max-w-[22ch]">
					Continue pela cadeia
				</h2>
				<a
					href={next.href}
					data-cta="primary"
					className="bg-foreground text-background focus-visible:ring-ring/50 inline-flex min-h-11 max-w-full items-center rounded-[var(--ref-pill-radius)] px-6 py-2 text-sm font-medium outline-none focus-visible:ring-[3px]"
				>
					{next.label}
				</a>
				{related.length > 0 && (
					<ul className="flex flex-col items-center gap-2" aria-label="Leituras relacionadas">
						{related.map((r) => (
							<li key={r.href}>
								<ChevronLink href={r.href}>{r.title}</ChevronLink>
							</li>
						))}
					</ul>
				)}
			</div>
		</section>
	);
}
