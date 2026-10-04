# LANC-001 — Workflow de engenharia

- **Status:** E1 concluída (requisitos v0.2.0, Q1–Q8 respondidas); E2–E6 começam pela onda 0 numa sessão nova (`KICKOFF-PROXIMA-SESSAO.md`)
- **Fluxo:** agent-handoff (`/plan` → `/execute` → `/verify`), um PR por linha do plano (ADR-M02)
- **Gates:** `npm run typecheck`, `npm run build`, `npm run test` (inclui `tests/hig.spec.ts`, ADR-M03)

## Etapas

| Etapa | O que acontece | Entrada | Saída | Gate para avançar |
|---|---|---|---|---|
| E0 Intake | Arquivos chegam em `intake/` com hash | uploads do usuário | `intake/`, `MANIFEST.sha256` | usuário declara intake fechado |
| E1 Requisitos | Conflitos resolvidos, lacunas e perguntas registradas, requisitos importáveis | intake + decisões | `requirements/` | Q* da linha respondidas |
| E2 ADR | Decisão que muda regra vigente vira ADR (ADR-13 do blog; emenda ao ADR-12; ADR de Ferramentas cognitivas substitui o ADR-08) | E1 | ADR em `CLAUDE.md` | ADR com status Aceita |
| E3 `/plan` | Plano do PR com os RQ da linha como change list | `00-PLANO` + RQ | `.handoff/plan.md` | plano revisado |
| E4 `/execute` | Implementa o plano; typecheck como rede de segurança | plano | código | typecheck limpo |
| E5 `/verify` | Testes, lint, gate HIG; critérios de aceite dos RQ; de preferência em sessão nova | código | `.handoff/review.md` | sem P0/P1, critérios cumpridos |
| E6 PR | PR pronto (nunca draft), checklist do template, auto-merge (merge commit) | branch verde | PR | CI verde → merge → deploy de produção |

`main` é a produção: o merge dispara o deploy pelo Workers Builds. Não existe branch de produção separada; cada PR
nasce de `main` atualizada.

## PRs (detalhe e ordem em `requirements/00-PLANO-DE-IMPORTANCIA.md`; saídas em `ENTREGAVEIS-POR-ONDA.md`)

| Onda | PR | Épico | Requisitos | Risco | Depende de |
|---|---|---|---|---|---|
| 0 | PR-A | EP-01 Marca e ícones | RQ-001, RQ-002 | Baixo | — |
| 0 | PR-B | EP-02 Tokens + ADR-13 | RQ-010…015 | Médio | — |
| 1 | PR-C | EP-03 Shell v6/v7 | RQ-020…026 | Alto | PR-B |
| 1 | PR-D | EP-04 Imagens (todo artigo com imagem) | RQ-030…033 | Médio | PR-B |
| 1 | PR-E | EP-05 Conteúdo canônico | RQ-040…046 | Médio | PR-C, PR-D |
| 1 | PR-F | EP-06 Jornada e menu | RQ-050…054 | Médio | PR-C |
| 1 | PR-J1 | EP-10 Ferramentas cognitivas (Loja retirada) | RQ-103, RQ-100 | Médio | PR-F |
| 2 | PR-G | EP-07 Grafo (Teia) | RQ-060…065 | Médio | — |
| 2 | PR-H | EP-08 Mapa | RQ-070…080 | Alto | PR-B, PR-C, PR-G |
| 3 | PR-I | EP-09 Personalizar | RQ-090 | Médio | PR-H |
| 3 | PR-K | EP-11 Medição (Cloudflare) | RQ-110, RQ-111 | Baixo | PR-G |
| 3 | PR-L | EP-12 Adapters da Teia | RQ-120…122 | Médio | PR-G, PR-J1 |
| 4 | PR-J2 | EP-10 Ferramenta piloto + Resultado | RQ-101, RQ-102 | — | Bloqueado (GAP-02, GAP-07) |

## Decisões

| ID | Pergunta original | Situação |
|---|---|---|
| D1 | v6 ou v7? | **Respondida:** arquitetura e interação do v6/v7, motion do v7 (DEC-U1) |
| D2 | Amarelo só como fundo? | **Sem efeito:** Brand Local em tudo (DEC-U2) |
| D3 | Imagem em todo artigo? | **Respondida:** todo artigo tem imagem (DEC-U7) |
| D4 | Logo substitui o favicon? | RQ-001: todo o `apps/blog`; o CMS do `apps/workflow` fica fora até ser pedido |
| D5 | OWNER e aprovação da Teia | **Respondida:** Aceita, OWNER Leonardo (DEC-U10, ADR-M04) |

Q1–Q8 respondidas em 2026-10-04 (DEC-U6…U13 em `requirements/01-DECISOES-E-AMBIGUIDADES.md`).

## Registro

| Data | Evento |
|---|---|
| 2026-10-04 | Intake aberto com `lancamento_.zip` (41 arquivos); workflow preparado |
| 2026-10-04 | Recebido `Docs__2.zip` (DOCS-002); respostas D1/D2; requisitos v0.1.0: 59 RQ, 12 épicos, 17 conflitos resolvidos, 7 lacunas, 8 perguntas |
| 2026-10-04 | Respostas Q1–Q8 registradas (DEC-U6…U13); Loja retirada em favor de Ferramentas cognitivas; Teia Aceita (OWNER Leonardo, ADR-M04); requisitos v0.2.0: 60 RQ, 56 READY |
