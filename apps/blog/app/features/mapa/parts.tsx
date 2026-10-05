// Peças compartilhadas pelo Explorar, pelo bottom sheet e pela página do fator (LANC-001 PR-H).
// Tipo de nó = forma + rótulo (RQ-076); relações sempre em frase (RQ-073); cadeia "Por quê?" em texto (RQ-078).
import type { ReactNode } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RC_GRAPH, NODE_TYPES, chainFor, relationsFor, type EdgeView, type MapNode, type VisualType } from "@/lib/graph";
import { cn } from "@/lib/utils";

export function TypeBadge({ type, className }: { type: VisualType; className?: string }) {
	const t = NODE_TYPES[type];
	return (
		<span className={cn("stories-meta text-muted-foreground inline-flex items-center gap-1.5", className)} data-node-type={type}>
			<span aria-hidden="true" className="text-foreground">
				{t.glyph}
			</span>
			{t.label}
		</span>
	);
}

/** Trecho do texto canônico que ancora o nó (RQ-062), só quando diz mais que o próprio nome. */
export function SourceQuote({ node, className }: { node: MapNode; className?: string }) {
	const quote = node.source_quote?.trim();
	if (!quote || quote.split(/\s+/).length < 4) return null;
	return (
		<figure className={className} data-source-quote>
			<blockquote className="stories-body text-muted-foreground">“{quote}”</blockquote>
			{node.source_refs[0] && <figcaption className="stories-caption text-muted-foreground mt-1">{node.source_refs[0]}</figcaption>}
		</figure>
	);
}

/** Link para outro nó: no Explorar seleciona no mapa; na página do fator, abre a página dele. */
export type NodeLink = (node: MapNode, children: ReactNode) => ReactNode;

export function EdgeSentence({ edge, nodeLink, from }: { edge: EdgeView; nodeLink: NodeLink; from?: string }) {
	const name = (n: MapNode) => (n.id === from ? <strong className="font-semibold">{n.label}</strong> : nodeLink(n, n.label));
	return (
		<span data-edge-sentence={edge.sentence}>
			{name(edge.source)} {edge.label} {name(edge.target)}
			{edge.inferred && <span className="text-muted-foreground"> (inferido)</span>}
		</span>
	);
}

function SentenceList({ edges, nodeLink, from, empty }: { edges: EdgeView[]; nodeLink: NodeLink; from?: string; empty: string }) {
	if (!edges.length) return <p className="stories-body text-muted-foreground">{empty}</p>;
	return (
		<ul className="stories-body space-y-3">
			{edges.map((e) => (
				<li key={e.id}>
					<EdgeSentence edge={e} nodeLink={nodeLink} from={from} />
				</li>
			))}
		</ul>
	);
}

const TAB_TRIGGER = "min-h-11 flex-none px-4";

/** Abas Causas · Impactos · Soluções · Evidências (RQ-071). */
export function RelationTabs({ id, nodeLink }: { id: string; nodeLink: NodeLink }) {
	const r = relationsFor(RC_GRAPH, id);
	return (
		<Tabs defaultValue="causas" className="gap-4" data-relation-tabs>
			<TabsList aria-label="Relações" className="h-auto max-w-full flex-wrap justify-start">
				<TabsTrigger value="causas" className={TAB_TRIGGER}>
					Causas ({r.causes.length})
				</TabsTrigger>
				<TabsTrigger value="impactos" className={TAB_TRIGGER}>
					Impactos ({r.impacts.length})
				</TabsTrigger>
				<TabsTrigger value="solucoes" className={TAB_TRIGGER}>
					Soluções ({r.solutions.length})
				</TabsTrigger>
				<TabsTrigger value="evidencias" className={TAB_TRIGGER}>
					Evidências ({r.evidence.length})
				</TabsTrigger>
			</TabsList>
			<TabsContent value="causas">
				<SentenceList edges={r.causes} nodeLink={nodeLink} from={id} empty="Nenhuma causa registrada no grafo." />
			</TabsContent>
			<TabsContent value="impactos">
				<SentenceList edges={r.impacts} nodeLink={nodeLink} from={id} empty="Nenhum impacto registrado no grafo." />
			</TabsContent>
			<TabsContent value="solucoes">
				<SentenceList edges={r.solutions} nodeLink={nodeLink} from={id} empty="Nenhuma solução registrada no grafo." />
			</TabsContent>
			<TabsContent value="evidencias">
				{r.evidence.length ? (
					<ul className="stories-body space-y-3">
						{r.evidence.map((ev) => (
							<li key={ev.id}>
								{ev.url ? (
									<a href={ev.url} rel="noopener" className="text-primary underline underline-offset-4 hover:no-underline">
										{ev.label}
									</a>
								) : (
									ev.label
								)}
							</li>
						))}
					</ul>
				) : (
					<p className="stories-body text-muted-foreground">
						Sem fonte ligada a este nó. <a href="/fontes/" className="text-primary underline underline-offset-4 hover:no-underline">Ver todas as fontes</a>
					</p>
				)}
			</TabsContent>
		</Tabs>
	);
}

/** Modo "Por quê?" em texto (RQ-078): causas acima, compensações abaixo. */
export function WhyChain({ id, nodeLink }: { id: string; nodeLink: NodeLink }) {
	const chain = chainFor(RC_GRAPH, id);
	return (
		<div className="space-y-6" data-why-chain>
			<div>
				<h3 className="hy-eyebrow">Causas acima</h3>
				<div className="mt-3">
					<SentenceList edges={chain.causes} nodeLink={nodeLink} from={id} empty="Nenhuma causa acima deste nó." />
				</div>
			</div>
			<div>
				<h3 className="hy-eyebrow">Compensações abaixo</h3>
				<div className="mt-3">
					<SentenceList edges={chain.compensations} nodeLink={nodeLink} from={id} empty="Nenhuma compensação registrada." />
				</div>
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
		<dl className="flex flex-wrap gap-x-6 gap-y-2" data-relation-counts>
			{items.map(([k, v]) => (
				<div key={k} className="flex items-baseline gap-2">
					<dt className="hy-eyebrow">{k}</dt>
					<dd className="text-foreground font-semibold">{v}</dd>
				</div>
			))}
		</dl>
	);
}
