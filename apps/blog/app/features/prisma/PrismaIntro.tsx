// Tela INTRO da rota /prisma (RC-PWA-PRISMA-FRD-001 §4): é o HTML pré-renderizado da página.
// RC-DS-CF (ADR-26, DS-CF-001-prisma §3): PageHead + seções com SectionHead, passos em `ds-steps`, cards do DS e
// "Saiba mais ›" com destinos reais. O eyebrow "Solução · Externalização cognitiva" é a citação que sustenta a
// correlação do Prisma na Teia (app/features/store/data/correlations.ts): não reescrever.
import { Button, Card, CardGrid, Frame, MoreLink, PageHead, SectionHead } from "@/components/ds";

/** Nó da compensação no Mapa (o mesmo `ref` do Prisma em TOOL_CORRELATIONS). */
export const PRISMA_MAP_HREF = "/mapas/explorar/cmp-externalizacao/";

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

function Steps({ items, cols = 3 }: { items: readonly { n: string; title: string; text: string }[]; cols?: 3 | 5 }) {
	return (
		<Frame>
			<ol className="ds-steps" style={{ ["--ds-steps-cols" as string]: cols }}>
				{items.map((s) => (
					<li key={s.n}>
						<span className="ds-steps-n" aria-hidden="true">
							{s.n}
						</span>
						<h3>{s.title}</h3>
						<p>{s.text}</p>
					</li>
				))}
			</ol>
		</Frame>
	);
}

export function PrismaIntro() {
	return (
		<div id="introducao" className="ds-page">
			<PageHead
				eyebrow="Solução · Externalização cognitiva"
				title="Organize o que está dificultando sua execução."
				lead="Preencha o formulário, revise seu Prisma e exporte uma página A4 para usar onde precisar."
				notice="Ferramenta real no design system novo. A folha A4 mantém o formato de impressão."
				actions={
					<>
						<Button href="#formulario" size="lg" data-cta="primary">
							Criar meu Prisma
						</Button>
						<p className="ds-tool-note">Seus dados ficam neste dispositivo.</p>
					</>
				}
			/>

			<section className="ds-section" style={{ paddingTop: 0 }} aria-labelledby="como-usar">
				<SectionHead id="como-usar" label="Passo a passo" heading="Como usar em 3 passos" lead="Leva alguns minutos e não pede conta." align="left" />
				<Steps items={STEPS} />
			</section>

			<section className="ds-section" aria-labelledby="o-que-organiza">
				<SectionHead id="o-que-organiza" label="A folha" heading="O que o Prisma organiza" lead="Cinco blocos, em ordem, numa folha só." align="left" />
				<Steps items={CHAIN.map((c, i) => ({ n: String(i + 1).padStart(2, "0"), title: c.label, text: c.text }))} cols={5} />
				<p style={{ marginTop: 16 }}>
					<MoreLink href={PRISMA_MAP_HREF}>Ver a externalização no Mapa Cognitivo</MoreLink>
				</p>
			</section>

			<section className="ds-section" aria-labelledby="por-que-externalizar">
				<SectionHead
					id="por-que-externalizar"
					label="Evidência"
					heading="Por que tirar da cabeça ajuda"
					lead="Externalização cognitiva é usar listas, lembretes e mapas para reduzir o que você precisa manter na mente."
					align="left"
				/>
				<CardGrid cols={3}>
					{POINTS.map((p) => (
						<Card key={p.title} title={p.title} text={p.text} />
					))}
				</CardGrid>
				<div className="ds-prose-block" style={{ marginTop: 24, color: "var(--cf-fg-muted)" }}>
					<p>
						O benefício depende de a representação combinar com a tarefa: ferramentas espalhadas podem aumentar a demanda em vez de reduzi-la. E o apoio compensa a tarefa; não
						treina a função por trás dela.
					</p>
				</div>
				<p style={{ marginTop: 8 }}>
					<MoreLink href="/fontes/#fontes-cientificas">Ver as fontes</MoreLink>
				</p>
			</section>

			<section className="ds-section" style={{ paddingBottom: "var(--cf-section-gap)" }} aria-labelledby="privacidade-e-limites">
				<SectionHead id="privacidade-e-limites" label="Limites" heading="Privacidade e limites" align="left" />
				<CardGrid cols={2}>
					<Card
						title="Seus dados ficam com você"
						text="O Prisma funciona no seu navegador. O que você escreve não é enviado a nenhum servidor e só é guardado no dispositivo se você pedir. Dá para apagar tudo a qualquer momento."
					/>
					<Card
						title="Não é diagnóstico"
						text="O Prisma organiza o que você informa para ajudar a decidir o próximo passo. Não avalia pessoas nem substitui apoio profissional."
					/>
				</CardGrid>
				<p style={{ marginTop: 16 }}>
					<MoreLink href="#formulario">Criar meu Prisma</MoreLink>
				</p>
			</section>
		</div>
	);
}
