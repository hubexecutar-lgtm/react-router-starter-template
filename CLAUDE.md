# CLAUDE.md — Monorepo EXECUTAR

Guidance for Claude Code (and other AI agents) working in this repository.

## Estrutura

```
apps/      um diretório por produto (deploy independente)
  blog/    Risco Cognitivo — React Router 7 + Cloudflare Workers (ver apps/blog/CLAUDE.md)
  workflow/ Programa EXECUTAR — Workflows + Durable Objects + R2 + CMS (/admin) + MCP (ver apps/workflow/CLAUDE.md)
packages/  código compartilhado entre produtos (vazio até o segundo produto precisar)
docs/      decisões e evidências do monorepo (docs/migrations/*)
```

- npm workspaces, **um único `package-lock.json` na raiz**. Instale sempre na raiz:
  `npm install`; dependência de um app: `npm install <pkg> -w apps/<app>`.
- Scripts da raiz delegam aos apps: `npm run dev` (blog), `npm run build`,
  `npm run typecheck`, `npm run test`, `npm run deploy:blog`.
- Cada app mantém seus próprios ADRs no `CLAUDE.md` do app; leia-o antes de mexer no app.

## Agentes, skills e plugins (raiz)

- `.claude/agents/` e `.claude/skills/`: subagentes e skills do fluxo EXECUTAR (`clp-orchestrator`, `research-agent`, `plano-ops-agent`, `analytics-agent`, `blog-publisher`, `cadeia-valor-unica`, `executar-flow`, handoff). Servem a todos os apps.
- `plugins/executar-cop` (0.4.0) e `plugins/agent-handoff` (0.4.2), com marketplace em `.claude-plugin/marketplace.json`.
- `.handoff/`: estado do Agent Handoff (`config.md`, `backlog.md`). Itens abertos viram issues no GitHub.
- Pré-voo e publicação: `npm run doctor -w apps/workflow` confere ambiente e Worker; `npm run bootstrap -w apps/workflow` publica do zero. Runbook e prompt de passagem para outro agente: `docs/AGENT-RUNBOOK.md`.
- Operação do fluxo: `apps/workflow/CLAUDE.md` (variáveis `EXECUTAR_URL` e `EXECUTAR_AGENT_TOKEN`, `/executar-flow`, `/cadeia-unica`).

## ADRs do monorepo

### ADR-M01: Migração progressiva, um produto por vez

- **Status:** Aceita
- **Contexto:** O ecossistema EXECUTAR tem vários repositórios independentes. O primeiro
  migrado foi o Blog (`docs/migrations/BLOG-001.md`).
- **Decisão:**
  - Cada repositório entra como `apps/<nome>` com paridade verificável contra o deploy
    original (rotas, conteúdo, assets, testes) antes de qualquer melhoria funcional.
  - Proveniência registrada: repositório e commit de origem no commit de importação e em
    `docs/migrations/<ID>.md`. O repositório original não é alterado pela migração.
  - Código só vai para `packages/*` quando dois apps precisarem dele; até lá, fica no app.
  - Versões-base comuns (React, React Router, Vite, Tailwind, wrangler) ficam alinhadas
    entre apps para manter um lockfile só.
- **Consequências:**
  - Mudanças de identidade, conteúdo ou comportamento são PRs separados da migração.
  - Cada migração tem um teste de paridade (ex.: `apps/blog/tests/parity.spec.ts`).

### ADR-M02: Trabalhar a partir de `main`, PR pronto (sem draft) e auto-merge

- **Status:** Aceita — importada do ADR-01 do Blog (`apps/blog/CLAUDE.md`) e estendida ao
  monorepo inteiro.
- **Contexto:** O fluxo do Blog (branch curta a partir de `main`, PR aberto já pronto) passa a
  valer para todos os apps. Várias branches de trabalho podem estar abertas ao mesmo tempo, e
  cada uma deve entrar em `main` sozinha assim que estiver verde, sem esperar as outras.
- **Decisão:**
  - Toda branch de trabalho nasce de `main` atualizada (nunca de outra branch de feature) e
    tem um único objetivo.
  - Ao concluir a mudança, abrir o Pull Request **pronto para revisão, nunca em draft**, salvo
    pedido explícito do usuário para um caso pontual.
  - Habilitar **auto-merge** no PR (método *merge commit*, que preserva o histórico e a
    proveniência das migrações). O PR entra em `main` sozinho quando o CI (Workers Builds) passa.
    Se o GitHub recusar o auto-merge porque o PR já está mergeável, mergear direto com o CI verde.
  - Branches paralelas: cada uma tem seu PR com auto-merge. Se `main` andar e gerar conflito,
    trazer `main` para a branch (merge, sem rebase de branch já publicada), validar e enviar;
    o auto-merge conclui sozinho.
- **Consequências:**
  - Sem branches de longa duração nem stacks de PRs dependentes.
  - `main` é sempre o estado publicado: o merge dispara o deploy de produção pelo Workers Builds.
  - Antes de enviar, rodar as verificações do app (`npm run typecheck`, `npm run build`,
    testes); o CI vermelho bloqueia o auto-merge.

### ADR-M03: UX-GOV-HIG-001 — Apple HIG + WCAG 2.2 AA como gate transversal de interface

- **Status:** Aceita — vigente para todo app, presente e futuro. Política completa em
  `docs/governance/UX-GOV-HIG-001.md`.
- **Contexto:** O usuário definiu o Apple Human Interface Guidelines (oito princípios: Purpose, Agency,
  Responsibility, Familiarity, Flexibility, Simplicity, Craft, Delight) como regra transversal e a página
  https://developer.apple.com/programs/ como fonte de verdade da anatomia de página. Um site de leitura não
  pode ter texto desestruturado, e a regra precisa valer para tudo que vier depois.
- **Decisão:**
  - Baseline obrigatória: Apple HIG + WCAG 2.2 AA + HTML semântico + ARIA quando necessária + responsivo +
    Design System do produto. Segue-se o pensamento do HIG, não a aparência do iOS; a marca prevalece.
  - Anatomia de página (Apple Developer Programs): hero com título e lead curto; seções com ícone ou
    ilustração, título, parágrafo curto e link "Saiba mais ›"; cards de comparação; rodapé-diretório.
    Todo texto ocupa um slot dessa anatomia, dentro da medida de leitura e sem prosa em fonte mono.
  - Gate AUD-HIG-01…09 com achados no formato RULE_ID/ROUTE/COMPONENT/REQUIREMENT/SOURCE/STATUS/SEVERITY/
    EVIDENCE/REMEDIATION/OWNER/VERIFICATION. P0 bloqueia; P1 corrige antes de produção (salvo waiver).
  - Todo app tem um gate automatizado no `npm test` (no blog: `apps/blog/tests/hig.spec.ts`) e uma auditoria
    registrada em `apps/<app>/docs/audit/HIG-WEB-AUDIT.{json,md}`, com linha de base e reteste.
- **Consequências:**
  - Nenhuma página, rota, template ou componente reutilizável é VERIFIED sem passar pelo gate aplicável;
    PR com P0/P1 aberto não entra (ADR-M02: merge só com verificações verdes).
  - O checklist do PR (`.github/pull_request_template.md`) inclui o gate.
  - Novo app nasce com o gate e a anatomia; não há exceção por produto.

### ADR-M04: Teia Única de Correlação — um grafo canônico tipado para todos os apps (ARCH-EXEC-CORRELATION-GRAPH-001)

- **Status:** Aceita em 2026-10-04 · OWNER: Leonardo. Pacote em `docs/lancamento/LANC-001/intake/EXECUTAR-TEIA-UNICA-CORRELACAO-v0.1.0/`;
  aplicação no LANC-001 em `docs/lancamento/LANC-001/requirements/06-DATA-SPEC-GRAFO-CAUSAL.md`.
- **Contexto:** Quick Framework, Knowledge Pack, Ferramentas cognitivas, mapa causal e analytics descrevem as mesmas
  coisas (problema, fator, compensação, solução, evidência, métrica) com vocabulários diferentes e sem correlação.
- **Decisão:**
  - Um Typed Property Graph canônico no formato `CORRELATION_RECORD.schema.json`; as superfícies (mapa, artigos,
    Ferramentas, Quick Framework, analytics) são **projeções** dele e não criam evidência nova.
  - Toda aresta carrega proveniência (`A_OBSERVED`…`E_INFERRED`) e status; correlação não explícita = `E_INFERRED` +
    `PROPOSED`; associação clínica nunca vira causalidade de produto.
  - Os schemas existentes continuam e ganham `correlation_refs` por adapters (Quick Framework, Ferramentas — o
    antigo adapter Solution Store).
  - O código do grafo nasce no app que o usa primeiro e vai para `packages/` quando um segundo app consumir (ADR-M01).
- **Consequências:**
  - IDs estáveis obrigatórios nas novas projeções; o grafo é validado contra o schema no `npm test` do app.
  - Mudança de tipo ou relação na Teia passa pelo OWNER (ex.: evento operacional × evento de analytics, CF-16).
