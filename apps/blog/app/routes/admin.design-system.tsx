import { ArrowRight, ChevronRight, CircleDot, Eye, FileText } from 'lucide-react';

import type { Route } from './+types/admin.design-system';

import { ComponentGallery } from '@/components/design-system/component-gallery';
import { DataGallery } from '@/components/design-system/data-gallery';
import { AsciiDiagram, PlainTextPanel, renderTree } from '@/components/plain';
import { buttonVariants } from '@/components/ui/button';
import { Callout } from '@/components/ui/callout';
import { CALLOUT_VARIANTS, CALLOUT_VARIANT_NAMES } from '@/components/ui/callout-registry';
import DefaultLayout from '@/layouts/DefaultLayout';
import { css } from '@/lib/css';
import { seo } from '@/lib/seo';
import { tokenValue } from '@/lib/tokens.server';
import { cn } from '@/lib/utils';

const ARTICLE = '/blog/do-risco-cognitivo-a-execucao-assistida/';
const sections = [
  { id: 'gramatica', label: 'Gramática visual' },
  { id: 'moodboard', label: 'Mood board' },
  { id: 'storyboard', label: 'Storyboard' },
  { id: 'tokens', label: 'Tokens' },
  { id: 'callouts', label: 'Callouts' },
  { id: 'dados', label: 'Dados e charts' },
  { id: 'plain', label: 'Plain text' },
  { id: 'componentes', label: 'Componentes' },
];
const families = ['brand', 'attention', 'critical'] as const;
const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const roles = ['subtle', 'soft', 'default', 'strong', 'on-strong'];
const neutrals = [
  ['background', '--background'],
  ['card', '--card'],
  ['muted', '--muted'],
  ['border', '--border'],
  ['muted-foreground', '--muted-foreground'],
  ['foreground', '--foreground'],
  ['primary (site)', '--primary'],
];
const surfaces = [
  { name: 'background', v: '--background', extra: true },
  { name: 'card', v: '--card', extra: true },
  { name: 'popover', v: '--popover', extra: true },
  { name: 'muted', v: '--muted', extra: false },
  { name: 'secondary', v: '--secondary', extra: false },
  { name: 'accent', v: '--accent', extra: false },
];
const textLadder = [
  ['foreground', '--foreground', 'títulos, valores, texto principal'],
  ['muted-foreground', '--muted-foreground', 'descrições, corpo secundário, eixos'],
  ['muted-foreground-subtle', '--muted-foreground-subtle', 'legendas, notas, carimbos de data — só sobre card/background/popover'],
];
const chartPalette = [
  ['chart-1', 'brand.default', 'série principal'],
  ['chart-2', 'attention.default', 'segunda série'],
  ['chart-3', 'critical.default', 'terceira série / risco'],
  ['chart-4', 'brand.500 (primitivo)', 'série única clara (radar, áreas)'],
  ['chart-5', 'muted-foreground', 'meta e referência (traço tracejado)'],
];
// ---- Plain text system (ADR-05 / ADR-BLOG-ASCII-001 + annex A)
const storeRows = [
  ['STORE_HEADER', 'StoreHeader (h1 + descrição + selo "Catálogo de exemplo")', 'components/store-header.tsx', 'texto fixo', 'READY'],
  ['SEARCH + FILTER', 'Input[type=search] + Select', 'store-header.tsx', 'q, area', 'READY'],
  ['TABS', 'Tabs em ScrollArea horizontal', 'components/store-catalog.tsx', 'ITEM_TYPES', 'READY'],
  ['CATEGORIAS', 'CategoryCard × tipos com itens', 'components/category-card.tsx', 'contagem por tipo', 'READY'],
  ['DESTAQUE', 'FeaturedItem', 'components/featured-item.tsx', 'item.featured', 'READY'],
  ['SKILLS + "Ver todas"', 'CatalogSection + SkillCard × 4', 'catalog-section.tsx, skill-card.tsx', 'type=skill', 'READY'],
  ['E-BOOKS + "Ver todos"', 'CatalogSection + VisualProductCard × 3', 'visual-product-card.tsx', 'type=ebook', 'READY'],
  ['(estados)', 'CatalogSkeleton / CatalogEmpty / CatalogError', 'catalog-states.tsx', 'status, resultados', 'LOADING/EMPTY/ERROR'],
];
const plainTokens = [
  ['--plain-surface', 'alias de --surface-default'],
  ['--plain-border', 'alias de --border-default'],
  ['--plain-text', 'alias de --foreground'],
  ['--plain-accent', 'var(--primary)'],
  ['--plain-accent-soft', 'var(--primary-soft)'],
  ['--plain-radius-desktop / mobile', '28px / 22px'],
  ['--plain-font', 'ui-monospace, SFMono-Regular, Menlo…'],
  ['--plain-font-size', 'clamp(0.875rem, 1.6vw, 1.125rem)'],
];
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
const treeJson = {
  label: 'RELATÓRIO',
  children: [
    { label: 'MARKDOWN NORMAL', children: [{ label: 'títulos' }, { label: 'parágrafos' }, { label: 'listas' }, { label: 'tabelas' }] },
    { label: 'PLAIN TEXT PANEL', children: [{ label: 'instrução' }, { label: 'procedimento' }, { label: 'definição' }, { label: 'evidência' }] },
    { label: 'ASCII DIAGRAM', children: [{ label: 'flowchart' }, { label: 'organograma' }, { label: 'arquitetura' }] },
  ],
};
const treeFromJson = renderTree(treeJson);
const directory = `src/
│
├── components/
│   └── plain/
│       ├── PlainSurface.tsx
│       ├── PlainTextPanel.tsx
│       ├── AsciiDiagram.tsx
│       ├── CopyButton.tsx
│       ├── plain.types.ts
│       ├── PlainSurface.css
│       ├── PlainTextPanel.css
│       ├── AsciiDiagram.css
│       └── index.ts
│
└── lib/
    └── plain/
        ├── normalizeText.ts
        ├── normalizeDiagram.ts
        ├── renderTree.ts
        ├── remarkPlain.ts
        ├── copy.ts
        └── types.ts`;
const mindmap = `                 ┌── definir problema
                 ├── decompor fatores
   RISCO ────────┤
   COGNITIVO     ├── medir exposição
                 └── registrar evidência
                 │
                 ▼
          PROCESSO NEUROADAPTATIVO`;
const wide = `ENTRADA ──► TRIAGEM ──► PESQUISA ──► ESTRUTURA ──► REDAÇÃO ──► REVISÃO TÉCNICA ──► REVISÃO EDITORIAL ──► PUBLICAÇÃO ──► MEDIÇÃO ──► APRENDIZADO`;
const panels = [
  { kind: 'instruction', title: 'Instrução', source: `Não iniciar workflows novos diretamente em A3 ou A4.
Sequência inicial:
1. definir escopo;
2. identificar ferramentas;
3. mapear permissões;
4. executar em A1/A2;
5. ampliar autonomia somente após validação.` },
  { kind: 'procedure', title: 'Procedimento', source: `01  abrir o briefing
02  listar insumos e fontes
03  validar critérios de conclusão
04  produzir o rascunho
05  registrar evidências da revisão` },
  { kind: 'definition', title: 'Definição', source: `A0  ORIENTAR
    nenhuma ação externa
A1  PREPARAR
    gera plano ou artefato
A2  HUMAN-IN-THE-LOOP
    humano autoriza execução` },
  { kind: 'decision', title: 'Decisão', source: `DECISÃO   ADOTADA
DATA      2026-09-30
ESCOPO    diagramas e textos operacionais do blog
MOTIVO    conteúdo copiável, pesquisável e acessível` },
  { kind: 'status', title: 'Estado', source: `STATUS              IMPLEMENTED
responsividade      OK
acessibilidade      OK
clipboard           OK
design tokens       OK` },
  { kind: 'evidence', title: 'Evidência', source: `teste     tests/plain.spec.ts
resultado aprovado
build     npm run build — sem erros
link      /admin/relatorio-exemplo` },
];
const longText = `Este painel demonstra a regra do anexo A, seção 6: o texto operacional usa a mesma superfície dos diagramas, mas quebra a linha automaticamente para que a leitura no celular não dependa de rolagem horizontal. Identificadores longos como REPORT-GENERATOR-CONTRACT-001/REGRA-06/texto-longo-sem-espacos-para-testar-quebra também quebram sem estourar o layout.

As quebras de linha e os espaços do autor continuam preservados:
    - item recuado
    - outro item recuado`;
const storyboard = [
  { n: '01', title: 'Blog — início', route: '/blog/', image: '/images/binoculo.webp', uses: 'Hero, Button, cards de território, filtros' },
  { n: '02', title: 'Territórios', route: '/blog/#territorios-title', image: '/images/equipe-tablet.webp', uses: 'Filtro (Button outline sm), cards' },
  { n: '03', title: 'Artigo', route: ARTICLE, image: '/images/binoculo.webp', uses: 'Prose, capitular, Callout (decision, question, quote, example, note)' },
  { n: '04', title: 'Painel', route: '/admin', image: '/images/mao-chaves.webp', uses: 'Cards de acesso, Design System' },
  { n: '05', title: 'Hub e catálogos', route: '/hub-editorial/', image: '/images/equipe-tablet.webp', uses: 'Ferramentas autônomas (Hub, Skills, Catálogo offline)' },
];
const spacing = [4, 8, 12, 16, 20, 24, 32, 48, 64];
const radii = [
  ['radius-sm (botões)', 'var(--radius-sm)'],
  ['radius-lg (base)', 'var(--radius-lg)'],
  ['radius-xl (cards)', 'var(--radius-xl)'],
  ['callout-sm (= radius-md)', 'var(--callout-radius-sm)'],
  ['callout-md (= radius-lg)', 'var(--callout-radius-md)'],
  ['callout-lg (= radius-xl)', 'var(--callout-radius-lg)'],
];
const elevations = [
  ['elevation-flat', 'cards, painéis, células de tabela', 'var(--elevation-flat)'],
  ['elevation-raised', 'controles (escala xs e sm)', 'var(--elevation-raised)'],
  ['elevation-overlay', 'popover, dialog, drawer, sheet, hover-card', 'var(--elevation-overlay)'],
];
const surfaceScale = [
  ['surface-page', 'fundo da página'],
  ['surface-subtle', 'áreas secundárias'],
  ['surface-default', 'cards, células, painéis, diagramas'],
  ['surface-hover', 'hover (= --muted / --accent)'],
  ['surface-selected', 'item ou linha selecionada'],
  ['border-subtle', 'divisões leves'],
  ['border-default', 'borda padrão (só estrutura)'],
  ['border-strong', 'ênfase estrutural'],
];

// Hex values shown in this page are read from the token source, never duplicated here.
export function loader() {
  return {
    tokens: Object.fromEntries(surfaceScale.map(([n]) => [n, tokenValue(`--${n}`)])),
    grammar: Object.fromEntries(
      [...grammarSurfaces.map((g) => g.token), '--foreground', '--muted-foreground', '--primary'].map((t) => [t, tokenValue(t)]),
    ),
  };
}
// ---- Visual grammar (mood board 10, ADR-11): four surfaces, type, actions, table, card, model.
const grammarSurfaces = [
  { n: '1', name: 'Canvas', role: 'Superfície principal', token: '--background', use: 'Canvas limpo para leitura e foco no conteúdo.' },
  { n: '2', name: 'Subtle', role: 'Superfície secundária', token: '--surface-subtle', use: 'Blocos, seções e módulos de apoio.' },
  { n: '3', name: 'Tabular', role: 'Células e tabelas', token: '--surface-tabular', use: 'Tabelas, listas e dados estruturados.' },
  { n: '4', name: 'Diagram', role: 'Painel de modelo', token: '--surface-model', use: 'Destaque para modelos, fluxos e esquemas.' },
];
const grammarTable = [
  ['Artigo', 'Texto', 'Canvas', 'Conteúdo principal'],
  ['Guia', 'Passo a passo', 'Subtle', 'Aprendizado prático'],
  ['Referência', 'Tabela', 'Tabular', 'Dados estruturados'],
  ['Modelo', 'Diagrama', 'Diagram', 'Explicação visual'],
];
const grammarSteps = [
  { icon: Eye, title: '1. Observar', text: 'Contexto e sinais' },
  { icon: FileText, title: '2. Analisar', text: 'Modelos e evidências' },
  { icon: CircleDot, title: '3. Decidir', text: 'Ação no mundo real' },
];
const h2 = 'text-primary scroll-mt-28 text-4xl font-medium';
const lead = 'text-muted-foreground mt-3 max-w-2xl text-lg font-medium';

export const meta: Route.MetaFunction = ({ location }) =>
  seo({
    title: 'Design System',
    description: 'Mood board, storyboard, tokens e componentes do Risco Cognitivo.',
    pathname: location.pathname,
  });

export default function DesignSystem({ loaderData }: Route.ComponentProps) {
  const { tokens, grammar } = loaderData;
  return (
    <DefaultLayout>
      <div className="container max-w-5xl pt-12 pb-24 lg:pt-20">
        <p className="text-muted-foreground text-sm font-medium"><a href="/admin" className="hover:underline">Painel</a> / Design System</p>
        <h1 className="mt-2 text-3xl tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">Design System</h1>
        <p className={lead}>
          Fonte de verdade visual do blog: referências, fluxo, tokens e todos os componentes. Callouts seguem
          DS-CALLOUT-001 e o anexo de paleta DS-CALLOUT-001-PAL-ANNEX-01.
        </p>
        <nav aria-label="Seções" className="mt-8 flex flex-wrap gap-2">
          {sections.map((s, i) => <a key={i} href={`#${s.id}`} className={buttonVariants({ variant: 'outline', size: 'sm' })}>{s.label}</a>)}
        </nav>

        {/* Visual grammar — mood board 10 */}
        <section id="gramatica" className="mt-20" aria-labelledby="gramatica-title" data-testid="visual-grammar">
          <p className="rc-eyebrow">Mood board 10 · ADR-11</p>
          <h2 id="gramatica-title" className="rc-display mt-3 text-5xl">Gramática visual</h2>
          <p className="rc-lead mt-3 max-w-2xl text-lg">
            Uma linguagem, três camadas: clareza editorial, estrutura de informação e elementos de modelo. Valores lidos de{' '}
            <code>app/styles/global.css</code>.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {grammarSurfaces.map((g) => (
              <div key={g.name} className="rc-surface rc-cell flex flex-col gap-3 p-4" data-grammar-surface={g.name}>
                <p className="rc-title text-base">{g.n}. {g.name}</p>
                <p className="text-muted-foreground -mt-2 text-xs">{g.role}</p>
                <span className="h-20 rounded-lg border border-[var(--border-default)]" style={css(`background: var(${g.token})`)} data-swatch={g.token}></span>
                <p className="font-mono text-xs">{grammar[g.token]}</p>
                <p className="text-muted-foreground text-xs">{g.use}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2 [&>*]:min-w-0">
            <div className="rc-cell p-5" data-testid="grammar-type">
              <p className="rc-eyebrow">Hierarquia tipográfica</p>
              <p className="rc-meta mt-5 normal-case">H1 / Título · Inter Bold 56/64 · {grammar['--foreground']}</p>
              <p className="rc-display mt-2 text-[2.25rem] leading-[1.14] sm:text-[3rem]">Conhecimento para decisões melhores.</p>
              <p className="rc-meta mt-6 normal-case">Corpo / Texto · Inter Regular 18/28 · {grammar['--foreground']} / {grammar['--muted-foreground']}</p>
              <p className="mt-2 text-lg leading-7">Artigos, guias e relatos sobre como pensamos, decidimos e lidamos com incertezas no mundo real.</p>
              <p className="rc-meta mt-6 normal-case">Mono / Técnico · IBM Plex Mono 14/20 · {grammar['--muted-foreground']}</p>
              <p className="mt-2 inline-block rounded-lg border border-[var(--border-default)] px-3 py-2 font-mono text-sm">rc_blog_001  v1.0.0  2026-10-02</p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="rc-cell p-5" data-testid="grammar-actions">
                <p className="rc-eyebrow">Botões e ações</p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <a href="#gramatica" className={cn(buttonVariants({ size: 'lg' }), 'gap-2')}>Ler artigo <ArrowRight className="size-4" aria-hidden="true" /></a>
                  <a href="#gramatica" className={buttonVariants({ variant: 'outline', size: 'lg' })}>Ver todos</a>
                  <a href="#gramatica" className="rc-link inline-flex items-center gap-1.5">Saiba mais <ChevronRight className="size-4" aria-hidden="true" /></a>
                </div>
              </div>
              <div className="rc-cell p-5">
                <p className="rc-eyebrow">Tabela com gutters</p>
                <div className="mt-3 overflow-x-auto" role="region" aria-label="Tabela com gutters" tabIndex={0}>
                  <table className="ds-table ds-table--stack w-full text-left [--table-cell-padding:0.5rem_0.75rem] [--table-font-size:0.875rem] sm:min-w-[22rem]">
                    <thead><tr><th scope="col">Tópico</th><th scope="col">Formato</th><th scope="col">Camada</th><th scope="col">Uso</th></tr></thead>
                    <tbody>{grammarTable.map((row) => <tr key={row[0]}>{row.map((c, j) => <td key={c} data-label={['Tópico', 'Formato', 'Camada', 'Uso'][j]}><div>{c}</div></td>)}</tr>)}</tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="grid gap-4 lg:col-span-2 lg:grid-cols-2 [&>*]:min-w-0">
              <div className="rc-cell p-5">
                <p className="rc-eyebrow">Card editorial</p>
                <article className="mt-3 grid grid-cols-[1fr_6rem] gap-4 rc-cell p-4">
                  <div>
                    <p className="rc-eyebrow">Artigo</p>
                    <h3 className="rc-title mt-1.5 text-lg">Como lidar com incerteza sem paralisar</h3>
                    <p className="text-muted-foreground mt-1.5 text-sm">Estratégias práticas para decidir quando o futuro não é claro.</p>
                    <p className="rc-meta mt-3">8 min de leitura</p>
                  </div>
                  <img src="/images/equipe-tablet.webp" alt="" className="aspect-square w-full rounded-[var(--table-radius)] object-contain" loading="lazy" />
                </article>
              </div>
              <div className="rc-surface rounded-[var(--table-radius)] bg-[var(--surface-model)] p-5" data-testid="grammar-model">
                <p className="rc-eyebrow">Painel de modelo</p>
                <ol className="mt-3 grid grid-cols-3 gap-2">
                  {grammarSteps.map(({ icon: Icon, title, text }) => (
                    <li key={title} className="bg-background flex flex-col items-center gap-1.5 rounded-[var(--table-radius)] p-3 text-center">
                      <Icon className="text-primary size-5" aria-hidden="true" />
                      <span className="text-xs font-semibold">{title}</span>
                      <span className="text-muted-foreground text-[0.6875rem] leading-tight">{text}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* Mood board */}
        <section id="moodboard" className="mt-20" aria-labelledby="moodboard-title">
          <h2 id="moodboard-title" className={h2}>Mood board</h2>
          <p className={lead}>Imagens em uso, cores e tipografia que definem o tom editorial.</p>
          <div className="mt-8 grid grid-cols-6 grid-rows-2 gap-3">
            <img src="/images/binoculo.webp" alt="Ilustração de uma mulher observando com um binóculo azul" className="col-span-3 row-span-2 aspect-[4/5] w-full rounded-[var(--table-radius)] object-contain sm:col-span-2" />
            <img src="/images/equipe-tablet.webp" alt="" className="col-span-3 h-full w-full rounded-[var(--table-radius)] object-contain sm:col-span-2" />
            <div className="col-span-3 flex flex-col justify-between rounded-2xl p-5 sm:col-span-2" style={css("background: var(--color-brand-strong); color: var(--color-brand-on-strong)")}>
              <span className="text-sm font-medium opacity-80">Display · Inter 700</span>
              <span className="text-4xl font-medium tracking-tight">Aa</span>
            </div>
            <div className="col-span-3 grid grid-cols-3 overflow-hidden rounded-2xl sm:col-span-2">
              <span style={css("background: var(--color-brand-default)")}></span>
              <span style={css("background: var(--color-attention-default)")}></span>
              <span style={css("background: var(--color-critical-default)")}></span>
            </div>
            <img src="/images/mao-chaves.webp" alt="" className="col-span-3 h-full w-full rounded-[var(--table-radius)] object-contain sm:col-span-2" />
          </div>
        </section>

        {/* Storyboard */}
        <section id="storyboard" className="mt-20" aria-labelledby="storyboard-title">
          <h2 id="storyboard-title" className={h2}>Storyboard</h2>
          <p className={lead}>A jornada do leitor, quadro a quadro, com os componentes de cada etapa.</p>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {storyboard.map((f, i) => (
              <li key={i} className="rc-cell overflow-hidden">
                <img src={f.image} alt="" loading="lazy" className="aspect-video w-full object-contain" />
                <div className="p-5">
                  <p className="text-primary text-sm font-medium">{f.n}</p>
                  <h3 className="mt-1 text-lg font-medium">{f.title}</h3>
                  <p className="text-muted-foreground mt-1 text-sm">{f.uses}</p>
                  <a href={f.route} className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'mt-4')}>Abrir</a>
                  <p className="text-muted-foreground mt-2 font-mono text-xs break-all">{f.route}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Tokens */}
        <section id="tokens" className="mt-20" aria-labelledby="tokens-title">
          <h2 id="tokens-title" className={h2}>Tokens</h2>
          <p className={lead}>Quatro camadas: primitivo → semântico → componente → variante. Valores concretos só existem na camada primitiva.</p>

          <h3 className="mt-10 text-xl font-medium">Primitivos (3 famílias × 11 passos)</h3>
          <div className="mt-4 flex flex-col gap-3">
            {families.map((f, i) => (
              <div key={i}>
                <p className="text-muted-foreground mb-2 font-mono text-xs">{f}</p>
                <div className="grid grid-cols-11 overflow-hidden rounded-[var(--table-radius)] border">
                  {steps.map((st, i) => (
                    <div key={i} className="flex h-14 items-end p-1" style={css(`background: var(--${f}-${st}); color: ${st >= 600 ? 'white' : 'black'}`)}>
                      <span className="font-mono text-[10px]">{st}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <h3 className="mt-10 text-xl font-medium">Papéis semânticos</h3>
          <p className="text-muted-foreground mt-1 text-sm">Alterne o tema no menu para ver os valores provisórios do modo escuro.</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {families.map((f, i) => (
              <div key={i} className="overflow-hidden rounded-[var(--table-radius)] border">
                {roles.map((r, i) => (
                  <div key={i} className="flex items-center gap-3 border-b p-3 last:border-b-0">
                    <span className="size-8 shrink-0 rounded-md border" style={css(`background: var(--color-${f}-${r})`)}></span>
                    <span className="font-mono text-xs">--color-{f}-{r}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <h3 className="mt-10 text-xl font-medium">Neutros (infraestrutura)</h3>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {neutrals.map(([name, v], i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="size-10 shrink-0 rounded-lg border" style={css(`background: var(${v})`)}></span>
                <span className="font-mono text-xs">{name}</span>
              </div>
            ))}
          </div>

          <h3 className="mt-10 text-xl font-medium">Superfícies, bordas e elevação</h3>
          <p className="text-muted-foreground mt-2 max-w-2xl text-base font-medium">
            Um único contrato neutro (ADR-09): cards, células, painéis e diagramas usam <code>surface-default</code> + <code>border-default</code> e
            nenhuma sombra. Sombra indica elevação real (overlays). O <code>--plain-*</code> é só alias.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4" data-testid="surface-scale">
            {surfaceScale.map(([n, use]) => (
              <div key={n} className="flex min-w-0 flex-col gap-2">
                <span className="h-14 rounded-lg border" data-surface-token={n} style={css(`background: var(--${n})`)}></span>
                <span className="font-mono text-xs">--{n}</span>
                <span className="text-muted-foreground text-xs">claro: {n === 'surface-page' ? 'branco' : tokens[n]} · {use}</span>
              </div>
            ))}
          </div>

          <h3 className="mt-10 text-xl font-medium">Superfícies e texto cinza</h3>
          <p className="text-muted-foreground mt-2 max-w-2xl text-base font-medium">
            Paleta de cards do sistema com a escada de texto cinza. O secundário do mockup
            (<code>--muted-foreground</code>) é AA só no canvas; dentro de superfícies cinza (<code>rc-surface</code>,
            cards, tabelas, plain) ele vira <code>--muted-foreground-on-gray</code> automaticamente (ADR-11).
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="surfaces">
            {surfaces.map((sf, i) => (
              <div key={i} data-surface={sf.name} className={cn('flex min-w-0 flex-col gap-1 rc-cell p-4', !['background', 'popover'].includes(sf.name) && 'rc-surface')} style={css(`background: var(${sf.v})`)}>
                <p className="text-foreground font-medium">{sf.name}</p>
                <p className="text-muted-foreground text-sm" data-text="secondary">Texto secundário sobre {sf.name}.</p>
                {sf.extra ? (
                  <p className="text-muted-foreground-subtle text-sm" data-text="extra">Texto extra cinza: legenda ou nota.</p>
                ) : (
                  <p className="text-muted-foreground text-sm" data-text="no-extra">Sem cinza extra nesta superfície.</p>
                )}
                <p className={cn('mt-1 font-mono text-xs', sf.extra ? 'text-muted-foreground-subtle' : 'text-muted-foreground')}>{sf.v}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-3 rc-cell p-5 md:grid-cols-3" data-testid="text-ladder">
            {textLadder.map(([n, v, use], i) => (
              <div key={i} className="flex min-w-0 flex-col gap-1">
                <p className="text-lg font-medium" style={css(`color: var(${v})`)}>Aa — {n}</p>
                <p className="text-muted-foreground text-sm">{use}</p>
              </div>
            ))}
          </div>

          <h3 className="mt-10 text-xl font-medium">Paleta de gráficos</h3>
          <p className="text-muted-foreground mt-2 max-w-2xl text-base font-medium">
            Derivada das 3 famílias e do neutro (ADR-04): nenhuma matiz nova. Séries também se
            distinguem por traço e legenda, não só por cor.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5" data-testid="chart-palette">
            {chartPalette.map(([n, from, use], i) => (
              <div key={i} className="flex min-w-0 flex-col gap-2 rc-cell p-3">
                <span className="h-12 rounded-lg border" data-chart-swatch={n} style={css(`background: var(--${n})`)}></span>
                <span className="font-mono text-xs">--{n}</span>
                <span className="text-muted-foreground text-xs">{from}</span>
                <span className="text-muted-foreground-subtle text-xs">{use}</span>
              </div>
            ))}
          </div>

          <h3 className="mt-10 text-xl font-medium">Tipografia</h3>
          <div className="mt-4 flex flex-col gap-6 rc-cell p-6">
            <div><p className="text-muted-foreground font-mono text-xs">h1 · display</p><p className="text-3xl tracking-tight sm:text-4xl md:text-5xl lg:text-6xl" style={css("font-family: var(--font-display); font-weight: var(--display-weight)")}>Do risco à execução</p></div>
            <div><p className="text-muted-foreground font-mono text-xs">h2 · seção</p><p className="text-primary text-4xl font-medium" style={css("font-family: var(--font-display)")}>Territórios</p></div>
            <div><p className="text-muted-foreground font-mono text-xs">corpo · text-lg 500</p><p className="text-muted-foreground max-w-xl text-lg font-medium">Compreender o problema. Redesenhar o trabalho. Criar condições para executar.</p></div>
            <div><p className="text-muted-foreground font-mono text-xs">callout · 700 / 400</p><p className="text-lg"><strong className="font-bold">Plano</strong> Aprovado</p></div>
          </div>

          <h3 className="mt-10 text-xl font-medium">Espaçamento, raios, sombras, movimento</h3>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2 rc-cell p-5">
              {spacing.map((px, i) => (
                <div key={i} className="flex items-center gap-3"><span className="font-mono text-xs w-10">{px}px</span><span className="bg-primary h-3 rounded-sm" style={css(`width: ${px * 3}px`)}></span></div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3 rc-cell p-5">
              {radii.map(([n, v], i) => (
                <div key={i} className="flex flex-col items-center gap-2"><span className="bg-muted size-14 border" style={css(`border-radius: ${v}`)}></span><span className="text-center font-mono text-[10px]">{n}</span></div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 rc-cell p-5">
              {elevations.map(([n, use, v]) => (
                <div key={n} className="flex w-40 flex-col gap-2">
                  <span className="bg-background grid h-20 place-items-center rounded-xl border font-mono text-[10px]" style={css(`box-shadow: ${v}`)} data-elevation={n}>{n}</span>
                  <span className="text-muted-foreground text-xs">{use}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2 rc-cell p-5 font-mono text-xs">
              <span>--callout-motion-fast: 120ms</span>
              <span>--callout-motion-default: 180ms</span>
              <span>--callout-easing: cubic-bezier(0.2, 0, 0, 1)</span>
              <span>prefers-reduced-motion: transições removidas</span>
            </div>
          </div>
        </section>

        {/* Callouts */}
        <section id="callouts" className="mt-20" aria-labelledby="callouts-title">
          <h2 id="callouts-title" className={h2}>Callouts</h2>
          <p className={lead}>Um único primitive, 26 variantes, 3 famílias cromáticas, 3 tamanhos, 2 tons e 2 layouts (compacto e anatomia completa).</p>

          <h3 className="mt-10 text-xl font-medium">Referência — approved · md</h3>
          <p className="text-muted-foreground mt-2 text-base font-medium">
            Mesma altura do CTA (Button lg, 40px), raio de <code>--radius</code>, glifo Lucide sem
            contêiner, assunto em sans 700 e mensagem em <code>--font-mono</code> 400. As medidas do
            handoff (56/32/32px) vieram de um raster 3× e equivalem a ~18/11/11px.
          </p>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center" data-testid="callout-proportion">
            <div className="min-w-0 flex-1" data-testid="callout-reference">
              <Callout variant="approved" subject="Plano" message="Aprovado" />
            </div>
            <a href="#callouts" className={buttonVariants({ size: 'lg' })} data-testid="cta-reference">CTA · Button lg</a>
          </div>

          <h3 className="mt-10 text-xl font-medium">Anatomia completa · outline × tinted</h3>
          <p className="text-muted-foreground mt-2 text-base font-medium">
            Com descrição ou ações, o callout ganha faixa superior (rótulo + fechar), corpo (emblema
            no outline, título em <code>--font-mono</code> e descrição) e rodapé com ações à direita.
            Sem descrição, fica na barra compacta acima.
          </p>
          <div className="mt-4 grid gap-6 md:grid-cols-2" data-testid="callout-anatomy">
            <Callout variant="tip" subject="Dica do dia" message="Um procedimento por vez" description="Registre critérios de conclusão antes de automatizar: o agente só apoia o que está explícito." action={{ label: 'Ação principal', href: '#callouts' }} secondaryAction={{ label: 'Secundária', href: '#callouts' }} dismissible />
            <Callout variant="tip" tone="tinted" subject="Dica do dia" message="Um procedimento por vez" description="Registre critérios de conclusão antes de automatizar: o agente só apoia o que está explícito." action={{ label: 'Entendi', href: '#callouts' }} dismissible />
            <Callout variant="warning" subject="Aviso" message="Revise antes de publicar" description="Há fontes sem data de acesso. Confira a seção de referências antes de enviar para revisão." action={{ label: 'Revisar', href: '#callouts' }} secondaryAction={{ label: 'Depois', href: '#callouts' }} dismissible />
            <Callout variant="warning" tone="tinted" subject="Aviso" message="Revise antes de publicar" description="Há fontes sem data de acesso. Confira a seção de referências antes de enviar para revisão." action={{ label: 'Revisar', href: '#callouts' }} secondaryAction={{ label: 'Depois', href: '#callouts' }} dismissible />
            <Callout variant="error" subject="Erro" message="Há dados não salvos" description="Sair agora descarta as alterações feitas neste rascunho." action={{ label: 'Descartar', href: '#callouts' }} secondaryAction={{ label: 'Salvar', href: '#callouts' }} dismissible />
            <Callout variant="error" tone="tinted" subject="Erro" message="Há dados não salvos" description="Sair agora descarta as alterações feitas neste rascunho." action={{ label: 'Descartar', href: '#callouts' }} secondaryAction={{ label: 'Salvar', href: '#callouts' }} dismissible />
            <Callout variant="action" subject="Ação necessária" message="Agende a revisão" description="Marque 30 minutos com quem executa o processo para validar o redesenho." action={{ label: 'Agendar', href: '#callouts' }} secondaryAction={{ label: 'Pular', href: '#callouts' }} dismissible />
            <Callout variant="action" tone="tinted" subject="Ação necessária" message="Agende a revisão" description="Marque 30 minutos com quem executa o processo para validar o redesenho." action={{ label: 'Agendar', href: '#callouts' }} secondaryAction={{ label: 'Pular', href: '#callouts' }} dismissible />
          </div>

          <h3 className="mt-10 text-xl font-medium">26 variantes · md · compacto</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2" data-testid="callout-variants">
            {CALLOUT_VARIANT_NAMES.map((v, i) => (
              <Callout key={i} variant={v} subject={CALLOUT_VARIANTS[v].label} message={`${v} · ${CALLOUT_VARIANTS[v].family}`} />
            ))}
          </div>

          <h3 className="mt-10 text-xl font-medium">Tamanhos</h3>
          <div className="mt-4 flex flex-col gap-3">
            <Callout variant="info" size="sm" subject="sm" message="cards e barras laterais" />
            <Callout variant="info" size="md" subject="md" message="padrão editorial" />
            <Callout variant="info" size="lg" subject="lg" message="display" />
          </div>

          <h3 className="mt-10 text-xl font-medium">Tons · outline × tinted por família</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Callout variant="decision" tone="outline" subject="Decisão" message="registrada" description="Superfície neutra, acento brand." />
            <Callout variant="decision" tone="tinted" subject="Decisão" message="registrada" description="Header brand.strong, corpo brand.subtle." />
            <Callout variant="warning" tone="outline" subject="Aviso" message="revise antes de publicar" description="Família attention." />
            <Callout variant="warning" tone="tinted" subject="Aviso" message="revise antes de publicar" description="Família attention." />
            <Callout variant="error" tone="outline" subject="Erro" message="falha na importação" description="Família critical." />
            <Callout variant="error" tone="tinted" subject="Erro" message="falha na importação" description="Família critical." />
          </div>

          <h3 className="mt-10 text-xl font-medium">Estados</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2" data-testid="callout-states">
            <Callout variant="next-step" subject="Próximo passo" message="Publicar o artigo" description="Com ações (máximo 2)." action={{ label: 'Publicar', href: '/blog' }} secondaryAction={{ label: 'Rever', href: ARTICLE }} />
            <Callout variant="pending" subject="Pendente" message="aguardando revisão" description="Ações desabilitadas." action={{ label: 'Publicar' }} disabled />
            <Callout variant="data" subject="Dados" message="carregando" loading />
            <Callout variant="attention" subject="Atenção" message="pode ser fechado" description="dismissible: remove o callout do fluxo." dismissible />
            <Callout variant="research" subject="Pesquisa" message="Texto longo que quebra naturalmente em várias linhas sem reticências, mantendo o símbolo alinhado ao início do conteúdo quando passa de uma linha." />
            <Callout variant="evidence" subject="Evidência" message="Confirmada" />
          </div>
        </section>

        {/* Dados e charts */}
        <section id="dados" className="mt-20" aria-labelledby="dados-title">
          <h2 id="dados-title" className={h2}>Dados e charts</h2>
          <p className={lead}>Indicadores, seis tipos de gráfico, tabela de dados e estados de carregamento, vazio e erro, todos nos tokens do sistema.</p>
          <div className="mt-8 min-w-0">
            <DataGallery />
          </div>
        </section>

        {/* Plain text & diagramas */}
        <section id="plain" className="mt-20" aria-labelledby="plain-title">
          <h2 id="plain-title" className={h2}>Plain text e diagramas</h2>
          <p className={lead}>
            Diagramas e textos operacionais como texto UTF-8 com caracteres de desenho de caixa: copiáveis,
            pesquisáveis e acessíveis, sem SVG, Mermaid ou imagem (ADR-05). Veja o
            <a href="/admin/relatorio-exemplo/" className="text-primary underline underline-offset-4">relatório de exemplo</a>.
          </p>

          <h3 className="mt-10 text-xl font-medium">Tokens</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="ds-table" data-testid="plain-tokens">
              <thead><tr><th scope="col">Token</th><th scope="col">Valor</th></tr></thead>
              <tbody>
                {plainTokens.map(([t, v], i) => (
                  <tr key={i}><td><code>{t}</code></td><td>{v}</td></tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="mt-10 text-xl font-medium">Tabelas</h3>
          <p className="text-muted-foreground mt-2 text-base font-medium">Todas as tabelas (componente <code>Table</code> e tabelas Markdown) usam células cinza separadas, cabeçalho em caixa alta e valores técnicos em mono.</p>
          <div className="mt-4 overflow-x-auto" data-testid="table-reference" data-wide-table role="region" aria-label="Tabela de referência (rolagem horizontal intencional)" tabIndex={0}>
            <table className="ds-table">
              <caption className="sr-only">Store Hub — wireframe para código</caption>
              <thead><tr><th scope="col">Wireframe_node</th><th scope="col">Component</th><th scope="col">Source_file</th><th scope="col">Data</th><th scope="col">State</th></tr></thead>
              <tbody>
                {storeRows.map(([n, c, f, d, st], i) => (
                  <tr key={i}><td>{n}</td><td><code>{c}</code></td><td>{f.startsWith('components/') ? <a href="#plain">{f}</a> : <code>{f}</code>}</td><td>{d.includes(' ') ? d : <code>{d}</code>}</td><td>{st}</td></tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="mt-10 text-xl font-medium">AsciiDiagram · preserva a geometria</h3>
          <div className="mt-4 grid gap-6 lg:grid-cols-2" data-testid="plain-diagrams">
            <AsciiDiagram id="FLOW-OPS-001" kind="orgchart" title="Organograma OPS / CAVORK" source={orgchart} />
            <div className="flex min-w-0 flex-col">
              <AsciiDiagram id="FLOW-AUTONOMY-001" kind="flowchart" title="Progressão de autonomia" source={flowchart} className="mt-0" />
              <AsciiDiagram id="TREE-REPORT-001" kind="tree" title="Gerado por renderTree(JSON)" source={treeFromJson} caption="Entrada JSON hierárquica; o componente desenha ├── └── │ de forma determinística." />
            </div>
            <AsciiDiagram id="DIR-PLAIN-001" kind="directory" title="Estrutura de código" source={directory} density="compact" />
            <AsciiDiagram id="MAP-RISK-001" kind="mindmap" title="Mapa mental" source={mindmap} />
          </div>
          <AsciiDiagram id="FLOW-WIDE-001" kind="workflow" title="Diagrama largo · rolagem horizontal" source={wide} caption="Linhas largas rolam dentro do bloco; a página não ganha rolagem lateral." />

          <h3 className="mt-10 text-xl font-medium">PlainTextPanel · quebra texto longo</h3>
          <div className="mt-4 grid gap-6 lg:grid-cols-2" data-testid="plain-panels">
            {panels.map((p, i) => (
              <PlainTextPanel key={i} id={`PANEL-${p.kind.toUpperCase()}-001`} kind={p.kind as any} title={p.title} source={p.source} className="my-0" />
            ))}
          </div>
          <PlainTextPanel id="PANEL-LONG-001" kind="example" title="Texto longo" source={longText} />

          <h3 className="mt-10 text-xl font-medium">Variantes</h3>
          <div className="mt-4 grid gap-6 lg:grid-cols-3" data-testid="plain-variants">
            <PlainTextPanel id="PANEL-COLLAPSIBLE-001" kind="data" title="collapsible" source={`Conteúdo em <details> nativo:\nabre e fecha sem JavaScript.`} collapsible className="my-0" />
            <AsciiDiagram id="FLOW-SM-001" kind="generic" title="fontSize sm · comfortable" source={flowchart.split('\n').slice(0, 7).join('\n')} fontSize="sm" density="comfortable" className="my-0" />
            <PlainTextPanel id="PANEL-NOCOPY-001" kind="generic" title="copyable={false}" source={`Sem botão de copiar.\nO texto continua selecionável.`} copyable={false} className="my-0" />
          </div>
        </section>

        {/* Componentes */}
        <section id="componentes" className="mt-20" aria-labelledby="componentes-title">
          <h2 id="componentes-title" className={h2}>Componentes</h2>
          <p className={lead}>Todos os primitivos de <code>src/components/ui</code>, agrupados por família.</p>
          <div className="mt-8">
            <ComponentGallery />
          </div>
        </section>
      </div>
    </DefaultLayout>
  );
}
