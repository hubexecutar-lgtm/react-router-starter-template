# LANC-001 — Plano de importância

- **ID:** RC-LANC-001-PLAN · **Versão:** 0.1.0 · **Data:** 2026-10-04
- **Critério:** importância = (desbloqueia outros?) × (valor visível para quem lê) × (risco de retrabalho se adiado).
  Fundação e regras primeiro, conteúdo e jornada depois, interatividade pesada por último, e só o que depende de
  lacuna fica para depois.
- **Regra de execução:** um PR por linha, a partir de `main`, pronto e com auto-merge (ADR-M02). Cada PR passa
  por `/plan` → `/execute` → `/verify` com os requisitos da linha como change list.

## Ondas

| Onda | PR | Entrega | Requisitos | Por que nesta posição | Pode começar? |
|---|---|---|---|---|---|
| **0 · Fundação** | PR-A | Logo e favicon | RQ-001 | Independente, pequeno, visível em toda aba | **Sim** |
| | PR-B | ADR-13 + tokens de ilustração, grafo, motion e componentes + testes | RQ-010…015 | Todo PR visual depende desses tokens; mudar depois é retrabalho em cascata | **Sim** |
| **1 · Experiência de leitura** | PR-C | Shell v6/v7: nav desktop, drawer, barra inferior, chrome no scroll, heroReveal, carrossel | RQ-020…026 | Moldura de todas as páginas; afeta todos os testes HIG | Depois de Q1 |
| | PR-D | 6 ilustrações RC no banco + bloco 100vh do artigo | RQ-030…033 | Pré-requisito do conteúdo novo | RQ-030/031 sim; RQ-032 depois de Q2 |
| | PR-E | Home RC-LP-001 + 4 artigos canônicos + fontes + JSON-LD + pilares | RQ-040…046 | Maior valor editorial; precisa de shell e imagens | Depois de Q7 |
| | PR-F | Menu, 4 perguntas por página, escada de CTA, índice por problemas | RQ-050…054 | Liga leitura e exploração; o RQ-054 (índice por problemas) depende do grafo e só fecha depois do PR-G | Depois de Q1/Q3 |
| **2 · Exploração** | PR-G | Grafo canônico (formato da Teia) + grafo inicial + validação | RQ-060…065 | Dados antes da UI; destrava mapa, Loja e analytics | Sim (RQ-061 confirmar Q8) |
| | PR-H | Mapa Explorar + Detalhe + Lista + filtros + "Por quê?" | RQ-070…080 | Feature central do lançamento; depende de PR-B, PR-C e PR-G | Depois de PR-G |
| **3 · Personalização e medição** | PR-I | Personalizar | RQ-090 | Valor incremental sobre o mapa | Depois de PR-H |
| | PR-K | Gate CWV (RQ-110) já vale nas ondas 1–2; eventos (RQ-111) | RQ-110, RQ-111 | RQ-110 entra como verificação em cada PR | RQ-111 depois de GAP-03 |
| **4 · Bloqueado** | PR-J | Ferramentas, ferramenta piloto, Resultado | RQ-100…102 | Sem conteúdo nem regra de resultado | GAP-02, GAP-06, GAP-07 |
| | PR-L | Adapters da Teia (Quick Framework, Loja, registries) | RQ-120…122 | Depende de aprovar a Teia | GAP-01 |

## Caminho crítico

```
PR-B tokens ──┬──> PR-C shell ──┬──> PR-E conteúdo ──> PR-F jornada
              │                 │
PR-A logo     ├──> PR-D imagens ┘
              │
              └──> PR-G grafo ──> PR-H mapa ──> PR-I personalizar
```

PR-A e PR-G não dependem de nenhuma pergunta e podem correr em paralelo com PR-B.

## O que destrava cada pergunta

| Pergunta | Destrava |
|---|---|
| Q1 menu e barra inferior | PR-C, PR-F |
| Q2 bloco 100vh em todo artigo | RQ-032 (PR-D) |
| Q3 URLs | PR-F, rotas do PR-H |
| Q4 Ferramentas × Loja | PR-J |
| Q5 OWNER / aprovação da Teia | PR-L, CF-16 |
| Q6 analytics | RQ-111 |
| Q7 conteúdo canônico na home e como artigos novos | PR-E |
| Q8 cadeia canônica | RQ-061 (PR-G) |

## Fora desta onda

RQ-081 (simulação "e se…"), contas de usuário, persistência em servidor, Supabase.
