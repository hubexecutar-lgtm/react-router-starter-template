// Bottom sheet do fator (LANC-001 RQ-071, SCR-03): recolhido (nome, tipo, "Explorar relações") → médio (trecho de
// origem e contagens) → expandido (abas e "Por quê?"). Muda de altura arrastando a alça, pelos botões ou pelas setas
// na alça; Esc fecha. A partir de 900px vira painel ao lado do mapa.
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { useEffect, useRef } from "react";

import { RelationCounts, RelationTabs, SourceQuote, TypeBadge, WhyChain, type NodeLink } from "./parts";

import { factorHref, type MapNode } from "@/lib/graph";
import { cn } from "@/lib/utils";

export const SNAPS = ["collapsed", "medium", "expanded"] as const;
export type Snap = (typeof SNAPS)[number];

const step = (snap: Snap, by: 1 | -1): Snap => SNAPS[Math.min(SNAPS.length - 1, Math.max(0, SNAPS.indexOf(snap) + by))];
const DRAG = 32;

const ICON_BTN =
	"focus-visible:ring-ring/50 inline-flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-control)] outline-none hover:bg-[var(--surface-hover)] focus-visible:ring-[3px] disabled:opacity-40";

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
		<aside
			aria-labelledby={titleId}
			data-sheet
			data-snap={snap}
			className={cn(
				"bg-background fixed inset-x-0 bottom-[var(--bottombar-h)] z-30 flex flex-col overflow-hidden rounded-t-[var(--radius-sheet)] border-t border-[var(--border-default)] shadow-[var(--shadow-overlay)]",
				"transition-[max-height] duration-[var(--dur-base)] ease-[var(--ease)]",
				snap === "collapsed" && "max-h-[180px]",
				snap === "medium" && "max-h-[50svh]",
				snap === "expanded" && "max-h-[calc(100svh-var(--bottombar-h)-var(--ref-header-h)-16px)]",
				"min-[900px]:sticky min-[900px]:top-[calc(var(--ref-header-h)+16px)] min-[900px]:bottom-auto min-[900px]:z-auto min-[900px]:max-h-[calc(100svh-var(--ref-header-h)-32px)] min-[900px]:rounded-[var(--radius-sheet)] min-[900px]:border",
			)}
		>
			<div className="flex shrink-0 justify-center pt-1">
				<button
					type="button"
					data-sheet-handle
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
					className="focus-visible:ring-ring/50 flex h-6 w-16 touch-none items-center justify-center rounded-full outline-none focus-visible:ring-[3px]"
				>
					<span aria-hidden="true" className="h-1 w-10 rounded-full bg-[var(--border-strong)]" />
				</button>
				<span id={`${titleId}-hint`} className="sr-only">
					Arraste para cima ou para baixo, ou use as setas.
				</span>
			</div>
			<div className="flex shrink-0 items-start gap-2 px-4 pb-2">
				<div className="min-w-0 flex-1 pt-2">
					<TypeBadge type={node.visual} />
					<h2 id={titleId} className="mt-1 text-xl leading-tight font-semibold">
						{node.label}
					</h2>
				</div>
				<button type="button" className={ICON_BTN} aria-label="Recolher painel" data-sheet-down disabled={snap === "collapsed"} onClick={() => onSnap(step(snap, -1))}>
					<ChevronDown className="size-5" aria-hidden="true" />
				</button>
				<button type="button" className={ICON_BTN} aria-label="Expandir painel" data-sheet-up disabled={snap === "expanded"} onClick={() => onSnap(step(snap, 1))}>
					<ChevronUp className="size-5" aria-hidden="true" />
				</button>
				<button type="button" className={ICON_BTN} aria-label="Fechar painel" data-sheet-close onClick={onClose}>
					<X className="size-5" aria-hidden="true" />
				</button>
			</div>
			<div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
				{snap === "collapsed" ? (
					<button
						type="button"
						data-sheet-explore
						onClick={() => onSnap("expanded")}
						className="text-primary focus-visible:ring-ring/50 inline-flex min-h-11 items-center rounded-[var(--radius-control)] text-sm font-semibold outline-none focus-visible:ring-[3px]"
					>
						Explorar relações
					</button>
				) : (
					<div className="space-y-6">
						<SourceQuote node={node} />
						<RelationCounts id={node.id} />
						{snap === "expanded" && (
							<>
								<RelationTabs id={node.id} nodeLink={nodeLink} />
								<section aria-label="Por quê?">
									<h3 className="text-lg font-semibold">Por quê?</h3>
									<div className="mt-3">
										<WhyChain id={node.id} nodeLink={nodeLink} />
									</div>
								</section>
							</>
						)}
						<a
							href={factorHref(node.id)}
							data-factor-link
							className="text-primary focus-visible:ring-ring/50 inline-flex min-h-11 items-center rounded-[var(--radius-control)] text-sm font-semibold underline underline-offset-4 outline-none hover:no-underline focus-visible:ring-[3px]"
						>
							Abrir página do fator
						</a>
					</div>
				)}
			</div>
		</aside>
	);
}
