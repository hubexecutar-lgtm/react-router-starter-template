// RC-HOME-002 completo, fora da Home (ADR-26): dados, risco, exigências, problemas, método e apoio, nas composições do
// RC-DS-CF. Mora em /sobre/ (decisão do usuário, 2026-10-06); o texto vem de app/data/home.ts sem reescrita e o
// tests/editorial.spec.ts confere Home + Sobre contra o canônico linha a linha.
import { useState } from "react";

import { BrainCircuit, CalendarClock, Check, CircleAlert, Globe2, MapPin, Puzzle, ShieldCheck, TerminalSquare, type LucideIcon } from "lucide-react";

import { Dots, Frame, SectionHead } from "@/components/ds";
import { HOME_METHOD, HOME_PROBLEMS, HOME_REQUIREMENTS, HOME_RISK, HOME_STATS, HOME_SUPPORT } from "@/data/home";

const PROBLEM_ICONS = [Puzzle, CalendarClock, BrainCircuit];

function Stats() {
	const [tab, setTab] = useState(0);
	return (
		<Frame className="ds-proof">
			<div className="ds-tabs-row" role="tablist" aria-label="Recorte dos dados">
				{HOME_STATS.cards.map((c, i) => {
					const Icon: LucideIcon = i ? Globe2 : MapPin;
					return (
						<button
							key={c.tag}
							type="button"
							role="tab"
							id={`dados-tab-${i}`}
							aria-selected={tab === i}
							aria-controls={`dados-painel-${i}`}
							tabIndex={tab === i ? 0 : -1}
							onClick={() => setTab(i)}
							onKeyDown={(e) => {
								if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
									e.preventDefault();
									const next = (i + 1) % HOME_STATS.cards.length;
									setTab(next);
									document.getElementById(`dados-tab-${next}`)?.focus();
								}
							}}
						>
							<Icon size={18} aria-hidden="true" />
							{c.tag}
						</button>
					);
				})}
			</div>
			{HOME_STATS.cards.map((c, i) => (
				<figure key={c.tag} className="ds-quote" role="tabpanel" id={`dados-painel-${i}`} aria-labelledby={`dados-tab-${i}`} hidden={tab !== i}>
					<blockquote>
						<p>
							<span aria-hidden="true">“ </span>
							<strong>{c.strong}</strong> {c.text}
							<span aria-hidden="true"> ”</span>
						</p>
					</blockquote>
					<figcaption>
						<a href={c.source.url} rel="noopener">
							{c.source.label}
						</a>
					</figcaption>
				</figure>
			))}
		</Frame>
	);
}

export function MethodSections() {
	return (
		<>
			{/* Prova social → os números, cada um com a fonte primária. */}
			<section className="ds-section" aria-labelledby="home-dados" data-home-section="Dados">
				<SectionHead id="home-dados" heading={HOME_STATS.heading} lead={HOME_STATS.lead} />
				<Stats />
				<p className="ds-more">{HOME_STATS.closing}</p>
			</section>

			<Dots />

			{/* Why choose → o que é um risco cognitivo: os exemplos (a confusão) × a definição (painel laranja). */}
			<section className="ds-section" aria-labelledby="home-risco" data-home-section="Risco">
				<SectionHead id="home-risco" heading={HOME_RISK.heading} lead={HOME_RISK.lead} size="lg" />
				<Frame className="ds-compare">
					<div className="ds-compare-chaos">
						{HOME_RISK.examples.map((ex, i) => (
							<article key={ex.title} className="ds-incident" data-n={i}>
								<h3>
									<CircleAlert size={16} aria-hidden="true" /> {ex.title}
								</h3>
								<ol className="ds-chain">
									{ex.chain.map((step, j) => (
										<li key={step} data-last={j === ex.chain.length - 1 || undefined}>
											{step}
										</li>
									))}
								</ol>
							</article>
						))}
					</div>
					<div className="ds-compare-accent">
						<p>{HOME_RISK.closing}</p>
						<span className="ds-accent-pill">
							<Check size={16} aria-hidden="true" /> Gestão e Controle de Riscos Cognitivos
						</span>
					</div>
				</Frame>
			</section>

			<Dots />

			{/* Preços → exigências (quadro com diagrama) e os 3 problemas concretos (colunas do quadro). */}
			<section className="ds-section" aria-labelledby="home-exigencias" data-home-section="Exigências">
				<SectionHead id="home-exigencias" heading={HOME_REQUIREMENTS.heading} lead={HOME_REQUIREMENTS.lead} />
				<Frame className="ds-plan">
					<div className="ds-plan-top">
						<div className="ds-plan-intro">
							<h3>
								{HOME_REQUIREMENTS.columns[0]} <span aria-hidden="true">→</span> {HOME_REQUIREMENTS.columns[1]}
							</h3>
							<p>{HOME_REQUIREMENTS.closing}</p>
						</div>
						<div className="ds-diagram" role="group" aria-label={`${HOME_REQUIREMENTS.columns[0]} e o que ${HOME_REQUIREMENTS.columns[1].toLowerCase()}`}>
							<p className="ds-diagram-labels" aria-hidden="true">
								<span>{HOME_REQUIREMENTS.columns[0]}</span>
								<span>{HOME_REQUIREMENTS.columns[1]}</span>
							</p>
							<dl>
								{HOME_REQUIREMENTS.rows.map(([task, need]) => (
									<div key={task}>
										<dt>{task}</dt>
										<dd>{need}</dd>
									</div>
								))}
							</dl>
						</div>
					</div>
					<div className="ds-plan-cols" aria-labelledby="home-problemas" data-home-section="Problemas">
						<h3 id="home-problemas" className="ds-plan-cols-title">
							{HOME_PROBLEMS.heading}
						</h3>
						{HOME_PROBLEMS.cards.map((card, i) => {
							const Icon = PROBLEM_ICONS[i];
							return (
								<article key={card.title} className="ds-plan-col">
									<Icon size={22} strokeWidth={1.6} aria-hidden="true" />
									<h4>{card.title}</h4>
									<dl>
										{card.rows.map(([term, text]) => (
											<div key={term}>
												<dt>{term}:</dt>
												<dd>{text}</dd>
											</div>
										))}
									</dl>
								</article>
							);
						})}
					</div>
				</Frame>
			</section>

			<Dots />

			{/* Tailored → método (6 passos) e apoio externo, em bento com o card laranja. */}
			<section className="ds-section" aria-labelledby="home-metodo" data-home-section="Método">
				<SectionHead id="home-metodo" heading={HOME_METHOD.heading} lead={HOME_METHOD.lead} />
				<Frame className="ds-bento">
					<div className="ds-bento-steps">
						<ol>
							{HOME_METHOD.steps.map((s, i) => (
								<li key={s.title}>
									<span className="ds-step-n">{i + 1}.</span>
									<div>
										<h3>{s.title}</h3>
										<p>{s.text}</p>
									</div>
								</li>
							))}
						</ol>
					</div>
					<article className="ds-bento-accent" aria-labelledby="home-apoio" data-home-section="Apoio">
						<ShieldCheck size={22} aria-hidden="true" />
						<h3 id="home-apoio">{HOME_SUPPORT.heading}</h3>
						<p>{HOME_SUPPORT.lead}</p>
					</article>
					<article className="ds-bento-note">
						<CircleAlert size={22} aria-hidden="true" />
						<p>{HOME_SUPPORT.caveat}</p>
					</article>
					<article className="ds-bento-term">
						<p className="ds-term-title">
							<TerminalSquare size={18} aria-hidden="true" /> {HOME_SUPPORT.listTitle}
						</p>
						<ul className="ds-term">
							{HOME_SUPPORT.items.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
						<p className="ds-term-foot">{HOME_SUPPORT.examples}</p>
					</article>
				</Frame>
			</section>

		</>
	);
}
