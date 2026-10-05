// "Carregar mais": botão secundário do híbrido (ADR-22), centrado. A paginação é em memória: só aparece quando há
// itens além do lote visível e não duplica nenhum card.
export function LoadMore({ onClick }: { onClick: () => void }) {
	return (
		<div className="flex justify-center">
			<button type="button" onClick={onClick} className="hy-btn-secondary">
				Carregar mais
			</button>
		</div>
	);
}
