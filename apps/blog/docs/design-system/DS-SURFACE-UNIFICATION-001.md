> **SUBSTITUÍDO (2026-10-06):** os valores e a geometria deste contrato foram substituídos pelo RC-DS-CF (ADR-26,
> `DS-CF-001.md`). As camadas de superfície continuam como aliases dos tokens `--cf-*`.

# DS-SURFACE-UNIFICATION-001 — Superfícies, bordas e elevação

| Campo | Valor |
|---|---|
| ID | DS-SURFACE-UNIFICATION-001 (origem: `DS-SURFACE-UNIFICATION-HANDOFF-001`, arquivado em `docs/handoff/surface-unification/`) |
| Decisão | ADR-09 (`CLAUDE.md`) |
| Camada do Design System | 02. Surfaces & Elevation (tokens) → 03. Primitives (Card, Table, Panel) → 04. Components |
| Status | IMPLEMENTED |
| Showroom | `/admin/design-system#tokens` ("Superfícies, bordas e elevação") |
| Testes | `tests/surfaces.spec.ts` |

## 1. Contrato

O visual das tabelas aprovadas deixa de ser um subsistema `--plain-*` e vira o contrato global.
Tudo é definido uma vez, em `app/styles/global.css`:

| Token | Valor (claro) | Uso |
|---|---|---|
| `--surface-page` | `--background` (#FFFFFF) | fundo da página, overlays |
| `--surface-subtle` | #FAFAFA | áreas secundárias |
| `--surface-default` | #F8F8F8 | **cards, células de tabela, painéis, diagramas** (`--card`) |
| `--surface-hover` | #F3F3F3 | hover (`--muted`, `--secondary`, `--accent`) |
| `--surface-selected` | #EEEEEE | item ou linha selecionada |
| `--border-subtle` / `-default` / `-strong` | #F0F0F0 / #EBEBEB / #DADADA | `--border` = default; só estrutura |
| `--elevation-flat` / `-raised` / `-overlay` | `none` / `0 1px 2px …/.04` / `0 8px 28px …/.10` | ver §2 |
| `--surface-radius-card` / `-cell` | `--radius-xl` / `--radius-sm` | cards / células |

Aliases (sem sistema paralelo): `--plain-surface`, `--plain-border`, `--plain-text`, `--plain-accent(-soft)`,
`--table-surface`, `--table-head-surface`, `--table-selected`, `--surface-neutral`, `--surface-neutral-border`.

Texto e marca: `--foreground` #111111 · `--muted-foreground` #6A6A72 · `--muted-foreground-subtle` #727272 ·
`--primary` #306DD4 (hover `--primary-hover` #255CBD, fundo `--primary-soft` #EEF4FF).

## 2. Elevação

| Tipo | Superfície | Borda | Sombra |
|---|---|---|---|
| Página | page | — | — |
| Card, painel, tabela, Plain/Ascii, callout (card) | default | default | **nenhuma** |
| Card clicável | default → hover | default | nenhuma (feedback por superfície/foco) |
| Controles (button, input, select, tabs, slider) | — | `--input` | `raised` (`shadow-xs`/`sm`) |
| Popover, dropdown, select, hover-card, menus | page | default | `overlay` (`shadow-md`) |
| Dialog, drawer, sheet | page | default | `overlay` (`shadow-lg`) |

A escala do Tailwind colapsa em dois níveis: `shadow-2xs…sm` = `raised`, `shadow-md…2xl` = `overlay`.
`Card` usa `shadow-none`. Um teste falha se `shadow-md/lg/xl` aparecer fora de um overlay ou `shadow-sm` num card.

## 3. Regras de composição

- Tabela dentro de card: as células sobem para `--surface-page` (senão somem no fundo do card); o cabeçalho
  continua em `--border-default`. A linha selecionada usa `--surface-selected`.
- O raio de 28px/22px é só dos painéis Plain/Ascii grandes; cards comuns usam a escala global.
- `#EBEBEB` tem contraste ~1,1:1: nunca para texto, ícone ou estado que dependa só da borda.
- Controles continuam com `--input` (#D2D2D7): o contorno de campos não pode ficar mais fraco que a borda de card.
  Por isso o `Button outline` passou de `border` para `border-input`.
- Callouts semânticos não são neutralizados (família cromática = significado); só perderam a sombra do card.

## 4. Desvios deliberados do handoff

| Handoff | Implementado | Motivo |
|---|---|---|
| Texto auxiliar #737373 | #727272 | #737373 dá 4,46:1 sobre #F8F8F8 (< AA); #727272 dá 4,53:1 |
| `border-spacing` 4px (ZIP) / 2px (mensagem) | 3px (inalterado) | é o efeito já aprovado nas tabelas |
| Brand excluído do escopo (ZIP) | primário #306DD4 | decisão do usuário (substitui #0A6FDB; ADR-03 atualizado) |
| `--muted` = #F5F5F7 | `--muted`/`--secondary`/`--accent` = `--surface-hover` #F3F3F3 | elimina o quase-duplicado frio |
| `--surface-neutral*` | mantidos como aliases | compatibilidade com o handoff |
| Texto do Plain #000 | `--foreground` #111111 | um só token de texto |
| Texto secundário #6E6E73 | #6A6A72 | AA também sobre `--surface-selected` (4,62:1) |
| `#306DD4` sobre `#EEF4FF` | só como fundo | texto azul ali dá 4,46:1 |

Tema escuro: PROVISIONAL (sem especificação); os mesmos nomes de token, valores derivados do tema atual.

## 5. Matriz de migração — estado

| Família | Estado |
|---|---|
| Card/default | feito (`shadow-none`, superfície/borda por token) |
| Table + tabela Markdown | feito (tabela em card sobe para a superfície da página) |
| PlainSurface / PlainTextPanel / AsciiDiagram | feito (aliases dos tokens globais) |
| Admin cards, rotas | feito (sem `shadow-sm`; hover = `--surface-hover`) |
| CategoryCard / SkillCard / VisualProductCard / FeaturedItem | herdam `Card` (nada próprio a remover) |
| KPI / data cards | herdam `Card`; gráficos inalterados |
| Popover / Dialog / Drawer / Sheet | confirmados como únicos usuários de `overlay` |
| Callouts | sem mudança de cor; card sem sombra |

## 6. Critérios de aceite (handoff §11) → evidência

| # | Critério | Evidência |
|---|---|---|
| 1 | Card/default = surface-neutral, sem sombra | `surfaces.spec.ts` (showroom, /admin/, /admin/rotas/, /loja/) |
| 2 | Tabelas com células cinza separadas | `plain.spec.ts` + teste "table inside a card" |
| 3 | PlainSurface sem hex duplicado | teste de código: hex só em `global.css` |
| 4 | Nenhum card com shadow-md/lg/xl | teste de código |
| 5 | Overlays distinguíveis | teste do dialog (`elevation-overlay`) |
| 6 | Sem regressão de contraste/foco/teclado | testes AA (claro e escuro) + axe existentes |
| 7 | Sem overflow horizontal | `surfaces.spec.ts` (desktop e 390px) |
| 8 | Screenshots desktop + mobile | `/admin/`, `/blog/`, artigo, `/loja/` em `tests/__screenshots__/` |
| 9 | Sem novos hex fora dos tokens | teste de código |
| 10 | Build, lint e testes com exit 0 | ver o commit |
