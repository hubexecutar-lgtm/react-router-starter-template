// Showroom do RC-DS-CF (ADR-26; DS-CF-001 §3/§4 e DS-CF-001-admin §3): cada componente de @/components/ds e cada
// classe ds-* com exemplo vivo, variantes, estados, notas de acessibilidade e do/don't. Os valores dos tokens e o
// contraste são calculados no navegador, no tema atual. Camadas semânticas (ADR-26, exceções 1–4) aparecem só como
// amostra de token ou por link para a rota que as usa. Interna e noindex.
import { useState, type ReactNode } from "react";

import { ArrowRight, BookOpen, Brain, Wrench } from "lucide-react";

import type { Route } from "./+types/admin.design-system";

import { ContrastTable, Specimen, Stage, Swatch, TokenProvider, TokenValue, Variant, type ContrastPair } from "@/components/admin/showroom";
import {
	ArticleMeta,
	Badge,
	Breadcrumb,
	Button,
	Card,
	CardGrid,
	Check,
	Chips,
	ConfirmDialog,
	DemoNotice,
	Dots,
	EmptyState,
	Faq,
	Field,
	Frame,
	Input,
	KeyPoints,
	MoreLink,
	PageHead,
	SectionHead,
	Select,
	Table,
	Tabs,
	Textarea,
	Toc,
} from "@/components/ds";
import { AsciiDiagram, PlainTextPanel, renderTree } from "@/components/plain";
import { SOLUTIONS } from "@/features/solutions/data";
import DefaultLayout from "@/layouts/DefaultLayout";
import { seo } from "@/lib/seo";

export const meta: Route.MetaFunction = ({ location }) =>
	seo({
		title: "Design System",
		description: "Showroom do design system RC-DS-CF: tokens, componentes, estados, acessibilidade e do/don't.",
		pathname: location.pathname,
		noindex: true,
	});

/* ------------------------------------------------------------------ índice */

const SECTIONS = [
	{ id: "tokens", label: "Tokens" },
	{ id: "camadas", label: "Camadas semânticas" },
	{ id: "botoes", label: "Botões e links" },
	{ id: "cards", label: "Cards e quadros" },
	{ id: "navegacao", label: "Navegação" },
	{ id: "cabecalhos", label: "Cabeçalhos e avisos" },
	{ id: "laranja", label: "Cartão laranja" },
	{ id: "conteudo", label: "Conteúdo de leitura" },
	{ id: "formularios", label: "Formulários" },
	{ id: "estados", label: "Estados e selos" },
	{ id: "dados", label: "Tabelas e dados" },
	{ id: "plain", label: "Plain text e diagramas" },
];

/* ------------------------------------------------------------------ tokens (só nomes; valores lidos no navegador) */

const COLORS: [string, string, string?][] = [
	["--cf-fg", "Texto", "--cf-bg"],
	["--cf-fg-muted", "Texto secundário", "--cf-bg"],
	["--cf-bg", "Página"],
	["--cf-bg-200", "Painel, estado vazio"],
	["--cf-bg-300", "Hover, cabeçalho de tabela"],
	["--cf-border", "Quadros e divisões"],
	["--cf-border-strong", "Campos, botão de contorno"],
	["--cf-accent", "Cartão laranja, botão primário, marcadores"],
	["--cf-accent-200", "Hover do primário, botão suave"],
	["--cf-accent-text", "Acento como texto e links", "--cf-bg"],
	["--cf-accent-soft", "Fundo de destaque"],
	["--cf-accent-line", "Linha de destaque"],
	["--cf-on-accent", "Só título grande sobre o acento"],
	["--cf-on-accent-ink", "Texto pequeno sobre o acento"],
	["--cf-glow", "Brilho do cartão laranja"],
	["--cf-focus", "Anel de foco (3 px)", "--cf-bg"],
];

const PAIRS: ContrastPair[] = [
	{ fg: "--cf-fg", bg: "--cf-bg", min: 4.5, use: "Texto" },
	{ fg: "--cf-fg", bg: "--cf-bg-300", min: 4.5, use: "Texto sobre hover e cabeçalho" },
	{ fg: "--cf-fg-muted", bg: "--cf-bg", min: 4.5, use: "Texto secundário" },
	{ fg: "--cf-fg-muted", bg: "--cf-bg-300", min: 4.5, use: "Rótulo de tabela" },
	{ fg: "--cf-accent-text", bg: "--cf-bg", min: 4.5, use: "Links e eyebrow" },
	{ fg: "--cf-accent-text", bg: "--cf-accent-soft", min: 4.5, use: "Aviso demonstrativo, badge accent" },
	{ fg: "--cf-on-accent-ink", bg: "--cf-accent", min: 4.5, use: "Botão primário, texto pequeno no laranja" },
	{ fg: "--cf-on-accent", bg: "--cf-accent", min: 3, use: "Só título grande (≥ 24 px) no laranja" },
	{ fg: "--cf-focus", bg: "--cf-bg", min: 3, use: "Anel de foco (não texto)" },
];

const RADII: [string, string][] = [
	["--cf-radius-sm", "Chip, badge, célula"],
	["--cf-radius-md", "Painel, campo, card panel"],
	["--cf-radius-lg", "Cartão laranja, sheet"],
	["--cf-radius-pill", "Botão, pílula"],
];

const SIZES: [string, string][] = [
	["--cf-px", "Gutter (16 px < 768)"],
	["--cf-pad", "Padding de card"],
	["--cf-pad-lg", "Padding grande"],
	["--cf-section-gap", "Ritmo de seção interna"],
	["--cf-section", "Ritmo entre seções"],
	["--cf-header-h", "Cabeçalho"],
	["--cf-btn", "Botão grande (50 px)"],
	["--cf-btn-sm", "Botão (44 px, alvo mínimo)"],
	["--cf-corner", "Quadradinho de canto"],
	["--cf-reading", "Coluna de leitura"],
	["--cf-container", "Largura de seção"],
];

const TYPE: [string, string][] = [
	["--cf-h1", "Título de página (h1)"],
	["--cf-h2", "Título de seção (h2)"],
	["--cf-h3", "Título de card (h3)"],
	["--cf-sub", "Lead"],
	["--cf-body", "Corpo de leitura"],
];

const FAMILIES = ["brand", "attention", "critical"] as const;
const ROLES = ["subtle", "soft", "default", "strong"] as const;
const FAMILY_LABEL = { brand: "Informação", attention: "Atenção", critical: "Crítico" } as const;
const CHARTS = [1, 2, 3, 4, 5].map((n) => `--chart-${n}`);
const GRAPH: [string, string][] = [
	["--graph-node-bg", "Fundo do nó"],
	["--graph-node-border", "Contorno do nó"],
	["--graph-node-border-selected", "Nó selecionado"],
	["--graph-node-text", "Rótulo do nó"],
	["--graph-edge", "Aresta"],
	["--graph-edge-active", "Aresta destacada"],
];

const COLOR_TOKENS = [
	...COLORS.map(([t]) => t),
	...FAMILIES.flatMap((f) => ROLES.map((r) => `--color-${f}-${r}`)),
	...CHARTS,
	...GRAPH.map(([t]) => t),
];
const OTHER_TOKENS = [...RADII, ...SIZES, ...TYPE].map(([t]) => t).concat(["--cf-font", "--cf-mono", "--cf-measure"]);

/* ------------------------------------------------------------------ plain text (ADR-05; IDs usados em tests/plain.spec.ts) */

const orgchart = `FASE 01
│
├── 01. ENTRADA / PLANEJAMENTO
│   │
│   ├── 01.01 Plano / Campanha
│   │   ├── definir tema
│   │   ├── definir estrutura
│   │   ├── definir objetivo
│   │   └── definir diretrizes
│   │
│   └── 01.02 Pesquisa de Insumos
│       ├── documentos
│       ├── artigos
│       ├── referências
│       ├── imagens
│       └── vídeos
│
└── 02. PESQUISA / COLETA
    ├── 02.01 Executar pesquisa
    └── 02.02 Registrar na base`;
const flowchart = `A0
│
▼
A1
│
▼
A2
│   aprovação humana
▼
A3
│
▼
A4
    executar
    verificar
    evidenciar`;
const treeFromJson = renderTree({
	label: "RELATÓRIO",
	children: [
		{ label: "MARKDOWN NORMAL", children: [{ label: "títulos" }, { label: "parágrafos" }, { label: "listas" }, { label: "tabelas" }] },
		{ label: "PLAIN TEXT PANEL", children: [{ label: "instrução" }, { label: "procedimento" }, { label: "definição" }, { label: "evidência" }] },
		{ label: "ASCII DIAGRAM", children: [{ label: "flowchart" }, { label: "organograma" }, { label: "arquitetura" }] },
	],
});
const wide = `ENTRADA ──► TRIAGEM ──► PESQUISA ──► ESTRUTURA ──► REDAÇÃO ──► REVISÃO TÉCNICA ──► REVISÃO EDITORIAL ──► PUBLICAÇÃO ──► MEDIÇÃO ──► APRENDIZADO`;
const PANELS = [
	{
		kind: "instruction",
		title: "Instrução",
		source: `Não iniciar workflows novos diretamente em A3 ou A4.
Sequência inicial:
1. definir escopo;
2. identificar ferramentas;
3. mapear permissões;
4. executar em A1/A2;
5. ampliar autonomia somente após validação.`,
	},
	{
		kind: "definition",
		title: "Definição",
		source: `A0  ORIENTAR
    nenhuma ação externa
A1  PREPARAR
    gera plano ou artefato
A2  HUMAN-IN-THE-LOOP
    humano autoriza execução`,
	},
	{
		kind: "status",
		title: "Estado",
		source: `ID        STAGE      STATUS
HKW-01    Bootstrap  VERIFIED
HKW-02    Inventory  VERIFIED
HKW-03    Mapping    BLOCKED`,
	},
	{
		kind: "decision",
		title: "Decisão",
		source: `DECISÃO   ADOTADA
DATA      2026-10-06
ESCOPO    painéis e diagramas na pele do RC-DS-CF
MOTIVO    conteúdo copiável, pesquisável e acessível`,
	},
] as const;
const longText = `Este painel demonstra a regra do anexo A, seção 6: o texto operacional usa a mesma superfície dos diagramas, mas quebra a linha automaticamente para que a leitura no celular não dependa de rolagem horizontal. Identificadores longos como REPORT-GENERATOR-CONTRACT-001/REGRA-06/texto-longo-sem-espacos-para-testar-quebra também quebram sem estourar o layout.

As quebras de linha e os espaços do autor continuam preservados:
    - item recuado
    - outro item recuado`;

/* ------------------------------------------------------------------ dados de exemplo (rotulados) */

const TABLE_HEAD = ["Componente", "Classe", "Variantes", "Estado"];
const TABLE_ROWS = [
	["Botão", <code key="c">ds-btn</code>, "primary, outline, ghost; lg", "Pronto"],
	["Card", <code key="c">ds-card</code>, "cell, panel; lg", "Pronto"],
	["Chips", <code key="c">ds-chips</code>, "atual, contagem, em preparação", "Pronto"],
	["Painel plain text", <code key="c">ds-panel</code>, "definição, instrução, estado", "Pronto"],
];

const SOLUTION = SOLUTIONS[0];

/* ------------------------------------------------------------------ página */

function Section({ id, label, heading, lead, children }: { id: string; label: string; heading: string; lead: string; children: ReactNode }) {
	return (
		<section id={id} className="ds-showroom-section" aria-labelledby={`${id}-titulo`} data-showroom-section={id}>
			<SectionHead id={`${id}-titulo`} label={label} heading={heading} lead={lead} align="left" />
			{children}
		</section>
	);
}

export default function DesignSystem() {
	const [confirmed, setConfirmed] = useState<string | null>(null);
	const [name, setName] = useState("");
	const nameError = name.length > 0 && name.trim().length < 3 ? "O nome está curto demais. Ele aparece no cabeçalho do relatório. Use ao menos 3 letras." : undefined;

	return (
		<DefaultLayout>
			<div className="ds-page" data-showroom>
				<PageHead
					crumbs={[{ label: "Painel", href: "/admin/" }, { label: "Design System" }]}
					eyebrow="Painel · RC-DS-CF"
					title="Design System"
					lead="Tokens, componentes, variantes e estados do design system do site, com notas de acessibilidade e do/don't. Os valores e o contraste são calculados no tema atual."
					notice="Showroom vivo do design system novo (DS-CF-001): todo exemplo usa os componentes reais."
					actions={
						<Button href="/admin/rotas/" variant="outline">
							Ver as rotas do site
						</Button>
					}
				/>

				<TokenProvider names={OTHER_TOKENS} colors={COLOR_TOKENS}>
					<div className="ds-container grid gap-10 pb-24 min-[1100px]:grid-cols-[220px_minmax(0,1fr)]">
						<Toc items={SECTIONS} />
						<div className="min-w-0">
							{/* ------------------------------------------------------------ tokens */}
							<Section id="tokens" label="Fundação" heading="Tokens" lead="Fonte única no bloco RC-DS-CF do global.css. Valores lidos do navegador; troque o tema para ver o escuro.">
								<Specimen
									id="tokens-cor"
									name="Cores"
									api="--cf-*"
									a11y={["Texto de leitura ≥ 4,5:1; texto grande e não texto ≥ 3:1.", "A borda é estrutural (≈ 1,1:1): nunca carrega estado sozinha."]}
									dos={["Usar var(--cf-*) em componentes e rotas.", "Usar --cf-accent-text para o acento como texto."]}
									donts={["Escrever hex em TSX ou em ds-*.css.", "Pôr texto pequeno branco sobre o laranja."]}
								>
									<div className="ds-swatches" data-testid="cf-colors">
										{COLORS.map(([t, role, on]) => (
											<Swatch key={t} token={t} role={role} contrastOn={on} />
										))}
									</div>
								</Specimen>

								<Specimen
									id="tokens-contraste"
									name="Pares de contraste"
									api="WCAG 2.2 AA · calculado no tema atual"
									lead="Cada par é resolvido para sRGB no navegador (inclusive oklch no escuro) e comparado com o mínimo do uso."
									a11y={["O resultado é texto (AA ou Abaixo do mínimo), não só cor.", "A tabela empilha no celular em células rotuladas."]}
									dos={["Conferir aqui um par novo antes de usá-lo."]}
									donts={["Usar branco sobre o acento em texto menor que 24 px."]}
								>
									<div data-testid="contrast-pairs">
										<ContrastTable pairs={PAIRS} />
									</div>
								</Specimen>

								<Specimen
									id="tokens-forma"
									name="Raios"
									api="--cf-radius-sm · md · lg · pill"
									a11y={["Raio não comunica estado."]}
									dos={["Pílula só em botão e pílula; md em painel e campo."]}
									donts={["Misturar raios diferentes no mesmo grupo de cards."]}
								>
									<div className="ds-swatches" data-testid="cf-radii">
										{RADII.map(([t, role]) => (
											<Swatch key={t} token={t} role={role} kind="radius" />
										))}
									</div>
								</Specimen>

								<Specimen
									id="tokens-tipo"
									name="Tipografia"
									api="--cf-font (Hanken Grotesk) · --cf-mono (IBM Plex Mono)"
									a11y={["Linhas de leitura até 68ch (--cf-measure).", "Mono só em rótulos técnicos e IDs, nunca em prosa."]}
									dos={["Usar a escala --cf-h1…--cf-body; ela encolhe abaixo de 768 px."]}
									donts={["Escrever parágrafo em fonte mono."]}
								>
									<div data-testid="cf-type">
										{TYPE.map(([t, role]) => (
											<div key={t} className="ds-type-sample" data-type-token={t}>
												<span style={{ fontSize: `var(${t})` }}>{role}</span>
												<span className="ds-swatch-name">
													{t} · <TokenValue name={t} />
												</span>
											</div>
										))}
										<div className="ds-type-sample" data-type-token="--cf-mono">
											<span style={{ fontFamily: "var(--cf-mono)", fontSize: 14, fontWeight: 400 }} data-mono-sample>
												RC-DS-CF-001 · 2026-10-06
											</span>
											<span className="ds-swatch-name">
												--cf-mono · <TokenValue name="--cf-mono" />
											</span>
										</div>
									</div>
								</Specimen>

								<Specimen
									id="tokens-espaco"
									name="Espaçamento e medidas"
									api="--cf-px · --cf-pad · --cf-section · --cf-btn …"
									a11y={["--cf-btn-sm (44 px) é o alvo de toque mínimo (accessibility-review)."]}
									dos={["Usar o ritmo --cf-section entre seções e --cf-section-gap dentro de páginas internas."]}
									donts={["Criar espaçamento de seção novo em px literal."]}
								>
									<div className="ds-swatches" data-testid="cf-sizes">
										{SIZES.map(([t, role]) => (
											<Swatch key={t} token={t} role={role} kind="size" />
										))}
									</div>
								</Specimen>
							</Section>

							{/* ------------------------------------------------------------ camadas semânticas */}
							<Section
								id="camadas"
								label="Exceções do ADR-26"
								heading="Camadas semânticas"
								lead="Cores que codificam significado, não identidade. Aqui aparecem só como amostra de token; os componentes vivem nas rotas que as usam."
							>
								<Specimen
									id="camadas-callout"
									name="Famílias de estado"
									api="--color-{brand,attention,critical}-{subtle,soft,default,strong}"
									lead="Estados de informação, atenção e erro (ex.: mensagem de erro de campo em --color-critical-default)."
									a11y={["Estado sempre com texto ou ícone rotulado, nunca só cor."]}
									dos={["Usar a família critical para erro e attention para aviso."]}
									donts={["Usar uma família de estado como cor de marca ou de destaque."]}
								>
									{FAMILIES.map((f) => (
										<div key={f} className="mb-6" data-layer-family={f}>
											<p className="ds-label" style={{ marginBottom: 8 }}>
												{FAMILY_LABEL[f]} · {f}
											</p>
											<div className="ds-layer-family">
												{ROLES.map((r) => (
													<Swatch key={r} token={`--color-${f}-${r}`} role={r} />
												))}
											</div>
										</div>
									))}
								</Specimen>

								<Specimen
									id="camadas-graficos"
									name="Séries de gráfico"
									api="--chart-1 … --chart-5 (ADR-04)"
									a11y={["Cada série ≥ 3:1 sobre o fundo; séries também se distinguem por legenda e traço."]}
									dos={["Usar var(--chart-N) em gráficos."]}
									donts={["Distinguir séries só por cor."]}
								>
									<div className="ds-swatches" data-testid="chart-palette">
										{CHARTS.map((t, i) => (
											<Swatch key={t} token={t} role={["Série principal", "Segunda série", "Terceira série / risco", "Série única clara", "Meta e referência"][i]} contrastOn="--cf-bg" />
										))}
									</div>
								</Specimen>

								<Specimen
									id="camadas-grafo"
									name="Grafo causal"
									api="--graph-* (ADR-19)"
									a11y={["Nó e aresta têm rótulo em texto; seleção não depende só da cor."]}
									dos={["Usar --graph-* só no canvas do mapa."]}
									donts={["Reaproveitar --graph-* fora do mapa."]}
								>
									<div className="ds-swatches" data-testid="graph-tokens">
										{GRAPH.map(([t, role]) => (
											<Swatch key={t} token={t} role={role} />
										))}
									</div>
									<p className="ds-more" style={{ marginTop: 0 }}>
										<MoreLink href="/mapas/">Ver o grafo no Mapa</MoreLink>
									</p>
								</Specimen>

								<Specimen
									id="camadas-artefatos"
									name="Folha A4 e card de solução"
									api="prisma-sheet* / --ps-* · solution-*"
									lead="Artefatos com pele própria: a folha A4 é sempre clara (impressão) e o card 2×2 usa os quadrantes semânticos do ADR-24."
									a11y={["Cada quadrante do card tem número e rótulo em texto.", "A folha A4 mantém contraste no tema escuro porque não muda de tema."]}
									dos={["Ver e testar esses artefatos nas rotas reais."]}
									donts={["Copiar a pele da folha ou do card para outros componentes."]}
								>
									<CardGrid cols={2} label="Artefatos com pele própria" gap>
										<Card href="/prisma/" variant="panel" eyebrow="Folha A4" title="Prisma" text="Formulário guiado que gera a folha A4 para imprimir ou salvar em PDF." cta="Abrir o Prisma" />
										{SOLUTION && (
											<Card
												href={`/ferramentas/solucoes/${SOLUTION.slug}/`}
												variant="panel"
												eyebrow="Card de solução"
												title={SOLUTION.name}
												text="Card 2×2 com dor, solução, passos e progresso."
												cta="Abrir a solução"
											/>
										)}
									</CardGrid>
								</Specimen>
							</Section>

							{/* ------------------------------------------------------------ botões */}
							<Section id="botoes" label="Ação" heading="Botões e links" lead="Pílula de 44 px (50 px no tamanho lg). O rótulo começa com verbo.">
								<Specimen
									id="botoes-button"
									name="Button"
									api='<Button variant="primary | outline | ghost" size="lg" href? />'
									a11y={[
										"Com href vira <a>; sem href, <button type=button>.",
										"Alvo ≥ 44 px; foco com anel --cf-focus de 3 px.",
										"Primário: texto --cf-on-accent-ink sobre o acento (4,95:1).",
									]}
									dos={["Um único primário por grupo de ações.", "Rótulo com verbo: “Abrir o Mapa”."]}
									donts={["Usar Button para navegação de texto corrido (use MoreLink).", "Rótulos genéricos como “Clique aqui”."]}
								>
									<Stage>
										<Variant label="primary · padrão">
											<Button>Salvar alterações</Button>
										</Variant>
										<Variant label="primary · hover">
											<Button data-force="hover">Salvar alterações</Button>
										</Variant>
										<Variant label="primary · foco">
											<Button data-force="focus">Salvar alterações</Button>
										</Variant>
										<Variant label="primary · disabled">
											<Button disabled>Salvar alterações</Button>
										</Variant>
										<Variant label="outline">
											<Button variant="outline">Ver detalhes</Button>
											<Button variant="outline" data-force="hover">
												Ver detalhes
											</Button>
										</Variant>
										<Variant label="ghost">
											<Button variant="ghost">Cancelar</Button>
										</Variant>
										<Variant label="lg · link (href)">
											<Button href="#botoes" size="lg">
												Abrir o showroom <ArrowRight size={18} aria-hidden="true" />
											</Button>
										</Variant>
									</Stage>
								</Specimen>

								<Specimen
									id="botoes-morelink"
									name="MoreLink"
									api='<MoreLink href /> · .ds-link ("Saiba mais ›")'
									a11y={["Texto do link diz o destino; o chevron é decorativo.", "Altura mínima de 44 px."]}
									dos={["Fechar seção com um “Saiba mais ›” para a página completa."]}
									donts={["Usar MoreLink como ação primária."]}
								>
									<Stage>
										<Variant label="padrão">
											<MoreLink href="#botoes">Ver todas as ferramentas</MoreLink>
										</Variant>
									</Stage>
								</Specimen>
							</Section>

							{/* ------------------------------------------------------------ cards */}
							<Section id="cards" label="Conteúdo" heading="Cards e quadros" lead="Um card para artigo, ferramenta, função e prévia. O título é o link e a área clicável cobre o card.">
								<Specimen
									id="cards-card"
									name="Card e CardGrid"
									api='<CardGrid cols={2|3|4} gap?><Card variant="cell | panel" size="lg" … /></CardGrid>'
									a11y={[
										"Título em h3 com o link; um só alvo por card.",
										"O selo “Demonstração” é texto, não só cor.",
										"CTA visual (“Ler artigo ›”) é aria-hidden: o nome acessível é o título.",
									]}
									dos={["Usar cell dentro de CardGrid e panel em card solto.", "Rotular item fictício com Badge demo."]}
									donts={["Pôr botões ou links extras dentro do card (o link do título cobre a área).", "Card com CTA para #."]}
								>
									<CardGrid cols={3} label="Variantes de card">
										<Card href="#cards" eyebrow="cell · padrão" title="Card em célula de quadro" text="Sem borda própria; separado por linha do quadro." cta="Abrir" icon={<BookOpen size={24} strokeWidth={1.6} />} />
										<Card
											href="#cards"
											eyebrow="cell · com meta"
											title="Card com meta e selo"
											text="Meta em texto secundário e selo de demonstração."
											meta="6 min de leitura"
											badge={<Badge variant="demo">Demonstração</Badge>}
											cta="Ler artigo"
											icon={<Brain size={24} strokeWidth={1.6} />}
										/>
										<Card eyebrow="cell · sem link" title="Card sem link" text="Sem href não há hover nem CTA: é só conteúdo." icon={<Wrench size={24} strokeWidth={1.6} />} />
									</CardGrid>
									<CardGrid cols={2} label="Card grande e painel" gap>
										<Card href="#cards" variant="panel" size="lg" eyebrow="panel · lg" title="Card grande para o destaque" text="Usado no primeiro item de uma lista editorial." cta="Ler artigo" />
										<Card href="#cards" variant="panel" eyebrow="panel" title="Card painel" text="Borda --cf-border, raio md; hover em --cf-bg-300." cta="Abrir" />
									</CardGrid>
								</Specimen>

								<Specimen
									id="cards-frame"
									name="Frame e colunas"
									api="<Frame> · .ds-corner · .ds-cols / .ds-col"
									a11y={["Cantos são decorativos (aria-hidden).", "Cada coluna tem h3."]}
									dos={["Usar Frame para agrupar conteúdo relacionado com a moldura da referência."]}
									donts={["Aninhar quadros dentro de quadros."]}
								>
									<Frame>
										<div className="ds-cols" style={{ marginTop: 0 }}>
											{["Entenda", "Estruture", "Execute"].map((t, i) => (
												<a key={t} href="#cards" className="ds-col">
													<h3>
														<span className="ds-col-n">0{i + 1}</span> {t}
													</h3>
													<p>Coluna de exemplo com título e texto curto.</p>
												</a>
											))}
										</div>
									</Frame>
								</Specimen>
							</Section>

							{/* ------------------------------------------------------------ navegação */}
							<Section id="navegacao" label="Orientação" heading="Navegação" lead="Trilha, facetas, abas e sumário.">
								<Specimen
									id="navegacao-breadcrumb"
									name="Breadcrumb"
									api="<Breadcrumb items={[{label, href?}]} />"
									a11y={['nav[aria-label="Trilha"] + ol; o último item tem aria-current="page".', "Separador › decorativo."]}
									dos={["Pôr a trilha antes do h1."]}
									donts={["Repetir a trilha no rodapé."]}
								>
									<Stage cols={1}>
										<Variant label="três níveis">
											<Breadcrumb items={[{ label: "Início", href: "/" }, { label: "Blog", href: "/artigos/" }, { label: "Artigo atual" }]} />
										</Variant>
									</Stage>
								</Specimen>

								<Specimen
									id="navegacao-chips"
									name="Chips"
									api="<Chips label items={[{label, href?, count?, current?, soon?}]} />"
									a11y={['Atual com aria-current="true" (texto, não só cor).', "“Em preparação” não é link nem aria-disabled.", "Alvo ≥ 44 px."]}
									dos={["Mostrar a contagem quando houver itens."]}
									donts={["Criar link para faceta sem conteúdo."]}
								>
									<Stage cols={1}>
										<Variant label="atual · contagem · em preparação">
											<Chips
												label="Temas de exemplo"
												items={[
													{ label: "Todos", href: "#navegacao", current: true },
													{ label: "Memória de trabalho", href: "#navegacao", count: 1 },
													{ label: "Flexibilidade", soon: true },
												]}
											/>
										</Variant>
									</Stage>
								</Specimen>

								<Specimen
									id="navegacao-tabs"
									name="Tabs"
									api="<Tabs label items={[{value, label, content}]} /> (Radix só pelo comportamento)"
									a11y={["role=tablist com setas, Home/End e aria-controls.", "Só a aba selecionada fica no Tab."]}
									dos={["Usar abas para recortes do mesmo conteúdo."]}
									donts={["Esconder em aba o que o leitor precisa comparar lado a lado."]}
								>
									<Stage cols={1}>
										<div data-testid="tabs-demo">
											<Tabs
												label="Recorte de exemplo"
												items={[
													{ value: "brasil", label: "Brasil", content: <p>Conteúdo da aba Brasil.</p> },
													{ value: "mundo", label: "Mundo", content: <p>Conteúdo da aba Mundo.</p> },
													{ value: "metodo", label: "Método", content: <p>Conteúdo da aba Método.</p> },
												]}
											/>
										</div>
									</Stage>
								</Specimen>

								<Specimen
									id="navegacao-toc"
									name="Toc"
									api="<Toc items={[{id, label}]} />"
									lead="O sumário desta página (ao lado no desktop, recolhido no celular) é o próprio componente."
									a11y={['nav[aria-label="Nesta página"] com details/summary nativos.', "Links de 44 px."]}
									dos={["Gerar os itens dos h2 do conteúdo."]}
									donts={["Usar mais de um Toc por página."]}
								>
									<p className="ds-more" style={{ marginTop: 0 }}>
										<MoreLink href="#tokens">Ir para o início do sumário</MoreLink>
									</p>
								</Specimen>
							</Section>

							{/* ------------------------------------------------------------ cabeçalhos */}
							<Section id="cabecalhos" label="Estrutura" heading="Cabeçalhos e avisos" lead="Um h1 por página (PageHead), h2 por seção (SectionHead).">
								<Specimen
									id="cabecalhos-pagehead"
									name="PageHead"
									api="<PageHead eyebrow title lead actions crumbs notice align />"
									lead="O cabeçalho no topo desta página é o PageHead: trilha, aviso, eyebrow, h1, lead e ações."
									a11y={["Um único h1 por página.", "Trilha antes do aviso e do título."]}
									dos={["Usar em toda página interna (admin incluído)."]}
									donts={["Usar o cartão laranja como cabeçalho de página interna."]}
								>
									<p className="ds-more" style={{ marginTop: 0 }}>
										<MoreLink href="#leitura">Ver o topo desta página como exemplo</MoreLink>
									</p>
								</Specimen>

								<Specimen
									id="cabecalhos-sectionhead"
									name="SectionHead"
									api='<SectionHead id label? heading lead? size="md | lg" align="center | left" />'
									a11y={["h2 com id para aria-labelledby da seção.", "Rótulo (ds-label) é texto antes do h2."]}
									dos={["Alinhar à esquerda em páginas internas."]}
									donts={["Pular de h1 para h3."]}
								>
									<Stage cols={1}>
										<Variant label="md · left (o desta seção)">
											<p className="ds-label">Rótulo</p>
										</Variant>
										<Variant label="eyebrow">
											<p className="ds-eyebrow" style={{ marginBottom: 0 }}>
												Painel · Exemplo
											</p>
										</Variant>
									</Stage>
								</Specimen>

								<Specimen
									id="cabecalhos-notice"
									name="DemoNotice"
									api="<DemoNotice>frase curta</DemoNotice> · .ds-notice"
									a11y={['role="note"; o rótulo “Layout demonstrativo” é texto.']}
									dos={["Dizer em uma frase o que é demonstração e o que é real."]}
									donts={["Usar o aviso para mensagens de erro."]}
								>
									<Stage cols={1}>
										<Variant label="padrão">
											<DemoNotice>Esta seção mostra o aviso fora do cabeçalho.</DemoNotice>
										</Variant>
									</Stage>
								</Specimen>
							</Section>

							{/* ------------------------------------------------------------ laranja */}
							<Section id="laranja" label="Identidade" heading="Cartão laranja" lead="Reservado às homes (hero) e ao CTA final. Branco só em título grande; o resto em --cf-on-accent-ink.">
								<Specimen
									id="laranja-cta"
									name="CTA, pílula, botões brancos e letreiro"
									api=".ds-cta · .ds-pill · .ds-btn-white · .ds-btn-soft · .ds-ticker · .ds-disclaimer"
									lead="O hero (.ds-hero) tem a mesma pele e o h1 da Home; veja na página inicial."
									a11y={[
										"Título branco ≥ 24 px (3,05:1, texto grande).",
										"Foco no laranja com anel --cf-on-accent-ink.",
										"O letreiro para com prefers-reduced-motion; a 2ª faixa é aria-hidden.",
									]}
									dos={["Um CTA laranja por página, no fim."]}
									donts={["Lead ou botão com texto branco sobre o laranja.", "Usar o laranja como fundo de página interna."]}
								>
									<div className="ds-cta" data-testid="orange-cta">
										<div className="ds-cta-content" style={{ paddingBlock: 64 }}>
											<a href="#laranja" className="ds-pill">
												<span>Pílula sobre o laranja</span>
												<span className="ds-pill-arrow" aria-hidden="true">
													<ArrowRight size={18} />
												</span>
											</a>
											<h4 style={{ marginTop: 24, color: "var(--cf-on-accent)", fontSize: "var(--cf-h2)", lineHeight: 1, fontWeight: 500, letterSpacing: "-0.025em" }} data-large-white>
												Título grande em branco
											</h4>
											<p>Texto pequeno em --cf-on-accent-ink sobre o acento.</p>
											<div className="ds-cta-actions">
												<a href="#laranja" className="ds-btn-white">
													Abrir o Mapa
												</a>
												<a href="#laranja" className="ds-btn-soft">
													Conhecer o método
												</a>
											</div>
										</div>
										<div className="ds-ticker" aria-label="Exemplo de letreiro">
											<ol className="ds-ticker-track">
												{["Entenda", "Estruture", "Execute"].map((s) => (
													<li key={s}>{s}</li>
												))}
											</ol>
											<ol className="ds-ticker-track" aria-hidden="true">
												{["Entenda", "Estruture", "Execute"].map((s) => (
													<li key={s}>{s}</li>
												))}
											</ol>
										</div>
									</div>
									<p className="ds-disclaimer">Nota curta abaixo do cartão (.ds-disclaimer).</p>
									<p className="ds-more" style={{ marginTop: 0 }}>
										<MoreLink href="/">Ver o hero na Home</MoreLink>
									</p>
								</Specimen>
							</Section>

							{/* ------------------------------------------------------------ conteúdo */}
							<Section id="leitura" label="Leitura" heading="Conteúdo de leitura" lead="Corpo de artigo, citação, listas, meta, pontos principais e perguntas frequentes.">
								<Specimen
									id="conteudo-prose"
									name="Prose"
									api=".ds-prose (artigo) · .ds-prose-block (texto institucional)"
									a11y={["Medida de 68ch.", "Links sublinhados em --cf-accent-text.", "Citação com régua de acento e fonte em texto."]}
									dos={["Envolver o MDX em ArticleBody."]}
									donts={["Pôr prosa em fonte mono ou em caixa alta."]}
								>
									<div className="ds-prose" data-testid="prose-sample">
										<h4 style={{ fontSize: 22, fontWeight: 500 }}>Subtítulo do corpo (h3 no artigo)</h4>
										<p>
											Parágrafo de 18 px com <strong>destaque</strong> e um <a href="#leitura">link no texto</a>. A linha não passa de 68 caracteres
											para manter a leitura confortável.
										</p>
										<ul>
											<li>Item de lista com marcador.</li>
											<li>Segundo item de lista.</li>
										</ul>
										<blockquote>
											<p>Citação de exemplo com a régua de acento à esquerda.</p>
										</blockquote>
									</div>
								</Specimen>

								<Specimen
									id="conteudo-quote"
									name="Citação com fonte"
									api=".ds-quote (figure + blockquote + figcaption)"
									a11y={["A fonte é link em figcaption.", "Aspas decorativas são aria-hidden."]}
									dos={["Citar dado com fonte primária."]}
									donts={["Citação sem fonte."]}
								>
									<figure className="ds-quote" style={{ marginBlock: 0 }}>
										<blockquote>
											<p>
												<span aria-hidden="true">“ </span>
												<strong>Dado em destaque</strong> e o resto da frase da citação de exemplo.
												<span aria-hidden="true"> ”</span>
											</p>
										</blockquote>
										<figcaption>
											<a href="/fontes/">Fonte de exemplo (ver /fontes/)</a>
										</figcaption>
									</figure>
									<p className="ds-more" style={{ marginTop: 0 }}>
										<MoreLink href="/sobre/">Ver ds-compare, ds-diagram e ds-bento em Sobre</MoreLink>
									</p>
								</Specimen>

								<Specimen
									id="conteudo-meta"
									name="ArticleMeta, lista e definições"
									api="<ArticleMeta publisher date minutes id /> · .ds-list · .ds-dl"
									a11y={["Meta em dl; tempo como “N min de leitura”.", "ID em mono (rótulo técnico)."]}
									dos={["Calcular o tempo de leitura (palavras ÷ 200)."]}
									donts={["Inventar autor ou data."]}
								>
									<Stage>
										<Variant label="ArticleMeta">
											<ArticleMeta publisher="Risco Cognitivo" date="2026-10-06" minutes={6} id="RC-EXEMPLO-001" />
										</Variant>
										<Variant label="ds-dl">
											<dl className="ds-dl">
												<div>
													<dt>Termo</dt>
													<dd>Definição curta do termo.</dd>
												</div>
												<div>
													<dt>Outro termo</dt>
													<dd>Outra definição.</dd>
												</div>
											</dl>
										</Variant>
										<Variant label="ds-list">
											<ul className="ds-list" style={{ width: "100%" }}>
												<li>Primeiro item da lista com divisória.</li>
												<li>Segundo item.</li>
											</ul>
										</Variant>
									</Stage>
								</Specimen>

								<Specimen
									id="conteudo-keypoints"
									name="KeyPoints e Faq"
									api="<KeyPoints items /> · <Faq items={[{q, a}]} />"
									lead="Só aparecem quando o conteúdo existe no texto; aqui com texto de exemplo rotulado."
									a11y={["KeyPoints é aside com h2.", "Faq usa details/summary nativos (teclado sem JS)."]}
									dos={["Tirar os pontos do próprio texto."]}
									donts={["Inventar perguntas que o texto não responde."]}
								>
									<KeyPoints items={["Exemplo: primeiro ponto principal.", "Exemplo: segundo ponto principal."]} />
									<Faq items={[{ q: "Pergunta de exemplo?", a: <p>Resposta de exemplo, aberta e fechada pelo teclado.</p> }]} />
								</Specimen>
							</Section>

							{/* ------------------------------------------------------------ formulários */}
							<Section id="formularios" label="Entrada" heading="Formulários" lead="Rótulo explícito, ajuda e erro ligados por aria-describedby; 44 px; erro na família critical.">
								<Specimen
									id="formularios-field"
									name="Field, Input, Textarea, Select e Check"
									api="<Field label help? error?>{({id, describedBy, invalid}) => <Input … />}</Field>"
									a11y={["label for explícito.", "Ajuda e erro em aria-describedby; aria-invalid no erro.", "Erro diz o quê, por quê e como resolver."]}
									dos={["Validar ao sair do campo e explicar a correção."]}
									donts={["Usar placeholder como rótulo.", "Mostrar erro só com borda vermelha."]}
								>
									<Stage>
										<Variant label="padrão · com ajuda">
											<Field label="Nome do relatório" help="Aparece no cabeçalho. Digite menos de 3 letras para ver o erro." error={nameError}>
												{({ id, describedBy, invalid }) => (
													<Input id={id} aria-describedby={describedBy} aria-invalid={invalid || undefined} value={name} onChange={(e) => setName(e.target.value)} data-field="nome" />
												)}
											</Field>
										</Variant>
										<Variant label="erro">
											<Field label="E-mail" error="O e-mail está sem @. Ele é usado para enviar o relatório. Confira o endereço.">
												{({ id, describedBy, invalid }) => <Input id={id} type="email" aria-describedby={describedBy} aria-invalid={invalid} defaultValue="nome.exemplo" data-field="erro" />}
											</Field>
										</Variant>
										<Variant label="disabled">
											<Field label="Código (gerado)">
												{({ id }) => <Input id={id} defaultValue="RC-0001" disabled />}
											</Field>
										</Variant>
										<Variant label="Textarea">
											<Field label="Observações">
												{({ id }) => <Textarea id={id} defaultValue="" />}
											</Field>
										</Variant>
										<Variant label="Select">
											<Field label="Tema">
												{({ id }) => (
													<Select id={id} defaultValue="memoria">
														<option value="memoria">Memória de trabalho</option>
														<option value="inibicao">Controle inibitório</option>
													</Select>
												)}
											</Field>
										</Variant>
										<Variant label="Check">
											<Check label="Salvar neste dispositivo" />
										</Variant>
									</Stage>
								</Specimen>

								<Specimen
									id="formularios-dialog"
									name="ConfirmDialog"
									api="<ConfirmDialog trigger title text confirm cancel onConfirm />"
									a11y={["Foco preso no diálogo; Esc fecha e devolve o foco ao gatilho.", "Botões rotulados pela ação, não “OK/Cancelar”."]}
									dos={["Pedir confirmação só para ação destrutiva."]}
									donts={["Abrir diálogo sem ação do usuário."]}
								>
									<Stage cols={1}>
										<Variant label="gatilho · resultado">
											<ConfirmDialog
												trigger={<Button variant="outline">Limpar dados de exemplo</Button>}
												title="Limpar os dados de exemplo?"
												text="Os campos desta seção voltam ao estado inicial. Nada fora do showroom muda."
												confirm="Limpar dados"
												cancel="Manter dados"
												onConfirm={() => {
													setName("");
													setConfirmed("Dados de exemplo limpos.");
												}}
											/>
											<span role="status" aria-live="polite" data-dialog-result>
												{confirmed}
											</span>
										</Variant>
									</Stage>
								</Specimen>
							</Section>

							{/* ------------------------------------------------------------ estados */}
							<Section id="estados" label="Feedback" heading="Estados e selos" lead="Estado vazio com caminho real, selos com texto e a faixa de pontos.">
								<Specimen
									id="estados-empty"
									name="EmptyState"
									api="<EmptyState title text action={{label, href}} level />"
									a11y={["Título em h2/h3; ação é link real."]}
									dos={["Dizer o quê, por quê e como começar."]}
									donts={["Estado vazio sem saída ou com CTA #."]}
								>
									<EmptyState
										level={3}
										title="Nenhum e-book publicado"
										text="Esta categoria ainda não tem material pronto. Comece pelas soluções publicadas."
										action={{ label: "Ver as soluções publicadas", href: "/ferramentas/solucoes/" }}
									/>
								</Specimen>

								<Specimen
									id="estados-badge"
									name="Badge e Dots"
									api='<Badge variant="neutral | accent | demo" /> · <Dots />'
									a11y={["Selo sempre com texto.", "Dots é decorativo (aria-hidden) e só aparece no celular."]}
									dos={["Usar demo para marcar item fictício."]}
									donts={["Usar badge como botão."]}
								>
									<Stage>
										<Variant label="neutral">
											<Badge>Rascunho</Badge>
										</Variant>
										<Variant label="accent">
											<Badge variant="accent">Novo</Badge>
										</Variant>
										<Variant label="demo">
											<Badge variant="demo">Demonstração</Badge>
										</Variant>
									</Stage>
									<Dots />
								</Specimen>
							</Section>

							{/* ------------------------------------------------------------ dados */}
							<Section id="dados" label="Dados" heading="Tabelas e dados" lead="Tabela com cabeçalho em caixa alta e linhas finas; no celular, células rotuladas.">
								<Specimen
									id="dados-table"
									name="Table"
									api='<Table head rows caption stack? /> · .ds-table[data-stack]'
									a11y={["caption (sr-only) e th scope=col.", "Empilhada abaixo de 640 px com data-label; sem rolagem lateral."]}
									dos={["Usar stack em tabela de leitura."]}
									donts={["Tabela larga que rola a página."]}
								>
									<div data-testid="table-reference">
										<Table caption="Componentes do DS (exemplo)" head={TABLE_HEAD} rows={TABLE_ROWS} />
									</div>
									<div className="mt-6" data-testid="table-fixed">
										<Table caption="Tabela sem empilhar (exemplo)" head={["Token", "Uso"]} rows={[[<code key="t">--cf-radius-md</code>, "Painel e campo"]]} stack={false} />
									</div>
								</Specimen>
							</Section>

							{/* ------------------------------------------------------------ plain */}
							<Section
								id="plain"
								label="ADR-05"
								heading="Plain text e diagramas"
								lead="PlainTextPanel e AsciiDiagram (@/components/plain) na pele do DS: texto copiável, pesquisável e acessível."
							>
								<Specimen
									id="plain-diagram"
									name="AsciiDiagram"
									api='<AsciiDiagram id kind title source caption? density? fontSize? />'
									a11y={["Região focável com rótulo (tipo + título); rola dentro do bloco.", "Copiar confirma por aria-live."]}
									dos={["Preservar a geometria (white-space: pre)."]}
									donts={["Desenhar diagrama em imagem, SVG ou Mermaid."]}
								>
									<div className="grid gap-6 lg:grid-cols-2" data-testid="plain-diagrams">
										<AsciiDiagram id="FLOW-OPS-001" kind="orgchart" title="Organograma OPS / CAVORK" source={orgchart} className="my-0" />
										<div className="flex min-w-0 flex-col gap-6">
											<AsciiDiagram id="FLOW-AUTONOMY-001" kind="flowchart" title="Progressão de autonomia" source={flowchart} className="my-0" />
											<AsciiDiagram
												id="TREE-REPORT-001"
												kind="tree"
												title="Gerado por renderTree(JSON)"
												source={treeFromJson}
												caption="Entrada JSON hierárquica; o componente desenha ├── └── │ de forma determinística."
												className="my-0"
											/>
										</div>
									</div>
									<AsciiDiagram id="FLOW-WIDE-001" kind="workflow" title="Diagrama largo · rolagem horizontal" source={wide} caption="Linhas largas rolam dentro do bloco; a página não ganha rolagem lateral." />
								</Specimen>

								<Specimen
									id="plain-panel"
									name="PlainTextPanel"
									api='<PlainTextPanel id kind title source collapsible? copyable? />'
									a11y={["Visão estruturada (dl, listas, tabela) na fonte de texto; o original fica em [data-plain-source].", "Sem rolagem lateral no celular."]}
									dos={["Usar kind para dizer o tipo do texto operacional."]}
									donts={["Prosa corrida em mono."]}
								>
									<div className="grid gap-6 lg:grid-cols-2" data-testid="plain-panels">
										{PANELS.map((p) => (
											<PlainTextPanel key={p.kind} id={`PANEL-${p.kind.toUpperCase()}-001`} kind={p.kind} title={p.title} source={p.source} className="my-0" />
										))}
									</div>
									<PlainTextPanel id="PANEL-LONG-001" kind="example" title="Texto longo" source={longText} />
									<div className="grid gap-6 lg:grid-cols-2" data-testid="plain-variants">
										<PlainTextPanel id="PANEL-COLLAPSIBLE-001" kind="data" title="collapsible" source={`Conteúdo em <details> nativo:\nabre e fecha sem JavaScript.`} collapsible className="my-0" />
										<PlainTextPanel id="PANEL-NOCOPY-001" kind="generic" title="copyable={false}" source={`Sem botão de copiar.\nO texto continua selecionável.`} copyable={false} className="my-0" />
									</div>
									<p className="ds-more">
										<MoreLink href="/admin/relatorio-exemplo/">Ver o relatório de exemplo</MoreLink>
									</p>
								</Specimen>
							</Section>
						</div>
					</div>
				</TokenProvider>
			</div>
		</DefaultLayout>
	);
}
