# N1 — Inventário de rotas (ADR-BLOG-JORNADA-ROTAS-001)

Levantado no código em 2026-10-06, a partir de `main` @ 42481ac.

- **Fontes:** `app/routes.ts`, `app/data/routes.ts`, `react-router.config.ts`, `content/`, `app/data/article-meta.ts`,
  `app/features/store/data/*`, `app/components/site/nav.ts` e `public/_redirects`.
- **Decisões do usuário** que valem para todas as tabelas: um layout demonstrativo por rota; só um artigo público
  (`riscos-cognitivos-guia`); os outros artigos fazem 302 para `/artigos/`; o catálogo mostra só itens reais.
- **Preservação:** nenhum MDX, ID ou fonte é apagado. O que sai do ar sai só da apresentação e da indexação.

## Rotas fixas

| URL | Papel (ADR §2.2) | Fonte do conteúdo | Destino depois | Status |
|---|---|---|---|---|
| `/` | Home geral: problema, orientação e prévias | RC-HOME-002 (hero), dados do grafo, catálogo real | Layout novo: hero, cérebro em prévia, prévias de Blog, Mapa e Ferramentas | 200 |
| `/artigos/` | Home do Blog | `content/artigos` (só os públicos), facetas | Índice editorial com o artigo exemplo e as facetas | 200 |
| `/mapas/` | Home do Mapa Cognitivo | `rc-graph.json`, cérebro HOME-BRAIN-001 | Cérebro completo, cards e modos | 200 |
| `/mapas/explorar/` | Relações causais | `rc-graph.json` | Mesmo comportamento, chrome novo | 200 |
| `/mapas/personalizar/` | Preferências locais | `prefs.ts` (localStorage) | Mesmo fluxo, chrome novo | 200 |
| `/ferramentas/` | Home de Ferramentas | `repository.ts` | Só itens reais (6 soluções) e o Prisma | 200 |
| `/prisma/` | Ferramenta interativa | `features/prisma` | Intro e formulário novos; folha A4 é exceção | 200 |
| `/sobre/` | Projeto, princípios, limites | `LANDING`, `GOVERNANCE_NOTE` | Ganha o RC-HOME-002 completo (decisão do usuário) | 200 |
| `/fontes/` | Índice de fontes | `SOURCES`, `SCIENTIFIC_SOURCES`, `HOME_SOURCES` | Layout novo | 200 |
| `/comece/` | RC-LP-001 | `LANDING` | Layout de orientação novo, com o texto integral | 200 |
| `/admin/`, `/admin/rotas/`, `/admin/handoff/`, `/admin/relatorio-exemplo/`, `/admin/design-system/`, `/admin/stories-fixtures/` | Operação interna (fora da jornada) | Vários | Migram para o DS novo; o showroom vira o do DS novo | 200, noindex |
| `*` | 404 | `NotFoundPage` | Layout novo | 404 |

## Famílias dinâmicas

| Família | Itens hoje | Exemplo público | Os demais |
|---|---|---|---|
| `/artigos/:slug/` | 10 MDX `ready` | `riscos-cognitivos-guia` | 302 → `/artigos/` (lista abaixo) |
| `/mapas/explorar/:fatorId/` | um por fator do grafo | Todos continuam (dados reais do grafo, um template) | — |
| `/ferramentas/:type/` | 9 tipos | `solucoes` (com itens reais) | Tipos sem item real mostram estado vazio honesto (200) |
| `/ferramentas/:type/:slug/` | 6 soluções + 19 mock | As 6 soluções (um template) | 19 URLs mock → 302 `/ferramentas/` |

### Artigos que fazem 302 para `/artigos/`

Todos os MDX ficam intactos. Os IDs vêm de `article-meta.ts`.

| Slug | contentId |
|---|---|
| `riscos-cognitivos` | RC-ART-P1-001 |
| `processos-neuroadaptativos` | RC-ART-P2-001 |
| `compensacao-cognitiva` | RC-ART-P3-001 |
| `tres-pilares-riscos-cognitivos` | RC-ART-MASTER-001 |
| `risco-cognitivo` | autor (PR #19) |
| `o-que-sao-riscos-cognitivos` | RC-PUB-003-A01 |
| `funcoes-executivas-demandas-risco` | RC-PUB-003-A02 |
| `riscos-cognitivos-rotina-estudos-trabalho` | RC-PUB-003-A03 |
| `estrategias-reduzir-riscos-cognitivos` | RC-PUB-003-A04 |

### Itens mock que fazem 302 para `/ferramentas/`

Os dados ficam em `mock-items.ts` e não entram mais em `listItems()`.

| Tipo | URLs |
|---|---|
| Skills | `/ferramentas/skills/skill-001/` … `skill-010/` |
| E-books | `/ferramentas/ebooks/ebook-011/` … `ebook-013/` |
| Prompts | `/ferramentas/prompts/prompt-014/` … `prompt-016/` |
| Workbook | `/ferramentas/workbooks/workbook-017/` |
| HTML | `/ferramentas/html/html-018/` |
| Asset | `/ferramentas/assets/asset-019/` |

## Links que apontavam para destinos que saem do ar

Corrigidos no mesmo PR (ADR §4.4):

| Origem | Destino antigo | Destino novo |
|---|---|---|
| `nav.ts` `PILLAR_TRAIL` e rodapé "Os 3 pilares" | `/artigos/riscos-cognitivos/`, `/processos-neuroadaptativos/`, `/compensacao-cognitiva/` | A trilha sai do site (a `CategoryRail` some com o DS antigo); o rodapé passa a listar as áreas: Blog, Mapa, Ferramentas |
| `home.ts` `HOME_PILLARS` (trilha 01–03) | P1 e P2 | `/artigos/riscos-cognitivos-guia/`, `/mapas/`, `/ferramentas/` |
| `sobre.tsx` | `/artigos/riscos-cognitivos/` | `/artigos/riscos-cognitivos-guia/` |
| `SolutionDetail.tsx` (link da série) | `/artigos/estrategias-reduzir-riscos-cognitivos/` | `/artigos/riscos-cognitivos-guia/` (série) |
| `article-meta.ts` `riscos-cognitivos-guia.next` | `/artigos/o-que-sao-riscos-cognitivos/` | `/mapas/?foco=COG-MEMORIA-TRABALHO` (ponte para o Mapa, ADR §2.1) |
| Cards de mock no catálogo | `cta.target: "#"` | Removidos com os mock (ADR §4.2: CTA `#` não é ação) |
