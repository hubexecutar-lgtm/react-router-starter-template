# DS-CF-001-admin — extensão do RC-DS-CF para a família Admin

- **ID:** DS-CF-001-admin · **Versão:** 1.0.0 · **Data:** 2026-10-06
- **Decisão:** ADR-26 (`apps/blog/CLAUDE.md`): "o admin também migra". Base: `DS-CF-001.md`.
- **Método:** skill Design 1.2.0, `/design-system` nos modos **extend** (componentes abaixo, especificados antes do
  uso) e **document** (o showroom `/admin/design-system/`).
- **Rotas:** `/admin/`, `/admin/design-system/`, `/admin/rotas/`, `/admin/relatorio-exemplo/`, `/admin/handoff/`,
  `/admin/stories-fixtures/`. Todas `noindex`, com `PageHead` (h1 único e aviso "Layout demonstrativo").
- **Código:** CSS em `app/styles/ds-admin.css` (só `var(--cf-*)` e as camadas semânticas do ADR-26); React em
  `app/components/admin/showroom.tsx` e nas rotas `app/routes/admin.*.tsx`; layout de relatório em
  `app/layouts/ReportLayout.tsx`.

---

## 1. Composição por rota (sem componente novo)

| Rota | Composição |
|---|---|
| `/admin/` | `PageHead` + `CardGrid` de `Card` (um por ferramenta interna, CTA "Abrir") |
| `/admin/design-system/` | `PageHead` + `Toc` (âncoras) + uma `ds-section` por família de componente, cada uma com `ds-specimen` (§2.1) |
| `/admin/rotas/` | `PageHead` + `ds-stats` (§2.3) + barra de filtros `ds-hubbar` (composição de `Field`, `Input`, `Select` e `Button`; nome próprio porque `ds-toolbar` é da família Prisma) + grade de `ds-qrcard` (§2.4) + `Table` (registro) |
| `/admin/relatorio-exemplo/`, `/admin/handoff/` | `ReportLayout`: `PageHead` (título e descrição do frontmatter) + `ArticleBody` (`ds-prose`, tabela empilhada, `PlainTextPanel`/`AsciiDiagram` na pele do DS) |
| `/admin/stories-fixtures/` | `PageHead` + componentes de artigo (`Card`, `Toc`, `KeyPoints`, `Faq`, `ArticleMeta`, `ds-prose`, `Table`, `EmptyState`, `DemoNotice`) com dados sintéticos rotulados |

---

## 2. Componentes novos (extend)

### 2.1 `Specimen` (`ds-specimen`): ficha de componente no showroom
- **Problema:** o showroom precisa mostrar, para cada componente, o exemplo vivo, as variantes, os estados, as notas
  de acessibilidade e o do/don't, sempre na mesma ordem, para que a leitura seja comparável entre componentes.
- **Existentes:** `Card` é conteúdo navegável (o título é link e a área clicável cobre o card): um exemplo interativo
  dentro dele ficaria sob o link estendido. `Frame` é só o quadro, sem slots. `ds-panel` é texto operacional.
- **Props:** `id` (âncora), `name` (h3), `api` (nome do componente ou da classe, em mono), `lead?`, `a11y: string[]`,
  `dos: string[]`, `donts: string[]`, `children` (o palco).
- **Subpartes:** `ds-showroom-section` (seção com âncora, recuo do cabeçalho fixo e ritmo `--cf-section-gap`), `ds-specimen-stage` (palco com fundo `--cf-bg`, quadro `--cf-border`), `ds-variant` (cada variante
  ou estado com legenda `figcaption`), `ds-specimen-notes` (lista de a11y) e `ds-dodont` (duas colunas Fazer/Evitar,
  rótulo em texto, não só cor).
- **Variantes:** palco claro (padrão) e `data-stage="accent"` (sobre o laranja, para pílula e botões brancos).
- **Estados:** estático. Estados do componente exibido (hover, foco, disabled, vazio, erro) aparecem como `ds-variant`
  com legenda; hover e foco são forçados por `data-force="hover|focus"` só no palco (`ds-admin.css`), para serem vistos
  sem ponteiro.
- **Tokens:** `--cf-border`, `--cf-bg`, `--cf-bg-200`, `--cf-fg-muted`, `--cf-mono`, `--cf-radius-md`, `--cf-pad`.
- **A11y:** `section[aria-labelledby]` com `h3`; legendas em `figure/figcaption`; "Fazer" e "Evitar" são títulos de
  lista (`h4`), com ✓/✕ decorativos `aria-hidden`.

### 2.2 `Swatch` (`ds-swatch`) e `ContrastTable`: amostra de token com valor e contraste calculados
- **Problema:** a página de tokens precisa mostrar o valor real de cada token no tema atual (claro ou escuro) e o
  contraste calculado, sem duplicar o hex no código (o hex vive só no bloco RC-DS-CF do `global.css`).
- **Existentes:** a amostra antiga lia o valor no servidor (`tokens.server`), que não acompanha o tema escuro nem as
  media queries; não havia componente de contraste.
- **Props:** `Swatch`: `token`, `role`, `kind` (`color` | `radius` | `size` | `type`). `ContrastTable`: `pairs:
  {fg, bg, min, use}[]`.
- **Comportamento:** depois da hidratação, lê `getComputedStyle(document.documentElement).getPropertyValue(token)`;
  cores são resolvidas para sRGB num canvas 1×1 (aceita `oklch`), e a razão WCAG é calculada. Recalcula quando a classe
  `dark` do `html` muda (`MutationObserver`). Sem JS, mostra o nome do token e "calculado no navegador".
- **Variantes:** cor (bloco preenchido), raio (quadrado com o raio), tamanho (barra com a largura), tipo (amostra de
  texto no tamanho).
- **Estados:** calculando (traço), pronto (valor e razão), reprovado (rótulo "Abaixo do mínimo" em texto).
- **Tokens:** `--cf-border-strong` (contorno da amostra, para o branco aparecer), `--cf-mono` (valores),
  `--cf-fg-muted`.
- **A11y:** a amostra é decorativa (`aria-hidden`); o nome, o valor e a razão são texto. A tabela de contraste usa o
  `Table` do DS (empilha no celular); o resultado é "AA" ou "Abaixo do mínimo", nunca só cor.
- **Dados de teste:** `data-token`, `data-token-value`, `data-contrast-pair`, `data-ratio`, `data-min`.

### 2.3 `Stats` (`ds-stats`): números-resumo
- **Problema:** o hub de rotas abre com quatro contagens (entradas, grupos, internas, links).
- **Existentes:** `ds-dl` é lista de definição em linhas (rótulo e texto), sem número em destaque; `Card` é navegável.
- **Props:** `items: {label, value, data?}[]`.
- **Variantes:** 2 colunas no celular, 4 a partir de 768 px.
- **Tokens:** `--cf-border` (células), `--cf-bg-200`, `--cf-fg-muted` (rótulo), `--cf-fg` (número 32 px, `tabular-nums`).
- **A11y:** `dl` com `dt` (rótulo) antes de `dd` (número) no DOM; ordem visual igual à de leitura.

### 2.4 `QrCard` (`ds-qrcard`): card do hub de rotas
- **Problema:** cada entrada do hub tem QR, título, rota, URL, descrição, exposição e duas ações (Abrir, Copiar URL).
- **Existentes:** `Card` estende o link do título sobre o card inteiro, o que cobriria as duas ações e o link da URL.
- **Props:** `entry` (id, grupo, título, rota, URL, descrição, exposição), `svg` (QR), `copied`, `onCopy`, `hidden`.
- **Variantes:** — (o QR fica à esquerda; abaixo de 420 px ele vai para cima).
- **Estados:** visível, filtrado (`hidden`, fora do fluxo), copiado ("Copiado" no botão).
- **Tokens:** `--cf-border`, `--cf-radius-md`, `--cf-bg`, `--cf-fg-muted`, `--cf-mono`, `--cf-accent-text` (URL).
  O QR é preto sobre branco por legibilidade de câmera (padrão da biblioteca, fora do tema), com moldura `--cf-border`.
- **A11y:** `article` com `h3`; o QR é `role="img"` com `aria-label="QR Code para <título>"`; a exposição é `Badge`
  com texto; botões de 44 px; o primeiro link do card é a URL (contrato de `tests/routes.spec.ts`).
- **Dados de teste:** `.route-card`, `data-id`, `data-kind`, `data-group`, `data-exposure`, `data-search`.

---

## 3. Showroom `/admin/design-system/` (document)

Seções e âncoras, na ordem do `Toc` da página:

| Âncora | Conteúdo |
|---|---|
| `#tokens` | Cores `--cf-*` com valor e contraste calculados, pares de contraste AA, raios, tipo, espaçamento e medidas |
| `#camadas` | Exceções semânticas do ADR-26: famílias `--color-{brand,attention,critical}-*`, séries `--chart-*`, grafo `--graph-*`, links para a folha A4 (`/prisma/`) e o card de solução |
| `#botoes` | `Button` (primary, outline, ghost; 44 e 50 px; link e botão; hover, foco, disabled), `MoreLink`, `ds-pill`, `ds-btn-white`/`ds-btn-soft` |
| `#cards` | `Card` (cell, panel, lg, ícone, badge demo), `CardGrid` (2, 3, 4), `Frame` com cantos, `ds-cols` |
| `#navegacao` | `Breadcrumb`, `Chips` (atual, contagem, em preparação), `Tabs`, `Toc`, `ds-tabs-row` (por link) |
| `#cabecalhos` | `PageHead` (o desta página), `SectionHead` (md, lg, left), `DemoNotice`, `ds-eyebrow`, `ds-label` |
| `#laranja` | `ds-cta` com título grande branco, `ds-pill`, botões brancos e o `ds-ticker`; `ds-hero` por link para `/` |
| `#conteudo` | `ds-prose` (com citação), `ds-quote`, `ds-list`, `ds-dl`, `ArticleMeta`, `KeyPoints`, `Faq`; `ds-compare`, `ds-diagram`, `ds-bento` por link para `/sobre/` |
| `#formularios` | `Field` + `Input` (ajuda, erro, disabled), `Textarea`, `Select`, `Check`, `ConfirmDialog` |
| `#estados` | `EmptyState`, `Badge` (neutral, accent, demo), `Dots` |
| `#dados` | `Table` (empilhada e fixa), tabela de referência |
| `#plain` | `PlainTextPanel` e `AsciiDiagram` (pele `ds-panel`/`ds-ascii`), com os IDs usados em `tests/plain.spec.ts` |

## 4. Do / Don't do admin

| ✅ Fazer | ❌ Não fazer |
|---|---|
| Usar `PageHead` e `noindex` em toda rota de admin | Indexar páginas internas ou abrir sem h1 |
| Ler valores de token no navegador | Copiar o hex do token para a página |
| Rotular dado sintético como sintético | Mostrar fixture como conteúdo do site ou com link `#` |
| Mostrar camadas semânticas só como amostra de token | Importar `@/components/ui` para demonstrá-las |
