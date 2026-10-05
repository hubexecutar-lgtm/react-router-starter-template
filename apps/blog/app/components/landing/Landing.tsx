// Home RC-HOME-002 no padrão da cloudflare.com (ADR-25), seção por seção, com o nosso texto (app/data/home.ts, sem
// reescrita). Cada seção da referência ganhou a parte da home que cumpre o mesmo papel:
//   hero laranja → hero · "Region: Earth" (globo + 3 colunas) → mapa (cérebro) + trilha 01–03 ·
//   prova social (abas + citação) → dados (Brasil/Mundo, com a fonte) · "Why choose" (2 painéis) → o que é risco ·
//   preços (quadro + diagrama + colunas) → exigências + problemas · "Tailored" (bento) → método + apoio ·
//   CTA laranja + letreiro → Entenda → Estruture → Execute.
// Medidas e tokens em app/styles/home.css (valores computados da referência em 2026-10-05).
import { useState, type ReactNode } from "react";

import {
	ArrowRight,
	BrainCircuit,
	CalendarClock,
	Check,
	CircleAlert,
	Compass,
	Globe2,
	ListChecks,
	MapPin,
	Puzzle,
	ShieldCheck,
	TerminalSquare,
	Workflow,
	type LucideIcon,
} from "lucide-react";

import { HOME_FINAL, HOME_HERO, HOME_METHOD, HOME_PILLARS, HOME_PROBLEMS, HOME_REQUIREMENTS, HOME_RISK, HOME_STATS, HOME_SUPPORT } from "@/data/home";
import { BrainHero } from "@/features/home-brain/BrainHero";
import type { BrainTopic } from "@/features/home-brain/types";

const PILLAR_ICONS = [Compass, Workflow, ListChecks];
const PROBLEM_ICONS = [Puzzle, CalendarClock, BrainCircuit];

/** Quadro da referência: borda fina com quadradinhos nos 4 cantos. */
function Frame({ children, className = "", ...rest }: { children: ReactNode; className?: string } & Record<`data-${string}`, string>) {
	return (
		<div className={`cfh-frame ${className}`} {...rest}>
			<span className="cfh-corner" data-corner="tl" aria-hidden="true" />
			<span className="cfh-corner" data-corner="tr" aria-hidden="true" />
			<span className="cfh-corner" data-corner="bl" aria-hidden="true" />
			<span className="cfh-corner" data-corner="br" aria-hidden="true" />
			{children}
		</div>
	);
}

/** Cabeçalho de seção da referência: título centrado (48/48, 500) e subtítulo cinza (19,2/23). */
function Head({ id, heading, lead, size = "md" }: { id: string; heading: string; lead?: string; size?: "md" | "lg" }) {
	return (
		<header className="cfh-head" data-size={size}>
			<h2 id={id}>{heading}</h2>
			{lead && <p>{lead}</p>}
		</header>
	);
}

/** Faixa de pontos entre seções (a referência mostra no celular). */
const Dots = () => <div className="cfh-dots" aria-hidden="true" />;

function Stats() {
	const [tab, setTab] = useState(0);
	return (
		<Frame className="cfh-proof">
			<div className="cfh-tabs-row" role="tablist" aria-label="Recorte dos dados">
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
				<figure key={c.tag} className="cfh-quote" role="tabpanel" id={`dados-painel-${i}`} aria-labelledby={`dados-tab-${i}`} hidden={tab !== i}>
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

export function Landing({ brainTopics }: { brainTopics: BrainTopic[] }) {
	return (
		<div className="cfh">
			{/* Hero: cartão laranja (raio 16, 8 px da borda), pílula, h1 centrado, lead e botão pílula branco. */}
			<section className="cfh-hero-wrap" aria-labelledby="home-titulo" data-home-section="Hero">
				<div className="cfh-hero">
					<div className="cfh-hero-content rc-hero-reveal">
						<a href="#mapa" className="cfh-pill">
							<span>{HOME_HERO.eyebrow}</span>
							<span className="cfh-pill-arrow" aria-hidden="true">
								<ArrowRight size={18} />
							</span>
						</a>
						<h1 id="home-titulo">{HOME_HERO.title}</h1>
						<div className="cfh-hero-lead">
							{HOME_HERO.lead.map((p) => (
								<p key={p}>{p}</p>
							))}
						</div>
						<a href="#mapa" data-cta="primary" className="cfh-btn-white">
							{HOME_HERO.cta}
						</a>
					</div>
				</div>
			</section>

			{/* Region: Earth → mapa interativo com o cérebro, e as 3 colunas logo abaixo. */}
			<div className="cfh-section">
				<BrainHero topics={brainTopics} />
				<Frame className="cfh-cols" data-home-section="Trilha">
					{HOME_PILLARS.map((p, i) => {
						const Icon = PILLAR_ICONS[i];
						return (
							<a key={p.n} href={p.href} className="cfh-col">
								<Icon size={24} strokeWidth={1.6} aria-hidden="true" />
								<h3>
									<span className="cfh-col-n">{p.n}</span> {p.title}
								</h3>
								<p>{p.text}</p>
							</a>
						);
					})}
				</Frame>
			</div>

			<Dots />

			{/* Prova social → os números, cada um com a fonte primária. */}
			<section className="cfh-section" aria-labelledby="home-dados" data-home-section="Dados">
				<Head id="home-dados" heading={HOME_STATS.heading} lead={HOME_STATS.lead} />
				<Stats />
				<p className="cfh-more">{HOME_STATS.closing}</p>
			</section>

			<Dots />

			{/* Why choose → o que é um risco cognitivo: os exemplos (a confusão) × a definição (painel laranja). */}
			<section className="cfh-section" aria-labelledby="home-risco" data-home-section="Risco">
				<Head id="home-risco" heading={HOME_RISK.heading} lead={HOME_RISK.lead} size="lg" />
				<Frame className="cfh-compare">
					<div className="cfh-compare-chaos">
						{HOME_RISK.examples.map((ex, i) => (
							<article key={ex.title} className="cfh-incident" data-n={i}>
								<h3>
									<CircleAlert size={16} aria-hidden="true" /> {ex.title}
								</h3>
								<ol className="cfh-chain">
									{ex.chain.map((step, j) => (
										<li key={step} data-last={j === ex.chain.length - 1 || undefined}>
											{step}
										</li>
									))}
								</ol>
							</article>
						))}
					</div>
					<div className="cfh-compare-accent">
						<p>{HOME_RISK.closing}</p>
						<span className="cfh-accent-pill">
							<Check size={16} aria-hidden="true" /> Gestão e Controle de Riscos Cognitivos
						</span>
					</div>
				</Frame>
			</section>

			<Dots />

			{/* Preços → exigências (quadro com diagrama) e os 3 problemas concretos (colunas do quadro). */}
			<section className="cfh-section" aria-labelledby="home-exigencias" data-home-section="Exigências">
				<Head id="home-exigencias" heading={HOME_REQUIREMENTS.heading} lead={HOME_REQUIREMENTS.lead} />
				<Frame className="cfh-plan">
					<div className="cfh-plan-top">
						<div className="cfh-plan-intro">
							<h3>
								{HOME_REQUIREMENTS.columns[0]} <span aria-hidden="true">→</span> {HOME_REQUIREMENTS.columns[1]}
							</h3>
							<p>{HOME_REQUIREMENTS.closing}</p>
						</div>
						<div className="cfh-diagram" role="group" aria-label={`${HOME_REQUIREMENTS.columns[0]} e o que ${HOME_REQUIREMENTS.columns[1].toLowerCase()}`}>
							<p className="cfh-diagram-labels" aria-hidden="true">
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
					<div className="cfh-plan-cols" aria-labelledby="home-problemas" data-home-section="Problemas">
						<h3 id="home-problemas" className="cfh-plan-cols-title">
							{HOME_PROBLEMS.heading}
						</h3>
						{HOME_PROBLEMS.cards.map((card, i) => {
							const Icon = PROBLEM_ICONS[i];
							return (
								<article key={card.title} className="cfh-plan-col">
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
			<section className="cfh-section" aria-labelledby="home-metodo" data-home-section="Método">
				<Head id="home-metodo" heading={HOME_METHOD.heading} lead={HOME_METHOD.lead} />
				<Frame className="cfh-bento">
					<div className="cfh-bento-steps">
						<ol>
							{HOME_METHOD.steps.map((s, i) => (
								<li key={s.title}>
									<span className="cfh-step-n">{i + 1}.</span>
									<div>
										<h3>{s.title}</h3>
										<p>{s.text}</p>
									</div>
								</li>
							))}
						</ol>
					</div>
					<article className="cfh-bento-accent" aria-labelledby="home-apoio" data-home-section="Apoio">
						<ShieldCheck size={22} aria-hidden="true" />
						<h3 id="home-apoio">{HOME_SUPPORT.heading}</h3>
						<p>{HOME_SUPPORT.lead}</p>
					</article>
					<article className="cfh-bento-note">
						<CircleAlert size={22} aria-hidden="true" />
						<p>{HOME_SUPPORT.caveat}</p>
					</article>
					<article className="cfh-bento-term">
						<p className="cfh-term-title">
							<TerminalSquare size={18} aria-hidden="true" /> {HOME_SUPPORT.listTitle}
						</p>
						<ul className="cfh-term">
							{HOME_SUPPORT.items.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
						<p className="cfh-term-foot">{HOME_SUPPORT.examples}</p>
					</article>
				</Frame>
			</section>

			{/* CTA laranja da referência, com dois botões e o letreiro da cadeia do método. */}
			<section className="cfh-cta-wrap" aria-labelledby="home-final" data-home-section="CTA">
				<div className="cfh-cta">
					<div className="cfh-cta-content">
						<h2 id="home-final">{HOME_FINAL.heading}</h2>
						<p>{HOME_FINAL.lead}</p>
						<div className="cfh-cta-actions">
							<a href="/mapas/" className="cfh-btn-white">
								{HOME_FINAL.cta}
							</a>
							<a href="/comece/" className="cfh-btn-soft">
								Comece por aqui
							</a>
						</div>
					</div>
					<div className="cfh-ticker" aria-label="Do problema ao progresso">
						<ol className="cfh-ticker-track">
							{HOME_METHOD.chain.map((step) => (
								<li key={step}>{step}</li>
							))}
						</ol>
						<ol className="cfh-ticker-track" aria-hidden="true">
							{HOME_METHOD.chain.map((step) => (
								<li key={step}>{step}</li>
							))}
						</ol>
					</div>
				</div>
				<p className="cfh-disclaimer">{HOME_FINAL.note}</p>
			</section>
		</div>
	);
}
