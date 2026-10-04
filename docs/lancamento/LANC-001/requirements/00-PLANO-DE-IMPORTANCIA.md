# LANC-001 — Plano de importância

- **ID:** RC-LANC-001-PLAN · **Versão:** 0.2.0 · **Data:** 2026-10-04 · Q1–Q8 respondidas (DEC-U6…U13)
- **Critério:** importância = (desbloqueia outros?) × (valor visível para quem lê) × (risco de retrabalho se adiado).
  Fundação e regras primeiro, conteúdo e jornada depois, interatividade pesada por último.
- **Regra de execução:** um PR por linha, a partir de `main` atualizada, pronto e com auto-merge (ADR-M02). Cada PR
  passa por `/plan` → `/execute` → `/verify` com os requisitos da linha como change list e os critérios de aceite
  como verificação. Saídas esperadas de cada PR: `ENTREGAVEIS-POR-ONDA.md`.

## Ondas

| Onda | PR | Entrega | Requisitos | Por que nesta posição | Depende de |
|---|---|---|---|---|---|
| **0 · Fundação** | PR-A | Logo e favicon | RQ-001, RQ-002 | Independente, pequeno, visível em toda aba | — |
| | PR-B | ADR-13 + tokens de ilustração, grafo, motion e componentes + testes | RQ-010…015 | Todo PR visual depende desses tokens | — |
| **1 · Leitura** | PR-C | Shell v6/v7: nav desktop, drawer, barra inferior, chrome no scroll, heroReveal, carrossel | RQ-020…026 | Moldura de todas as páginas | PR-B |
| | PR-D | 6 ilustrações RC + imagem em todo artigo (emenda ao ADR-12) | RQ-030…033 | Pré-requisito do conteúdo novo | PR-B |
| | PR-E | Home RC-LP-001 + 4 artigos canônicos + fontes + JSON-LD + pilares | RQ-040…046 | Maior valor editorial | PR-C, PR-D |
| | PR-F | Menu, 4 perguntas por página, escada de CTA, índice por problemas | RQ-050…054 | Liga leitura e exploração; RQ-054 fecha depois do PR-G | PR-C (RQ-054: PR-G) |
| | PR-J1 | Ferramentas cognitivas: `/loja` → `/ferramentas` (301), catálogo reaproveitado, ADR-08 substituído | RQ-103, RQ-100 | O menu (PR-F) aponta para `/ferramentas` | PR-F |
| **2 · Exploração** | PR-G | Grafo canônico (formato da Teia) + grafo inicial + validação | RQ-060…065 | Dados antes da UI; destrava mapa, Ferramentas e analytics | — |
| | PR-H | Mapa Explorar + Detalhe + Lista + filtros + "Por quê?" | RQ-070…080 | Feature central | PR-B, PR-C, PR-G |
| **3 · Personalização, medição e Teia** | PR-I | Personalizar | RQ-090 | Valor incremental sobre o mapa | PR-H |
| | PR-K | Cloudflare Web Analytics + eventos no Workers Analytics Engine | RQ-110, RQ-111 | Mede a jornada já construída (RQ-110 vale como verificação desde a onda 1) | PR-G |
| | PR-L | Adapters da Teia: registries, Quick Framework, Ferramentas | RQ-120…122 | Teia aprovada (OWNER Leonardo) | PR-G, PR-J1 |
| **4 · Bloqueado** | PR-J2 | Ferramenta piloto (interrupções) + Resultado | RQ-101, RQ-102 | Falta o conteúdo da ferramenta e a política de dados | GAP-02, GAP-07 |
| Backlog | — | Simulação "e se…" (RQ-081); regras de uso do logo (RQ-003, GAP-04) | | | |

## Caminho crítico

```
PR-A logo
PR-B tokens ──┬──> PR-C shell ──┬──> PR-E conteúdo
              │                 └──> PR-F jornada ──> PR-J1 ferramentas ──┐
              ├──> PR-D imagens ───> PR-E                                  │
              │                                                            ▼
PR-G grafo ───┴──────────────────> PR-H mapa ──> PR-I personalizar     PR-L teia
      └──────────────────────────> PR-K medição
```

PR-A, PR-B e PR-G não dependem de nada e podem correr em paralelo (branches separadas de `main`).

## Ainda em aberto (não bloqueia as ondas 0–3)

| ID | Falta | Quem decide |
|---|---|---|
| GAP-02 | Perguntas e regra de resultado da ferramenta piloto | Leonardo |
| GAP-07 | Política de dados do Resultado (salvar? anônimo?) | Leonardo |
| GAP-04 | Regras de uso do logo | Leonardo |
| CF-16 | Evento operacional na Teia: tag `stage:event` (proposto) ou tipo novo na v0.2.0 | Leonardo (OWNER da Teia) |
