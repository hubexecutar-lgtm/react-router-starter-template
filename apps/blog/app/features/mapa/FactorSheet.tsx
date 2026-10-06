// Bottom sheet do fator (LANC-001 RQ-071, SCR-03): recolhido (nome, tipo, "Explorar relações") → médio (trecho de
// origem e contagens) → expandido (abas e "Por quê?"). Muda de altura arrastando a alça, pelos botões ou pelas setas
// na alça; Esc fecha. A partir de 900px vira painel ao lado do mapa. Pele: ds-sheet (DS-CF-001 §4.15, DS-CF-001-mapa §2).
import { useEffect, useRef } from "react";

import { ChevronDown, ChevronUp, X } from "lucide-react";

import { RelationCounts, RelationTabs, SourceQuote, TypeBadge, WhyChain, type NodeLink } from "./parts";

import { factorHref, type MapNode } from "@/lib/graph";

export const SNAPS = ["collapsed", "medium", "expanded"] as const;
export type Snap = (typeof SNAPS)[number];

const step = (snap: Snap, by: 1 | -1): Snap => SNAPS[Math.min(SNAPS.length - 1, Math.max(0, SNAPS.indexOf(snap) + by))];
const DRAG = 32;

type Props = { node: MapNode; snap: Snap; onSnap: (s: Snap) => void; onClose: () => void; nodeLink: NodeLink };

export function FactorSheet({ node, snap, onSnap, onClose, nodeLink }: Props) {
	const start = useRef<number | null>(null);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [onClose]);

	const titleId = `sheet-${node.id}`;
	return (
		<aside aria-labelledby={titleId} data-sheet data-snap={snap} className="ds-sheet">
			<div className="ds-sheet-grip">
				<button
					type="button"
					data-sheet-handle
					className="ds-sheet-handle"
					aria-label="Ajustar a altura do painel"
					aria-describedby={`${titleId}-hint`}
					onPointerDown={(e) => {
						start.current = e.clientY;
					}}
					onPointerUp={(e) => {
						if (start.current === null) return;
						const dy = e.clientY - start.current;
						start.current = null;
						if (dy < -DRAG) onSnap(step(snap, 1));
						else if (dy > DRAG) onSnap(step(snap, -1));
					}}
					onKeyDown={(e) => {
						if (e.key === "ArrowUp") {
							e.preventDefault();
							onSnap(step(snap, 1));
						} else if (e.key === "ArrowDown") {
							e.preventDefault();
							onSnap(step(snap, -1));
						}
					}}
				>
					<span aria-hidden="true" />
				</button>
				<span id={`${titleId}-hint`} className="sr-only">
					Arraste para cima ou para baixo, ou use as setas.
				</span>
			</div>
			<div className="ds-sheet-head">
				<div className="min-w-0 flex-1">
					<TypeBadge type={node.visual} />
					<h2 id={titleId}>{node.label}</h2>
				</div>
				<button type="button" className="ds-icon-btn" aria-label="Recolher painel" data-sheet-down disabled={snap === "collapsed"} onClick={() => onSnap(step(snap, -1))}>
					<ChevronDown size={20} aria-hidden="true" />
				</button>
				<button type="button" className="ds-icon-btn" aria-label="Expandir painel" data-sheet-up disabled={snap === "expanded"} onClick={() => onSnap(step(snap, 1))}>
					<ChevronUp size={20} aria-hidden="true" />
				</button>
				<button type="button" className="ds-icon-btn" aria-label="Fechar painel" data-sheet-close onClick={onClose}>
					<X size={20} aria-hidden="true" />
				</button>
			</div>
			<div className="ds-sheet-body">
				{snap === "collapsed" ? (
					<button type="button" data-sheet-explore className="ds-btn" data-variant="outline" onClick={() => onSnap("expanded")}>
						Explorar relações
					</button>
				) : (
					<>
						<SourceQuote node={node} />
						<RelationCounts id={node.id} />
						{snap === "expanded" && (
							<>
								<RelationTabs id={node.id} nodeLink={nodeLink} />
								<section aria-labelledby={`${titleId}-why`}>
									<h3 id={`${titleId}-why`} className="ds-mapa-subhead">
										Por quê?
									</h3>
									<div className="mt-3">
										<WhyChain id={node.id} nodeLink={nodeLink} />
									</div>
								</section>
							</>
						)}
						<a href={factorHref(node.id)} data-factor-link className="ds-link">
							Abrir página do fator <span aria-hidden="true">›</span>
						</a>
					</>
				)}
			</div>
		</aside>
	);
}
