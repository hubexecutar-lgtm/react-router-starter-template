# Repositório autossuficiente para agentes (agent-readiness)

> Created: 2026-10-03
> Author: plan skill
> Addresses backlog: issues #11 (CMS → apps/blog) e #12 (listar posts) do repositório; caminhos do monorepo; permissões; pré-voo

## Background

Depois da migração (PR #10), um agente novo ainda tropeça em: caminhos do repositório antigo nas skills/agentes e no prompt embutido da cadeia (`node scripts/print-pdf.mjs` fora de `apps/workflow`), allowlist de permissões incompleta (o agente pararia pedindo aprovação), CMS e `blog-publisher` apontando para o blog antigo (sem `territory`, que o blog novo exige), lista de posts que quebra (RSS atrás do Access, API do GitHub 403 pelo IP do Worker), nenhuma checagem prévia do ambiente e metadados dos plugins apontando para o repositório antigo. Este plano elimina esses passos no código; só ficam os que exigem credencial humana (token, conta Cloudflare), que o pré-voo reporta com a correção exata.

## Phases

- [🔄] Phase 1: Agente pronto — pré-voo `doctor`, hook de sessão, permissões, caminhos do monorepo, CMS → apps/blog, lista de posts, metadados, deploy por Actions, runbook  — current

## Change list

### `apps/workflow/scripts/doctor.mjs` (novo) e `package.json` (app e raiz) — Create/Modify
Script `npm run doctor` (raiz: `-w apps/workflow`). Checa Node ≥ 22, dependências instaladas, `.claude/` e plugins presentes, `EXECUTAR_URL`/`EXECUTAR_AGENT_TOKEN`, health do Worker, 401 sem token e 200 com token nas rotas de agente, `POST /mcp initialize`, listagem de definições. Cada falha imprime a correção exata (PASS/WARN/FAIL, exit 1 só em FAIL). Nunca imprime token.
- **Risk**: low · **Side effects**: network (GETs/POST initialize)

### `.claude/settings.json`, `.claude/hooks/session-start.sh` (novo) — Modify/Create
Allowlist para o fluxo inteiro sem prompts (npm ci/doctor/pdf/test/build/lint, `python3 .claude/skills/**`, `node .claude/skills/**`, `node apps/workflow/scripts/**`). Hook SessionStart: `npm ci` se faltar `node_modules`, roda o doctor em modo resumo, nunca falha a sessão. `env` com `EXECUTAR_URL`.
- **Risk**: medium · **Side effects**: install, network

### Caminhos do monorepo — Modify
`apps/workflow/scripts/print-pdf.mjs` grava relativo ao diretório de origem do npm (`INIT_CWD`). Skill `cadeia-valor-unica` (`.claude/` e `plugins/`), agente `cadeia-valor-unica`, `validar_cadeia.py`, `apps/workflow/CLAUDE.md` e `CLAUDE.md` passam a usar `npm run pdf -w apps/workflow -- <slug>`. O prompt embutido é regenerado pelo build.

### CMS → `apps/blog` — Modify
`worker/cms-api.ts`: `BLOG_REPO` `hubexecutar-lgtm/react-router-starter-template`, caminho `apps/blog/content/blog/<slug>.mdx`, prompt com o frontmatter real (`territory` = slug de `Rota_editorial`, `contentId`, `type`, `tags`, `evidence`, `draft: false`), build `npm run build -w apps/blog`, branch `cms/<slug>`. Lista de posts: API do GitHub (token opcional `GITHUB_TOKEN`) → fallback jsDelivr (público, sem credencial). `wrangler*.jsonc`, `worker-configuration.d.ts`, `cms-actions.tsx` (URL do blog por variável do servidor), `.claude/agents/blog-publisher.md`, testes.
- **Risk**: medium

### Metadados e docs — Modify/Create
`plugins/*/.claude-plugin/plugin.json` e `.claude-plugin/marketplace.json` (repositório novo), `docs/AGENT-RUNBOOK.md` (prompt de passagem e comandos), `CLAUDE.md` (conta Hub.executar, URLs, doctor).

### `.github/workflows/deploy-workflow.yml` (novo) — Create
Deploy do Worker do workflow no push à `main` com mudanças em `apps/workflow/**`, via `wrangler deploy`, com `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID` dos secrets; sem os secrets, o job termina com aviso (não falha).
- **Risk**: high · **Side effects**: deploy

## Test strategy
`apps/workflow/test/cms.test.ts` atualizado (repositório, caminho, `territory`, lista de posts por jsDelivr com fetch simulado); `test/doctor.test.ts` para as funções puras do pré-voo.

## Verification plan
- `npm test -w apps/workflow` — todos os testes passam
- `npm run lint -w apps/workflow` — sem erros
- `(cd apps/workflow && npx tsc -b)` — sem erros
- `npm run build` — build dos dois apps ok
- `npm run doctor -w apps/workflow` — roda e reporta (WARN aceitável para token ausente)
