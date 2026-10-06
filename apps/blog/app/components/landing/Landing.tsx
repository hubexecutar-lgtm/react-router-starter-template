// Home (ADR-BLOG-JORNADA-ROTAS-001 §2.2, ADR-26): apresenta o problema, orienta e mostra a prévia das áreas.
// Um layout demonstrativo no RC-DS-CF:
// hero laranja (RC-HOME-002) → cérebro em prévia (o mesmo do Mapa) → trilha Entenda · Estruture · Execute (uma prévia por
// área) → prévias do Blog e das Ferramentas com conteúdo real → CTA. O resto do RC-HOME-002 está em /sobre/.
import { ArrowRight, Compass, ListChecks, Workflow } from "lucide-react";

import { Card, CardGrid, Dots, MoreLink, SectionHead } from "@/components/ds";
import { HOME_FINAL, HOME_HERO, HOME_METHOD, HOME_PILLARS } from "@/data/home";
import { BrainHero } from "@/features/home-brain/BrainHero";
import type { BrainTopic } from "@/features/home-brain/types";

const PILLAR_ICONS = [Compass, Workflow, ListChecks];
const PILLAR_AREA = ["Blog", "Mapa Cognitivo", "Ferramentas"];

export type HomePreview = {
	article: { title: string; description: string; href: string } | null;
	tools: { name: string; text: string; href: string; kind: string }[];
};

export function Landing({ brainTopics, preview }: { brainTopics: BrainTopic[]; preview: HomePreview }) {
	return (
		<div className="ds-page">
			{/* Hero: cartão laranja (raio 16, 8 px da borda), pílula, h1 centrado, lead e botão pílula branco. */}
			<section className="ds-hero-wrap" aria-labelledby="home-titulo" data-home-section="Hero">
				<div className="ds-hero">
					<div className="ds-hero-content rc-hero-reveal">
						<a href="#mapa" className="ds-pill">
							<span>{HOME_HERO.eyebrow}</span>
							<span className="ds-pill-arrow" aria-hidden="true">
								<ArrowRight size={18} />
							</span>
						</a>
						<h1 id="home-titulo">{HOME_HERO.title}</h1>
						<div className="ds-hero-lead">
							{HOME_HERO.lead.map((p) => (
								<p key={p}>{p}</p>
							))}
						</div>
						<a href="#mapa" data-cta="primary" className="ds-btn-white">
							{HOME_HERO.cta}
						</a>
					</div>
				</div>
			</section>

			{/* Prévia do Mapa: o mesmo cérebro de /mapas/, em tamanho de prévia; a seleção leva ao Mapa com o foco. */}
			<div className="ds-section">
				<BrainHero topics={brainTopics} variant="preview" />
				{/* Trilha: uma prévia por área, com o texto canônico de cada etapa. */}
				<CardGrid cols={3} data-home-section="Trilha" label="Áreas do site">
					{HOME_PILLARS.map((p, i) => {
						const Icon = PILLAR_ICONS[i];
						return (
							<Card
								key={p.n}
								href={p.href}
								icon={<Icon size={24} strokeWidth={1.6} />}
								eyebrow={PILLAR_AREA[i]}
								title={
									<>
										<span className="ds-col-n">{p.n}</span> {p.title}
									</>
								}
								text={p.text}
								cta={`Ir para ${PILLAR_AREA[i]}`}
							/>
						);
					})}
				</CardGrid>
			</div>

			<Dots />

			{/* Prévia do Blog: o artigo publicado (demonstração do template) e o caminho para o índice. */}
			<section className="ds-section" aria-labelledby="home-blog" data-home-section="Blog">
				<SectionHead id="home-blog" label="Blog" heading="Comece pela leitura" lead="Um guia para entender demandas cognitivas, funções executivas, vulnerabilidades e contexto." />
				{preview.article && (
					<CardGrid cols={2} label="Leituras">
						<Card href={preview.article.href} eyebrow="Guia" size="lg" title={preview.article.title} text={preview.article.description} cta="Ler o guia" />
						<Card href="/artigos/" eyebrow="Blog" title="Todos os temas" text="Organize a leitura por neurodivergências, funções cognitivas, domínios e contextos." cta="Abrir o Blog" />
					</CardGrid>
				)}
			</section>

			<Dots />

			{/* Prévia das Ferramentas: só itens publicados, sem demonstração vendida como produto. */}
			<section className="ds-section" aria-labelledby="home-ferramentas" data-home-section="Ferramentas">
				<SectionHead id="home-ferramentas" label="Ferramentas e soluções" heading="Aplique na sua rotina" lead="Soluções publicadas com passos, indicadores e fontes, e uma ferramenta interativa que gera um resultado local." />
				<CardGrid cols={4} label="Ferramentas publicadas" data-tablet="2">
					{preview.tools.map((t) => (
						<Card key={t.href} href={t.href} eyebrow={t.kind} title={t.name} text={t.text} cta="Abrir" />
					))}
				</CardGrid>
				<p className="ds-more">
					<MoreLink href="/ferramentas/">Ver todas as ferramentas</MoreLink>
				</p>
			</section>

			{/* CTA laranja com dois botões e o letreiro da cadeia do método. */}
			<section className="ds-cta-wrap" aria-labelledby="home-final" data-home-section="CTA">
				<div className="ds-cta">
					<div className="ds-cta-content">
						<h2 id="home-final">{HOME_FINAL.heading}</h2>
						<p>{HOME_FINAL.lead}</p>
						<div className="ds-cta-actions">
							<a href="/mapas/" className="ds-btn-white">
								{HOME_FINAL.cta}
							</a>
							<a href="/sobre/" className="ds-btn-soft">
								Conhecer o método
							</a>
						</div>
					</div>
					<div className="ds-ticker" aria-label="Do problema ao progresso">
						<ol className="ds-ticker-track">
							{HOME_METHOD.chain.map((step) => (
								<li key={step}>{step}</li>
							))}
						</ol>
						<ol className="ds-ticker-track" aria-hidden="true">
							{HOME_METHOD.chain.map((step) => (
								<li key={step}>{step}</li>
							))}
						</ol>
					</div>
				</div>
				<p className="ds-disclaimer">{HOME_FINAL.note}</p>
			</section>
		</div>
	);
}
