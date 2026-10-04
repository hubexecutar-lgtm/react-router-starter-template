# LANC-001 — Requisitos de produto

Conversão dos pacotes do intake (`../intake/`) em requisitos rastreáveis e importáveis.

| Arquivo | O que é |
|---|---|
| `00-PLANO-DE-IMPORTANCIA.md` | Ondas, ordem dos PRs, caminho crítico e o que cada pergunta destrava |
| `01-DECISOES-E-AMBIGUIDADES.md` | Decisões do usuário, fatos verificados, conflitos resolvidos, lacunas e perguntas Q1–Q8 |
| `02-PRD.md` | RC-PRD-001: problema, objetivo, escopo, princípios, métricas e riscos |
| `03-FRD.md` | RC-FRD-001: os 59 requisitos por épico, com critério de aceite (gerado) |
| `04-UIX-SPEC.md` | RC-UIX-001: rotas, shell, motion, anatomia das telas, semântica visual do grafo |
| `05-TOKENS-SPEC.md` | RC-TOKENS-001: tokens de interface, ilustração, vetor, gráfico, grafo, motion e imagem |
| `06-DATA-SPEC-GRAFO-CAUSAL.md` | RC-DATA-001: grafo único no formato da Teia Única e projeção para o mapa |
| `requisitos.json` | **Fonte única** dos requisitos |
| `requisitos.csv` | Exportação para importar (gerada) |
| `render.py` | Gera `requisitos.csv` e `03-FRD.md` a partir do JSON |

## Rastreabilidade

`intake/…` (arquivo + sha256) → FT/DEC/CF/GAP (`01-DECISOES`) → RQ (`requisitos.json`, campo `fonte`) → PR-A…L
(`00-PLANO`) → `/plan` do PR → commit. Para mudar um requisito, edite o JSON e rode `python3 render.py`.

## Importar

- **Linear / Jira / Notion / planilha:** `requisitos.csv` (UTF-8, cabeçalho na 1ª linha). Colunas: `id`,
  `titulo`, `descricao`, `tipo`, `prioridade` (P0–P3), `status`, `epico`, `epico_nome`, `pr`, `depende_de`
  (separado por `;`), `fonte`, `criterio_aceite`, `labels` (separado por `,`).
- **GitHub Issues:** um issue por requisito ou por épico, com título `[RQ-xxx] titulo`, labels de `labels` e
  corpo com descrição, critério de aceite, dependências e fonte. Criação sob pedido (convenção do `.handoff/`).
- **`/plan`:** cada PR usa os RQ da sua linha no `00-PLANO` como change list e os critérios como verificação.
