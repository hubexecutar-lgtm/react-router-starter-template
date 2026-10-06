// RC-LP-001 (LANC-001 RQ-040) em /comece/, no RC-DS-CF (ADR-26): um layout de orientação com o texto canônico sem
// reescrita (app/data/landing.ts), na ordem Problema → Conhecimento → Ferramenta → Ação. Um CTA primário só, no topo
// (RQ-053). Os pilares levam a destinos válidos na reconstrução: o guia (P1), o Mapa (P2) e as Ferramentas (P3); a linha
// "CTA:" do canônico fica como texto, porque o artigo que ela nomeia está fora do ar (302).
import { Button, Card, CardGrid, MoreLink, PageHead, SectionHead } from "@/components/ds";
import { SITE_TAGLINE } from "@/consts";
import type { Pillar } from "@/data/article-media";
import { PILLARS } from "@/data/article-meta";
import { LANDING, type LandingBlock } from "@/data/landing";
import { MAP_LEAD } from "@/features/mapa/copy";

const PILLAR_ORDER: Pillar[] = ["p1", "p2", "p3"];
/** Os três passos do canônico ("Problema → Método → Aplicação"), na ordem dos pilares. */
const STEP: Record<Pillar, string> = { p1: "Problema", p2: "Método", p3: "Aplicação" };
/** Destino de cada pilar enquanto os artigos canônicos estão em reconstrução (ADR-26, INVENTARIO.md). */
const PILLAR_HREF: Record<Pillar, string> = { p1: "/artigos/riscos-cognitivos-guia/", p2: "/mapas/", p3: "/ferramentas/" };

function Paragraphs({ blocks }: { blocks: LandingBlock[] }) {
	return (
		<>
			{blocks.map((b, i) =>
				"p" in b ? (
					<p key={i} style={b.p.includes("→") ? { fontWeight: 600 } : undefined}>
						{b.p}
					</p>
				) : null,
			)}
		</>
	);
}

export function CanonicalLanding() {
	const [intro, oQue, pilares, ciclo, comecar] = LANDING.sections;
	const [lead, ...introRest] = intro.blocks;
	// Os 3 pilares: cada marcador "N. TÍTULO" abre um grupo com os parágrafos que o seguem.
	const groups: { title: string; blocks: LandingBlock[] }[] = [];
	for (const b of pilares.blocks) {
		if ("pillar" in b) groups.push({ title: b.pillar, blocks: [] });
		else groups[groups.length - 1]?.blocks.push(b);
	}
	return (
		<div className="ds-page">
			<PageHead
				eyebrow={SITE_TAGLINE}
				title={LANDING.title}
				lead={"p" in lead ? lead.p : null}
				notice="Página de orientação no design system novo; o texto é o canônico RC-LP-001, sem reescrita."
				actions={
					<>
						<Button href={PILLAR_HREF.p1} size="lg" data-cta="primary">
							Ler o guia de riscos cognitivos
						</Button>
						<Button href="/mapas/" variant="outline" size="lg">
							Explorar o mapa
						</Button>
					</>
				}
			>
				<p className="ds-card-meta" style={{ marginTop: 16 }} data-canonical-cta>
					{LANDING.cta}
				</p>
			</PageHead>

			{/* Problema: o modelo e os três pilares em fluxo */}
			<section className="ds-section" style={{ paddingTop: 0 }} aria-labelledby="problema" data-landing-section="Problema">
				<SectionHead id="problema" label="Problema" heading={oQue.heading} align="left" />
				<div className="ds-prose-block">
					<Paragraphs blocks={introRest} />
				</div>
				<ol className="ds-chips" aria-label="Os três pilares" style={{ marginBlock: 32 }}>
					{PILLAR_ORDER.map((p) => (
						<li key={p} className="ds-badge" style={{ padding: "8px 14px", fontSize: 15 }}>
							<strong>{PILLARS[p].label}</strong> · <span>{STEP[p]}</span>
						</li>
					))}
				</ol>
				<div className="ds-prose-block">
					<Paragraphs blocks={oQue.blocks} />
				</div>
			</section>

			{/* Conhecimento: os 3 pilares em células do quadro, mais o mapa */}
			<section className="ds-section" aria-labelledby="pilares" data-landing-section="Conhecimento">
				<SectionHead id="pilares" label="Conhecimento" heading={pilares.heading ?? ""} align="left" />
				<CardGrid cols={2} label="Os três pilares e o mapa">
					{groups.map((g, i) => {
						const p = PILLAR_ORDER[i];
						return (
							<article key={g.title} className="ds-card" data-pillar={p}>
								<span className="ds-card-eyebrow">
									{p.toUpperCase()} — {STEP[p]}
								</span>
								<h3>{g.title}</h3>
								<div className="ds-prose-block" style={{ fontSize: 16, color: "var(--cf-fg-muted)" }}>
									<Paragraphs blocks={g.blocks} />
								</div>
								<MoreLink href={PILLAR_HREF[p]}>Saiba mais sobre {PILLARS[p].label}</MoreLink>
							</article>
						);
					})}
					<Card href="/mapas/" eyebrow="Mapa Cognitivo" title="Veja como as partes se conectam" text={MAP_LEAD} cta="Explorar o mapa" />
				</CardGrid>
			</section>

			{/* Ferramenta: a cadeia do projeto ao aprendizado */}
			<section className="ds-section" aria-labelledby="ciclo" data-landing-section="Ferramenta">
				<SectionHead id="ciclo" label="Ferramenta" heading={ciclo.heading ?? ""} align="left" />
				<dl className="ds-dl">
					{ciclo.blocks.map((b) =>
						"term" in b ? (
							<div key={b.term}>
								<dt>{b.term}</dt>
								<dd>{b.text}</dd>
							</div>
						) : null,
					)}
				</dl>
				<p className="ds-more">
					<MoreLink href="/ferramentas/">Ver as ferramentas cognitivas</MoreLink>
				</p>
			</section>

			{/* Ação: por onde começar */}
			<section className="ds-section" aria-labelledby="comecar" data-landing-section="Ação">
				<SectionHead id="comecar" label="Ação" heading={comecar.heading ?? ""} align="left" />
				<CardGrid cols={3} label="Por onde começar">
					{comecar.blocks.map((b, i) =>
						"p" in b ? (
							<article key={i} className="ds-card">
								<p style={{ color: "var(--cf-fg)" }}>{b.p}</p>
								<MoreLink href={PILLAR_HREF[PILLAR_ORDER[i]]}>{PILLARS[PILLAR_ORDER[i]].label}</MoreLink>
							</article>
						) : null,
					)}
				</CardGrid>
			</section>
		</div>
	);
}
