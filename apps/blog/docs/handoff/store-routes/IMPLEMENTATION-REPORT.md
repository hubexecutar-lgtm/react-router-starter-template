# IMPLEMENTATION-REPORT — DEV-STORE-ROUTES-001 v1.0.0

Data: 2026-09-30 · ADR: `ADR-STORE-ROUTES-UI-001` · Dados: mock

## Sequência executada (WIP = 1)

Inspeção (Astro estático, shadcn completo, tokens em `global.css`, navbar em `ITEMS`) →
Component Map → tokens de área → dados mock + repositório → `/loja` → `/loja/skills` +
demais tipos → `/loja/:type/:slug` → busca/filtros → estados → navegação → verificação.

## Verificação

- `astro build`: OK (46+ páginas; 9 rotas de catálogo + 19 detalhes).
- `tsc`: nenhum erro novo (os existentes são anteriores: `blog-post`, `data-gallery`, `worker`…).
- `eslint` nos arquivos novos/alterados: limpo.
- Playwright: `tests/store.spec.ts` 45/45 (2 execuções consecutivas). Suíte do design system:
  passou (31/31) sem as mudanças e com elas; uma falha isolada em "AA contrast (dark)" numa
  execução paralela passou ao rodar sozinha e em reruns completos (intermitente, fora da Store).
- axe (`serious`/`critical`) em `/loja/`, `/loja/skills/`, `/loja/ebooks/`, detalhe: 0.
- Overflow horizontal em 320/375/768/1024/1440 px: 0.

## Dev Check

| CHECK_ID | CRITERION | PASS_FAIL | EVIDENCE | FILE | LINE_OR_COMPONENT | ACTION_REQUIRED |
|----------|-----------|-----------|----------|------|-------------------|-----------------|
| AC-001 | Design System reutilizado | PASS | só `ui/*` + tokens existentes | `store/components/*` | — | — |
| AC-002 | Sem primitive duplicado | PASS | COMPONENT-MAP; um deslize (tag em span) corrigido para `Badge` | `featured-item.tsx` | `FeaturedItem` | — |
| AC-003 | `/loja` funciona | PASS | teste "routes render" + "hub" | `pages/loja/index.astro` | `StoreCatalog` | — |
| AC-004 | `/loja/skills` funciona | PASS | teste `/loja/skills fixes type=skill` | `pages/loja/[type]/index.astro` | `lockedType` | — |
| AC-005 | Detalhe funciona | PASS | teste "detail…" | `pages/loja/[type]/[slug].astro` | `ItemDetail` | — |
| AC-006 | Busca no mock | PASS | teste "search filters" (nome, tag, tipo, área) | `lib/filter-items.ts` | `filterItems` | — |
| AC-007 | Filtro de tipo | PASS | teste "type filter (tabs)" | `store-catalog.tsx` | `Tabs` | — |
| AC-008 | Filtro de área | PASS | teste "area filter" | `store-header.tsx` | `Select` | — |
| AC-009 | Institucional azul | PASS | `--area-institutional` = brand; contraste ≥ 4.5 | `global.css` | tokens | Uso amplo (nav ativa azul) fica para quando houver telas institucionais na Loja |
| AC-010 | Artigos amarelo | PASS | `--area-editorial` = attention (âmbar do sistema) | `global.css` | tokens | — |
| AC-011 | Skills verde | PASS | teste "area markers": borda da linha = `--area-skills` | `skill-card.tsx` | `border-l-4` | — |
| AC-012 | Cores adicionais consistentes | PASS | AREA-COLOR-MAP; 6 cores distintas, AA claro/escuro | `area-tokens.ts` | `AREAS` | — |
| AC-013 | Skills = plugin/list | PASS | `SkillCard` (`Item`) | `skill-card.tsx` | — | — |
| AC-014 | Visuais = connector/grid | PASS | `VisualProductCard` com capa | `visual-product-card.tsx` | — | — |
| AC-015 | Problema, Processo, Progresso | PASS | teste "detail" | `detail-cards.tsx` | 3 cards | — |
| AC-016 | Processo com 3 passos | PASS | tipo `[ProcessStep ×3]` + teste (3 `li`) | `types/store.ts` | `process` | — |
| AC-017 | Flowchart = mesmos 3 passos | PASS | teste compara rótulos | `detail-cards.tsx` | `ItemFlowchart` | — |
| AC-018 | Rolagem controlada | PASS | `BoundedText` (`ScrollArea max-h-48`, foco por teclado) | `detail-cards.tsx` | — | — |
| AC-019 | Mobile em coluna única | PASS | teste "single column on mobile" | `item-detail.tsx` | grid | — |
| AC-020 | Sem overflow horizontal | PASS | 20 testes (4 rotas × 5 larguras) | `tests/store.spec.ts` | — | — |
| AC-021 | Loading | PASS | `?estado=carregando` | `catalog-states.tsx` | `CatalogSkeleton` | — |
| AC-022 | Empty | PASS | `/loja/agentes/` e busca sem resultado | `catalog-states.tsx` | `CatalogEmpty` | — |
| AC-023 | Error | PASS | `?estado=erro` + "Tentar novamente" | `catalog-states.tsx` | `CatalogError` | — |
| AC-024 | Mock separado da UI | PASS | só `repository.ts` importa `mock-items.ts` | `data/` | — | — |
| AC-025 | Navegação por teclado | PASS | teste "Loja reachable by keyboard"; foco visível nos cards/links | `navbar.tsx` | item "Loja" | — |
| AC-026 | Sem schemas finais | PASS | contrato provisório em `types/store.ts` | `types/store.ts` | `StoreItem` | — |

## Limitações conhecidas

- CTA do detalhe fica desabilitado enquanto `cta.target === "#"` (destino não conectado).
- LOADING/ERROR são pré-visualizados por `?estado=`; com backend real virão do fetch.
- Não há paginação, ordenação, filtro por tag, preço ou download (fora do escopo).
- Verde/verde-azulado/violeta são exceção ao ADR-03, restrita a `--area-*` (ver ADR-05).
- A navbar ganhou um item ("Loja"); a barra é estreita (`max 700px`) — conferir visualmente.
