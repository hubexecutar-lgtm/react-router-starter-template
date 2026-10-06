// Referências do artigo (LANC-001 RQ-042/043) no RC-DS-CF: as fontes do RC-SRC-001 e do RC-SRC-002 que o artigo usa e a
// nota de governança do RC-SRC-001, literal (conceitos próprios do projeto não são normas externas).
import { MoreLink, SectionHead } from "@/components/ds";
import { GOVERNANCE_NOTE, SOURCES } from "@/data/sources";
import { SCIENTIFIC_SOURCES } from "@/data/sources-scientific";

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
		<section className="ds-section" aria-labelledby="referencias" data-references>
			<div className="ds-reading" style={{ paddingInline: 0, marginInline: "auto" }}>
				<SectionHead id="referencias" label="Fontes" heading="Referências" align="left" />
				<ul className="ds-list">
					{sourcesById(ids).map((s) => (
						<li key={s.id}>
							<a href={s.url} rel="noopener" className="ds-ref-link">
								{s.label}
							</a>
							<span className="ds-card-meta" style={{ display: "block" }}>
								{s.topic}
							</span>
						</li>
					))}
				</ul>
				<div className="ds-prose-block" style={{ marginTop: 24, fontSize: 15, color: "var(--cf-fg-muted)" }} data-governance-note>
					{GOVERNANCE_NOTE.map((l) => (
						<p key={l}>{l}</p>
					))}
				</div>
				<MoreLink href="/fontes/">Todas as fontes</MoreLink>
			</div>
		</section>
	);
}
