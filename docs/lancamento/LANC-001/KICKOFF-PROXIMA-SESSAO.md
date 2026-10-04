# LANC-001 — Mensagem de início da próxima sessão

**Pré-condição:** o PR do intake (hubexecutar-lgtm/react-router-starter-template#20) precisa estar em `main`, porque
a sessão nova parte de `main` e lê os documentos de lá.

Copie o bloco abaixo como primeira mensagem de uma sessão nova do Claude Code neste repositório.

---

```text
Projeto: LANC-001 — lançamento do Risco Cognitivo (apps/blog). Você é o agente de implementação.

CONTEXTO (leia antes de agir, nesta ordem)
1. CLAUDE.md (raiz) — ADR-M01…M04; ADR-M02: branch curta de main, PR pronto (nunca draft), auto-merge com merge commit.
2. apps/blog/CLAUDE.md — ADRs do blog (ADR-06 hub de rotas, ADR-11 paleta, ADR-12 anatomia e imagens).
3. docs/lancamento/LANC-001/requirements/00-PLANO-DE-IMPORTANCIA.md — ondas e ordem dos PRs.
4. docs/lancamento/LANC-001/requirements/01-DECISOES-E-AMBIGUIDADES.md — decisões DEC-U1…U13 e conflitos CF-01…17.
   Elas são finais: não reabra nada que esteja como DECISION.
5. docs/lancamento/LANC-001/ENTREGAVEIS-POR-ONDA.md — o que cada PR tem que entregar.
6. Especificações, quando o PR pedir: 04-UIX-SPEC.md, 05-TOKENS-SPEC.md, 06-DATA-SPEC-GRAFO-CAUSAL.md.
   Requisitos: requisitos.json (fonte única; 03-FRD.md é a versão legível).
   Arquivos de origem: docs/lancamento/LANC-001/intake/ (não alterar).

DECISÕES QUE MAIS PESAM
- Identidade: Brand Local v7 em tudo (= ADR-11: #2563EB, #202124, Inter + IBM Plex Mono). O amarelo/preto do v6 está fora.
- Arquitetura e interação do v6/v7; motion do v7 (--ease cubic-bezier(.22,1,.36,1), heroReveal, reduced-motion).
- RC-BRAND-STYLING-001 é só a camada de ilustração/vetor (--illu-*); coral e azul claro nunca como texto.
- Menu: Artigos (/blog) · Mapa (/mapas) · Ferramentas (/ferramentas) · Sobre (/about); barra inferior Início · Mapa · Ferramentas.
- URLs mantidas, exceto a Loja: ela não existe mais; /loja/* vira /ferramentas/* (Ferramentas cognitivas, 301).
- Todo artigo tem imagem (emenda ao ADR-12).
- Teia Única aceita (ADR-M04, OWNER Leonardo): o grafo do mapa usa o formato CORRELATION_RECORD da Teia.
- Analytics: Cloudflare Web Analytics + Workers Analytics Engine. Sem Supabase.
- Nenhum número sem evidência; "processo neuroadaptativo" é conceito do projeto, não norma.

TAREFA DESTA SESSÃO: onda 0, um PR por vez (WIP = 1)
1. PR-A (RQ-001, RQ-002): logo e favicon.
2. PR-B (RQ-010…015): ADR-13 + tokens de ilustração, grafo, motion e componentes + testes.
3. Se sobrar contexto: PR-G (RQ-060…065), grafo canônico (não depende de PR-A/B).

PARA CADA PR
a. git fetch origin main && git checkout -b feat/lanc-001-<pr>-<slug> origin/main
b. /plan com change list = os RQ do PR e verificação = o critério de aceite de cada RQ (requisitos.json).
c. /execute.
d. /verify: npm run typecheck, npm run build e npm test (inclui tests/hig.spec.ts) verdes; routes:check se mexer em rotas.
e. No mesmo PR, marque os RQ entregues em docs/lancamento/LANC-001/requirements/requisitos.json:
   status "DONE" + campo "entregue_em" com o link do PR. Depois rode: cd docs/lancamento/LANC-001/requirements && python3 render.py
f. Commit, push e PR pronto (template .github/pull_request_template.md), listando os RQ no corpo.
   Habilite auto-merge (merge commit). Acompanhe o CI até ficar verde.
g. Só então comece o próximo PR, a partir de main atualizada.

REGRAS
- Não mude decisão registrada. Se um requisito conflitar com o código, pare e me pergunte com o RQ e o arquivo exatos.
- Hex só em apps/blog/app/styles/global.css. Rota nova entra em app/data/routes.ts (ADR-06).
- Itens BLOCKED (RQ-003, RQ-101, RQ-102) e BACKLOG (RQ-081) não entram.
- Ao final, responda com: PRs abertos/mesclados, RQ marcados DONE e o próximo PR da fila.
```

---

## Sessões seguintes (mesmo modelo, trocando o bloco "TAREFA")

| Sessão | Tarefa |
|---|---|
| 2 | Onda 1: PR-C (shell) → PR-D (imagens) |
| 3 | Onda 1: PR-E (conteúdo) → PR-F (jornada) → PR-J1 (Ferramentas no lugar da Loja) |
| 4 | Onda 2: PR-G (se não saiu na 1) → PR-H (mapa) |
| 5 | Onda 3: PR-I (personalizar) → PR-K (medição) → PR-L (adapters da Teia) |

`/verify` funciona melhor numa sessão nova (contexto limpo): se a sessão ficar longa, abra outra só para o `/verify`.
