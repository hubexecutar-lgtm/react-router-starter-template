// Template de item das Ferramentas (ADR-BLOG-JORNADA-ROTAS-001 §2.2, ADR-26) para tipos que não são solução: propósito,
// entrada, etapas, saída, fontes e modo de acesso, no RC-DS-CF (DS-CF-001-ferramentas §3–5). Soluções usam o
// SolutionDetail. Um único CTA primário quando o destino é real; sem destino, a indisponibilidade é dita em texto.
import { AREAS } from "../area-tokens";
import { typeDef, typeHref } from "../data/item-types";
import type { StoreItem } from "../types/store";

import { Badge, Button, PageHead, Table } from "@/components/ds";

/** Processo numerado (§3). */
function Steps({ items }: { items: StoreItem["process"] }) {
	return (
		<ol className="ds-steps" data-testid="process-steps">
			{items.map((s) => (
				<li key={s.index}>
					<span className="ds-steps-n" aria-hidden="true">
						{s.index}
					</span>
					<span>{s.label}</span>
				</li>
			))}
		</ol>
	);
}

/** Fluxo entrada → passos → saída (§4), derivado dos mesmos três passos. */
function ItemFlow({ item }: { item: StoreItem }) {
	const nodes = [
		{ key: "in", label: item.input, tag: "Entrada" },
		...item.process.map((s) => ({ key: `s${s.index}`, label: s.label, tag: String(s.index) })),
		{ key: "out", label: item.output, tag: "Saída" },
	];
	return (
		<ol aria-label="Fluxo de uso" className="ds-flow" data-testid="flowchart">
			{nodes.map((n, i) => (
				<li key={n.key} data-node={n.key}>
					<span className="ds-flow-node" data-kind={n.key === "in" || n.key === "out" ? "io" : "step"}>
						<span className="ds-flow-tag">{n.tag}</span>
						{n.label}
					</span>
					{i < nodes.length - 1 && <span className="ds-flow-link" aria-hidden="true" />}
				</li>
			))}
		</ol>
	);
}

export function ItemDetail({ item }: { item: StoreItem }) {
	const type = typeDef(item.type);
	const pending = !item.cta.target || item.cta.target === "#";
	return (
		<article className="ds-page" data-item={item.slug}>
			<PageHead
				crumbs={[{ label: "Ferramentas", href: "/ferramentas/" }, { label: type.plural, href: typeHref(item.type) }, { label: item.name }]}
				eyebrow={`${type.label} · ${item.id}`}
				title={item.name}
				lead={item.description}
				actions={
					pending ? (
						<p className="ds-tools-note" style={{ marginTop: 0 }}>
							Acesso indisponível: o destino deste item ainda não está publicado.
						</p>
					) : (
						<Button href={item.cta.target} size="lg" data-cta="primary">
							{item.cta.label}
						</Button>
					)
				}
			>
				<div className="ds-chips" style={{ marginTop: 16 }}>
					<Badge>{AREAS[item.area].label}</Badge>
					{item.tags.map((t) => (
						<Badge key={t}>{t}</Badge>
					))}
				</div>
			</PageHead>

			<section className="ds-section" style={{ paddingTop: 0 }} aria-label="Detalhe do item">
				<div className="ds-item-cols">
					<div>
						<section aria-labelledby="contexto">
							<h2 id="contexto">Contexto</h2>
							<p className="ds-prose-block">{item.context}</p>
						</section>
						<section aria-labelledby="como-funciona">
							<h2 id="como-funciona">Como funciona</h2>
							<ItemFlow item={item} />
						</section>
						<details className="ds-disclosure">
							<summary>Referências</summary>
							<ul className="ds-list">
								{item.references.map((r) => (
									<li key={r.label}>
										<b>{r.label}</b> — {r.note}
									</li>
								))}
							</ul>
						</details>
					</div>
					<div>
						<section aria-labelledby="problema">
							<h2 id="problema">Problema</h2>
							<p className="ds-prose-block">{item.problem}</p>
						</section>
						<section aria-labelledby="processo">
							<h2 id="processo">Processo</h2>
							<Steps items={item.process} />
						</section>
						<section aria-labelledby="progresso">
							<h2 id="progresso">Progresso</h2>
							<Table
								caption="Progresso em PDCA"
								head={["Etapa", "O que observar"]}
								rows={[
									["Plan", item.progress.plan],
									["Do", item.progress.do],
									["Check", item.progress.check],
									["Act", item.progress.act],
								]}
							/>
						</section>
					</div>
				</div>
			</section>
		</article>
	);
}
