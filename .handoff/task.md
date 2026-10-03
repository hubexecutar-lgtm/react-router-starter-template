# Phase 1 — Repositório autossuficiente para agentes

> Plan: .handoff/plan.md · Executed: 2026-10-03

## Checklist
- [x] `apps/workflow/scripts/doctor.mjs` (+ scripts `doctor` no app e na raiz): pré-voo com PASS/WARN/FAIL e correção exata; `--offline`, `--json`; nunca imprime token
- [x] `apps/workflow/scripts/bootstrap.sh` (+ script `bootstrap`): R2, KV, deploy (com fallback para assets embutidos), segredos, doctor; idempotente; ganchos de teste `WRANGLER_BIN`, `DEPLOY_CMD`, `DEPLOY_INLINE_CMD`
- [x] `.claude/settings.json`: allowlist do fluxo inteiro (sem prompts) + hook `SessionStart`; `.claude/hooks/session-start.sh`
- [x] Caminhos do monorepo: `print-pdf.mjs` grava a partir de `INIT_CWD`; skill/agente/juiz da cadeia usam `npm run pdf -w apps/workflow -- <slug>`; prompt embutido regenerado
- [x] CMS → `apps/blog`: `BLOG_REPO`, `BLOG_POSTS_DIR`, prompt com Quick Framework + `territory` (slug de `Rota_editorial`) + `evidence` + validador + gerador; lista de posts GitHub (`GITHUB_TOKEN` opcional) → jsDelivr; agente `blog-publisher` reescrito para o monorepo; testes
- [x] Metadados: marketplace/plugin.json/README dos plugins, `.mcp.json` com `${EXECUTAR_URL:-…}`, link de fonte do admin
- [x] `.github/workflows/deploy-workflow.yml` (bootstrap com secrets; sem secrets só avisa) e passo `doctor --offline` + `bash -n` no CI do app
- [x] `docs/AGENT-RUNBOOK.md`, `CLAUDE.md` (raiz e app), `apps/workflow/README.md`

## Evidência
- `npm test -w apps/workflow`: 8 arquivos, 64 testes; `tsc -b` 0 erros; `npm run lint -w apps/workflow` limpo; `npm run build -w apps/workflow` ok
- `doctor --offline`: ok; `doctor` online contra o endereço hub-executar: FAIL "Nenhum Worker publicado" com a correção `bootstrap`
- `bootstrap` com wrangler simulado: conta vazia (cria bucket e KV, troca o id nos wrangler*.jsonc, grava AGENT_TOKEN+ADMIN_TOKEN, gera admin-token modo 600, roda doctor); conta com tudo (nenhum create, ADMIN_TOKEN preservado); deploy com 401 (cai para inline); sem token (para com mensagem)

## Não verificado
- `bootstrap`/deploy reais (sem credencial Cloudflare nesta sessão); `wrangler secret bulk` e `kv namespace list` assumem o formato de saída do wrangler 4.136
- `npm run content:check -w apps/blog` e o fluxo real do `blog-publisher` (abre PR)
