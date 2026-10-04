# LANC-001 — Workflow de engenharia

- **Status:** E1 em andamento: requisitos v0.1.0 preparados, aguardando Q1–Q8 e o fim do intake
- **Fluxo:** agent-handoff (`/plan` → `/execute` → `/verify`), um PR por linha do plano (ADR-M02)
- **Gates:** `npm run typecheck`, `npm run build`, `npm run test` (inclui `tests/hig.spec.ts`, ADR-M03)

## Etapas

| Etapa | O que acontece | Entrada | Saída | Gate para avançar |
|---|---|---|---|---|
| E0 Intake | Arquivos chegam em `intake/` com hash | uploads do usuário | `intake/`, `MANIFEST.sha256` | usuário declara intake fechado |
| E1 Requisitos | Conflitos resolvidos, lacunas e perguntas registradas, requisitos importáveis | intake + decisões | `requirements/` | Q* da linha respondidas |
| E2 ADR | Decisão que muda regra vigente vira ADR (ADR-13 do blog; emenda ao ADR-12 se Q2 = sim) | E1 | ADR em `CLAUDE.md` | ADR com status Aceita |
| E3 `/plan` | Plano do PR com os RQ da linha como change list | `00-PLANO` + RQ | `.handoff/plan.md` | plano revisado |
| E4 `/execute` | Implementa o plano; typecheck como rede de segurança | plano | código | typecheck limpo |
| E5 `/verify` | Testes, lint, gate HIG; critérios de aceite dos RQ; de preferência em sessão nova | código | `.handoff/review.md` | sem P0/P1, critérios cumpridos |
| E6 PR | PR pronto (nunca draft), checklist do template, auto-merge (merge commit) | branch verde | PR | CI verde → merge → deploy de produção |

`main` é a produção: o merge dispara o deploy pelo Workers Builds. Não existe branch de produção separada; cada PR
nasce de `main` atualizada.

## PRs (detalhe e ordem em `requirements/00-PLANO-DE-IMPORTANCIA.md`)

| PR | Épico | Requisitos | Risco | Pode começar? |
|---|---|---|---|---|
| PR-A | EP-01 Marca e ícones | RQ-001…003 | Baixo | Sim |
| PR-B | EP-02 Tokens + ADR-13 | RQ-010…015 | Médio | Sim |
| PR-C | EP-03 Shell v6/v7 | RQ-020…026 | Alto | Q1 |
| PR-D | EP-04 Imagens | RQ-030…033 | Médio | Parcial (Q2) |
| PR-E | EP-05 Conteúdo canônico | RQ-040…046 | Médio | Q7 |
| PR-F | EP-06 Jornada e menu | RQ-050…054 | Médio | Q1, Q3 |
| PR-G | EP-07 Grafo (Teia) | RQ-060…065 | Médio | Sim (Q8 para RQ-061) |
| PR-H | EP-08 Mapa | RQ-070…081 | Alto | Depois do PR-G |
| PR-I | EP-09 Personalizar | RQ-090 | Médio | Depois do PR-H |
| PR-J | EP-10 Ferramentas e Resultado | RQ-100…102 | — | Bloqueado (GAP-02/06/07) |
| PR-K | EP-11 Medição | RQ-110…111 | Baixo | RQ-110 já; RQ-111 bloqueado (GAP-03) |
| PR-L | EP-12 Adapters da Teia | RQ-120…122 | Médio | Bloqueado (GAP-01) |

## Decisões

| ID | Pergunta original | Situação |
|---|---|---|
| D1 | v6 ou v7? | **Respondida:** arquitetura e interação do v6/v7, motion do v7 (DEC-U1) |
| D2 | Amarelo só como fundo? | **Sem efeito:** amarelo/preto descartado, Brand Local em tudo (DEC-U2) |
| D3 | Imagem 100vh em todo artigo? | Proposta em CF-11, aguardando Q2 |
| D4 | Logo substitui o favicon em todo o site? | Proposta RQ-001: todo o `apps/blog`, incluindo as rotas `/admin` do blog; o CMS do `apps/workflow` fica fora até ser pedido |
| D5 | OWNER e aprovação da Teia | Aberta (Q5, GAP-01) |

Perguntas abertas: Q1–Q8 em `requirements/01-DECISOES-E-AMBIGUIDADES.md` §5.

## Registro

| Data | Evento |
|---|---|
| 2026-10-04 | Intake aberto com `lancamento_.zip` (41 arquivos); workflow preparado |
| 2026-10-04 | Recebido `Docs__2.zip` (DOCS-002); respostas D1/D2; requisitos v0.1.0: 59 RQ, 12 épicos, 17 conflitos resolvidos, 7 lacunas, 8 perguntas |
