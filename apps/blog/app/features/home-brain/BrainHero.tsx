// Cérebro compartilhado (HOME-BRAIN-001, ADR-26): o mesmo componente, asset e renderer na Home (`variant="preview"`) e no
// Mapa Cognitivo (`variant="full"`, /mapas/). Cérebro 3D pontilhado (Three.js, só depois da hidratação) com os 4 seletores
// do RC-HOME-002 sobre a figura e a explicação da função em HTML, fora do canvas. No `full`, `?foco=` abre a função e a
// seleção grava `?foco=` (replaceState). Sem JS, sem WebGL ou com falha do asset: imagem estática, seletores e links continuam.
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

import { Ban, ClipboardList, Database, Lightbulb, Pause, Play, RefreshCcw, RotateCcw, RotateCw, Target, TriangleAlert, type LucideIcon } from "lucide-react";

import type { BrainController, BrainTopic } from "./types";

import { HOME_MAP, type HomeFunction } from "@/data/home";
import { track } from "@/lib/analytics/track";

const ASSET_ID = "HOME-BRAIN-001";
const ICONS: Record<string, LucideIcon> = {
	"COG-PLANEJAMENTO": ClipboardList,
	"COG-MEMORIA-TRABALHO": Database,
	"COG-CONTROLE-INIBITORIO": Ban,
	"COG-FLEXIBILIDADE": RefreshCcw,
};
const ARROWS: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

type Status = "loading" | "ready" | "fallback";
export type BrainFunction = HomeFunction & { topic?: BrainTopic };

export type BrainCopy = { eyebrow: string; heading: string; lead: string; note: string; defaultId: string; functions: HomeFunction[] };

export function BrainHero({
	topics,
	variant = "preview",
	copy = HOME_MAP,
}: {
	topics: BrainTopic[];
	variant?: "preview" | "full";
	copy?: BrainCopy;
}) {
	const functions: BrainFunction[] = copy.functions.map((f) => ({ ...f, topic: topics.find((t) => t.id === f.id) }));
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const controller = useRef<BrainController | null>(null);
	const selectors = useRef<(HTMLButtonElement | null)[]>([]);
	const pausedRef = useRef(true);
	const [paused, setPaused] = useState(true);
	const [status, setStatus] = useState<Status>("loading");
	const [attempt, setAttempt] = useState(0);
	const [selectedId, setSelectedId] = useState(copy.defaultId);

	const updatePaused = (value: boolean) => {
		pausedRef.current = value;
		setPaused(value);
		controller.current?.setPaused(value);
	};

	// Movimento reduzido: a cena começa (e fica) parada até um comando explícito.
	useEffect(() => {
		const media = window.matchMedia("(prefers-reduced-motion: reduce)");
		const apply = () => updatePaused(media.matches);
		apply();
		media.addEventListener("change", apply);
		return () => media.removeEventListener("change", apply);
	}, []);

	useEffect(() => {
		const abort = new AbortController();
		let instance: BrainController | null = null;
		const fail = () => {
			if (abort.signal.aborted) return;
			instance?.dispose();
			controller.current = null;
			setStatus("fallback");
		};
		setStatus("loading");
		import("./brain-renderer.client")
			.then(({ createBrainRenderer }) =>
				createBrainRenderer(canvasRef.current!, {
					signal: abort.signal,
					paused: pausedRef.current,
					onDrag: () => {
						pausedRef.current = true;
						setPaused(true);
					},
					onError: fail,
				}),
			)
			.then((created) => {
				if (abort.signal.aborted) return created.dispose();
				instance = created;
				controller.current = created;
				created.setPaused(pausedRef.current);
				setStatus("ready");
			})
			.catch(fail);
		return () => {
			abort.abort();
			instance?.dispose();
			if (controller.current === instance) controller.current = null;
		};
	}, [attempt]);

	// Mapa (full): ?foco= abre a função pedida, depois da hidratação (o HTML pré-renderizado sai com a padrão).
	useEffect(() => {
		if (variant !== "full") return;
		const foco = new URLSearchParams(window.location.search).get("foco");
		if (foco && copy.functions.some((f) => f.id === foco)) setSelectedId(foco);
	}, [variant, copy.functions]);

	const select = (id: string) => {
		setSelectedId(id);
		updatePaused(true);
		if (variant === "full") {
			const url = new URL(window.location.href);
			url.searchParams.set("foco", id);
			window.history.replaceState(window.history.state, "", url);
		}
		track({ stage: "TOOL", action: "select", capability_id: id, asset_id: ASSET_ID });
	};
	// Setas percorrem os seletores e selecionam (como no esboço); Tab sai do grupo.
	const onSelectorKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
		const delta = ARROWS[event.key];
		if (!delta) return;
		event.preventDefault();
		const next = (index + delta + functions.length) % functions.length;
		selectors.current[next]?.focus();
		select(functions[next].id);
	};
	const rotate = (direction: number) => {
		updatePaused(true);
		controller.current?.rotate(direction);
	};

	return (
		<section
			id="mapa"
			className="home-map"
			aria-labelledby="mapa-titulo"
			data-home-section="Mapa"
			data-brain-status={status}
			data-brain-variant={variant}
		>
			<header className="ds-head">
				<p className="ds-label">{copy.eyebrow}</p>
				<h2 id="mapa-titulo">{copy.heading}</h2>
				<p>{copy.lead}</p>
			</header>

			<div className="brain-stage">
				<div className="brain-viewport">
					<img
						className="brain-poster"
						src="/models/home-brain/brain-poster.webp"
						width={1200}
						height={900}
						alt="Cérebro pontilhado em laranja, visto de lado, com os dois hemisférios, o cerebelo e o tronco."
						aria-hidden={status === "ready" ? true : undefined}
						decoding="async"
					/>
					<canvas key={attempt} ref={canvasRef} className="brain-canvas" aria-hidden="true" />
				</div>
				<div className="brain-markers" role="group" aria-label="Funções executivas">
					{functions.map((f, i) => {
						const Icon = ICONS[f.id] ?? Target;
						return (
							<button
								key={f.id}
								ref={(el) => {
									selectors.current[i] = el;
								}}
								type="button"
								className="brain-marker"
								data-side={f.marker.side}
								data-function={f.id}
								style={{ "--mx": `${f.marker.x}%`, "--my": `${f.marker.y}%` } as React.CSSProperties}
								aria-pressed={selectedId === f.id}
								aria-controls="brain-detail"
								tabIndex={selectedId === f.id ? 0 : -1}
								onClick={() => select(f.id)}
								onKeyDown={(e) => onSelectorKey(e, i)}
							>
								<span className="brain-marker-dot" aria-hidden="true">
									<Icon size={24} strokeWidth={1.8} />
								</span>
								<span className="brain-marker-label">
									<b>{f.label}</b>
									<small>{f.summary}</small>
								</span>
							</button>
						);
					})}
				</div>
			</div>
			<p className="home-map-note">{copy.note}</p>

			<div className="brain-controls" role="group" aria-label="Controles do cérebro 3D">
				<button type="button" disabled={status !== "ready"} onClick={() => updatePaused(!paused)} aria-pressed={!paused}>
					{paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
					{paused ? "Girar" : "Pausar"}
				</button>
				<button type="button" disabled={status !== "ready"} onClick={() => rotate(-1)} aria-label="Girar o cérebro para a esquerda">
					<RotateCcw size={18} aria-hidden="true" />
				</button>
				<button type="button" disabled={status !== "ready"} onClick={() => rotate(1)} aria-label="Girar o cérebro para a direita">
					<RotateCw size={18} aria-hidden="true" />
				</button>
				<button
					type="button"
					disabled={status !== "ready"}
					onClick={() => {
						updatePaused(true);
						controller.current?.reset();
					}}
				>
					Restaurar vista
				</button>
			</div>
			<p className="brain-instruction">Arraste para girar. Selecione uma função para ver os detalhes.</p>
			<p className="brain-load-status" role="status">
				{status === "loading" ? "Carregando o cérebro 3D…" : status === "fallback" ? "O 3D está indisponível. Os seletores e o mapa continuam funcionando." : ""}
			</p>
			{status === "fallback" && (
				<button type="button" className="brain-retry" onClick={() => setAttempt((a) => a + 1)}>
					Tentar carregar o 3D novamente
				</button>
			)}

			<div id="brain-detail" className="brain-detail" aria-live="polite">
				{functions.map((f) => (
					<FunctionDetail key={f.id} fn={f} hidden={f.id !== selectedId} variant={variant} />
				))}
			</div>
			<noscript>
				<ul className="brain-nojs-links">
					{functions.map((f) => (
						<li key={f.id}>
							<a href={f.topic?.href ?? "/mapas/"}>{f.label} no mapa</a>
						</li>
					))}
				</ul>
			</noscript>
		</section>
	);
}

function FunctionDetail({ fn, hidden, variant }: { fn: BrainFunction; hidden: boolean; variant: "preview" | "full" }) {
	const rows: [LucideIcon, string, string][] = [
		[Target, "Demanda", fn.demand],
		[TriangleAlert, "Dificuldade possível", fn.difficulty],
		[Lightbulb, "Estratégia de apoio", fn.strategy],
	];
	const relations = fn.topic?.relations.slice(0, variant === "full" ? 8 : 3) ?? [];
	const sources = variant === "full" ? (fn.topic?.sources ?? []) : [];
	// Prévia (Home) leva ao Mapa com o foco; o Mapa leva às relações do grafo.
	const next =
		variant === "preview"
			? { href: `/mapas/?foco=${fn.id}`, label: `Abrir ${fn.label.toLocaleLowerCase("pt-BR")} no Mapa Cognitivo` }
			: { href: fn.topic?.href ?? "/mapas/explorar/", label: `Explorar as relações de ${fn.label.toLocaleLowerCase("pt-BR")}` };
	return (
		<article className="brain-detail-body" data-detail={fn.id} hidden={hidden}>
			<h3>
				Função selecionada: <strong>{fn.label}</strong>
			</h3>
			<dl>
				{rows.map(([Icon, term, text]) => (
					<div key={term}>
						<dt>
							<Icon size={26} strokeWidth={1.8} aria-hidden="true" />
							{term}:
						</dt>
						<dd>{text}</dd>
					</div>
				))}
			</dl>
			{relations.length > 0 && (
				<div className="brain-relations">
					<p>Relações registradas no mapa:</p>
					<ul>
						{relations.map((r) => (
							<li key={r.id}>{r.sentence}</li>
						))}
					</ul>
				</div>
			)}
			{sources.length > 0 && (
				<div className="brain-relations" data-brain-sources>
					<p>Fontes no grafo:</p>
					<ul>
						{sources.map((s) => (
							<li key={s.id}>{s.label}</li>
						))}
					</ul>
				</div>
			)}
			<a href={next.href} className="brain-detail-link" onClick={() => track({ stage: "TOOL", action: "cta", capability_id: fn.id, asset_id: ASSET_ID })}>
				{next.label} <span aria-hidden="true">›</span>
			</a>
		</article>
	);
}
