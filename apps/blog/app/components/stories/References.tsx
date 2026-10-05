// Referências do artigo (LANC-001 RQ-042/043): as fontes do RC-SRC-001 e do RC-SRC-002 (fontes científicas,
// RC-PUB-PACK-003) que o artigo usa, e a nota de governança do RC-SRC-001, literal (conceitos próprios do projeto não
// são normas externas).
import { SCIENTIFIC_SOURCES } from "@/data/sources-scientific";
import { GOVERNANCE_NOTE, SOURCES } from "@/data/sources";

type RefView = { id: string; label: string; url: string; topic: string };

const ALL: RefView[] = [
	...SOURCES,
	...SCIENTIFIC_SOURCES.map((s) => ({
		id: s.id,
		label: s.title,
		url: s.url,
		topic: `${s.authors} · ${s.journal} · ${s.year}${s.pmid ? ` · PMID ${s.pmid}` : ""}`,
	})),
];

export const sourcesById = (ids: string[]) =>
	ids.map((id) => {
		const s = ALL.find((x) => x.id === id);
		if (!s) throw new Error(`Fonte inexistente no RC-SRC-001 e no RC-SRC-002: ${id}`);
		return s;
	});

export function References({ ids }: { ids: string[] }) {
	if (!ids.length) return null;
	return (
		<section className="mt-12 px-[var(--ref-gutter)]" aria-labelledby="referencias" data-references>
			<div className="hy-article">
				<div className="hy-source">
					<h2 id="referencias" className="text-foreground mb-4 text-[17px] font-semibold">
						Referências
					</h2>
					<ul className="space-y-3">
						{sourcesById(ids).map((s) => (
							<li key={s.id}>
								<a href={s.url} rel="noopener" className="text-primary underline underline-offset-4 hover:no-underline">
									{s.label}
								</a>
								<span className="block">{s.topic}</span>
							</li>
						))}
					</ul>
					<div className="mt-4 space-y-2" data-governance-note>
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
			</div>
		</section>
	);
}
