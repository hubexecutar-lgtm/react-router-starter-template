# ADR-STORE-ROUTES-UI-001 — Rotas de Loja, Skills e Assets sobre a UI existente

- **Versão:** 1.0.0
- **Área:** UI / Store / Skills / Editorial / Assets
- **Tipo:** Arquitetura + UX + Frontend
- **Executor:** [`docs/agent-prompts/DEV-STORE-ROUTES-001.md`](../agent-prompts/DEV-STORE-ROUTES-001.md)
- **Handoff:** [`docs/handoff/STORE-ROUTES-HANDOFF.md`](../handoff/STORE-ROUTES-HANDOFF.md)

Este ADR registra **por que** e **qual arquitetura** foi decidida. O **como executar** vive no
Agent Prompt; o **onde começar** no Handoff; o resultado é o código.

## STATUS

> Trazido para o monorepo em 2026-10-02 a partir de `executar-23/Risco-cognitivo-blog@c3a4219`
> (branch `claude/trusting-gates-go053v`). O projeto agora é React Router 7: as rotas viram
> módulos em `app/routes/` (ADR-08 em `apps/blog/CLAUDE.md`); o restante desta decisão vale como está.

Aceita para implementação. Implementação da primeira versão (mock data) registrada em
`docs/handoff/store-routes/IMPLEMENTATION-REPORT.md`.

## CONTEXT

O projeto já tem UI, Design System (shadcn + tokens `--callout-*`, `--chart-*`), componentes
reutilizáveis (Card, Badge, Tabs, Input, ScrollArea, Separator, Collapsible, Progress, Empty,
Alert, Skeleton, Item…) e identidade visual. A arquitetura Public/Private e os schemas
definitivos ainda estão em formalização. O frontend não deve esperar por eles: esta etapa usa
**dados de exemplo**, sem inventar evidências, claims, preços, métricas ou integrações.

## DECISION

Criar a Store como nova área de navegação **reaproveitando integralmente** componentes e tokens
existentes. Quatro padrões de UX (as referências são padrões, não identidade a copiar):

| Padrão | Uso |
|--------|-----|
| BROWSE | descoberta, busca, categorias |
| PLUGIN-LIKE | Skills, Agentes, Prompts (linha/lista compacta) |
| CONNECTOR-LIKE | E-books, PDFs, HTML, Workbooks, Assets (grid com capa) |
| REPORT-LIKE | detalhe do item com Problema + Processo + Progresso |

Cor = marcador de **área**, nunca preenchimento dominante:

```text
cor = categoria / área      estrutura = componente
hierarquia = layout         estado = texto / iconografia / componente
```

## ROUTES

O projeto é Astro estático (`output: "static"`, roteamento por arquivos em `src/pages`); não há
router a substituir. Rotas novas:

| Rota | Arquivo | Papel |
|------|---------|-------|
| `/loja` | `app/routes/loja._index.tsx` | Store Hub |
| `/loja/{skills,agentes,prompts,ebooks,pdfs,html,workbooks,assets}` | `app/routes/loja.$type._index.tsx` | catálogo com `type` fixo |
| `/loja/:type/:slug` | `app/routes/loja.$type.$slug.tsx` | detalhe |

Todas montam o mesmo shell/ilha (`StoreCatalog`); `/loja/skills` apenas configura `type=skill`.
Rotas existentes (`/blog`, `/admin`…) não foram renomeadas. `/artigos` e `/skills` do contrato
permanecem como **áreas cromáticas**; o conteúdo editorial segue em `/blog`.

## COLOR SYSTEM

Camada nova **`--area-*`** (semântica) sobre os primitivos existentes; a interface segue neutra.

| Área | Cor | Origem |
|------|-----|--------|
| Institucional | azul | `--color-brand-*` (existente) |
| Artigos / Editorial | amarelo (âmbar do sistema) | `--color-attention-*` (existente) |
| Skills | verde | primitivo novo `--green-*` |
| Operações | verde-azulado | primitivo novo `--teal-*` |
| Ferramentas | violeta | primitivo novo `--violet-*` |
| Dados / Loja | neutro | `--muted-foreground` / `--foreground` |
| Pesquisa | reservado | sem valor até ser usada |

Uma área = uma cor estável; a cor sempre acompanha texto/ícone. Valores, contraste e racional:
`docs/handoff/store-routes/AREA-COLOR-MAP.md`.

> **Relação com o ADR-03.** O ADR-03 limita os *callouts* a 3 famílias. Os marcadores de área
> são uma camada distinta, pedida explicitamente por este contrato (verde para Skills e "outras
> cores" para demais domínios). As famílias `brand`/`attention`/`critical` e os callouts **não
> mudam**; verde, verde-azulado e violeta só existem como `--area-*` e não podem ser usados em
> callouts, gráficos ou variantes de estado.

## COMPONENT REUSE

Primitives reutilizadas sem cópia: `Card`, `Badge`, `Button`, `Tabs`, `Input`, `Select`,
`ScrollArea`, `Separator`, `Collapsible`, `Empty`, `Alert`, `Skeleton`, `Spinner`, `Item`,
`AspectRatio`. Componentes de feature (composições, em `app/features/store/components`):
`StoreCatalog`, `StoreHeader`, `CategoryCard`, `FeaturedItem`, `CatalogSection`, `SkillCard`,
`VisualProductCard`, `ItemDetail` (+ `ProblemCard`, `ProcessCard`, `ProgressCard`,
`ItemFlowchart`, `ReferenceDisclosure`, `PrimaryCTA`). Mapeamento completo:
`docs/handoff/store-routes/COMPONENT-MAP.md`.

## WIREFRAMES

Store Hub (desktop e mobile), lista de Skills, grid de produtos visuais e detalhe em duas
colunas estão no contrato (seções `STORE_HOME_WIREFRAME`, `MOBILE_STORE_WIREFRAME`,
`SKILLS_ROUTE_WIREFRAME`, `VISUAL_PRODUCTS_ROUTE`, `DETAIL_ROUTE`, `DETAIL_MOBILE`) e o
mapeamento wireframe → código em `docs/handoff/store-routes/STORE-WIREFRAMES.md`.

## MOCK DATA STRATEGY

- Dados em `app/features/store/data/mock-items.ts`; nunca dentro de componentes de apresentação.
- Acesso só via `app/features/store/data/repository.ts` — ponto único a trocar quando o backend e
  os schemas definitivos existirem.
- Catálogo mínimo: 10 Skills, 3 E-books, 3 Prompts, 3 Workbook/HTML/Asset. Textos claramente
  genéricos; sem preço, métrica, evidência, connector ou download reais.

## RESPONSIVE RULES

Desktop: catálogo multi-coluna e detalhe em split. Tablet: grid adaptativo. Mobile: coluna
única, sem colunas divididas, sem overflow horizontal estrutural (tabs rolam dentro de
`ScrollArea`).

## ACCESSIBILITY

HTML semântico, ordem lógica de headings, foco visível, navegação por teclado, `aria-label`
onde necessário, alvos de toque ≥ 40px, `prefers-reduced-motion` respeitado, contraste AA e cor
de área nunca como única informação.

## CONSEQUENCES

- Trocar mock por backend toca só `repository.ts` (e `types/`).
- Novas áreas exigem entrada em `area-tokens.ts` + token documentado antes do uso.
- Três matizes novas entram no CSS global apenas como marcadores de área.
- Não há paginação, filtros avançados, checkout, preço nem autenticação neste workflow.

## ACCEPTANCE CRITERIA

AC-001…AC-026 do contrato. Evidência por critério (Dev Check) em
`docs/handoff/store-routes/IMPLEMENTATION-REPORT.md`.
