# apps/workflow — Programa EXECUTAR · Linha de Produção Editorial

> Este app vive em `apps/workflow` do monorepo. `.claude/`, `plugins/` e `.handoff/` ficam na **raiz** do monorepo; scripts do app: `npm run <script> -w apps/workflow`. Origem e proveniência: `docs/migrations/WORKFLOW-001.md`.

Worker Cloudflare (Workflows + Durable Objects + R2) com UI React. O fluxo inteiro vem de `workflow.json`, tipado por `shared/schema.ts`.

## Operar o fluxo (execução real)

- **Casas humanas:** o Leonardo entrega evidência ou arquivo pela UI.
- **Casas de agente:** depois do OK na UI, a tarefa é despachada e um agente Claude Code a executa:
  - `/executar-flow` roda uma passada na fila (WIP = 1, uma tarefa por vez);
  - `/loop 10m /executar-flow` mantém a fila rodando enquanto a sessão estiver aberta;
  - para rodar sem sessão aberta (headless/cron): `claude -p "/executar-flow" --permission-mode acceptEdits`;
  - Routine cloud "EXECUTAR · fila de agentes": roda de hora em hora, ou na hora pelo "Run now".
- **Subagentes** (`/agents`): `clp-orchestrator`, `research-agent`, `plano-ops-agent`, `analytics-agent` e `blog-publisher` (publicação no blog a partir do CMS).
- **CMS (`/admin`):** Hub Editorial do blog Risco Cognitivo. No conteúdo: "Iniciar campanha" abre um run com `campaignId = CNT-RC-*`; "Publicar no blog" despacha uma tarefa para o `blog-publisher`, que abre um PR pronto em `hubexecutar-lgtm/react-router-starter-template` (blog em `apps/blog`: registro Quick Framework + `.mdx` gerado, ADR-10 do blog).
- **Plano do mês (upstream):** delegue ao `plano-ops-agent` com o intake. Ele usa a skill `plano-operacional-rastreavel`, passa o plano pelo juiz `validar_plano.py` e envia com `flow.mjs plan-upload`. Depois, inicie o run com o `planId` retornado.
- **Pré-voo:** `npm run doctor -w apps/workflow` (ambiente, arquivos, Worker, token; imprime a correção de cada falha). Hook de sessão já roda em modo resumo.
- **Diagnóstico:** `node .claude/skills/executar-flow/scripts/flow.mjs whoami` e `node .claude/skills/executar-flow/scripts/flow.mjs tasks --status despachada`.

## Cadeia de Valor Única (upstream)

- **Agente/skill:** `cadeia-valor-unica` (`/cadeia-unica` no plugin `executar-cop`). Process doc → 5 artefatos (árvore roadmap, árvore visual, working process, relatório único, runbook), Estratégia 07 + handoff, WIP = 1, `out/cadeia/<slug>/ESTADO.md` único. Juiz: `python3 .claude/skills/cadeia-valor-unica/scripts/validar_cadeia.py out/cadeia/<slug> --etapa all`.
- **Working process no Worker:** `flow.mjs def-validate|def-upload|def-put|def-list|def-start` (R2 `definitions/` imutável + `cadeia/<slug>/`); UI em `/?def=<slug>`, PDF A4 em `/?def=<slug>&print=1` ou `npm run pdf -w apps/workflow -- <slug>` (da raiz).
- **MCP:** `POST /mcp` (Streamable HTTP, OAuth: `/authorize` pede o `ADMIN_TOKEN`). Conector no claude.ai: Configurações → Conectores → Adicionar personalizado → `<URL do Worker>/mcp`.
- **Exemplo completo:** `examples/cadeia/aikb-0001/` (AIKB-0001 · PD-CLB-20260906-F01).
- **Plugins:** `.claude-plugin/marketplace.json` → `plugins/executar-cop` (0.4.0) e `plugins/agent-handoff` (0.4.2).

## Credenciais

- Conta Cloudflare padrão: **Hub.executar** (`*.hub-executar.workers.dev`), conforme o ADR-002 do `executar-23/PROGAMA-LANCAMENTO`. O `npm run bootstrap -w apps/workflow` não depende de recurso pré-existente e funciona em qualquer conta; se o Worker ficar em outra, defina `EXECUTAR_URL` no ambiente do agente. Em sessões de agente o proxy bloqueia o upload de assets do wrangler (401): o bootstrap repete sozinho com assets embutidos (`wrangler.inline.jsonc`).

- `EXECUTAR_URL` e `EXECUTAR_AGENT_TOKEN` são **variáveis do ambiente**: cloud em Edit → variáveis de ambiente; local em `export` ou em `.claude/settings.local.json`. Nunca cole o token no chat nem o grave no repositório.
- `npm run agent:token` sincroniza o token do ambiente com o secret `AGENT_TOKEN` do Worker.

## Git e issues

- **Fluxo Git:** vale o ADR-M02 do `CLAUDE.md` da raiz do monorepo (branch curta a partir da `main`, PR pronto, nunca draft, auto-merge). Branches paralelas por frente, com escopo de arquivos disjunto.
- **Issues no GitHub, não no chat.** Nunca devolva listas de issues, pendências ou achados por aqui: registre cada item como issue do repositório com as ferramentas `mcp__github__*` (`issue_write`; cheque duplicatas com `search_issues`) e responda só com o link e um resumo de uma linha. O `.handoff/backlog.md` (na raiz) é o rascunho local do ciclo; os itens abertos viram issues.

## Regras

- **Não inventar:** dado ausente é `TBD` e vira GAP; "A DEFINIR" continua "A DEFINIR".
- **Mudanças de código:** seguir o Agent Handoff (`/plan` → `/execute` → `/verify` em contexto novo), com estado em `.handoff/`.
- **Verificação** (na raiz): `npm test -w apps/workflow`, `npm run lint -w apps/workflow`, `npm run build -w apps/workflow` e, para tipos, `(cd apps/workflow && npx tsc -b)`.
- **Deploy:** `npm run bootstrap -w apps/workflow` (cria R2/KV se faltarem, grava `AGENT_TOKEN`/`ADMIN_TOKEN`, publica e roda o `doctor`; precisa de `EXECUTAR_AGENT_TOKEN`, credencial Cloudflare e R2 habilitado). Depois do merge, `.github/workflows/deploy-workflow.yml` faz o mesmo se os secrets do GitHub existirem. Runbook completo: `docs/AGENT-RUNBOOK.md`.
