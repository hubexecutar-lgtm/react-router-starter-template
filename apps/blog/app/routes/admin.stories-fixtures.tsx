// Fixtures do template de artigo (ADR-26, DS-CF-001-admin §1): os componentes do Blog e do artigo com DADOS SINTÉTICOS,
// para conferir o que o conteúdo real ainda não exercita (grade cheia, sumário longo, tabela empilhada, FAQ, estado vazio).
// Interna e noindex; nada daqui é conteúdo do site, e todo item é rotulado como sintético.
import { ArticleMeta, Badge, Card, CardGrid, DemoNotice, EmptyState, Faq, KeyPoints, PageHead, SectionHead, Table, Toc } from "@/components/ds";
import DefaultLayout from "@/layouts/DefaultLayout";
import { seo } from "@/lib/seo";

const CATEGORIES = ["Categoria A", "Categoria B", "Categoria C"];

const CARDS = Array.from({ length: 9 }, (_, i) => {
	const n = String(i + 1).padStart(2, "0");
	return {
		id: `FIXTURE-${n}`,
		title: `Título sintético ${n}: um título de duas ou três linhas para medir a quebra no card`,
		text: "Descrição sintética do artigo, com uma ou duas frases.",
		category: CATEGORIES[i % CATEGORIES.length],
		minutes: 3 + (i % 7),
	};
});

const TOC = [
	{ id: "fixture-contexto", label: "Contexto sintético" },
	{ id: "fixture-tabela", label: "Tabela empilhada" },
	{ id: "fixture-citacao", label: "Citação e lista" },
	{ id: "fixture-fechamento", label: "Fechamento" },
];

export const meta = ({ location }: { location: { pathname: string } }) =>
	seo({
		title: "Fixtures de artigo",
		description: "Componentes do template de artigo com dados sintéticos.",
		pathname: location.pathname,
		noindex: true,
	});

export default function ArticleFixtures() {
	return (
		<DefaultLayout>
			<div className="ds-page" data-fixtures>
				<PageHead
					crumbs={[{ label: "Painel", href: "/admin/" }, { label: "Fixtures de artigo" }]}
					eyebrow="Painel · Fixtures"
					title="Fixtures de artigo"
					lead="Componentes do Blog e do artigo preenchidos com dados sintéticos, para conferir grade, sumário, meta, tabela e estados."
					notice="Dados sintéticos: nada desta página é conteúdo do site."
				/>

				<section className="ds-section" style={{ paddingTop: 0 }} aria-labelledby="fixture-grade" data-fixture="cards">
					<SectionHead id="fixture-grade" label="Blog" heading="Grade cheia de cards" lead="Nove cards sintéticos: destaque grande e grade de três colunas." align="left" />
					<CardGrid cols={2} label="Destaque (sintético)">
						<Card
							href="#fixture-artigo"
							size="lg"
							eyebrow={CARDS[0].category}
							badge={<Badge variant="demo">Sintético</Badge>}
							title={CARDS[0].title}
							text={CARDS[0].text}
							meta={`${CARDS[0].minutes} min de leitura`}
							cta="Ler artigo"
							data-story-card=""
						/>
						<Card
							href="#fixture-artigo"
							eyebrow={CARDS[1].category}
							badge={<Badge variant="demo">Sintético</Badge>}
							title={CARDS[1].title}
							text={CARDS[1].text}
							meta={`${CARDS[1].minutes} min de leitura`}
							cta="Ler artigo"
							data-story-card=""
						/>
					</CardGrid>
					<div className="mt-4">
						<CardGrid cols={3} label="Artigos (sintéticos)">
							{CARDS.slice(2).map((c) => (
								<Card
									key={c.id}
									href="#fixture-artigo"
									eyebrow={c.category}
									badge={<Badge variant="demo">Sintético</Badge>}
									title={c.title}
									text={c.text}
									meta={`${c.minutes} min de leitura`}
									cta="Ler artigo"
									data-story-card=""
								/>
							))}
						</CardGrid>
					</div>
				</section>

				<section id="fixture-artigo" className="ds-section" aria-label="Artigo sintético" data-fixture="article">
					<header className="ds-pagehead" data-align="left" style={{ paddingTop: 0 }}>
						<DemoNotice>Artigo sintético para conferir o template; o texto não é conteúdo do site.</DemoNotice>
						<p className="ds-eyebrow">Categoria A</p>
						<p className="ds-pagehead-lead" style={{ marginTop: 0, color: "var(--cf-fg)", fontSize: "var(--cf-h3)", fontWeight: 500 }}>
							Título sintético do artigo de fixture
						</p>
						<ArticleMeta publisher="Risco Cognitivo" date="2026-10-06" minutes={4} id="RC-FIXTURE-001" />
					</header>
					<div className="ds-article" style={{ paddingInline: 0 }}>
						<Toc items={TOC} />
						<div>
							<KeyPoints items={["Ponto sintético um: frase curta tirada do texto.", "Ponto sintético dois: outra frase curta."]} />
							<div className="ds-prose" data-fixture-body>
								<h2 id="fixture-contexto">Contexto sintético</h2>
								<p>
									Parágrafo sintético de leitura, com <strong>destaque</strong> e um <a href="#fixture-tabela">link interno</a>. A linha respeita a medida de 68
									caracteres para o conforto da leitura.
								</p>
								<h2 id="fixture-tabela">Tabela empilhada</h2>
								<p>No celular, cada linha vira um bloco com células rotuladas.</p>
								<Table
									caption="Tabela sintética"
									head={["Demanda", "Dificuldade", "Estratégia"]}
									rows={[
										["Demanda sintética A", "Dificuldade sintética A", "Estratégia sintética A"],
										["Demanda sintética B", "Dificuldade sintética B", "Estratégia sintética B"],
										["Demanda sintética C", "Dificuldade sintética C", "Estratégia sintética C"],
									]}
								/>
								<h2 id="fixture-citacao">Citação e lista</h2>
								<blockquote>
									<p>Citação sintética para medir o bloco de citação com a régua de acento.</p>
								</blockquote>
								<ul>
									<li>Item sintético de lista.</li>
									<li>Segundo item sintético.</li>
								</ul>
								<h2 id="fixture-fechamento">Fechamento</h2>
								<p>Parágrafo final sintético antes das perguntas frequentes.</p>
							</div>
							<div className="mt-12">
								<Faq
									items={[
										{ q: "Pergunta sintética um?", a: <p>Resposta sintética um.</p> },
										{ q: "Pergunta sintética dois?", a: <p>Resposta sintética dois.</p> },
									]}
								/>
							</div>
						</div>
					</div>
				</section>

				<section className="ds-section pb-24" aria-labelledby="fixture-estados" data-fixture="states">
					<SectionHead id="fixture-estados" label="Estados" heading="Estado vazio e aviso" align="left" />
					<div className="grid gap-6">
						<EmptyState
							level={3}
							title="Nenhum artigo sobre este tema ainda"
							text="Este tema está na taxonomia, mas os artigos dele ainda estão em reconstrução. Comece pelo guia geral."
							action={{ label: "Ver todos os artigos", href: "/artigos/" }}
						/>
						<DemoNotice>Aviso sintético de layout demonstrativo fora do cabeçalho.</DemoNotice>
					</div>
				</section>
			</div>
		</DefaultLayout>
	);
}
