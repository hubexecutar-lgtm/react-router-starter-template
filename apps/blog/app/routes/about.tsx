// Sobre: decisões de marca (DEC-RC-0001), método editorial e distinção ciência × framework.
import { ArrowRight } from "lucide-react";

import type { Route } from "./+types/about";

import { IMAGES } from "@/components/editorial/HeroArt";
import { PageHero } from "@/components/editorial/PageHero";
import { SURFACE } from "@/components/editorial/surface";
import { PlainTextPanel } from "@/components/plain";
import seed from "@/data/editorial/seed.json";
import DefaultLayout from "@/layouts/DefaultLayout";
import { EVIDENCE, TERRITORIES } from "@/lib/editorial";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

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
	{ n: "01", title: "Problema", text: "Risco cognitivo: reconhecer como atenção, memória e julgamento participam da formação do risco." },
	{ n: "02", title: "Método", text: "Processo neuroadaptativo: redesenhar o trabalho para que ele não dependa de sustentar tudo de cabeça." },
	{ n: "03", title: "Progresso", text: "Execução assistida: controles, ferramentas e indicadores que mostram se a mudança funcionou." },
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

			<section className="container grid gap-4 md:grid-cols-3" aria-label="Três pilares">
				{PILLARS.map((p) => (
					<div key={p.n} className={cn(SURFACE, "p-6")}>
						<p className="rc-eyebrow flex justify-between">
							<span>Pilar</span>
							<span>{p.n}</span>
						</p>
						<h2 className="rc-title mt-4 text-2xl">{p.title}</h2>
						<p className="text-muted-foreground mt-2 leading-relaxed">{p.text}</p>
					</div>
				))}
			</section>

			<section className="container mt-16 grid gap-10 lg:grid-cols-2 lg:gap-16 [&>*]:min-w-0">
				<div>
					<p className="rc-eyebrow">Nome e escopo</p>
					<h2 className="rc-title mt-2 text-3xl">Marca, prática e método</h2>
					{naming && <p className="mt-4 text-lg leading-relaxed">{naming.Decisao_tomada}</p>}
					<p className="text-muted-foreground mt-4 leading-relaxed">
						O conteúdo se organiza em {TERRITORIES.length} territórios — do fenômeno ao framework que conecta tudo.
						Cada território responde a uma pergunta e reúne os artigos que tratam dela.
					</p>
					<a href="/temas/" className="rc-link mt-4 inline-flex items-center gap-1.5">
						Ver o mapa de temas <ArrowRight className="size-4" aria-hidden="true" />
					</a>

					<p className="rc-eyebrow mt-12">Ciência e framework próprio</p>
					<h2 className="rc-title mt-2 text-3xl">O que é evidência, o que é proposta</h2>
					<p className="mt-4 leading-relaxed">
						“Risco cognitivo”, como usado aqui, é uma definição operacional deste projeto, não um consenso
						científico. Os artigos apoiam essa proposta em fontes de fatores humanos, ergonomia e gestão de risco
						— hoje {EVIDENCE.length} registros — e marcam quando uma afirmação é do framework, não da literatura.
					</p>
					<a href="/evidencias/" className="rc-link mt-4 inline-flex items-center gap-1.5">
						Ver as evidências <ArrowRight className="size-4" aria-hidden="true" />
					</a>
				</div>
				<div>
					<p className="rc-eyebrow">Como produzimos</p>
					<h2 className="rc-title mt-2 text-3xl">Do tema ao artigo</h2>
					<p className="text-muted-foreground mt-4 leading-relaxed">
						Os artigos seguem o workflow de Quick Frameworks: um tópico por vez, fontes verificadas antes da
						escrita e validação automática da estrutura. O banco editorial vive no Hub Editorial.
					</p>
					<img
						src={IMAGES.equipeTablet.src}
						alt={IMAGES.equipeTablet.alt}
						width={IMAGES.equipeTablet.width}
						height={IMAGES.equipeTablet.height}
						loading="lazy"
						className="mt-6 aspect-[4/3] w-full max-w-md object-contain"
					/>
					<div className="mt-6">
						<PlainTextPanel id="ABOUT-PIPELINE-001" kind="procedure" title="Workflow editorial" source={PIPELINE} />
					</div>
					<a href="/hub-editorial/" className="rc-link mt-4 inline-flex items-center gap-1.5">
						Abrir o Hub Editorial <ArrowRight className="size-4" aria-hidden="true" />
					</a>
				</div>
			</section>
		</DefaultLayout>
	);
}
