// Home RC-LP-001 (LANC-001 RQ-040) na arquitetura Editorial Hybrid v4 (ADR-22): texto canônico sem reescrita
// (app/data/landing.ts), na ordem do Índex Problema → Conhecimento → Ferramenta → Ação. Composição do híbrido:
// hero centrado, painel de modelo (Problema), tiles 2×2 (os 3 pilares + o mapa), banda de cards (o ciclo) e carrossel
// de perguntas (por onde começar). Um CTA primário só, no hero (RQ-053).
import { ChevronLink } from "@/components/layout/ChevronLink";
import { ArtImage } from "@/components/stories/ArtImage";
import { SITE_TAGLINE } from "@/consts";
import { PILLAR_MEDIA, RC_IMAGES, type Pillar } from "@/data/article-media";
import { PILLARS } from "@/data/article-meta";
import { LANDING, type LandingBlock } from "@/data/landing";
import { MAP_LEAD } from "@/features/mapa/copy";

const articleHref = (p: Pillar) => `/artigos/${PILLARS[p].article}/`;
const PILLAR_ORDER: Pillar[] = ["p1", "p2", "p3"];
/** Os três passos do canônico ("Problema → Método → Aplicação"), na ordem dos pilares. */
const STEP: Record<Pillar, string> = { p1: "Problema", p2: "Método", p3: "Aplicação" };

function Paragraphs({ blocks, className }: { blocks: LandingBlock[]; className?: string }) {
	return (
		<>
			{blocks.map((b, i) =>
				"p" in b ? (
					<p key={i} className={b.p.includes("→") ? `font-semibold ${className ?? ""}` : className}>
						{b.p}
					</p>
				) : null,
			)}
		</>
	);
}

function Intro({ id, eyebrow, heading }: { id: string; eyebrow: string; heading: string }) {
	return (
		<header className="hy-section-intro">
			<p className="hy-eyebrow">{eyebrow}</p>
			<h2 id={id}>{heading}</h2>
		</header>
	);
}

export function Landing() {
	const [intro, oQue, pilares, ciclo, comecar] = LANDING.sections;
	const [lead, ...introRest] = intro.blocks;
	// Os 3 pilares: cada marcador "N. TÍTULO" abre um grupo com os parágrafos que o seguem.
	const groups: { title: string; blocks: LandingBlock[] }[] = [];
	for (const b of pilares.blocks) {
		if ("pillar" in b) groups.push({ title: b.pillar, blocks: [] });
		else groups[groups.length - 1]?.blocks.push(b);
	}
	return (
		<>
			{/* Hero: onde estou, o que significa, próxima ação (RQ-052) */}
			<header className="hy-hero rc-hero-reveal" data-landing-hero>
				<p className="hy-eyebrow">{SITE_TAGLINE}</p>
				<h1>{LANDING.title}</h1>
				<p className="hy-lead">{"p" in lead ? lead.p : null}</p>
				<div className="hy-actions">
					<a href={articleHref("p1")} data-cta="primary" className="hy-btn-primary">
						{LANDING.cta}
					</a>
					<a href="/mapas/" className="hy-btn-secondary">
						Explorar o mapa
					</a>
				</div>
			</header>

			<div className="hy-shell">
				<div>
					<ArtImage media={RC_IMAGES.binoculosMapaCerebral} priority />
				</div>
			</div>

			{/* Problema: painel de modelo do híbrido, com os três pilares em fluxo */}
			<section className="hy-shell mt-[var(--hy-section)]" aria-labelledby="problema" data-landing-section="Problema">
				<div className="hy-model">
					<p className="hy-eyebrow">Problema</p>
					<h2 id="problema">{oQue.heading}</h2>
					<div className="max-w-[var(--hy-read)] space-y-[var(--ref-block-gap)]">
						<Paragraphs blocks={introRest} />
					</div>
					<ol className="hy-flow" aria-label="Os três pilares">
						{PILLAR_ORDER.map((p) => (
							<li key={p}>
								<strong>{PILLARS[p].label}</strong>
								<span>{STEP[p]}</span>
							</li>
						))}
					</ol>
					<div className="max-w-[var(--hy-read)] space-y-[var(--ref-block-gap)]">
						<Paragraphs blocks={oQue.blocks} />
					</div>
				</div>
			</section>

			{/* Conhecimento: os 3 pilares em tiles, mais o mapa */}
			<section className="hy-wide hy-section" aria-labelledby="pilares" data-landing-section="Conhecimento">
				<div>
					<Intro id="pilares" eyebrow="Conhecimento" heading={pilares.heading ?? ""} />
					<div className="hy-tile-grid" role="list">
						{groups.map((g, i) => {
							const p = PILLAR_ORDER[i];
							const img = PILLAR_MEDIA[p].landscape;
							return (
								<div key={g.title} role="listitem">
									<article className="hy-tile" data-pillar={p}>
										<div className="hy-tile-media aspect-video">
											<img src={img.src} srcSet={img.srcSet} sizes="(min-width: 1024px) 520px, 100vw" width={img.width} height={img.height} alt={img.alt} loading="lazy" className="size-full object-contain" />
										</div>
										<p className="hy-eyebrow">
											{p.toUpperCase()} — {STEP[p]}
										</p>
										<h3>{g.title}</h3>
										<Paragraphs blocks={g.blocks} />
										<ChevronLink href={articleHref(p)}>Saiba mais sobre {PILLARS[p].label}</ChevronLink>
									</article>
								</div>
							);
						})}
						<div role="listitem">
							<article className="hy-tile">
								<p className="hy-eyebrow">Mapa causal</p>
								<h3>Veja como as partes se conectam</h3>
								<p>{MAP_LEAD}</p>
								<ChevronLink href="/mapas/">Explorar o mapa causal</ChevronLink>
							</article>
						</div>
					</div>
				</div>
			</section>

			{/* Ferramenta: a cadeia do projeto ao aprendizado, em cards brancos sobre a banda Subtle */}
			<section className="hy-band hy-section" aria-labelledby="ciclo" data-landing-section="Ferramenta">
				<div className="hy-wide">
					<div>
						<Intro id="ciclo" eyebrow="Ferramenta" heading={ciclo.heading ?? ""} />
						<dl className="hy-card-grid">
							{ciclo.blocks.map((b) =>
								"term" in b ? (
									<div key={b.term} className="hy-card">
										<dt className="hy-eyebrow">{b.term}</dt>
										<dd className="mt-4 text-[17px] leading-[1.647]">{b.text}</dd>
									</div>
								) : null,
							)}
						</dl>
						<ChevronLink href="/ferramentas/" className="mt-10">
							Ver as ferramentas cognitivas
						</ChevronLink>
					</div>
				</div>
			</section>

			{/* Ação: por onde começar, em cards de pergunta */}
			<section className="hy-wide hy-section" aria-labelledby="comecar" data-landing-section="Ação">
				<div>
					<Intro id="comecar" eyebrow="Ação" heading={comecar.heading ?? ""} />
					<ul className="hy-carousel" tabIndex={0} aria-label="Por onde começar">
						{comecar.blocks.map((b, i) =>
							"p" in b ? (
								<li key={i}>
									<p className="text-[17px] leading-[1.647]">{b.p}</p>
									<ChevronLink href={articleHref(PILLAR_ORDER[i])}>{PILLARS[PILLAR_ORDER[i]].label}</ChevronLink>
								</li>
							) : null,
						)}
					</ul>
				</div>
			</section>
		</>
	);
}
