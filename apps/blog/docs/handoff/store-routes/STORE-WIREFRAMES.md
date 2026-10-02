# STORE-WIREFRAMES — wireframe → código

Os wireframes ASCII completos (hub desktop/mobile, lista de Skills, grid visual, detalhe
desktop/mobile) estão no contrato
[`DEV-STORE-ROUTES-001`](../../agent-prompts/DEV-STORE-ROUTES-001.md). Wireframe é
especificação de estrutura; este mapa liga cada nó ao código.

`WIREFRAME_NODE → COMPONENT → SOURCE_FILE → DATA → STATE → RESPONSIVE_RULE`

## Store Hub (`/loja/`)

| WIREFRAME_NODE | COMPONENT | SOURCE_FILE | DATA | STATE | RESPONSIVE_RULE |
|----------------|-----------|-------------|------|-------|-----------------|
| STORE_HEADER | `StoreHeader` (h1 + descrição + selo "Catálogo de exemplo") | `components/store-header.tsx` | texto fixo | READY | quebra em linha |
| SEARCH + FILTER | `Input[type=search]` + `Select` | `store-header.tsx` | `q`, `area` | READY | coluna no mobile, linha ≥ sm |
| TABS | `Tabs` em `ScrollArea` horizontal | `components/store-catalog.tsx` | `ITEM_TYPES` | READY | rola dentro do próprio container |
| CATEGORIAS | `CategoryCard` × tipos com itens | `components/category-card.tsx` | contagem por tipo | READY | 1 / 2 / 3 colunas |
| DESTAQUE | `FeaturedItem` | `components/featured-item.tsx` | `item.featured` | READY | coluna no mobile, linha ≥ sm |
| SKILLS + "Ver todas" | `CatalogSection` + `SkillCard` × 4 | `catalog-section.tsx`, `skill-card.tsx` | `type=skill` | READY | 1 col → 2 col ≥ md |
| E-BOOKS + "Ver todos" | `CatalogSection` + `VisualProductCard` × 3 | `visual-product-card.tsx` | `type=ebook` | READY | 1 → 2 → 3 col |
| (estados) | `CatalogSkeleton` / `CatalogEmpty` / `CatalogError` | `catalog-states.tsx` | `status`, resultados | LOADING/EMPTY/ERROR | largura total |

## Catálogos (`/loja/{tipo}/`)

| WIREFRAME_NODE | COMPONENT | SOURCE_FILE | DATA | STATE | RESPONSIVE_RULE |
|----------------|-----------|-------------|------|-------|-----------------|
| SKILLS_HEADER | `StoreHeader` (título = plural do tipo) | `store-header.tsx` | `lockedType` | READY | idem hub |
| SKILL_ROW | `SkillCard` (`Item` + borda de área) | `skill-card.tsx` | `StoreItem` | READY | lista 1 col → 2 col ≥ md |
| PRODUCT_CARD | `VisualProductCard` (capa 4:3 + barra de área) | `visual-product-card.tsx` | `StoreItem` | READY | grid adaptativo |

## Detalhe (`/loja/:type/:slug/`)

| WIREFRAME_NODE | COMPONENT | SOURCE_FILE | DATA | STATE | RESPONSIVE_RULE |
|----------------|-----------|-------------|------|-------|-----------------|
| BACK | `Button ghost` link | `item-detail.tsx` | tipo | READY | — |
| TITLE + TAGS | `h1` + `AreaBadge` + `Badge` | `item-detail.tsx` | `name`, `tags` | READY | quebra em linha |
| SYMBOL | contêiner de ícone da área | `item-detail.tsx` | `type`, `area` | READY | — |
| DESCRIÇÃO / CONTEXTO | `p` + `BoundedText` | `detail-cards.tsx` | `description`, `context` | READY | ScrollArea `max-h-48` |
| COMO FUNCIONA | `ItemFlowchart` (input → 3 passos → output) | `detail-cards.tsx` | `process`, `input`, `output` | READY | vertical em todos os tamanhos |
| REFERÊNCIAS | `ReferenceDisclosure` (`Collapsible`) | `detail-cards.tsx` | `references` | READY | — |
| PROBLEMA | `ProblemCard` | `detail-cards.tsx` | `problem` | READY | coluna direita ≥ lg |
| PROCESSO | `ProcessCard` (exatamente 3 passos) | `detail-cards.tsx` | `process` | READY | idem |
| PROGRESSO | `ProgressCard` (Plan/Do/Check/Act) | `detail-cards.tsx` | `progress` | READY | idem |
| CTA | `PrimaryCTA` | `detail-cards.tsx` | `cta` | READY (desabilitado no mock) | alinhado à direita ≥ sm |

Mobile: `grid` de 1 coluna abaixo de `lg`; ordem = título → tags → símbolo → descrição →
flowchart → referências → problema → processo → progresso → CTA.
