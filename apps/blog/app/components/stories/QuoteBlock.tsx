// Citação (handoff): bloco centralizado em 826 px, 29,5662/39,0274 peso 500, com atribuição abaixo.
export function QuoteBlock({ text, attribution }: { text: string; attribution: string }) {
	return (
		<figure className="stories-container mt-[var(--ref-section-gap)]">
			<blockquote className="stories-quote mx-auto max-w-[826px] text-center">“{text}”</blockquote>
			<figcaption className="stories-caption text-muted-foreground mt-4 text-center">{attribution}</figcaption>
		</figure>
	);
}
