# LANC-001 — Data spec: grafo causal único (Teia Única + mapa)

- **ID:** RC-DATA-001 · **Versão:** 0.1.0 · **Decisões:** CF-05, CF-06, CF-08, CF-09, CF-16
- **Formato de armazenamento:** `CORRELATION_RECORD.schema.json` da Teia Única (intake), sem campos removidos.
- **Projeção de interface:** o mapa causal lê o mesmo grafo e projeta os tipos da Teia para os 9 tipos visuais da
  spec RC-MOBILE-CAUSAL-MAP-UI-001. **Projeção não é fonte** (princípio da Teia).

## 1. Por que um grafo só

A Teia Única (Typed Property Graph), o Causal Knowledge Graph e o `causal_data_model` da spec do mapa descrevem os
mesmos objetos com vocabulários diferentes. O schema da Teia é o mais completo: tem proveniência, papel epistêmico,
status e IDs nativos. Ele vira o armazenamento, e cada superfície (mapa, artigo, Loja, analytics) é uma projeção.

## 2. Cadeia canônica → tipos da Teia → tipo visual do mapa

| Etapa (RC-LP-001 + P3) | Tipo na Teia | Tipo visual (spec do mapa) | Forma |
|---|---|---|---|
| Objetivo | `OBJECTIVE` | context | ● |
| Contexto | `CONTEXT` | context | ● |
| Demanda cognitiva | `RISK_FACTOR` com `INCREASES_DEMAND_ON` → `COGNITIVE_CAPACITY` | demand | ◆ |
| Capacidade exigida | `COGNITIVE_CAPACITY` | capacity | ■ |
| Vulnerabilidade | `VULNERABILITY` | vulnerability | ▲ |
| Exposição | `EXPOSURE` | risk | ! |
| Risco cognitivo | `RISK` | risk | ! |
| Evento | `OPERATIONAL_IMPACT` + `tags: ["stage:event"]` (CF-16) | event | ✦ |
| Impacto | `OPERATIONAL_IMPACT` + `tags: ["stage:impact"]` | impact | ⬢ |
| Compensação | `COMPENSATION` | compensation | ✓ |
| Controle / Solução | `CONTROL`, `METHOD`, `SOLUTION` | compensation | ✓ |
| Resultado · Medição · Aprendizado | `METRIC`, `LEARNING` | (fora do mapa público na fase 1) | — |
| Evidência | `EVIDENCE`, `CLAIM` | evidence | ○ |

`NEURODIVERGENCE_PROFILE` **não** aparece no mapa público: a Teia o restringe a associação baseada em evidência, e o
RC-LP-001 proíbe tratar característica individual como risco (CF-06).

## 3. Relações → semântica da aresta no mapa

| Tipo de aresta na Teia | `relation` no mapa | Polaridade | Traço | Rótulo |
|---|---|---|---|---|
| `INCREASES_DEMAND_ON`, `CONTRIBUTES_TO`, `MAY_PRODUCE` | increases / contributes_to | positive | sólida forte | "aumenta" / "contribui para" / "pode produzir" |
| `MITIGATES`, `ADDRESSES` | decreases | negative | sólida média | "reduz" / "trata" |
| `MODULATES` | moderates | unknown | sólida fina | "modula" |
| `ASSOCIATED_WITH` | associated_with | neutral | tracejada | "associado a" |
| qualquer tipo com `epistemic.provenance_class = E_INFERRED` | (mantém) | (mantém) | **tracejada** | rótulo + "(inferido)" |
| `SUPPORTED_BY` | — (vira lista de evidências do nó/aresta) | — | — | — |

## 4. Nível de evidência exibido

Derivado, nunca digitado à mão:

| `provenance_class` + `claim_role` | `evidence_level` exibido |
|---|---|
| `A_OBSERVED` ou `B_PRIMARY` com `evidence_refs` | strong |
| `C_PUBLISHED` com `evidence_refs` | moderate |
| `D_INTERNAL` + `FRAMEWORK`/`PRODUCT_DECISION` | framework (rótulo "conceito do projeto", RQ-043) |
| `E_INFERRED` ou `HYPOTHESIS` | hypothesis |
| sem `evidence_refs` | unknown |

## 5. Regras de validação (testes no `npm test`, PR-G)

1. O arquivo do grafo valida contra `CORRELATION_RECORD.schema.json`.
2. IDs estáveis e únicos; toda aresta aponta para nós existentes.
3. Toda aresta tem `epistemic.provenance_class` e `status` (princípio `edge_requires_provenance`).
4. Nenhum número (métrica, percentual, risco relativo) sem `evidence_refs` (RQ-063).
5. Relação que não está explícita no texto de origem = `E_INFERRED` + `PROPOSED` (regra da Teia).
6. Todo nó tem `source_refs` apontando para o artigo canônico de origem (RQ-062).
7. Projeção do mapa: nó focal inicial + vizinhos ≤ 8 (RQ-070).

## 6. Grafo inicial (fase 1, PR-G)

Fonte: RC-ART-P1-001 e RC-ART-P3-001. Candidatos a nó, a extrair e conferir no texto:

- **Fatores e eventos:** interrupção, troca de tarefa, sobrecarga, ambiguidade, pressão temporal, perda de
  contexto, retrabalho, erro.
- **Capacidades:** atenção, memória (de trabalho), planejamento, tomada de decisão.
- **Compensações (P3):** externalização, redução, explicitação, automação.
- **Controles e métodos (P2/P3):** checkpoint, checklist, WIP reduzido, runbook, estado persistente.
- **Evidências:** as 12 fontes do RC-SRC-001 como nós `EVIDENCE` (ISO 10075-2, ISO 31000, W3C COGA, Altmann &
  Trafton, Gilbert…).

## 7. Onde fica e como persiste

- Arquivo versionado no repo: `apps/blog/app/data/graph/rc-graph.json` (fase 1), validado no build (RQ-065).
- Vai para `packages/rc-graph` quando o `apps/workflow` também consumir o grafo (ADR-M01, RQ-064).
- Cloudflare D1 só se o CMS (`/admin`) precisar editar o grafo; sem Supabase (CF-08).

## 8. Ponto aberto para o OWNER da Teia (CF-16)

Na Teia, `EVENT` quer dizer **evento observável de analytics** (clique, conclusão). A cadeia causal usa "Evento"
para **evento operacional** (erro, omissão). A proposta acima usa `OPERATIONAL_IMPACT` com a tag `stage:event`, sem
mudar o schema. Alternativa: acrescentar o tipo `OPERATIONAL_EVENT` na v0.2.0 da Teia. Decisão do OWNER (GAP-01).
