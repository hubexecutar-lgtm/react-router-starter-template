// Card 2×2 do schema RC-SCHEMA-001 (card_rule): 01 Atenção (amarelo), 02 Demanda executiva (vermelho),
// 03 Técnica (cinza) e 04 Progresso (verde). Cada quadrante tem número e rótulo em texto: a cor nunca é o único
// indicador (ADR-24). Leitura na ordem DOR → CONTEXTO → … → PROGRESSO.
import { ArrowDown, ArrowUp, BarChart3, Brain, Settings, TriangleAlert } from "lucide-react";

import type { Solution } from "./data";

import { sourceByKey } from "@/data/sources-scientific";


export function SolutionCard({ solution: s }: { solution: Solution }) {
	const refs = s.refs.map((key) => sourceByKey(key)).filter((x) => x !== undefined);
	return (
		<section className="solution-card" aria-labelledby={`${s.slug}-card`} data-solution-card>
			<h2 id={`${s.slug}-card`} className="sr-only">
				{s.name} em quatro quadrantes
			</h2>
			<article className="solution-q" data-quadrant="atencao">
				<p className="solution-q-label">
					<TriangleAlert size={18} aria-hidden="true" /> 01 · Atenção / Macro problema
				</p>
				<h3>O que essa dor representa?</h3>
				<p className="solution-yellow" data-yellow12>
					{s.yellow12}
				</p>
				<p>
					<b>Vulnerabilidade:</b> {s.vulnerability}
				</p>
			</article>
			<article className="solution-q" data-quadrant="demanda">
				<p className="solution-q-label">
					<Brain size={18} aria-hidden="true" /> 02 · Demanda executiva
				</p>
				<h3>O que a tarefa exige?</h3>
				<ul>
					{s.functions.map((f) => (
						<li key={f.name}>
							<b>{f.name}</b> — {f.detail}
						</li>
					))}
				</ul>
				<p>
					<b>Risco cognitivo:</b> {s.risk}
				</p>
			</article>
			<article className="solution-q" data-quadrant="tecnica">
				<p className="solution-q-label">
					<Settings size={18} aria-hidden="true" /> 03 · Técnica / Macro processo
				</p>
				<h3>{s.technique}</h3>
				<ol>
					{s.steps.map((step) => (
						<li key={step}>{step}</li>
					))}
				</ol>
				<dl>
					<div>
						<dt>Nos estudos</dt>
						<dd>{s.study}</dd>
					</div>
					<div>
						<dt>No trabalho</dt>
						<dd>{s.work}</dd>
					</div>
				</dl>
			</article>
			<article className="solution-q" data-quadrant="progresso">
				<p className="solution-q-label">
					<BarChart3 size={18} aria-hidden="true" /> 04 · Progresso
				</p>
				<h3>O que deve mudar?</h3>
				<ul className="solution-metrics">
					{s.metrics.map((m) => (
						<li key={m.label}>
							{m.direction === "up" ? <ArrowUp size={16} aria-hidden="true" /> : <ArrowDown size={16} aria-hidden="true" />}
							{m.label}
							<span className="sr-only">{m.direction === "up" ? " (deve aumentar)" : " (deve diminuir)"}</span>
						</li>
					))}
				</ul>
				<p>
					<b>Risco mitigado:</b> {s.risk}
				</p>
				<p className="solution-status">
					Estado da evidência: <strong data-evidence-status>{s.evidenceStatus}</strong>
				</p>
				{refs.length > 0 && (
					<p className="solution-refs">
						Fontes:{" "}
						{refs.map((r, i) => (
							<span key={r.id}>
								{i > 0 && " · "}
								<a href={`/fontes/#${r.id}`}>{r.label.split(" — ")[0]}</a>
							</span>
						))}
					</p>
				)}
			</article>
		</section>
	);
}
