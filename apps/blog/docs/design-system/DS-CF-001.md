# DS-CF-001 — Design system transversal RC-DS-CF

- **ID:** DS-CF-001 · **Versão:** 1.0.0 · **Data:** 2026-10-06
- **Decisão:** ADR-26 (`apps/blog/CLAUDE.md`), que adota o ADR-BLOG-JORNADA-ROTAS-001.
- **Método:** skill Design 1.2.0, `/design-system` nos modos **audit**, **extend** e **document**. A
  accessibility-review e a design-critique ficam em `docs/handoff/JORNADA-ROTAS-001/`.
- **Fonte única:**
  - tokens `--cf-*` no bloco `RC-DS-CF` de `app/styles/global.css`;
  - componentes `ds-*` em `app/styles/ds.css`;
  - React em `app/components/ds/`;
  - showroom vivo em `/admin/design-system/`.

---

## 1. Audit (estado em `main` @ 42481ac)

### Resumo
**Componentes revisados:** 41 · **Problemas:** 9 · **Nota:** 38/100. A nota mede o quanto o site responde a uma identidade
só.

### Consistência de nomes

| Problema | Onde | Padrão adotado |
|---|---|---|
| Quatro prefixos de token para o mesmo papel: `--ref-*`, `--hy-*`, `--radius-*` e `--home-*` | `global.css`, `home.css` | `--cf-*` é o único prefixo de identidade |
| Quatro prefixos de classe: `hy-*`, `stories-*`, `rc-*`, `cfh-*` (só na home) | rotas e componentes | `ds-*` |
| Componentes de mesma função com nomes diferentes: card de artigo (`StoryCard`, `hy-tile`), card de ferramenta (`SkillCard`, `VisualProductCard`, `rc-cell`) | stories, store | `ds-card` com variantes |

### Cobertura de tokens

| Categoria | Definidos | Valores fixos encontrados |
|---|---|---|
| Cor | 2 identidades: azul `#2563EB` (global) e laranja `#FF5E1F` (home) | Cada uma presa a uma camada: o laranja não pode sair da home (ADR-23/25) |
| Tipografia | Inter (corpo) + Hanken Grotesk (home e shell) + Plex Mono | Escalas em px literais (`--ref-h1-size` 61,6864, `--hy-*`) |
| Espaçamento | `--ref-*`, `--hy-section`, `--home-section`, `--cf-section-gap` | Três ritmos de seção (120, 128, 80 px) |
| Raio | 2 px (card), 8 px (botão), 16 px (cartão laranja), 9999 px (pill CF) | Duas linguagens de forma na mesma página |

### Completude de componentes

| Componente | Estados | Variantes | Docs | Nota |
|---|---|---|---|---|
| Botão | ✅ | ⚠️ duas famílias (`hy-btn` 8 px, `cf-btn` pill) | ⚠️ | 5/10 |
| Card | ⚠️ sem foco próprio | ❌ quatro implementações | ❌ | 3/10 |
| Cabeçalho de seção | ✅ | ⚠️ `hy-section-intro` × `cfh-head` | ❌ | 4/10 |
| Abas | ✅ (Radix) | ⚠️ estilo shadcn × `cfh-tabs-row` | ⚠️ | 5/10 |
| Estado vazio | ⚠️ | ⚠️ shadcn `Empty` | ❌ | 4/10 |
| Campos de formulário | ✅ | ✅ (shadcn, raio 8, azul) | ⚠️ | 6/10 |
| Cérebro (marcadores, card) | ✅ | ❌ só na home | ✅ | 6/10 |

### Ações prioritárias
1. Uma paleta e um prefixo: o acento CF vale para todas as rotas, e os aliases antigos apontam para ele.
2. Um card e um cabeçalho de seção com variantes, no lugar de quatro implementações.
3. Tirar do `global.css` os blocos de composição antigos e proibi-los em teste (`tests/ds.spec.ts`).

---

## 2. Tokens (RC-DS-CF)

| Token | Claro | Escuro | Uso |
|---|---|---|---|
| `--cf-font` | Hanken Grotesk | — | Todo texto |
| `--cf-mono` | IBM Plex Mono | — | IDs, números de passo, rótulos técnicos |
| `--cf-fg` | #262626 | `--foreground` escuro | Texto |
| `--cf-fg-muted` | #707070 (4,95:1) | ≥ 4,5:1 | Texto secundário |
| `--cf-bg` / `-200` / `-300` | #FFFFFF / #FDFDFC / #F9F7F6 | escuros | Página, painel, hover |
| `--cf-border` / `-strong` | #F0F0F0 / #E5E5E5 | escuros | Quadros, cantos |
| `--cf-accent` | #FF5E1F | igual | Cartões laranja, marcadores, ícone ativo |
| `--cf-accent-200` | #FF7038 | igual | Botão suave sobre o laranja |
| `--cf-accent-text` | #BF4C14 (4,9:1) | #FF8A5C | Acento como texto e links |
| `--cf-accent-soft` / `-line` | #FFF4EE / #FFD2BF | alfa | Fundos e linhas de destaque |
| `--cf-on-accent` | #FFFFFF | igual | **Só texto grande** sobre o acento (≥ 24 px, 3,05:1) |
| `--cf-on-accent-ink` | #262626 | igual | Texto pequeno sobre o acento (4,95:1) |
| `--cf-glow` | #FFE9A6 | igual | Brilho dos cartões laranja |
| `--cf-focus` | `--cf-accent-text` | igual | Anel de foco (3 px) |
| `--cf-radius-sm` / `md` / `lg` / `pill` | 4 / 8 / 16 / 9999 px | — | Chip / painel / cartão laranja / botão |
| `--cf-header-h` | 72 px | — | Cabeçalho |
| `--cf-container` | 1200 px | — | Largura de seção |
| `--cf-measure` | 68ch | — | Linha de leitura |
| `--cf-px` | 32 px (16 px < 768) | — | Gutter |
| `--cf-section` | 128 px (64 px < 768) | — | Ritmo entre seções |
| `--cf-h1` / `--cf-h2` / `--cf-h3` | 56 / 48 / 18 px (34 / 32 / 18 < 768) | — | Escala de títulos |
| `--cf-sub` | 19,2 px (17 px < 768) | — | Lead |
| `--cf-btn` / `-sm` | 50 / 44 px | — | Altura de botão (alvo ≥ 44 px, accessibility-review) |
| `--cf-corner` | 10 px | — | Quadradinho de canto |

Os aliases de infraestrutura apontam para os `--cf-*`: `--primary`, `--ring`, `--background`, `--foreground`,
`--muted-foreground`, `--border`, `--input`, `--card`, `--radius`, `--font-sans`. Os layers semânticos (callout, gráfico,
grafo, solução, folha A4) continuam como exceções registradas no ADR-26.

---

## 3. Componentes que vêm da home (document)

Já existiam como `cfh-*` e foram generalizados para `ds-*`. A referência medida está no ADR-25.

| Componente | Classe | Variantes | Estados | A11y |
|---|---|---|---|---|
| Cartão laranja | `ds-orange` (+ `-hero`, `-cta`) | hero, cta | — | Branco só em título grande; resto em `--cf-on-accent-ink` |
| Pill | `ds-pill` | sobre laranja, sobre branco | hover, foco | Link com texto; seta decorativa `aria-hidden` |
| Botão | `ds-btn` | `primary` (acento, texto escuro), `white`, `soft`, `outline` | hover, foco, disabled | `<a>` ou `<button>`; 44/50 px; verbo no rótulo (ux-copy) |
| Cabeçalho de seção | `ds-head` | `md`, `lg`, `left` | — | `h2` + lead; rótulo opcional `ds-label` |
| Quadro | `ds-frame` + `ds-corner` | — | — | Cantos `aria-hidden` |
| Colunas | `ds-cols` / `ds-col` | 2, 3, 4 | hover, foco (link) | Cada coluna tem `h3` |
| Abas | `ds-tabs` | — | selecionada, foco | `role=tablist`, setas, `aria-controls` |
| Citação | `ds-quote` | — | — | `figure` + `figcaption` com fonte |
| Comparação | `ds-compare` | — | — | Painel laranja com texto grande |
| Diagrama | `ds-diagram` | — | — | `dl` |
| Bento | `ds-bento` | — | — | Artigos com `h3` |
| Letreiro | `ds-ticker` | — | para com `prefers-reduced-motion` | Segunda faixa `aria-hidden` |
| Pontos | `ds-dots` | — | — | Decorativo, só no celular |
| Cérebro | `brain-*` | `preview`, `full` | carregando, pronto, fallback | Ver §5 |

---

## 4. Componentes novos (extend), especificados antes do uso

Cada um responde às perguntas da skill: problema, padrões existentes e por que não bastam, props, variantes, estados,
tokens e a11y.

### 4.1 `PageHead`: cabeçalho de página interna
- **Problema:** as páginas internas (Blog, Mapa, Ferramentas, Fontes, Sobre, admin) precisam de um hero sem o cartão
  laranja, reservado às homes com CTA.
- **Existentes:** `cfh-head` é cabeçalho de seção (h2) e `PageHero` é do DS antigo.
- **Props:** `eyebrow?`, `title` (h1), `lead?`, `actions?`, `crumbs?`.
- **Variantes:** `center` (homes de área), `left` (detalhe).
- **Tokens:** `--cf-h1`, `--cf-sub`, `--cf-fg-muted`, `--cf-accent-text` (eyebrow).
- **A11y:** um único `h1`; o breadcrumb fica antes, em `nav[aria-label="Trilha"]`.

### 4.2 `Breadcrumb`
- **Props:** `items: {label, href?}[]`. O último item é a página atual (`aria-current="page"`).
- **Estados:** link com hover e foco.
- **A11y:** `nav` + `ol`; separador `›` decorativo.

### 4.3 `Card`: card de conteúdo (artigo, ferramenta, função, prévia)
- **Problema:** `StoryCard`, `hy-tile`, `SkillCard` e `VisualProductCard` fazem a mesma coisa com quatro geometrias.
- **Props:** `href`, `eyebrow?`, `title`, `text?`, `meta?`, `icon?`, `media?`, `cta?` ("Ler artigo ›", "Abrir ›").
- **Variantes:** `cell` (célula de quadro, sem borda própria) e `panel` (borda `--cf-border`, raio `md`).
- **Estados:** default; hover (`--cf-bg-300`); foco (anel `--cf-focus` de 3 px); `demo` (selo "Demonstração").
- **A11y:** o título é o link (`h3 > a`, com área clicável estendida ao card); o selo é texto, não só cor.

### 4.4 `Chip` / `FacetBar`: facetas do Blog e filtros
- **Props:** `items: {label, href?, count?, current?}[]`. Sem `href`, vira texto com "em preparação".
- **Estados:** atual (`aria-current="true"`, fundo `--cf-fg`, texto `--cf-bg`), hover, foco, indisponível.
- **A11y:** `nav[aria-label]` + lista. Indisponível não é link, nem com `aria-disabled`. Alvo ≥ 44 px.

### 4.5 `ArticleMeta`
- **Conteúdo:** publicador ("Risco Cognitivo"), data de publicação (`time`), tempo de leitura calculado (palavras ÷ 200)
  e ID do conteúdo em `--cf-mono`.
- **A11y:** `dl` sem rótulos visuais redundantes; o tempo é "N min de leitura".

### 4.6 `Toc`: sumário de H2
- **Problema:** a análise da monday.com mostra que H2 numerosos precisam de localização.
- **Props:** `items: {id, label}[]`, lidos do MDX (rehype-slug).
- **Comportamento:** lateral fixa ≥ 1100 px; `details` recolhido no celular.
- **A11y:** `nav[aria-label="Nesta página"]`.

### 4.7 `KeyPoints` e `Faq`
- **Regra:** só aparecem quando o conteúdo existe no texto ou em `article-meta`. Nunca há texto inventado.
- `KeyPoints`: `aside` com `h2` "Pontos principais" e lista.
- `Faq`: `h2` + `details/summary`, com teclado nativo.

### 4.8 `Prose`: corpo do artigo
- **Escopo:** `ds-prose` com medida de 68ch, h2 34/1.1, h3 22, parágrafo 18/1.6, listas, `strong`, links em
  `--cf-accent-text` sublinhados, `blockquote` com régua de acento.
- **Tabela:** `ds-table` empilha no celular (substitui `ds-table--stack`).

### 4.9 `TextPanel` e `AsciiBlock` (MDX `PlainTextPanel`, `AsciiDiagram`)
- **Problema:** os MDX importam `@/components/plain` e não podem ser reescritos.
- **Decisão:** o módulo mantém o caminho e os nomes, mas a implementação passa para o DS novo. `ds-panel`: quadro com
  cabeçalho (ID em mono e título), a visão estruturada do ADR-05/12 e o botão Copiar. `ds-ascii`: `pre` com rolagem
  horizontal, mono e região focável.
- **Estados:** copiar → "Copiado" (`aria-live`).

### 4.10 `EmptyState`
- **Copy (ux-copy):** o quê, por quê e como começar. Exemplo: "Nenhum e-book publicado. Esta categoria ainda não
  tem material pronto. Veja as soluções publicadas ›".
- **A11y:** `h2`/`h3` com o título e um link real. Sem CTA falso.

### 4.11 `DemoNotice`
- **Problema:** o ADR pede que o layout demonstrativo seja identificado.
- **Forma:** faixa `ds-notice` com rótulo "Layout demonstrativo" e uma frase curta. Fica no `PageHead` de cada rota em
  reconstrução.
- **A11y:** `role="note"`.

### 4.12 Campos: `Field`, `Input`, `Textarea`, `Checkbox`, `Radio`, `Select`
- **Tokens:** borda `--cf-border-strong`, raio `md`, 44 px, foco com anel `--cf-focus`, erro com a família `critical`
  (camada semântica) e mensagem no formato o quê, por quê e como resolver.
- **A11y:** `label` explícito, `aria-describedby` para ajuda e erro, `aria-invalid`.

### 4.13 `Dialog`
- **Comportamento:** Radix só pelo comportamento (foco preso, Esc), com as classes `ds-dialog`. Botões rotulados pela
  ação ("Limpar dados" / "Manter dados").

### 4.14 `Badge`
- **Variantes:** `neutral`, `accent` e `state` (família semântica). Sempre com texto.

### 4.15 `Sheet` (fator do mapa)
- **Decisão:** o `FactorSheet` continua igual no comportamento. A pele passa para `ds-sheet` (borda `--cf-border`, raio
  `lg` no topo, alça de 44 px).

---

## 5. Cérebro (`BrainHero`): preview × full

| | preview (Home) | full (`/mapas/`) |
|---|---|---|
| Palco | 4:3, máximo de 980 px; 1:1 no celular | 4:3, máximo de 1200 px; 1:1 no celular |
| Seleção | Abre o card curto: demanda, dificuldade, estratégia | Abre o card completo: os mesmos campos, relações, fontes e links |
| Saída | "Abrir no Mapa ›" → `/mapas/?foco=ID` | "Explorar relações ›" → `/mapas/explorar/?foco=ID` |
| URL | Não muda | Lê `?foco=` ao carregar; grava com `replaceState` ao selecionar |
| Teclado | Setas percorrem e selecionam; Tab sai do grupo | Igual |
| Movimento | Parado com `prefers-reduced-motion`; botão Girar/Pausar | Igual |
| Fallback | Pôster, seletores e links sem JS ou sem WebGL | Igual |

---

## 6. Do / Don't

| ✅ Fazer | ❌ Não fazer |
|---|---|
| Usar `ds-*` e `--cf-*` | Usar `hy-*`, `stories-*`, `rc-cell`, `--ref-*`, `--hy-*` ou o azul antigo |
| Usar branco sobre o acento só em título grande | Colocar lead ou botão com texto branco sobre o laranja |
| Rotular a demonstração | Exibir item fictício como disponível ou usar CTA `#` |
| Especificar aqui o componente novo antes de usar | Estilizar ad hoc na rota |
| Usar camadas semânticas só para significado (grafo, callout, solução, A4) | Usar cor semântica como identidade |
