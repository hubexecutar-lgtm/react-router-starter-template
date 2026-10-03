# Runbook do agente EXECUTAR

Tudo o que um agente (ou pessoa) precisa para publicar e operar o workflow, sem depender de memória de sessão.
O repositório já traz o código, as skills, os agentes, o pré-voo e a publicação em um comando. O que sobra são
**três itens que só um humano resolve** (credenciais e uma opção de conta); o pré-voo avisa cada um com a correção exata.

## 1. Itens humanos (uma vez)

| Item | Onde | Por quê |
|---|---|---|
| R2 habilitado na conta Cloudflare | dash.cloudflare.com → R2 Object Storage → Enable (plano gratuito: 10 GB) | Guarda os entregáveis dos agentes. Sem ele o Worker não sobe. |
| Credencial Cloudflare | Sessão de agente: conector Cloudflare conectado antes de abrir a sessão. Fora dela: `CLOUDFLARE_API_TOKEN` (Workers Scripts, Workers KV, R2, Workflows: Edit) e `CLOUDFLARE_ACCOUNT_ID` | Para criar KV, segredos e fazer o deploy. |
| `EXECUTAR_AGENT_TOKEN` (valor aleatório com 24+ caracteres) | Variáveis de ambiente da sessão/Routine (cloud: Edit → variáveis). Nunca no chat nem no repositório | Autentica o agente no Worker; o `bootstrap` o grava como secret `AGENT_TOKEN`. |

Opcional, para o deploy automático depois de cada merge: secrets do repositório `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `EXECUTAR_AGENT_TOKEN` e `ADMIN_TOKEN` (usados por `.github/workflows/deploy-workflow.yml`; sem eles o job só avisa).

## 2. Prompt de passagem (para outro agente, em sessão nova)

Abra a sessão com o repositório `hubexecutar-lgtm/react-router-starter-template` e cole:

```
Retome o Programa EXECUTAR (leia CLAUDE.md, apps/workflow/CLAUDE.md e docs/AGENT-RUNBOOK.md).

1. Rode `npm run doctor -w apps/workflow` e siga a correção impressa de cada falha, na ordem.
2. Se o Worker não existir ou estiver desatualizado: `npm run bootstrap -w apps/workflow`
   (precisa de EXECUTAR_AGENT_TOKEN e de credencial Cloudflare; ele cria R2 e KV, grava os segredos,
   publica e roda o doctor). Nunca imprima tokens nem os cole no chat.
3. Com o doctor verde: `node .claude/skills/executar-flow/scripts/flow.mjs whoami` e depois /executar-flow.
   Para transformar um process doc em workflow: /cadeia-unica <arquivo> [slug].
4. Mudança de código: Agent Handoff (/plan → /execute → /verify), ADR-M02 (branch curta, PR pronto, nunca draft).
   Pendências viram issues no GitHub, não lista no chat.
```

## 3. Comandos

| Quero | Comando (da raiz) |
|---|---|
| Conferir ambiente e Worker | `npm run doctor -w apps/workflow` (`-- --offline` sem rede, `-- --json` para máquina) |
| Publicar do zero | `npm run bootstrap -w apps/workflow` |
| Sincronizar só o token do agente | `npm run agent:token -w apps/workflow` |
| Rodar a fila de agentes | `/executar-flow` (headless: `claude -p "/executar-flow" --permission-mode acceptEdits`) |
| Cadeia de valor a partir de um process doc | `/cadeia-unica <arquivo> [slug]` |
| PDF A4 do workflow publicado | `npm run pdf -w apps/workflow -- <slug>` (grava em `out/cadeia/<slug>/`) |
| Testes, lint, tipos, build do app | `npm test -w apps/workflow` · `npm run lint -w apps/workflow` · `(cd apps/workflow && npx tsc -b)` · `npm run build -w apps/workflow` |
| Publicar um conteúdo do CMS no blog | `/admin` → conteúdo → "Publicar no blog", depois `/executar-flow` (agente `blog-publisher`: registro Quick Framework em `apps/blog`, PR pronto) |

## 4. Se o doctor disser…

| Mensagem | O que fazer |
|---|---|
| `token … não definido` | Defina `EXECUTAR_AGENT_TOKEN` no ambiente (item 1). |
| `worker … Nenhum Worker publicado nesse endereço` | `npm run bootstrap -w apps/workflow`. Se a URL for outra conta, defina `EXECUTAR_URL`. |
| `auth-agente … 503` | O Worker não tem `AGENT_TOKEN`: `npm run agent:token -w apps/workflow`. |
| `auth-token … 401` | O token do ambiente difere do secret: `npm run agent:token -w apps/workflow`. |
| `mcp … 404` ou `cms … 404` | Worker desatualizado: `npm run bootstrap -w apps/workflow`. |
| `deps … node_modules ausente` | `npm ci` na raiz. |
| bootstrap: `R2 não está habilitado` | Item 1 (Enable R2). |
| bootstrap: `Cloudflare recusou a credencial` | Reconecte o conector Cloudflare e abra sessão nova, ou defina `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID`. |

## 5. Conector MCP no claude.ai

Configurações → Conectores → Adicionar personalizado → `<EXECUTAR_URL>/mcp`. A autorização pede o `ADMIN_TOKEN` do Worker
(se o `bootstrap` o gerou, está em `~/.local/state/executar/admin-token`, modo 600). O plugin `executar-cop` registra o mesmo
conector em `plugins/executar-cop/.mcp.json`, com a URL vinda de `EXECUTAR_URL`.

## 6. Plugins

```
/plugin marketplace add hubexecutar-lgtm/react-router-starter-template
/plugin install executar-cop@executar
/plugin install agent-handoff@executar
```
