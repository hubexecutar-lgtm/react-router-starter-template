// Home RC-LP-001 (LANC-001 RQ-040) sobre o Stories (ADR-14): texto canônico sem reescrita (app/data/landing.ts),
// na ordem do Índex Problema → Conhecimento → Ferramenta → Ação, com a anatomia de página do ADR-12
// (hero, seções de pilar com "Saiba mais ›", "Por onde começar?"). Um CTA primário só, no hero (RQ-053).
import { ChevronLink } from "@/components/layout/ChevronLink";
import { ArtImage } from "@/components/stories/ArtImage";
import { PILLAR_MEDIA, RC_IMAGES, type Pillar } from "@/data/article-media";
import { PILLARS } from "@/data/article-meta";
import { LANDING, type LandingBlock } from "@/data/landing";

const articleHref = (p: Pillar) => `/artigos/${PILLARS[p].article}/`;
const PILLAR_ORDER: Pillar[] = ["p1", "p2", "p3"];

function Paragraphs({ blocks }: { blocks: LandingBlock[] }) {
	return (
		<>
			{blocks.map((b, i) =>
				"p" in b ? (
					<p key={i} className={b.p.includes("→") ? "stories-body font-semibold" : "stories-body text-muted-foreground"}>
						{b.p}
					</p>
				) : null,
			)}
		</>
	);
}

function Section({ id, eyebrow, heading, children }: { id: string; eyebrow: string; heading: string; children: React.ReactNode }) {
	return (
		<section className="stories-container mt-[var(--ref-section-gap)]" aria-labelledby={id} data-landing-section={eyebrow}>
			<div className="mx-auto max-w-[var(--ref-wide-width)]">
				<p className="stories-meta text-muted-foreground">{eyebrow}</p>
				<h2 id={id} className="stories-h2 mt-3 max-w-[24ch]">
					{heading}
				</h2>
				<div className="mt-[var(--ref-block-gap)]">{children}</div>
			</div>
		</section>
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
			<header className="stories-container pt-12 lg:pt-[88px]" data-landing-hero>
				<div className="rc-hero-reveal mx-auto flex max-w-[var(--ref-hero-title-w)] flex-col items-center gap-6 text-center">
					<p className="stories-meta text-muted-foreground">Risco Cognitivo · Início</p>
					<h1 className="stories-h1">{LANDING.title}</h1>
					<p className="stories-body text-muted-foreground" style={{ maxWidth: "var(--ref-hero-lead-w)" }}>
						{"p" in lead ? lead.p : null}
					</p>
					<a
						href={articleHref("p1")}
						data-cta="primary"
						className="bg-foreground text-background focus-visible:ring-ring/50 inline-flex min-h-11 max-w-full items-center rounded-[var(--ref-pill-radius)] px-6 py-2 text-sm font-medium outline-none focus-visible:ring-[3px]"
					>
						{LANDING.cta}
					</a>
				</div>
				<div className="mx-auto mt-16 max-w-[var(--ref-wide-width)]">
					<ArtImage media={RC_IMAGES.binoculosMapaCerebral} priority />
				</div>
			</header>

			{/* Problema */}
			<Section id="problema" eyebrow="Problema" heading={oQue.heading ?? ""}>
				<div className="max-w-[var(--ref-reading-width)] space-y-[var(--ref-block-gap)]">
					<Paragraphs blocks={introRest} />
					<Paragraphs blocks={oQue.blocks} />
				</div>
			</Section>

			{/* Conhecimento: os 3 pilares, cada um com "Saiba mais ›" */}
			<Section id="pilares" eyebrow="Conhecimento" heading={pilares.heading ?? ""}>
				<div className="flex flex-col gap-[var(--ref-section-gap)]">
					{groups.map((g, i) => {
						const p = PILLAR_ORDER[i];
						return (
							<article key={g.title} className="grid items-center gap-8 md:grid-cols-2" data-pillar={p}>
								<ArtImage media={PILLAR_MEDIA[p]} className={i % 2 ? "md:order-2" : undefined} />
								<div className="space-y-[var(--ref-block-gap)]">
									<h3 className="stories-body font-semibold">{g.title}</h3>
									<Paragraphs blocks={g.blocks} />
									<ChevronLink href={articleHref(p)}>Saiba mais sobre {PILLARS[p].label}</ChevronLink>
								</div>
							</article>
						);
					})}
				</div>
			</Section>

			{/* Ferramenta: a cadeia do projeto ao aprendizado */}
			<Section id="ciclo" eyebrow="Ferramenta" heading={ciclo.heading ?? ""}>
				<dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-5">
					{ciclo.blocks.map((b) =>
						"term" in b ? (
							<div key={b.term}>
								<dt className="stories-meta font-semibold">{b.term}</dt>
								<dd className="stories-body text-muted-foreground mt-1">{b.text}</dd>
							</div>
						) : null,
					)}
				</dl>
				<ChevronLink href="/ferramentas/" className="mt-[var(--ref-block-gap)]">
					Ver as ferramentas cognitivas
				</ChevronLink>
			</Section>

			{/* Ação: por onde começar */}
			<Section id="comecar" eyebrow="Ação" heading={comecar.heading ?? ""}>
				<ul className="max-w-[var(--ref-reading-width)] space-y-[var(--ref-block-gap)]">
					{comecar.blocks.map((b, i) =>
						"p" in b ? (
							<li key={i} className="space-y-1">
								<p className="stories-body">{b.p}</p>
								<ChevronLink href={articleHref(PILLAR_ORDER[i])}>{PILLARS[PILLAR_ORDER[i]].label}</ChevronLink>
							</li>
						) : null,
					)}
				</ul>
			</Section>
		</>
	);
}
