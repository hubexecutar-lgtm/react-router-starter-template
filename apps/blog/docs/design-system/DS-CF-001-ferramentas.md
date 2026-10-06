# DS-CF-001 — extensão: Ferramentas e Soluções

- **ID:** DS-CF-001-ferramentas · **Versão:** 1.0.0 · **Data:** 2026-10-06
- **Decisão:** ADR-26 (`apps/blog/CLAUDE.md`) e ADR-BLOG-JORNADA-ROTAS-001 §2.2 (`/ferramentas/`, `/ferramentas/:type/`,
  `/ferramentas/:type/:slug/`).
- **Método:** `/design-system` no modo **extend**. Cada componente responde: problema, padrões existentes e por que
  não bastam, props, variantes, estados, tokens e a11y. CSS em `app/styles/ds-ferramentas.css` (só `var(--cf-*)` e as
  camadas semânticas registradas no ADR-26); React em `app/features/store/components/`.

## 0. Composição da família

| Rota | Composição (um layout demonstrativo) | Componentes |
|---|---|---|
| `/ferramentas/` | `PageHead` → catálogo reduzido (busca, área, tipos) → ferramenta interativa (Prisma) → encontrar por problema → por função executiva e por contexto | `PageHead`, `CatalogFilters`, `Card`/`CardGrid`, `Chips`, `EmptyState`, `SectionHead`, `MoreLink` |
| `/ferramentas/:type/` | `PageHead` com trilha → outros tipos (`Chips`) → catálogo do tipo ou `EmptyState` honesto | idem |
| `/ferramentas/solucoes/:slug/` | `PageHead` com trilha, dor e um CTA primário → card 2×2 (`solution-*`, exceção semântica) → corpo MDX (`ArticleBody`) → fontes (`References`) | `PageHead`, `Button`, `ArticleBody`, `References`, `MoreLink` |
| `/ferramentas/:type/:slug/` (outros tipos) | `PageHead` → problema, processo, progresso, fluxo e referências → um CTA primário ou indisponibilidade explícita | `ItemFlow`, `Steps`, `Disclosure`, `Table`, `Button` |

Só itens reais entram no catálogo: as 6 soluções (`repository.listItems()`) e o Prisma como ferramenta interativa
(`data/correlations.ts`). Tipo sem item aparece como "em preparação" (chip sem link) e a página do tipo mostra o
`EmptyState`. Nenhum selo "Catálogo de exemplo".

---

## 1. `CatalogFilters`: busca, área e tipo do catálogo

- **Problema:** o catálogo filtra por texto (`?q=`), tipo (`?tipo=`) e área (`?area=`), com estado na URL. O cabeçalho
  antigo usava `Input`, `Select` e `Tabs` do shadcn.
- **Existentes:** `Field`/`Input`/`Select` (§4.12) resolvem cada campo, mas não a linha responsiva nem o grupo de tipos;
  `Chips` (§4.4) é só de links, e o filtro de tipo troca o estado no lugar (botão com `aria-pressed`); `Tabs` (§3) é de
  painéis, não de filtro.
- **Props:** `query`, `onQuery`, `searchLabel`, `areas` (só as que têm item), `area`, `onArea`, `types?` (`{type, label,
  count}[]`, ausente na página de tipo), `type`, `onType`.
- **Variantes:** com grupo de tipos (home) e sem (página de tipo). O seletor de área só aparece com duas ou mais áreas.
- **Estados:** chip de tipo selecionado (`aria-pressed="true"`, fundo `--cf-fg`), tipo sem item (`data-state="soon"`,
  texto "em preparação", não é botão), hover e foco.
- **Tokens:** `--cf-border-strong`, `--cf-radius-md`, `--cf-fg`, `--cf-bg`, `--cf-fg-muted`, `--cf-focus`.
- **A11y:** `form[role=search]` com `label` visível no campo; `select` nativo rotulado "Filtrar por área"; grupo de tipos
  `role="group"` com `aria-label="Tipo de item"`; contagem anunciada em `role="status"`. Alvos ≥ 44 px. Sem JS, o HTML
  pré-renderizado já mostra todos os itens.

## 2. `CatalogSkeleton` e `CatalogError`: estados de carregamento e erro

- **Problema:** `?estado=carregando|erro` pré-visualiza os estados do catálogo; antes vinham de `Skeleton`, `Spinner` e
  `Alert` do shadcn.
- **Existentes:** `EmptyState` (§4.10) é o estado vazio; não há carregamento nem erro no DS.
- **Props:** `CatalogError` recebe `onRetry`.
- **Variantes:** `ds-skeleton` (quatro blocos) e `ds-alert` (família `critical`, camada semântica do ADR-26).
- **Estados:** carregando (`aria-busy="true"`, animação parada com `prefers-reduced-motion`); erro com "Tentar novamente".
- **Copy (ux-copy):** erro = o quê ("Não foi possível carregar o catálogo") + por quê ("a lista não respondeu") + como
  resolver ("Tente novamente em instantes").
- **Tokens:** `--cf-bg-300`, `--cf-border`, `--cf-radius-md`; `--color-critical-subtle`/`-default` só no alerta.
- **A11y:** o erro é `role="alert"`; o botão tem verbo no rótulo.

## 3. `Steps`: processo numerado

- **Problema:** o template de item mostra três passos numerados (Problema → Processo → Progresso).
- **Existentes:** `ds-list` não numera; `ds-bento-steps` é composição da home.
- **Props:** `items: {index, label}[]`.
- **Tokens:** `--cf-mono` no número, `--cf-border`, `--cf-bg-300`.
- **A11y:** `ol` nativo; o número visual é `aria-hidden` (a ordem vem da lista).

## 4. `ItemFlow`: fluxo entrada → passos → saída

- **Problema:** o item mostra o fluxo de uso derivado dos mesmos três passos.
- **Existentes:** `ds-diagram` é um `dl` horizontal da home, sem entrada/saída.
- **Props:** `input`, `steps`, `output`.
- **Variantes:** nó `io` (entrada e saída, rótulo em mono) e nó `step`.
- **Tokens:** `--cf-border-strong`, `--cf-bg-200`, `--cf-radius-md`, `--cf-mono`.
- **A11y:** `ol[aria-label="Fluxo de uso"]`; conectores `aria-hidden`.

## 5. `Disclosure`: referências recolhíveis

- **Problema:** as referências do item ficam recolhidas, operáveis por teclado.
- **Existentes:** `Faq` (§4.7) é uma seção com `h2` fixo "Perguntas frequentes".
- **Forma:** `details.ds-disclosure > summary` com chevron decorativo.
- **Estados:** aberto/fechado nativos, foco com anel `--cf-focus`.
- **A11y:** `summary` nativo (Enter/Espaço), alvo de 44 px.

## 6. Nota de pendência (`ds-tools-note`)

- **Problema:** "Função operacional e encaixe: a definir com o OWNER da Teia." é uma pendência, não um filtro.
- **Forma:** parágrafo pequeno em `--cf-fg-muted`, sem cor de estado.

---

## 7. Exceções visuais usadas nesta família

1. **Card 2×2 de solução (`solution-*`, ADR-24):** quadrantes amarelo/vermelho/cinza/verde codificam significado e
   sempre trazem número e rótulo em texto. O entorno da página (cabeçalho, corpo, fontes) é DS.
2. **Família `critical`** só no `CatalogError` (estado de erro).

Não há `--area-*` nos componentes desta família: a área aparece só como texto no filtro.
