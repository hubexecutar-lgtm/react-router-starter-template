// Tela INTRO da rota /prisma (RC-PWA-PRISMA-FRD-001 §4): é o HTML pré-renderizado da página.
// Anatomia ADR-12: hero (eyebrow, h1, lead, CTA), seções com título e parágrafo curto, "Saiba mais ›".
import { ArrowRight } from "lucide-react";

import { PageHero } from "@/components/editorial/PageHero";
import { ChevronLink } from "@/components/layout/ChevronLink";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/button";

const STEPS = [
	{ n: "01", title: "Preencha", text: "Descreva seu contexto, seu objetivo e o principal atrito." },
	{ n: "02", title: "Revise", text: "Veja as informações organizadas no Prisma." },
	{ n: "03", title: "Exporte", text: "Salve a folha A4 como PDF." },
] as const;

const CHAIN = [
	{ label: "Contexto", text: "Onde isso acontece." },
	{ label: "Demanda", text: "O que está sendo pedido." },
	{ label: "Atrito", text: "O que atrapalha." },
	{ label: "Compensação", text: "O apoio que carrega parte do esforço." },
	{ label: "Ação", text: "O próximo passo concreto." },
] as const;

const POINTS = [
	{ title: "Memória de trabalho", text: "Listas e etapas visíveis reduzem o que precisa ficar ativo na cabeça enquanto você executa." },
	{ title: "Lembrar de fazer depois", text: "Agendas, alarmes e lembretes ajudam a cumprir intenções futuras. É onde a evidência é mais clara." },
	{ title: "Planejamento e prioridade", text: "Mostrar a sequência e a fila de atenção fora da cabeça transforma obrigações soltas em um caminho." },
] as const;

export function PrismaIntro() {
	return (
		<div id="introducao">
			<PageHero
				eyebrow="Solução · Externalização cognitiva"
				title="Organize o que está dificultando sua execução."
				lead="Preencha o formulário, revise seu Prisma e exporte uma página A4 para usar onde precisar."
				id="prisma-view-title"
				seed={11}
			>
				<div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
					<Button asChild size="lg" className="min-h-12 px-8 text-base">
						<a href="#formulario">
							Criar meu Prisma <ArrowRight aria-hidden="true" />
						</a>
					</Button>
					<p className="text-muted-foreground text-sm">Seus dados ficam neste dispositivo.</p>
				</div>
			</PageHero>

			<Section id="como-usar" title="Como usar em 3 passos" lead="Leva alguns minutos e não pede conta.">
				<ol className="grid gap-4 md:grid-cols-3">
					{STEPS.map((s) => (
						<li key={s.n} className="rc-cell rc-surface p-6">
							<p className="rc-eyebrow">{s.n}</p>
							<h3 className="rc-title mt-2 text-[length:var(--text-h3)]">{s.title}</h3>
							<p className="text-muted-foreground mt-3 leading-relaxed">{s.text}</p>
						</li>
					))}
				</ol>
			</Section>

			<Section
				id="o-que-organiza"
				title="O que o Prisma organiza"
				lead="Cinco blocos, em ordem, numa folha só."
				link={{ href: "/blog/controles-cognitivos/", label: "Saiba mais sobre controles cognitivos" }}
			>
				<ol className="grid gap-4 md:grid-cols-5">
					{CHAIN.map((c, i) => (
						<li key={c.label} className="rc-cell rc-surface p-5">
							<p className="rc-eyebrow">{String(i + 1).padStart(2, "0")}</p>
							<h3 className="rc-title mt-2 text-lg">{c.label}</h3>
							<p className="text-muted-foreground mt-2 text-sm leading-relaxed">{c.text}</p>
						</li>
					))}
				</ol>
			</Section>

			<Section
				id="por-que-externalizar"
				title="Por que tirar da cabeça ajuda"
				lead="Externalização cognitiva é usar listas, lembretes e mapas para reduzir o que você precisa manter na mente."
				link={{ href: "/evidencias/", label: "Ver as evidências" }}
			>
				<ul className="grid gap-4 md:grid-cols-3">
					{POINTS.map((p) => (
						<li key={p.title} className="rc-cell rc-surface p-6">
							<h3 className="rc-title text-[length:var(--text-h3)]">{p.title}</h3>
							<p className="text-muted-foreground mt-3 leading-relaxed">{p.text}</p>
						</li>
					))}
				</ul>
				<p className="text-muted-foreground mt-6 max-w-[var(--measure)] leading-relaxed">
					O benefício depende de a representação combinar com a tarefa: ferramentas espalhadas podem aumentar a demanda em vez de reduzi-la. E o apoio compensa a tarefa; não
					treina a função por trás dela.
				</p>
			</Section>

			<Section id="privacidade-e-limites" title="Privacidade e limites" band className="pb-[var(--space-section)]">
				<div className="grid gap-6 md:grid-cols-2">
					<div>
						<h3 className="rc-title text-[length:var(--text-h3)]">Seus dados ficam com você</h3>
						<p className="text-muted-foreground mt-3 leading-relaxed">
							O Prisma funciona no seu navegador. O que você escreve não é enviado a nenhum servidor e só é guardado no dispositivo se você pedir. Dá para apagar tudo a qualquer momento.
						</p>
					</div>
					<div>
						<h3 className="rc-title text-[length:var(--text-h3)]">Não é diagnóstico</h3>
						<p className="text-muted-foreground mt-3 leading-relaxed">
							O Prisma organiza o que você informa para ajudar a decidir o próximo passo. Não avalia pessoas nem substitui apoio profissional.
						</p>
					</div>
				</div>
				<div className="mt-8">
					<ChevronLink href="#formulario">Criar meu Prisma</ChevronLink>
				</div>
			</Section>
		</div>
	);
}
