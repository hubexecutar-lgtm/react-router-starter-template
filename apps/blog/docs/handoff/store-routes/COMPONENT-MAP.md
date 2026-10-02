# COMPONENT-MAP — DEV-STORE-ROUTES-001

Regra: **reutilizar, não reconstruir**. Nenhum primitive foi duplicado; toda composição vive em
`app/features/store/components`.

## Requisito → componente

| REQUIREMENT | EXISTING_COMPONENT | ACTION | VARIANT | NEW_COMPONENT_REQUIRED | FILE |
|-------------|--------------------|--------|---------|------------------------|------|
| Busca | `Input` (`type="search"`) | reuse | default + ícone | não | `ui/input.tsx` |
| Filtro de área | `Select` | reuse | default | não | `ui/select.tsx` |
| Filtro de tipo | `Tabs` (+ `ScrollArea` horizontal) | reuse | default | não | `ui/tabs.tsx` |
| Tag / tipo / área | `Badge` | reuse | `outline`, `secondary` | não (`AreaBadge` compõe) | `ui/badge.tsx` |
| Linha de Skill | `Item` + `ItemMedia` + `Badge` | compose | `outline` | `SkillCard` (feature) | `store/components/skill-card.tsx` |
| Card de produto | `Card` + `AspectRatio` + `Badge` | compose | default | `VisualProductCard` (feature) | `store/components/visual-product-card.tsx` |
| Card de categoria | `Card` | compose | default | `CategoryCard` (feature) | `store/components/category-card.tsx` |
| Destaque | `Card` + `Button` + `Badge` | compose | `border-l-4` | `FeaturedItem` (feature) | `store/components/featured-item.tsx` |
| Cabeçalho + busca | `Input` + `Select` + `Badge` | compose | — | `StoreHeader` (feature) | `store/components/store-header.tsx` |
| Seção de catálogo | heading + link | compose | — | `CatalogSection` (feature) | `store/components/catalog-section.tsx` |
| Texto longo | `ScrollArea` | reuse (+ prop `viewportProps`) | vertical, `max-h-48` | `BoundedText` (feature) | `ui/scroll-area.tsx` |
| Separador | `Separator` | reuse | horizontal | não | `ui/separator.tsx` |
| Referências | `Collapsible` | reuse | — | `ReferenceDisclosure` (feature) | `ui/collapsible.tsx` |
| Problema / Processo / Progresso | `Card` | compose | — | `ProblemCard`, `ProcessCard`, `ProgressCard` | `store/components/detail-cards.tsx` |
| Flowchart | `<ol>` + tokens | compose | vertical | `ItemFlowchart` (feature) | `store/components/detail-cards.tsx` |
| CTA | `Button` | reuse | `lg`, `disabled` no mock | `PrimaryCTA` (feature) | `store/components/detail-cards.tsx` |
| Voltar | `Button` | reuse | `ghost`, `asChild` | não | `store/components/item-detail.tsx` |
| Loading | `Skeleton` + `Spinner` | reuse | — | `CatalogSkeleton` | `store/components/catalog-states.tsx` |
| Empty | `Empty*` | reuse | `icon` | `CatalogEmpty` | `store/components/catalog-states.tsx` |
| Error | `Alert` | reuse | `destructive` | `CatalogError` | `store/components/catalog-states.tsx` |
| Navegação | `Navbar` (`ITEMS`) | extend | item "Loja" | não | `blocks/navbar.tsx` |

## Mudanças em componentes existentes

| Arquivo | Mudança | Compatibilidade |
|---------|---------|-----------------|
| `ui/scroll-area.tsx` | prop opcional `viewportProps` (tabIndex/role/aria-label no viewport) | aditiva; sem uso anterior afetado |
| `blocks/navbar.tsx` | item "Loja" + estado ativo por prefixo (`isActive`) | comportamento anterior mantido |
| `styles/global.css` | camada `--area-*` (ver AREA-COLOR-MAP) | aditiva |

## Composições de feature do contrato não criadas como arquivo próprio

`StoreShell` e `StoreNavigation` são cobertos por `DefaultLayout` + `Navbar` existentes;
`StoreSearch` é o `Input` dentro de `StoreHeader`; `ItemIdentity` é o bloco de símbolo em
`ItemDetail`; `PrimaryCTA`/`ReferenceDisclosure`/cards de detalhe estão agrupados em
`detail-cards.tsx` (arquivos pequenos, sem componente monolítico).
