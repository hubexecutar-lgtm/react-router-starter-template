// Home RC-HOME-002 (HOME-BRAIN-001): o esboço risco-cognitivo-home-css-v4.html sobre os tokens do site, com o
// tratamento da seção "Region: Earth" da cloudflare.com no mapa interativo (cérebro 3D pontilhado no lugar do globo).
// Texto em app/data/home.ts, sem reescrita. Ordem: hero → dados → o que é → mapa (cérebro) → trilha 01–03 →
// tabela de exigências → problemas concretos → método → apoio externo → CTA final. Um CTA primário só, no hero.
// O RC-LP-001, que era a home, está em /comece/.
import { ArrowRight, BrainCircuit, CalendarClock, Compass, Globe2, ListChecks, MapPin, Puzzle, Workflow } from "lucide-react";

import { ChevronLink } from "@/components/layout/ChevronLink";
import { HOME_FINAL, HOME_HERO, HOME_METHOD, HOME_PILLARS, HOME_PROBLEMS, HOME_REQUIREMENTS, HOME_RISK, HOME_STATS, HOME_SUPPORT } from "@/data/home";
import { BrainHero } from "@/features/home-brain/BrainHero";
import type { BrainTopic } from "@/features/home-brain/types";

const PILLAR_ICONS = [Compass, Workflow, ListChecks];
const PROBLEM_ICONS = [Puzzle, CalendarClock, BrainCircuit];

function Head({ id, heading, lead }: { id: string; heading: string; lead?: string }) {
	return (
		<header className="home-head">
			<span className="home-bar" aria-hidden="true" />
			<h2 id={id}>{heading}</h2>
			{lead && <p>{lead}</p>}
		</header>
	);
}

/** Cadeia "A → B → C" como lista ordenada: a seta é decoração, a ordem é a da lista. */
function Chain({ items, label }: { items: string[]; label: string }) {
	return (
		<ol className="home-chain" aria-label={label}>
			{items.map((item) => (
				<li key={item}>{item}</li>
			))}
		</ol>
	);
}

export function Landing({ brainTopics }: { brainTopics: BrainTopic[] }) {
	return (
		<>
			{/* Hero: cartão laranja com retícula, como o hero da cloudflare.com (RQ-052: onde estou, o que é, próxima ação) */}
			<section className="home-hero-wrap" aria-labelledby="home-titulo" data-home-section="Hero">
				<div className="home-hero">
					<div className="home-hero-content rc-hero-reveal">
						<p className="home-kicker">
							<span>{HOME_HERO.eyebrow}</span>
							<ArrowRight size={20} aria-hidden="true" />
						</p>
						<h1 id="home-titulo">{HOME_HERO.title}</h1>
						{HOME_HERO.lead.map((p) => (
							<p key={p}>{p}</p>
						))}
						<a href="#mapa" data-cta="primary" className="home-hero-button">
							{HOME_HERO.cta}
						</a>
					</div>
				</div>
			</section>

			{/* Dados: os números, cada um com a fonte primária */}
			<section className="home-section" aria-labelledby="home-dados" data-home-section="Dados">
				<div className="home-narrow">
					<Head id="home-dados" heading={HOME_STATS.heading} lead={HOME_STATS.lead} />
					<div className="home-stats">
						{HOME_STATS.cards.map((c, i) => {
							const Icon = i ? Globe2 : MapPin;
							return (
								<article key={c.tag} className="home-stat">
									<Icon className="home-stat-icon" size={44} strokeWidth={1.4} aria-hidden="true" />
									<div>
										<p className="hy-eyebrow">{c.tag}</p>
										<p className="home-stat-text">
											<strong>{c.strong}</strong> {c.text}
										</p>
										<a href={c.source.url} rel="noopener" className="home-source">
											Fonte: {c.source.label.split(" (")[0].split(":")[0]}
										</a>
									</div>
								</article>
							);
						})}
					</div>
					<p className="home-closing">{HOME_STATS.closing}</p>
				</div>
			</section>

			{/* O que é um risco cognitivo: duas cadeias de exemplo */}
			<section className="home-section home-soft" aria-labelledby="home-risco" data-home-section="Risco">
				<div className="home-narrow">
					<Head id="home-risco" heading={HOME_RISK.heading} lead={HOME_RISK.lead} />
					<div className="home-examples">
						{HOME_RISK.examples.map((ex) => (
							<article key={ex.title} className="home-example">
								<h3>{ex.title}</h3>
								<Chain items={ex.chain} label={ex.title} />
							</article>
						))}
					</div>
					<p className="home-closing">{HOME_RISK.closing}</p>
				</div>
			</section>

			{/* Mapa interativo: o cérebro 3D com os seletores ligados ao /mapas/ */}
			<BrainHero topics={brainTopics} />

			{/* Trilha 01–03: cards separados por linhas finas, como a faixa da referência */}
			<section className="home-pillars" aria-label="Entenda, estruture, execute" data-home-section="Trilha">
				<div className="home-pillar-grid">
					{HOME_PILLARS.map((p, i) => {
						const Icon = PILLAR_ICONS[i];
						return (
							<article key={p.n} className="home-pillar">
								<Icon size={30} strokeWidth={1.5} aria-hidden="true" />
								<p className="hy-eyebrow">{p.n}</p>
								<h3>{p.title}</h3>
								<p>{p.text}</p>
								<ChevronLink href={p.href}>{p.title}</ChevronLink>
							</article>
						);
					})}
				</div>
			</section>

			{/* Exigências: o que executar pode exigir */}
			<section className="home-section home-soft" aria-labelledby="home-exigencias" data-home-section="Exigências">
				<div className="home-narrow">
					<Head id="home-exigencias" heading={HOME_REQUIREMENTS.heading} lead={HOME_REQUIREMENTS.lead} />
					<table className="ds-table ds-table--stack home-req">
						<thead>
							<tr>
								{HOME_REQUIREMENTS.columns.map((c) => (
									<th key={c} scope="col">
										{c}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{HOME_REQUIREMENTS.rows.map(([task, need]) => (
								<tr key={task}>
									<td data-label={HOME_REQUIREMENTS.columns[0]} className="font-semibold">
										{task}
									</td>
									<td data-label={HOME_REQUIREMENTS.columns[1]}>{need}</td>
								</tr>
							))}
						</tbody>
					</table>
					<p className="home-closing">{HOME_REQUIREMENTS.closing}</p>
				</div>
			</section>

			{/* Problemas concretos */}
			<section className="home-section" aria-labelledby="home-problemas" data-home-section="Problemas">
				<div className="home-narrow">
					<Head id="home-problemas" heading={HOME_PROBLEMS.heading} />
					<div className="home-problems">
						{HOME_PROBLEMS.cards.map((card, i) => {
							const Icon = PROBLEM_ICONS[i];
							return (
								<article key={card.title} className="home-problem">
									<h3>
										<Icon size={30} strokeWidth={1.6} aria-hidden="true" />
										{card.title}
									</h3>
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
				</div>
			</section>

			{/* Método: os 6 passos e a cadeia de controle */}
			<section className="home-section home-soft" aria-labelledby="home-metodo" data-home-section="Método">
				<div className="home-narrow">
					<Head id="home-metodo" heading={HOME_METHOD.heading} lead={HOME_METHOD.lead} />
					<ol className="home-steps">
						{HOME_METHOD.steps.map((s, i) => (
							<li key={s.title} className="home-step">
								<span className="home-step-n" aria-hidden="true">
									{i + 1}.
								</span>
								<div>
									<h3>{s.title}</h3>
									<p>{s.text}</p>
								</div>
							</li>
						))}
					</ol>
					<Chain items={HOME_METHOD.chain} label="Do problema ao progresso" />
				</div>
			</section>

			{/* Apoio externo */}
			<section className="home-section" aria-labelledby="home-apoio" data-home-section="Apoio">
				<div className="home-narrow">
					<Head id="home-apoio" heading={HOME_SUPPORT.heading} lead={HOME_SUPPORT.lead} />
					<div className="home-support">
						<h3>{HOME_SUPPORT.listTitle}</h3>
						<ul>
							{HOME_SUPPORT.items.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
						<p>{HOME_SUPPORT.examples}</p>
					</div>
					<p className="home-caveat">{HOME_SUPPORT.caveat}</p>
				</div>
			</section>

			{/* CTA final */}
			<section className="home-final" aria-labelledby="home-final" data-home-section="CTA">
				<div className="home-narrow">
					<h2 id="home-final">{HOME_FINAL.heading}</h2>
					<p>{HOME_FINAL.lead}</p>
					<div className="hy-actions">
						<a href="/mapas/" className="hy-btn-secondary">
							{HOME_FINAL.cta}
						</a>
						<a href="/comece/" className="hy-btn-secondary">
							Comece por aqui
						</a>
					</div>
					<p className="home-disclaimer">{HOME_FINAL.note}</p>
				</div>
			</section>
		</>
	);
}
