// Peças compartilhadas pelo Explorar, pelo bottom sheet e pela página do fator (LANC-001 PR-H), na pele do RC-DS-CF
// (DS-CF-001-mapa §4–§5). Tipo de nó = forma + rótulo (RQ-076); relações sempre em frase (RQ-073); cadeia "Por quê?"
// em texto (RQ-078).
import type { ReactNode } from "react";

import { MapTabs } from "./MapTabs";

import { RC_GRAPH, NODE_TYPES, chainFor, relationsFor, type EdgeView, type MapNode, type VisualType } from "@/lib/graph";

export function TypeBadge({ type, className = "" }: { type: VisualType; className?: string }) {
	const t = NODE_TYPES[type];
	return (
		<span className={`ds-nodetype ${className}`.trim()} data-node-type={type}>
			<span aria-hidden="true">{t.glyph}</span>
			{t.label}
		</span>
	);
}

/** Trecho do texto canônico que ancora o nó (RQ-062), só quando diz mais que o próprio nome. */
export function SourceQuote({ node, className = "" }: { node: MapNode; className?: string }) {
	const quote = node.source_quote?.trim();
	if (!quote || quote.split(/\s+/).length < 4) return null;
	return (
		<figure className={`ds-mapa-quote ${className}`.trim()} data-source-quote>
			<blockquote>“{quote}”</blockquote>
			{node.source_refs[0] && <figcaption>{node.source_refs[0]}</figcaption>}
		</figure>
	);
}

/** Link para outro nó: no Explorar seleciona no mapa; na página do fator, abre a página dele. */
export type NodeLink = (node: MapNode, children: ReactNode) => ReactNode;

export function EdgeSentence({ edge, nodeLink, from }: { edge: EdgeView; nodeLink: NodeLink; from?: string }) {
	const name = (n: MapNode) => (n.id === from ? <strong>{n.label}</strong> : nodeLink(n, n.label));
	return (
		<span data-edge-sentence={edge.sentence}>
			{name(edge.source)} {edge.label} {name(edge.target)}
			{edge.inferred && <span className="ds-muted"> (inferido)</span>}
		</span>
	);
}

function SentenceList({ edges, nodeLink, from, empty }: { edges: EdgeView[]; nodeLink: NodeLink; from?: string; empty: string }) {
	if (!edges.length) return <p className="ds-sentences-empty">{empty}</p>;
	return (
		<ul className="ds-sentences">
			{edges.map((e) => (
				<li key={e.id}>
					<EdgeSentence edge={e} nodeLink={nodeLink} from={from} />
				</li>
			))}
		</ul>
	);
}

/** Abas Causas · Impactos · Soluções · Evidências (RQ-071). */
export function RelationTabs({ id, nodeLink }: { id: string; nodeLink: NodeLink }) {
	const r = relationsFor(RC_GRAPH, id);
	return (
		<MapTabs
			label="Relações"
			wrap
			data-relation-tabs=""
			items={[
				{
					value: "causas",
					label: `Causas (${r.causes.length})`,
					content: <SentenceList edges={r.causes} nodeLink={nodeLink} from={id} empty="Nenhuma causa registrada no grafo." />,
				},
				{
					value: "impactos",
					label: `Impactos (${r.impacts.length})`,
					content: <SentenceList edges={r.impacts} nodeLink={nodeLink} from={id} empty="Nenhum impacto registrado no grafo." />,
				},
				{
					value: "solucoes",
					label: `Soluções (${r.solutions.length})`,
					content: <SentenceList edges={r.solutions} nodeLink={nodeLink} from={id} empty="Nenhuma solução registrada no grafo." />,
				},
				{
					value: "evidencias",
					label: `Evidências (${r.evidence.length})`,
					content: r.evidence.length ? (
						<ul className="ds-sentences">
							{r.evidence.map((ev) => (
								<li key={ev.id}>
									{ev.url ? (
										<a href={ev.url} rel="noopener" className="ds-inline-link">
											{ev.label}
										</a>
									) : (
										ev.label
									)}
								</li>
							))}
						</ul>
					) : (
						<p className="ds-sentences-empty">
							Sem fonte ligada a este nó.{" "}
							<a href="/fontes/" className="ds-inline-link">
								Ver todas as fontes
							</a>
						</p>
					),
				},
			]}
		/>
	);
}

/** Modo "Por quê?" em texto (RQ-078): causas acima, compensações abaixo. */
export function WhyChain({ id, nodeLink }: { id: string; nodeLink: NodeLink }) {
	const chain = chainFor(RC_GRAPH, id);
	return (
		<div className="ds-mapa-why" data-why-chain>
			<div>
				<h3 className="ds-label">Causas acima</h3>
				<SentenceList edges={chain.causes} nodeLink={nodeLink} from={id} empty="Nenhuma causa acima deste nó." />
			</div>
			<div>
				<h3 className="ds-label">Compensações abaixo</h3>
				<SentenceList edges={chain.compensations} nodeLink={nodeLink} from={id} empty="Nenhuma compensação registrada." />
			</div>
		</div>
	);
}

/** Contagens do snap médio do sheet. */
export function RelationCounts({ id }: { id: string }) {
	const r = relationsFor(RC_GRAPH, id);
	const items = [
		["Causas", r.causes.length],
		["Impactos", r.impacts.length],
		["Soluções", r.solutions.length],
	] as const;
	return (
		<dl className="ds-counts" data-relation-counts>
			{items.map(([k, v]) => (
				<div key={k}>
					<dt>{k}</dt>
					<dd>{v}</dd>
				</div>
			))}
		</dl>
	);
}
