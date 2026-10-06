// Estados do catálogo no RC-DS-CF (DS-CF-001-ferramentas §2): carregando, vazio e erro. `?estado=carregando|erro`
// pré-visualiza os dois primeiros; o vazio é o EmptyState do DS (o quê + por quê + como começar).
import { Button, EmptyState } from "@/components/ds";

export function CatalogSkeleton() {
	return (
		<div aria-busy="true" data-testid="state-loading" className="ds-skeleton">
			<p className="ds-skeleton-line" role="status">
				Carregando o catálogo…
			</p>
			{Array.from({ length: 4 }, (_, i) => (
				<div key={i} className="ds-skeleton-block" aria-hidden="true" />
			))}
		</div>
	);
}

export function CatalogEmpty({ filtered, onClear }: { filtered: boolean; onClear: () => void }) {
	return (
		<div data-testid="state-empty">
			{filtered ? (
				<>
					<EmptyState
						level={3}
						title="Nenhum resultado para esta busca"
						text="Nenhum item publicado combina com o texto ou a área escolhida. Limpe os filtros para ver o catálogo inteiro."
					/>
					<p style={{ marginTop: 16 }}>
						<Button variant="outline" onClick={onClear}>
							Limpar filtros
						</Button>
					</p>
				</>
			) : (
				<EmptyState
					level={3}
					title="Nada publicado neste tipo ainda"
					text="Este tipo está no catálogo, mas ainda não tem material pronto. As soluções já estão publicadas."
					action={{ label: "Ver as soluções publicadas", href: "/ferramentas/solucoes/" }}
				/>
			)}
		</div>
	);
}

export function CatalogError({ onRetry }: { onRetry: () => void }) {
	return (
		<div role="alert" data-testid="state-error" className="ds-alert">
			<h3>Não foi possível carregar o catálogo</h3>
			<p>A lista de ferramentas não respondeu. Tente novamente em instantes.</p>
			<Button variant="outline" onClick={onRetry}>
				Tentar novamente
			</Button>
		</div>
	);
}
