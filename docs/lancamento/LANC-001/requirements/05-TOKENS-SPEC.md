# LANC-001 — Tokens: interface, ilustração, gráficos, vetores e imagens

- **ID:** RC-TOKENS-001 · **Versão:** 0.1.0 · **Decisões:** DEC-U2, DEC-U3, CF-01…04
- **Regra de casa (ADR-11):** hex só em `apps/blog/app/styles/global.css`; componentes usam variáveis.

## 1. Camadas

| Camada | Fonte | Onde vale | Status |
|---|---|---|---|
| **Interface** | Brand Local v7 = ADR-11 | texto, superfícies, ações, foco, bordas, em todas as rotas, artigos inclusive | vigente, sem mudança |
| **Ilustração e vetor** `--illu-*` | RC-BRAND-STYLING-001 | SVG, ilustrações, fundos decorativos, halftone | novo (RQ-011) |
| **Gráficos** `--chart-*` | ADR-04 | séries de gráfico | vigente (RQ-013) |
| **Grafo causal** `--graph-*` | aliases das camadas acima | nós, arestas, seleção | novo (RQ-076) |
| **Motion** | v7 | transições e entradas | novo (RQ-014) |
| **Componentes novos** | v7 + spec do mapa | sheet, nó, drawer | novo (RQ-015) |

## 2. Interface (sem mudança, referência)

`--background #FFFFFF` · `--surface-subtle #F5F5F4` · `--surface-tabular #EAEAE8` · `--surface-model #EFF6FF` ·
texto `#202124` · secundário `#6B7280` (`#5F6670` em superfície cinza) · ação `--primary #2563EB` (hover `#1D4ED8`) ·
Inter + IBM Plex Mono. Os valores do RC-BRAND-STYLING para texto (`#18346F`, `#56647A`) **não** entram na
interface (CF-01).

## 3. Ilustração e vetor (novo)

| Token | Valor | Contraste em #FFF | Pode | Não pode |
|---|---|---|---|---|
| `--illu-ink` | `#18346F` | 11,93:1 | traço principal, texto embutido em SVG | — |
| `--illu-blue` | `#3155E7` | 5,86:1 | contorno, via, foco da cena | substituir `--primary` em UI |
| `--illu-coral` | `#F28F83` | 2,33:1 | ênfase pontual, poucos pontos por composição | texto; único indicador de significado |
| `--illu-blue-soft` | `#A9BFF4` | 1,83:1 | planos, profundidade | texto; marca com significado sem contorno |
| `--illu-canvas` | `#F4F6F1` | — | fundo de ilustração | fundo de texto longo |

Regras: azul orienta e conecta; coral marca evento ou foco, com moderação; azul claro dá profundidade
(RC-BRAND-STYLING). Marca gráfica com significado precisa de 3:1 (RQ-012).

## 4. Grafo causal (aliases)

| Token | Aponta para | Papel |
|---|---|---|
| `--graph-node-bg` | `--surface-model` | fundo de nó |
| `--graph-node-border` | `--border-default` → seleção `--primary` | contorno |
| `--graph-edge` | `--muted-foreground` (≥ 3:1) | aresta padrão |
| `--graph-edge-active` | `--primary` | aresta destacada |
| `--graph-dim-opacity` | `.35` | nós fora de foco |
| `--graph-accent-event` | `--illu-coral` + contorno `--illu-ink` | ênfase de evento (decorativa) |

A paleta da spec do mapa (`#3659B7`, `#15213A`, `#EEF3FC`…) é traduzida para estes aliases e não vira hex novo.

## 5. Motion e componentes

| Token | Valor | Origem |
|---|---|---|
| `--ease` | `cubic-bezier(.22,1,.36,1)` | v7 |
| `--dur-fast` / `--dur-base` / `--dur-slow` | 150 / 250 / 450 ms | proposta (ASSUMPTION) |
| `--radius-card` | 2px | ADR-12 / v7 |
| `--radius-control` | 8px | ADR-11 / v7 |
| `--radius-pill` | 40px | v7 (nós e chips) |
| `--radius-sheet` | 20px (só cantos de cima) | spec do mapa |
| `--shadow-overlay` | `0 8px 28px rgb(0 0 0 / .10)` | v7 (drawer, sheet) |

## 6. Imagens

| Regra | Origem |
|---|---|
| Só as 6 `RC_*` são publicáveis; as `REF_*` nunca (RQ-031) | FT-06 |
| WebP, variantes 16:9 e retrato por recomposição, sem cortar pessoa, cérebro ou a ligação entre eles | RC-BRAND-STYLING |
| `alt` descritivo; entrada no `docs/banco-imagens/manifest.json` com `tem_texto: false` | ADR-12 |
| Fundo da imagem claro; nunca sob texto | RC-BRAND-STYLING, ADR-12 |

## 7. Testes que travam

`tests/tokens.spec.ts` (valores e `--ease`), `tests/surfaces.spec.ts` (hex só em `global.css`; card 2px) e um
teste novo de contraste dos aliases `--graph-*` (≥ 3:1).
