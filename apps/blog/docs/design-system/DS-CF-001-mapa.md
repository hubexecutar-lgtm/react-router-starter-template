# DS-CF-001 — extensão: Mapa Cognitivo (`/mapas/*`)

- **ID:** DS-CF-001-mapa · **Versão:** 1.0.0 · **Data:** 2026-10-06
- **Decisão:** ADR-26 (`apps/blog/CLAUDE.md`) e ADR-BLOG-JORNADA-ROTAS-001 §2.2.
- **Escopo:** `/mapas/`, `/mapas/explorar/`, `/mapas/explorar/:fatorId/` e `/mapas/personalizar/`.
- **Implementação:** CSS em `app/styles/ds-mapa.css` (só `var(--cf-*)` e as camadas semânticas do ADR-26); React em
  `app/features/mapa/`.
- **Método:** skill Design 1.2.0, `/design-system` no modo **extend**. Cada componente responde às perguntas da skill:
  problema, padrões existentes e por que não bastam, props, variantes, estados, tokens e a11y.

## 0. Composição das rotas

| Rota | Composição (um layout demonstrativo) | Componentes |
|---|---|---|
| `/mapas/` | `PageHead` (h1 + lead de uso) → `BrainHero variant="full"` (o mesmo da Home) → modos de exploração → como ler (legenda) → outras capacidades → personalizar | `PageHead`, `BrainHero`, `CardGrid`/`Card`, `Chips`, `MapLegend`, `MoreLink` |
| `/mapas/explorar/` | `PageHead` com trilha → barra de preferências → modos e tipos (chips) → abas Mapa/Lista + "Por quê?" → sheet do fator | `PageHead`, `Chips` (`ds-chip`), `MapTabs`, `MapCanvasFrame`, `FactorSheet` (`ds-sheet`) |
| `/mapas/explorar/:fatorId/` | `PageHead` com trilha (volta ao Explorar com `?foco=`) → tipo, trecho de origem, contagens → Relações (abas) → Por quê? | `PageHead`, `NodeType`, `SourceQuote`, `RelationCounts`, `MapTabs`, `SentenceList` |
| `/mapas/personalizar/` | `PageHead` com trilha → passos → um `fieldset` por passo com opções → ações | `PageHead`, `Steps`, `OptionCard`, `Button` |

O canvas do React Flow continua com `--graph-*` e `rc-map*` (exceção 2 do ADR-26): cor e forma do nó codificam o tipo.

---

## 1. `MapTabs`: variante controlada das Abas (§3)

- **Problema:** o Explorar troca de aba por código ("selecionar no texto" volta para a aba Mapa) e precisa dos dois
  painéis no HTML pré-renderizado (a Lista existe sem JS). O `Tabs` do DS é não controlado (`defaultValue`) e desmonta o
  painel inativo; também não deixa pôr um controle ao lado da lista de abas ("Por quê?").
- **Existentes:** `Tabs` (`ds-tabs`/`ds-tab`, Radix) — mesma pele, mas sem `value`, sem `forceMount`, sem atributos `data-*`
  nos gatilhos e painéis, e a lista rola na horizontal em vez de quebrar linha.
- **Props:** `label` (nome do `tablist`), `items: {value, label, content, trigger?, panel?}[]` (`trigger`/`panel` levam
  `data-*`), `value?` + `onValueChange?` (controlado) ou `defaultValue?`, `forceMount?`, `wrap?`, `listEnd?` (controle
  ao lado da lista), `data-*` na raiz.
- **Variantes:** `wrap` (a lista quebra linha: 4 abas de relação cabem em 320 px sem rolagem); `forceMount` (painéis
  inativos ficam no DOM com `display: none`).
- **Estados:** selecionada (fundo `--cf-accent`, texto `--cf-on-accent-ink`), hover, foco (anel `--cf-focus` de 3 px).
- **Tokens:** os do `ds-tabs`; `--cf-radius-lg` quando quebra linha.
- **A11y:** Radix só pelo comportamento: `role=tablist/tab/tabpanel`, setas, Home/End, `aria-controls`. Alvo 44 px.
- **Classes:** `ds-maptabs`, `ds-maptabs-bar`, `ds-tabs[data-wrap]`, `ds-tab-panel`.

## 2. `ds-sheet`: sheet do fator (§4.15)

- **Problema:** o DS-CF-001 §4.15 decide a pele do `FactorSheet`, mas o `ds.css` não tem a classe. O sheet tem três
  alturas no celular e vira painel fixo ao lado do mapa a partir de 900 px.
- **Existentes:** `ds-dialog` é modal e centrado; o sheet não é modal (o mapa continua tocável).
- **Props (React, inalteradas):** `node`, `snap` (`collapsed` | `medium` | `expanded`), `onSnap`, `onClose`, `nodeLink`.
- **Variantes:** celular (fixo acima da barra inferior, raio `lg` só no topo); ≥ 900 px (painel `sticky`, raio `lg`).
- **Estados:** `data-snap` muda a altura máxima (196 px, 50svh, tela menos cabeçalho); transição de altura que zera com
  `prefers-reduced-motion` (`--dur-base`).
- **Tokens:** `--cf-bg`, `--cf-border`/`-strong`, `--cf-radius-lg`, `--cf-header-h`, `--elevation-overlay`; a distância da
  barra inferior em `--ds-sheet-bottom` (local, com fallback de 64 px).
- **A11y:** `aside[aria-labelledby]` com o nome do fator em `h2`; alça de 44 px (`ds-sheet-handle`) com setas ↑/↓ e
  instrução em `sr-only`; botões de ícone de 44 px (`ds-icon-btn`) rotulados; Esc fecha e o foco volta ao nó.

## 3. `ds-icon-btn`: botão só de ícone

- **Problema:** recolher, expandir e fechar o sheet são ações sem rótulo visível.
- **Existentes:** `ds-btn` tem texto e pílula; ficaria largo demais no cabeçalho do sheet.
- **Props:** `<button aria-label>` com um ícone `aria-hidden`.
- **Estados:** hover (`--cf-bg-300`), foco (anel `--cf-focus`), `disabled` (opacidade 0,4).
- **A11y:** 44 × 44 px; o nome vem do `aria-label`.

## 4. `ds-inline-link`: link ou botão dentro de frase

- **Problema:** as relações são frases ("Interrupções aumenta Atenção") e cada fator citado é um link (página do fator) ou
  um botão (seleciona no mapa). Os dois precisam da mesma aparência dentro do texto.
- **Existentes:** `ds-link` é um link de bloco de 44 px com chevron ("Saiba mais ›"); quebraria a frase.
- **Estados:** sublinhado em `--cf-accent-text`; hover sem sublinhado; foco com anel `--cf-focus`.
- **A11y:** `<a>` quando navega, `<button type="button">` quando seleciona. Link dentro de frase é exceção do critério de
  alvo (WCAG 2.5.8).

## 5. `NodeType`, `SourceQuote`, `RelationCounts`, `SentenceList`: peças do grafo em texto

- **Problema:** o tipo do nó, o trecho de origem, as contagens e as frases das relações aparecem no sheet, na página do
  fator e na Lista. Antes usavam `stories-*`/`hy-*`.
- **Existentes:** `Badge` não tem o glifo de forma do tipo (RQ-076: tipo = forma + rótulo, nunca só cor); `ds-quote` é a
  citação grande da Home; `ds-meta` não tem números em destaque.
- **Classes:** `ds-nodetype` (glifo `aria-hidden` + rótulo), `ds-mapa-quote` (`figure` + `blockquote` + `figcaption` com o
  ID da fonte em `--cf-mono`), `ds-counts` (`dl` em linha), `ds-sentences` (lista de frases na medida de 68ch),
  `ds-mapa-subhead` (h2/h3 de painel, 22 px).
- **Tokens:** `--cf-fg`, `--cf-fg-muted`, `--cf-accent-line` (régua da citação), `--cf-mono`, `--cf-measure`.
- **A11y:** a relação inferida diz "(inferido)" em texto; o glifo é decorativo e o rótulo é texto.

## 6. `MapCanvasFrame` e o recorte estático

- **Problema:** o canvas precisa de um quadro do DS, e o recorte em texto (sem JS e antes do canvas) precisa dos mesmos
  nós como links.
- **Existentes:** `Frame` (quadro com cantos). O canvas fica dentro dele num `div` com `overflow: hidden` (os cantos ficam
  fora do recorte).
- **Classes:** `ds-mapa-canvas` (interior do quadro); `rc-map-static` e `rc-map-static-node` (camada do grafo, exceção 2:
  `--graph-node-bg`, `--graph-node-border`, `--graph-node-border-selected`, `--graph-node-text`); `rc-map-node`,
  `rc-map-edge-label` e `rc-map-star` no canvas.
- **A11y:** nó de 48 px (≥ 44); foco com anel `--cf-focus`; o interesse do Personalizar tem marca e texto "seu interesse".

## 7. `MapLegend`: legenda dos tipos de nó

- **Problema:** a Home do Mapa explica como ler o grafo: forma + rótulo de cada tipo.
- **Existentes:** `ds-diagram` é um `dl` de etapas; `Chips` são filtros clicáveis. A legenda não é interativa.
- **Classe:** `ds-mapa-legend` (lista em 2 colunas a partir de 640 px, glifo em caixa de 24 px).
- **A11y:** `ul` com o glifo `aria-hidden` e o nome do tipo em texto.

## 8. `Steps` e `OptionCard`: fluxo do Personalizar

- **Problema:** o Personalizar tem 3 passos com opções marcáveis em cartões; o estado marcado precisa aparecer além da cor.
- **Existentes:** `Check` (`ds-check`) é só a caixa com rótulo, sem cartão nem estado marcado; `Chips` são links.
- **Classes:** `ds-steps` (`ol` com `aria-current="step"`, o atual em `--cf-fg` e peso 600, os outros em `--cf-fg-muted`);
  `ds-option` (`label` que envolve o `input` nativo; borda `--cf-border-strong`, raio `md`; marcado = borda de 2 px
  `--cf-accent-text` e fundo `--cf-accent-soft`; foco do input = anel `--cf-focus` no cartão); `ds-option-meta` (tipo do
  nó em 14 px).
- **Estados:** default, hover (`--cf-bg-300`), marcado, foco.
- **A11y:** `fieldset` + `legend` com o `h2` do passo (recebe o foco ao trocar de passo); `input` nativo de 24 px com
  `accent-color: --cf-accent-text`; cartão ≥ 44 px; status em `aria-live`.

## 9. Barra de preferências e status

- **Classes:** `ds-mapa-prefs` (linha com texto, link "Editar" e botão "Restaurar padrão"), `ds-mapa-status` (status do
  mapa em `aria-live`, 44 px), `ds-mapa-note` (nota de 14 px em `--cf-fg-muted`).
- **Copy (ux-copy):** CTAs com verbo ("Personalizar por onde começar", "Restaurar padrão", "Explorar relações").
