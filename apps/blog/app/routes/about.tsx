// Sobre: decisões de marca (DEC-RC-0001), método editorial e distinção ciência × framework.
// Anatomia Apple Developer Programs (ADR-12): hero, três pilares, linhas de recurso com mídia.
import { Compass, Route as RouteIcon, TrendingUp } from "lucide-react";

import type { Route } from "./+types/about";

import { HeroArt, IMAGES } from "@/components/editorial/HeroArt";
import { PageHero } from "@/components/editorial/PageHero";
import { FeatureBlock, FeatureRow } from "@/components/layout/FeatureBlock";
import { Section } from "@/components/layout/Section";
import { PlainTextPanel } from "@/components/plain";
import seed from "@/data/editorial/seed.json";
import DefaultLayout from "@/layouts/DefaultLayout";
import { EVIDENCE, TERRITORIES } from "@/lib/editorial";
import { seo } from "@/lib/seo";

export const meta: Route.MetaFunction = ({ location }) =>
	seo({
		title: "Sobre o projeto",
		description:
			"O que é o Risco Cognitivo, como os artigos são produzidos e como separamos evidência de framework próprio.",
		pathname: location.pathname,
	});

const naming = seed.seed.decisions.find((d) => d.Decision_ID === "DEC-RC-0001");
const PIPELINE = `ENTENDER     tema, dor, público e pergunta de pesquisa
PESQUISAR    fonte original → instituição → pesquisa → secundária
VALIDAR      cada afirmação central ligada a um registro EVD-RC
ESTRUTURAR   contexto, 5W2H, problema, processo, progresso
REDIGIR      português direto, exemplo cotidiano, limites explícitos
VALIDAR      validate_output.py: seções, limites de palavras, diagramas
ENTREGAR     artigo no blog + registro no Hub Editorial`;
const PILLARS = [
	{
		icon: Compass,
		n: "01",
		title: "Problema",
		text: "Risco cognitivo: reconhecer como atenção, memória e julgamento participam da formação do risco.",
		link: { href: "/blog/o-que-e-risco-cognitivo/", label: "O que é risco cognitivo" },
	},
	{
		icon: RouteIcon,
		n: "02",
		title: "Método",
		text: "Processo neuroadaptativo: redesenhar o trabalho para que ele não dependa de sustentar tudo de cabeça.",
		link: { href: "/mapas/", label: "Ver o framework" },
	},
	{
		icon: TrendingUp,
		n: "03",
		title: "Progresso",
		text: "Execução assistida: controles, ferramentas e indicadores que mostram se a mudança funcionou.",
		link: { href: "/guias/", label: "Abrir os guias" },
	},
];

export default function Page() {
	return (
		<DefaultLayout>
			<PageHero
				eyebrow="Sobre o projeto"
				title="Conhecimento que vira estrutura."
				lead="O Risco Cognitivo é um blog e um framework sobre como a cognição participa da formação do risco no trabalho — e sobre o que reduz, mede e acompanha esse risco."
				image={IMAGES.binoculo}
				seed={3}
			/>

			<Section id="pilares" eyebrow="Três pilares" title="Do problema ao progresso">
				<div className="grid gap-[var(--table-gap)] md:grid-cols-3">
					{PILLARS.map((p) => (
						<FeatureBlock key={p.n} icon={p.icon} eyebrow={`Pilar ${p.n}`} title={p.title} link={p.link}>
							<p>{p.text}</p>
						</FeatureBlock>
					))}
				</div>
			</Section>

			<FeatureRow
				id="nome-escopo"
				eyebrow="Nome e escopo"
				title="Marca, prática e método"
				link={{ href: "/temas/", label: "Ver o mapa de temas" }}
				media={<HeroArt seed={9} className="w-full" />}
			>
				{naming && <p>{naming.Decisao_tomada}</p>}
				<p>
					O conteúdo se organiza em {TERRITORIES.length} territórios — do fenômeno ao framework que conecta tudo.
					Cada território responde a uma pergunta e reúne os artigos que tratam dela.
				</p>
			</FeatureRow>

			<FeatureRow
				id="ciencia"
				eyebrow="Ciência e framework próprio"
				title="O que é evidência, o que é proposta"
				link={{ href: "/evidencias/", label: "Ver as evidências" }}
				reverse
				media={
					<dl className="grid grid-cols-2 gap-[var(--table-gap)]">
						<div className="rc-cell rc-surface p-6">
							<dt className="rc-eyebrow">Registros de evidência</dt>
							<dd className="rc-display mt-3 text-5xl">{EVIDENCE.length}</dd>
						</div>
						<div className="rc-cell rc-surface p-6">
							<dt className="rc-eyebrow">Territórios</dt>
							<dd className="rc-display mt-3 text-5xl">{TERRITORIES.length}</dd>
						</div>
					</dl>
				}
			>
				<p>
					“Risco cognitivo”, como usado aqui, é uma definição operacional deste projeto, não um consenso científico.
				</p>
				<p>
					Os artigos apoiam essa proposta em fontes de fatores humanos, ergonomia e gestão de risco, e marcam
					quando uma afirmação é do framework, não da literatura.
				</p>
			</FeatureRow>

			<FeatureRow
				id="como-produzimos"
				eyebrow="Como produzimos"
				title="Do tema ao artigo"
				link={{ href: "/hub-editorial/", label: "Abrir o Hub Editorial" }}
				media={
					<img
						src={IMAGES.equipeTablet.src}
						alt={IMAGES.equipeTablet.alt}
						width={IMAGES.equipeTablet.width}
						height={IMAGES.equipeTablet.height}
						loading="lazy"
						className="mx-auto max-h-80 w-auto object-contain"
					/>
				}
			>
				<p>
					Os artigos seguem o workflow de Quick Frameworks: um tópico por vez, fontes verificadas antes da escrita
					e validação automática da estrutura. O banco editorial vive no Hub Editorial.
				</p>
			</FeatureRow>

			<Section id="workflow" eyebrow="Workflow editorial" title="Sete etapas, sempre na mesma ordem">
				<PlainTextPanel id="ABOUT-PIPELINE-001" kind="procedure" title="Workflow editorial" source={PIPELINE} className="my-0" />
			</Section>
		</DefaultLayout>
	);
}
