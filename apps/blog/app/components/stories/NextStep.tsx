// "Próximo passo" no fim de todo artigo (LANC-001 RQ-044/RQ-053), no padrão do Editorial Hybrid v4 (ADR-22): exatamente
// 1 CTA primário (o do próprio texto canônico, ou o degrau seguinte da escada de CTA) e a navegação de leitura.
import { ChevronLink } from "@/components/layout/ChevronLink";
import type { NextStep as Next } from "@/data/article-meta";
import { track } from "@/lib/analytics/track";

export function NextStep({
	next,
	related,
	event,
}: {
	next: Next;
	related: { href: string; title: string }[];
	/** RQ-111: o clique no CTA primário vira evento "cta" do estágio do artigo. */
	event?: Omit<Parameters<typeof track>[0], "action">;
}) {
	return (
		<section className="mt-[var(--hy-section)] px-[var(--ref-gutter)]" aria-labelledby="proximo-passo" data-next-step>
			<div className="mx-auto max-w-[var(--hy-read)] border-t border-[var(--border-default)] pt-12">
				<p className="hy-eyebrow">Próximo passo</p>
				<h2 id="proximo-passo" className="mt-3 text-[length:var(--hy-subhead)] leading-[1.25] font-medium tracking-[-0.025em]">
					Continue pela cadeia
				</h2>
				<a href={next.href} data-cta="primary" onClick={() => event && track({ ...event, action: "cta" })} className="hy-btn-primary mt-6">
					{next.label}
				</a>
				<nav className="hy-article-nav" aria-label="Continuar leitura">
					<ChevronLink href="/artigos/">Todos os artigos</ChevronLink>
					{related.map((r) => (
						<ChevronLink key={r.href} href={r.href}>
							{r.title}
						</ChevronLink>
					))}
				</nav>
			</div>
		</section>
	);
}
