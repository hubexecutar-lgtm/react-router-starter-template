// Perguntas frequentes: respostas ancoradas no banco editorial (ARG, TAX, briefs).
import type { Route } from "./+types/faq";

import { PageHero } from "@/components/editorial/PageHero";
import DefaultLayout from "@/layouts/DefaultLayout";
import { seo } from "@/lib/seo";

export const meta: Route.MetaFunction = ({ location }) =>
	seo({
		title: "Perguntas frequentes",
		description: "Respostas curtas sobre risco cognitivo, o framework e como os artigos são produzidos.",
		pathname: location.pathname,
	});

const FAQS: { q: string; a: string; href?: string; link?: string }[] = [
	{
		q: "O que é risco cognitivo?",
		a: "É a possibilidade de aspectos da cognição — atenção, memória, julgamento — contribuírem para resultados indesejados. É uma definição operacional deste projeto, não um consenso científico.",
		href: "/blog/o-que-e-risco-cognitivo/",
		link: "Ler o artigo",
	},
	{
		q: "Risco cognitivo é o mesmo que erro humano?",
		a: "Não. O risco descreve uma possibilidade anterior; o erro é uma ocorrência. Olhar só para o erro começa a análise tarde demais.",
		href: "/blog/eventos-de-risco-cognitivo/",
		link: "Ver eventos de risco cognitivo",
	},
	{
		q: "É um diagnóstico sobre pessoas?",
		a: "Não. O framework analisa condições de trabalho, tarefas e sistemas. Não avalia inteligência nem patologiza diferenças individuais.",
	},
	{
		q: "Qual a diferença entre fator e exposição?",
		a: "Fator é uma condição que aumenta a probabilidade de falha, sem determiná-la. Exposição diz quanto esse fator incide sobre uma tarefa — por intensidade, frequência, duração e criticidade.",
		href: "/blog/exposicao-cognitiva/",
		link: "Ler sobre exposição",
	},
	{
		q: "As afirmações dos artigos têm fonte?",
		a: "As afirmações centrais apontam para registros do banco de evidências, com autor, ano e link. Quando algo é proposta do framework, o texto diz.",
		href: "/evidencias/",
		link: "Ver evidências",
	},
	{
		q: "Como os artigos são produzidos?",
		a: "Pelo workflow de Quick Frameworks: entender, pesquisar, validar, estruturar, redigir, validar e entregar. Cada artigo passa por uma checagem automática de estrutura.",
		href: "/about/",
		link: "Conhecer o método",
	},
	{
		q: "Posso usar o modelo de análise no meu trabalho?",
		a: "Sim. O modelo e os primeiros passos de cada território estão em Guias, prontos para copiar.",
		href: "/guias/",
		link: "Abrir guias",
	},
	{
		q: "Como acompanhar novos artigos?",
		a: "Pelo feed RSS. A newsletter ainda não tem provedor definido.",
		href: "/rss.xml",
		link: "Assinar o RSS",
	},
];

export default function Page() {
	return (
		<DefaultLayout>
			<PageHero
				eyebrow="Perguntas frequentes"
				title="Dúvidas sobre o framework"
				lead="Respostas curtas, com link para o texto completo quando houver."
			/>
			<section className="container max-w-4xl" aria-label="Perguntas">
				<div className="divide-y divide-[var(--border-default)] border-y border-[var(--border-default)]">
					{FAQS.map((f) => (
						<details key={f.q} className="group py-2">
							<summary className="rc-title focus-visible:ring-ring/50 flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-md text-lg outline-none focus-visible:ring-[3px] sm:text-xl [&::-webkit-details-marker]:hidden">
								{f.q}
								<span aria-hidden="true" className="text-primary text-2xl leading-none transition-transform group-open:rotate-45">
									+
								</span>
							</summary>
							<div className="pb-5">
								<p className="text-muted-foreground max-w-3xl leading-relaxed">{f.a}</p>
								{f.href && (
									<a href={f.href} className="rc-link mt-3 inline-block">
										{f.link}
									</a>
								)}
							</div>
						</details>
					))}
				</div>
			</section>
		</DefaultLayout>
	);
}
