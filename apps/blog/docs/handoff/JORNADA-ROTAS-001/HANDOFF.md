# Handoff — layouts demonstrativos por rota (ADR-BLOG-JORNADA-ROTAS-001, ADR-26)

- **Método:** skill Design 1.2.0, `/design-handoff`, com a microcopy no formato `/ux-copy`.
- **Tokens e componentes:** `docs/design-system/DS-CF-001.md` e as extensões `DS-CF-001-{ferramentas,mapa,prisma,admin}.md`.
- **Inventário (N1):** `INVENTARIO.md`. **Acessibilidade:** `A11Y.md`. **Crítica:** `CRITIQUE.md`.
- **research-synthesis / user-research:** não se aplicam a este trabalho, porque não há entrevistas, pesquisas nem testes
  com usuários para sintetizar. A jornada vem do ADR do usuário. Uma pesquisa de usabilidade (5–8 pessoas, roteiro
  Home → Blog → artigo → Mapa → ferramenta) fica como próxima etapa do N8 (medição).

## Visão geral

Cada rota (ou família de rotas dinâmicas) tem **um** layout demonstrativo no RC-DS-CF. As composições variam pela função
da área, mas a identidade é uma só:

| Área | Composição | Pergunta do visitante (ADR §2.1) |
|---|---|---|
| `/` | Cartão laranja (hero) → cérebro em prévia → trilha Entenda · Estruture · Execute → prévia do Blog → prévia das Ferramentas → CTA laranja com letreiro | "O que é e por onde começo?" |
| `/artigos/` | PageHead → facetas (quatro grupos) → destaque e caminho de leitura | "Qual tema se aplica a mim?" |
| `/artigos/:slug/` | Trilha → meta → sumário lateral + prose → referências → próximo passo (Mapa + soluções) | "Como funciona e qual a evidência?" |
| `/mapas/` | PageHead → cérebro completo (gira, seleciona, abre card) → modos → outras capacidades | "Como os fatores se conectam?" |
| `/ferramentas/` | PageHead → descoberta (tipo, problema) → catálogo só com itens reais | "O que posso aplicar?" |
| `/prisma/` | Intro em 3 passos → formulário → folha A4 (exceção) → próxima ação | "O que este exercício mostrou?" |
| `/sobre/`, `/comece/`, `/fontes/` | PageHead → seções com cabeçalho à esquerda | Projeto, orientação, evidência |
| `/admin/*` | PageHead → componentes do DS (showroom, hub, fixtures) | Operação interna |

## Layout

- **Grade:** contêiner de `--cf-container` (1200 px), gutter `--cf-px` (32 px; 16 px abaixo de 768).
- **Ritmo:** `--cf-section` (128/64 px) entre seções das homes de área e `--cf-section-gap` (80/64 px) depois de um
  `PageHead`.
- **Leitura:** coluna de `--cf-reading` (720 px) e medida de `--cf-measure` (68ch). A partir de 1100 px o sumário fica
  numa coluna lateral de 240 px.
- **Quadros:** `ds-frame` com cantos de 10 px. Células separadas por linha `--cf-border`.

## Design tokens usados

| Token | Valor | Uso |
|---|---|---|
| `--cf-accent` | #FF5E1F | Cartões laranja, marcadores do cérebro, aba ativa, botão primário |
| `--cf-accent-text` | #BF4C14 | Links, rótulos (eyebrow), números de passo, foco |
| `--cf-on-accent-ink` | #262626 | Texto pequeno e botões sobre o acento |
| `--cf-fg` / `--cf-fg-muted` | #262626 / #707070 | Texto / texto secundário |
| `--cf-bg` / `-200` / `-300` | #FFF / #FDFDFC / #F9F7F6 | Página / painel / hover e cabeçalho de tabela |
| `--cf-h1` / `--cf-h2` / `--cf-sub` | 56 / 48 / 19,2 px (34 / 32 / 17 no celular) | Títulos e lead |
| `--cf-btn` / `-sm` | 50 / 44 px | Botões |
| `--cf-radius-{sm,md,lg,pill}` | 4 / 8 / 16 / 9999 px | Chip / painel / cartão laranja / botão |

## Componentes

| Componente | Variante | Rotas |
|---|---|---|
| `PageHead` | `left` | Todas as internas (aviso "Layout demonstrativo" ligado) |
| Cartão laranja | hero, cta | `/` |
| `BrainHero` | `preview` / `full` | `/` / `/mapas/` |
| `Card` + `CardGrid` | cell (2, 3 ou 4 colunas) | Home, Blog, artigo, Ferramentas, Comece |
| `Chips` | faceta, "em preparação" | Blog, artigo (conceitos no Mapa), Mapa |
| `Toc`, `ArticleMeta`, `KeyPoints`, `Faq` | — | Artigo (KeyPoints e Faq só com conteúdo do texto) |
| `EmptyState` | — | Blog (tema sem artigo), Ferramentas (tipo sem item) |
| `Field`/`Input`/`Textarea`/`Check`, `ConfirmDialog` | — | Prisma, Personalizar |
| `Table` (`data-stack`) | — | Tabelas do artigo, admin |

## Estados e interações

| Elemento | Estado | Comportamento |
|---|---|---|
| `ds-btn` | hover | Primário: `--cf-accent-200`. Outline/ghost: `--cf-bg-300` |
| `ds-btn`, `ds-chip`, `ds-tab`, links | foco | Anel de 3 px `--cf-focus`, deslocado 2 px |
| `ds-card` com link | hover / foco | Fundo `--cf-bg-300`; a área clicável cobre o card (`::after`) |
| `ds-chip` | atual | Fundo `--cf-fg`, texto `--cf-bg`, `aria-current="true"` |
| `ds-chip` | em preparação | Borda tracejada, sem link, rótulo "em preparação" |
| Marcador do cérebro | selecionado | Ponto em `--cf-accent`, rótulo com borda de acento, `aria-pressed="true"` |
| Cérebro | carregando / pronto / fallback | Pôster → canvas; fallback mantém seletores, links e o botão "Tentar carregar o 3D novamente" |
| Letreiro | `prefers-reduced-motion` | Para (animação `none`) |

## Responsivo

| Faixa | Mudanças |
|---|---|
| ≥ 1100 px | Artigo com sumário lateral fixo |
| 900–1099 px | Grades de 3 ou 4 colunas mantidas; artigo em uma coluna com sumário recolhível |
| 640–899 px | Grades caem para 1 coluna (as marcadas com `data-tablet="2"` ficam em 2); quadros sem divisória lateral |
| < 768 px | Escala de tipo e ritmo menores; faixas de pontos entre seções (`ds-dots`) |
| < 620 px | Cérebro com palco quadrado e marcadores nas laterais, em alturas alternadas (HOME-BRAIN-001 v1.0.1); botões dos cartões laranja em largura total |

## Edge cases

- **Vazio:** tema sem artigo usa o `EmptyState` "Nenhum artigo sobre … ainda". Tipo de ferramenta sem item usa o
  `EmptyState` com link para as soluções publicadas.
- **Conteúdo fora do ar:** os 9 artigos e as 19 URLs de exemplo respondem 302 (para `/artigos/` e `/ferramentas/`) e
  não aparecem em links nem no prerender.
- **Sem JS / sem WebGL:** pôster, seletores e links `noscript` do cérebro. O filtro do Blog cai para a lista completa.
- **Texto longo:** títulos com `text-wrap: balance` e `overflow-wrap: anywhere`. Cards com `min-width: 0`.

## Animação / motion

| Elemento | Gatilho | Animação | Duração | Easing |
|---|---|---|---|---|
| Hero da Home | carregamento | `heroReveal` (opacidade e 18 px) | `--dur-slow` (450 ms) | `--ease` |
| Cérebro | pronto, sem movimento reduzido | rotação contínua, pausável | 0,12 rad/s | linear |
| Letreiro do CTA | contínuo | translateX −100 % | 40 s | linear |
| Hover de botão e card | hover | cor de fundo | `--dur-fast` (150 ms) | `--ease` |

Com `prefers-reduced-motion`, toda animação e transição cai para ≤ 0,01 s e o cérebro começa parado.

## UX copy (interface; os textos canônicos não foram reescritos)

| Elemento | Texto | Padrão ux-copy |
|---|---|---|
| Aviso de demonstração | "Layout demonstrativo — Esta página está em reconstrução no design system novo; o conteúdo exibido é real." | Neutro, informativo |
| CTA do artigo exemplo | "Ler o guia de riscos cognitivos" | Verbo + objeto específico |
| Card do cérebro (Home) | "Abrir memória de trabalho no Mapa Cognitivo ›" | Verbo; o destino é o próprio rótulo |
| Card do cérebro (Mapa) | "Explorar as relações de memória de trabalho ›" | Verbo + objeto |
| Estado vazio (Blog) | "Nenhum artigo sobre dislexia ainda. Este tema está na taxonomia, mas os artigos dele ainda estão em reconstrução. Comece pelo guia geral. Ver todos os artigos ›" | O quê + por quê + como começar |
| Faceta indisponível | "Dislexia · em preparação" | Estado explícito, sem link falso |
| Próximo passo do artigo | "Explore a memória de trabalho no Mapa Cognitivo" | Verbo; leva ao foco no Mapa |

## Acessibilidade

- **Ordem de foco:** pular para o conteúdo → cabeçalho → `main` (trilha, aviso, h1, ações) → conteúdo → rodapé.
- **Teclado:** setas nos seletores do cérebro e nas abas (Radix); `Esc` no diálogo e na folha do fator; `details` nativo
  no sumário e na FAQ.
- **Leitor de tela:** cantos, pontos e letreiro duplicado têm `aria-hidden`; os chips de faceta ficam em lista
  rotulada; o card do cérebro tem `aria-live="polite"`.
- **Alvos:** ≥ 44 px nos controles do DS (verificado em `tests/ds.spec.ts`). Relatório completo em `A11Y.md`.
