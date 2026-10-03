// "Carregar mais" (handoff): CTA em cápsula preta, 40 px de altura, centrado. A paginação é em memória:
// só aparece quando há itens além do lote visível e não duplica nenhum card.
export function LoadMore({ onClick }: { onClick: () => void }) {
	return (
		<div className="flex justify-center">
			<button
				type="button"
				onClick={onClick}
				className="bg-foreground text-background focus-visible:ring-ring/50 h-10 rounded-[var(--ref-pill-radius)] px-6 text-sm font-medium outline-none focus-visible:ring-[3px]"
			>
				Carregar mais
			</button>
		</div>
	);
}
