// Referências do artigo (LANC-001 RQ-042/043): as fontes do RC-SRC-001 que o artigo usa e a nota de governança
// do mesmo documento, literal (conceitos próprios do projeto não são normas externas).
import { GOVERNANCE_NOTE, SOURCES } from "@/data/sources";

export const sourcesById = (ids: string[]) =>
	ids.map((id) => {
		const s = SOURCES.find((x) => x.id === id);
		if (!s) throw new Error(`Fonte inexistente no RC-SRC-001: ${id}`);
		return s;
	});

export function References({ ids }: { ids: string[] }) {
	if (!ids.length) return null;
	return (
		<section className="stories-container mt-[var(--ref-section-gap)]" aria-labelledby="referencias" data-references>
			<div className="mx-auto max-w-[var(--ref-reading-width)]">
				<h2 id="referencias" className="stories-h2 mb-[var(--ref-block-gap)]">
					Referências
				</h2>
				<ul className="stories-body space-y-3">
					{sourcesById(ids).map((s) => (
						<li key={s.id}>
							<a href={s.url} rel="noopener" className="text-primary underline underline-offset-4 hover:no-underline">
								{s.label}
							</a>
							<span className="stories-caption text-muted-foreground block">{s.topic}</span>
						</li>
					))}
				</ul>
				<div className="stories-caption text-muted-foreground mt-[var(--ref-block-gap)] space-y-2" data-governance-note>
					{GOVERNANCE_NOTE.map((l) => (
						<p key={l}>{l}</p>
					))}
					<p>
						<a href="/fontes/" className="text-primary underline underline-offset-4">
							Todas as fontes
						</a>
					</p>
				</div>
			</div>
		</section>
	);
}
