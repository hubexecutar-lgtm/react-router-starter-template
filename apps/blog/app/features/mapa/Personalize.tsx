// Personalizar o mapa em 3 passos (LANC-001 SCR-04, RQ-090): focos de trabalho → interesses → "Mostrar evidências".
// O resultado só reordena e destaca o Explorar; fica neste navegador (prefs.ts) e nunca vai para a rede.
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";

import { EMPTY_PREFS, clearPrefs, focusNode, loadPrefs, savePrefs, type MapPrefs } from "./prefs";

import { PROBLEMS, type ProblemId } from "@/data/article-meta";
import { NODE_TYPES, RC_GRAPH, exploreHref, factorIds, neighborhood, nodeById, type MapNode } from "@/lib/graph";
import { cn } from "@/lib/utils";

const STEPS = ["Focos de trabalho", "Interesses", "Evidências"] as const;

const BTN = "disabled:opacity-40";
const PRIMARY = cn(BTN, "hy-btn-primary");
const SECONDARY = cn(BTN, "hy-btn-secondary");

const OPTION =
	"rc-cell rc-surface flex min-h-11 cursor-pointer items-center gap-3 px-4 py-3 has-[:checked]:outline has-[:checked]:outline-2 has-[:checked]:outline-[var(--graph-node-border-selected)] has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/50";

/** Interesses oferecidos: os fatores ao redor dos focos escolhidos; sem foco, todos os fatores. */
function interestOptions(focos: ProblemId[]): MapNode[] {
	const ids = focos.length
		? [...new Set(focos.flatMap((f) => neighborhood(RC_GRAPH, focusNode(f), Infinity).nodes.map((n) => n.id)))]
		: factorIds(RC_GRAPH);
	return ids.map((id) => nodeById(RC_GRAPH, id)!).filter((n) => n.visual !== "evidence");
}

export function Personalize() {
	const navigate = useNavigate();
	const [step, setStep] = useState(0);
	const [prefs, setPrefs] = useState<MapPrefs>(EMPTY_PREFS);
	const [saved, setSaved] = useState(false);
	const [status, setStatus] = useState("");
	const heading = useRef<HTMLHeadingElement>(null);
	const first = useRef(true);

	useEffect(() => {
		const stored = loadPrefs();
		if (stored) {
			setPrefs(stored);
			setSaved(true);
		}
	}, []);
	// Ao trocar de passo, o foco vai para o título do passo (leitor de tela e teclado sabem onde estão).
	useEffect(() => {
		if (first.current) {
			first.current = false;
			return;
		}
		heading.current?.focus();
	}, [step]);

	const options = useMemo(() => interestOptions(prefs.focos), [prefs.focos]);
	const toggle = <K extends "focos" | "interesses">(key: K, id: MapPrefs[K][number]) =>
		setPrefs((p) => {
			const list = p[key] as string[];
			const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
			// Interesse que saiu das opções (porque o foco mudou) não fica escondido na preferência.
			if (key === "focos") {
				const allowed = new Set(interestOptions(next as ProblemId[]).map((n) => n.id));
				return { ...p, focos: next as ProblemId[], interesses: p.interesses.filter((i) => allowed.has(i)) };
			}
			return { ...p, [key]: next };
		});

	const finish = () => {
		const ok = savePrefs(prefs);
		const focus = prefs.focos[0] ? focusNode(prefs.focos[0]) : null;
		if (!ok) {
			setStatus("Este navegador não permite guardar a personalização; o mapa abre no padrão.");
			return;
		}
		navigate(focus ? exploreHref(focus) : "/mapas/explorar/");
	};
	const reset = () => {
		clearPrefs();
		setPrefs(EMPTY_PREFS);
		setSaved(false);
		setStep(0);
		setStatus("Personalização apagada deste navegador. O mapa voltou ao padrão.");
	};

	return (
		<div className="stories-container pb-16">
			<div className="mx-auto max-w-[var(--ref-reading-width)]">
				<header className="pt-[var(--hy-section)]">
					<p className="hy-eyebrow">Mapa causal · Personalizar</p>
					<h1 className="stories-h2 mt-3">Personalizar o mapa</h1>
					<p className="stories-body text-muted-foreground mt-[var(--ref-block-gap)]">
						Escolha por onde começar. A personalização muda só a ordem e o destaque do mapa, nunca as relações nem as fontes, e fica
						guardada apenas neste navegador.
					</p>
				</header>

				<ol className="mt-8 flex flex-wrap gap-x-6 gap-y-2" aria-label="Passos" data-steps>
					{STEPS.map((s, i) => (
						<li key={s} aria-current={i === step ? "step" : undefined} className={cn("stories-meta", i === step ? "text-foreground font-semibold" : "text-muted-foreground")}>
							{i + 1}/3 {s}
						</li>
					))}
				</ol>

				<form
					className="mt-8"
					data-personalize
					data-step={step}
					onSubmit={(e) => {
						e.preventDefault();
						if (step < 2) setStep(step + 1);
						else finish();
					}}
				>
					{step === 0 && (
						<fieldset>
							<legend>
								<h2 ref={heading} tabIndex={-1} className="stories-h2 outline-none">
									Em que o trabalho mais pesa?
								</h2>
							</legend>
							<p className="stories-body text-muted-foreground mt-3">Escolha um ou mais focos de trabalho. O primeiro abre no centro do mapa.</p>
							<div className="mt-6 grid gap-[var(--ref-grid-gap)] sm:grid-cols-2">
								{PROBLEMS.map((p) => (
									<label key={p.id} className={OPTION}>
										<input type="checkbox" name="foco" value={p.id} checked={prefs.focos.includes(p.id)} onChange={() => toggle("focos", p.id)} className="size-6 accent-[var(--primary)]" />
										<span className="font-medium">{p.label}</span>
									</label>
								))}
							</div>
						</fieldset>
					)}

					{step === 1 && (
						<fieldset>
							<legend>
								<h2 ref={heading} tabIndex={-1} className="stories-h2 outline-none">
									O que você quer acompanhar?
								</h2>
							</legend>
							<p className="stories-body text-muted-foreground mt-3">
								{prefs.focos.length ? "Fatores ligados aos focos escolhidos." : "Todos os fatores do mapa."} Os marcados aparecem primeiro e
								com destaque.
							</p>
							<div className="mt-6 grid gap-[var(--ref-grid-gap)] sm:grid-cols-2" data-interest-options>
								{options.map((n) => (
									<label key={n.id} className={OPTION}>
										<input type="checkbox" name="interesse" value={n.id} checked={prefs.interesses.includes(n.id)} onChange={() => toggle("interesses", n.id)} className="size-6 shrink-0 accent-[var(--primary)]" />
										<span className="min-w-0">
											<span className="block font-medium">{n.label}</span>
											<span className="hy-eyebrow">
												<span aria-hidden="true">{NODE_TYPES[n.visual].glyph} </span>
												{NODE_TYPES[n.visual].label}
											</span>
										</span>
									</label>
								))}
							</div>
						</fieldset>
					)}

					{step === 2 && (
						<fieldset>
							<legend>
								<h2 ref={heading} tabIndex={-1} className="stories-h2 outline-none">
									Mostrar evidências?
								</h2>
							</legend>
							<p className="stories-body text-muted-foreground mt-3">
								Com esta opção, as fontes que sustentam o fator no centro entram no mapa ao lado das relações.
							</p>
							<label className={cn(OPTION, "mt-6")}>
								<input type="checkbox" name="evidencias" checked={prefs.evidencias} onChange={() => setPrefs((p) => ({ ...p, evidencias: !p.evidencias }))} className="size-6 accent-[var(--primary)]" />
								<span className="font-medium">Mostrar evidências no mapa</span>
							</label>
						</fieldset>
					)}

					<div className="mt-10 flex flex-wrap items-center gap-3">
						{step > 0 && (
							<button type="button" className={SECONDARY} onClick={() => setStep(step - 1)}>
								Voltar
							</button>
						)}
						<button type="submit" className={PRIMARY} data-cta="primary">
							{step < 2 ? "Continuar" : "Salvar e abrir o mapa"}
						</button>
						{saved && (
							<button type="button" className={SECONDARY} onClick={reset} data-reset-prefs>
								Restaurar padrão
							</button>
						)}
					</div>
					<p aria-live="polite" className="stories-caption text-muted-foreground mt-4 min-h-6" data-prefs-status>
						{status}
					</p>
				</form>
			</div>
		</div>
	);
}
