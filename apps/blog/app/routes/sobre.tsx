// Sobre (LANC-001 RQ-050): o projeto contado só com trechos dos textos canônicos (RC-LP-001, RC-ART-P1-001,
// RC-SRC-001), sem texto novo de posicionamento. Os conceitos próprios ficam rotulados como tal (RQ-043).
import type { Route } from "./+types/sobre";

import { ChevronLink } from "@/components/layout/ChevronLink";
import { ArtImage } from "@/components/stories/ArtImage";
import { RC_IMAGES } from "@/data/article-media";
import { LANDING } from "@/data/landing";
import { GOVERNANCE_NOTE } from "@/data/sources";
import DefaultLayout from "@/layouts/DefaultLayout";
import { seo } from "@/lib/seo";

const para = (section: number, index: number) => {
	const b = LANDING.sections[section].blocks[index];
	return "p" in b ? b.p : "";
};

/** Trechos literais, com o documento de origem. */
const PRINCIPLES = [
	{ text: para(0, 1), source: "RC-LP-001" },
	{ text: para(0, 2), source: "RC-LP-001" },
	{ text: "Risco cognitivo não deve ser usado para transformar uma pessoa em problema.", source: "RC-ART-P1-001" },
	{ text: "Ele deve ajudar a examinar o trabalho.", source: "RC-ART-P1-001" },
];

export const meta: Route.MetaFunction = ({ location }) =>
	seo({ title: "Sobre", description: para(0, 0), image: RC_IMAGES.cerebroUrbanoMaoB.landscape.src, pathname: location.pathname });

export default function Sobre() {
	return (
		<DefaultLayout>
			<header className="hy-hero rc-hero-reveal">
				<p className="hy-eyebrow">Risco Cognitivo · Sobre</p>
				<h1>Sobre o projeto</h1>
				<p className="hy-lead">{para(0, 0)}</p>
				<div className="hy-actions">
					<a href="/artigos/riscos-cognitivos/" data-cta="primary" className="hy-btn-primary">
						{LANDING.cta}
					</a>
				</div>
			</header>
			<div className="hy-shell">
				<div>
					<ArtImage media={RC_IMAGES.cerebroUrbanoMaoB} priority />
				</div>
			</div>
			<section className="stories-container mt-[var(--ref-section-gap)]" aria-labelledby="principios">
				<div className="mx-auto max-w-[var(--ref-reading-width)]">
					<h2 id="principios" className="stories-h2">
						Princípios
					</h2>
					<ul className="mt-[var(--ref-block-gap)] space-y-[var(--ref-block-gap)]">
						{PRINCIPLES.map((p) => (
							<li key={p.text}>
								<p className="stories-body">{p.text}</p>
								<p className="stories-caption text-muted-foreground">{p.source}</p>
							</li>
						))}
					</ul>
				</div>
			</section>
			<section className="stories-container mt-[var(--ref-section-gap)]" aria-labelledby="conceitos-proprios">
				<div className="mx-auto max-w-[var(--ref-reading-width)]">
					<h2 id="conceitos-proprios" className="stories-h2">
						Conceitos do projeto
					</h2>
					<div className="mt-[var(--ref-block-gap)] space-y-[var(--ref-block-gap)]" data-governance-note>
						{GOVERNANCE_NOTE.map((l) => (
							<p key={l} className="stories-body">
								{l}
							</p>
						))}
					</div>
					<ChevronLink href="/fontes/" className="mt-[var(--ref-block-gap)]">
						Ver todas as fontes
					</ChevronLink>
				</div>
			</section>
		</DefaultLayout>
	);
}
