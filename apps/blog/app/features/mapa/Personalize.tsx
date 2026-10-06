// Personalizar o mapa em 3 passos (LANC-001 SCR-04, RQ-090): focos de trabalho → interesses → "Mostrar evidências".
// O resultado só reordena e destaca o Explorar; fica neste navegador (prefs.ts) e nunca vai para a rede.
import { useEffect, useMemo, useRef, useState } from "react";

import { useNavigate } from "react-router";

import { EMPTY_PREFS, clearPrefs, focusNode, loadPrefs, savePrefs, type MapPrefs } from "./prefs";

import { Button, PageHead } from "@/components/ds";
import { PROBLEMS, type ProblemId } from "@/data/article-meta";
import { NODE_TYPES, RC_GRAPH, exploreHref, factorIds, neighborhood, nodeById, type MapNode } from "@/lib/graph";

const STEPS = ["Focos de trabalho", "Interesses", "Evidências"] as const;

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
		<div className="ds-page">
			<PageHead
				crumbs={[{ label: "Mapa Cognitivo", href: "/mapas/" }, { label: "Personalizar" }]}
				eyebrow="Mapa Cognitivo · Personalizar"
				title="Personalizar o mapa"
				lead="Escolha por onde começar. A personalização muda só a ordem e o destaque do mapa, nunca as relações nem as fontes, e fica guardada apenas neste navegador."
				notice="O Personalizar está em reconstrução no design system novo; as opções vêm do grafo real."
			/>

			<div className="ds-reading pb-16">
				<ol className="ds-steps" aria-label="Passos" data-steps>
					{STEPS.map((s, i) => (
						<li key={s} aria-current={i === step ? "step" : undefined}>
							<span className="ds-steps-n">{i + 1}/3</span> {s}
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
						<fieldset className="ds-fieldset">
							<legend>
								<h2 ref={heading} tabIndex={-1}>
									Em que o trabalho mais pesa?
								</h2>
							</legend>
							<p>Escolha um ou mais focos de trabalho. O primeiro abre no centro do mapa.</p>
							<div className="ds-option-grid mt-6">
								{PROBLEMS.map((p) => (
									<label key={p.id} className="ds-option">
										<input type="checkbox" name="foco" value={p.id} checked={prefs.focos.includes(p.id)} onChange={() => toggle("focos", p.id)} />
										<span>{p.label}</span>
									</label>
								))}
							</div>
						</fieldset>
					)}

					{step === 1 && (
						<fieldset className="ds-fieldset">
							<legend>
								<h2 ref={heading} tabIndex={-1}>
									O que você quer acompanhar?
								</h2>
							</legend>
							<p>
								{prefs.focos.length ? "Fatores ligados aos focos escolhidos." : "Todos os fatores do mapa."} Os marcados aparecem primeiro e
								com destaque.
							</p>
							<div className="ds-option-grid mt-6" data-interest-options>
								{options.map((n) => (
									<label key={n.id} className="ds-option">
										<input type="checkbox" name="interesse" value={n.id} checked={prefs.interesses.includes(n.id)} onChange={() => toggle("interesses", n.id)} />
										<span className="min-w-0">
											<span className="block">{n.label}</span>
											<span className="ds-option-meta">
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
						<fieldset className="ds-fieldset">
							<legend>
								<h2 ref={heading} tabIndex={-1}>
									Mostrar evidências?
								</h2>
							</legend>
							<p>Com esta opção, as fontes que sustentam o fator no centro entram no mapa ao lado das relações.</p>
							<div className="mt-6">
								<label className="ds-option">
									<input type="checkbox" name="evidencias" checked={prefs.evidencias} onChange={() => setPrefs((p) => ({ ...p, evidencias: !p.evidencias }))} />
									<span>Mostrar evidências no mapa</span>
								</label>
							</div>
						</fieldset>
					)}

					<div className="mt-10 flex flex-wrap items-center gap-3">
						{step > 0 && (
							<Button variant="outline" size="lg" onClick={() => setStep(step - 1)}>
								Voltar
							</Button>
						)}
						<Button type="submit" size="lg" data-cta="primary">
							{step < 2 ? "Continuar" : "Salvar e abrir o mapa"}
						</Button>
						{saved && (
							<Button variant="ghost" size="lg" onClick={reset} data-reset-prefs="">
								Restaurar padrão
							</Button>
						)}
					</div>
					<p aria-live="polite" className="ds-mapa-note min-h-6" data-prefs-status>
						{status}
					</p>
				</form>
			</div>
		</div>
	);
}
