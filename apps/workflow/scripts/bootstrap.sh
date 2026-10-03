#!/usr/bin/env bash
# Publica o Worker do workflow numa conta Cloudflare do zero e confere o resultado. Idempotente.
#   npm run bootstrap -w apps/workflow
# Faz, nesta ordem: (1) confere credenciais, (2) garante o bucket R2, (3) garante o KV do OAuth do MCP,
# (4) deploy, (5) grava AGENT_TOKEN e ADMIN_TOKEN, (6) roda o doctor contra o Worker publicado.
# Entrada (variáveis de ambiente; nunca no chat nem no repositório):
#   EXECUTAR_AGENT_TOKEN  obrigatório (mínimo 24 caracteres) -> secret AGENT_TOKEN
#   ADMIN_TOKEN           opcional: se faltar e o Worker ainda não tiver o secret, é gerado e guardado em
#                         ${XDG_STATE_HOME:-$HOME/.local/state}/executar/admin-token (modo 600; o valor não é impresso)
#   CLOUDFLARE_API_TOKEN / CLOUDFLARE_ACCOUNT_ID  credenciais da conta (nas sessões de agente: proxy-managed)
set -euo pipefail

cd "$(dirname "$0")/.."
APP="$(pwd)"
ROOT="$(cd ../.. && pwd)"
BUCKET="executar-artifacts"
KV_TITLE="executar-oauth"
export CLOUDFLARE_API_TOKEN="${CLOUDFLARE_API_TOKEN:-proxy-managed}"
LOG="$(mktemp)"
trap 'rm -f "$LOG"' EXIT

say() { printf '▸ %s\n' "$*"; }
die() { printf '✗ %s\n' "$*" >&2; exit 1; }
# WRANGLER_BIN, DEPLOY_CMD e DEPLOY_INLINE_CMD existem só para testar este script com um wrangler simulado.
wr() { ${WRANGLER_BIN:-npx --no-install wrangler} "$@"; }
DEPLOY_CMD="${DEPLOY_CMD:-npm run deploy}"
DEPLOY_INLINE_CMD="${DEPLOY_INLINE_CMD:-npm run deploy:inline}"

# ---------------------------------------------------------------- 0. entrada
[ -n "${EXECUTAR_AGENT_TOKEN:-}" ] || die "EXECUTAR_AGENT_TOKEN não definido. Defina no ambiente (cloud: Edit → variáveis; local: export) e rode de novo."
[ "${#EXECUTAR_AGENT_TOKEN}" -ge 24 ] || die "EXECUTAR_AGENT_TOKEN curto demais (mínimo 24 caracteres)."
if [ ! -d "$ROOT/node_modules" ]; then say "Instalando dependências (npm ci na raiz)"; (cd "$ROOT" && npm ci --no-audit --no-fund); fi

# ---------------------------------------------------------------- 1. credenciais
say "Conferindo credenciais da Cloudflare"
if ! KV_JSON="$(wr kv namespace list 2>"$LOG")"; then
	if grep -qiE "authentication|401|invalid access token|not authenticated|login" "$LOG"; then
		die "Cloudflare recusou a credencial. Em sessão de agente: reconecte o conector Cloudflare em claude.ai e abra uma sessão nova. Fora dela: defina CLOUDFLARE_API_TOKEN (permissões Workers, KV, R2) e CLOUDFLARE_ACCOUNT_ID."
	fi
	cat "$LOG" >&2; die "Não consegui falar com a API da Cloudflare."
fi

# ---------------------------------------------------------------- 2. R2
say "Garantindo o bucket R2 $BUCKET"
BUCKETS="$(wr r2 bucket list 2>"$LOG" || true)"
if grep -qE "10042|enable R2" "$LOG"; then
	die "R2 não está habilitado nesta conta. Habilite em dash.cloudflare.com → R2 Object Storage → Enable (plano gratuito: 10 GB) e rode de novo."
fi
if grep -q "$BUCKET" <<<"$BUCKETS"; then
	say "  bucket já existe"
else
	if ! wr r2 bucket create "$BUCKET" >"$LOG" 2>&1 && ! grep -qiE "already exists" "$LOG"; then
		cat "$LOG" >&2; die "Falha ao criar o bucket $BUCKET."
	fi
	say "  bucket criado"
fi

# ---------------------------------------------------------------- 3. KV (OAuth do MCP)
say "Garantindo o KV OAUTH_KV"
CURRENT_ID="$(node -e 'const s=require("fs").readFileSync("wrangler.jsonc","utf8");const m=/"binding":\s*"OAUTH_KV",\s*"id":\s*"([0-9a-f]{32})"/.exec(s);console.log(m?m[1]:"")')"
[ -n "$CURRENT_ID" ] || die "Binding OAUTH_KV com id não encontrado em apps/workflow/wrangler.jsonc."
KV_ID="$(printf '%s' "$KV_JSON" | CURRENT_ID="$CURRENT_ID" KV_TITLE="$KV_TITLE" node -e '
const list=JSON.parse(require("fs").readFileSync(0,"utf8"));
const byId=list.find(n=>n.id===process.env.CURRENT_ID); if(byId){console.log(byId.id);process.exit(0)}
const byTitle=list.find(n=>n.title===process.env.KV_TITLE); console.log(byTitle?byTitle.id:"")')"
if [ -z "$KV_ID" ]; then
	wr kv namespace create "$KV_TITLE" >"$LOG" 2>&1 || { cat "$LOG" >&2; die "Falha ao criar o KV $KV_TITLE."; }
	KV_ID="$(grep -oE '[0-9a-f]{32}' "$LOG" | head -1)"
	[ -n "$KV_ID" ] || { cat "$LOG" >&2; die "Criei o KV mas não consegui ler o id."; }
	say "  KV criado ($KV_TITLE)"
else
	say "  KV já existe"
fi
if [ "$KV_ID" != "$CURRENT_ID" ]; then
	say "  atualizando o id do KV nos wrangler*.jsonc (o id não é segredo; faça commit se quiser fixar)"
	sed -i "s/$CURRENT_ID/$KV_ID/g" wrangler.jsonc wrangler.inline.jsonc
fi

# ---------------------------------------------------------------- 4. deploy
say "Fazendo o deploy do Worker"
if ! $DEPLOY_CMD 2>&1 | tee "$LOG"; then
	if grep -qiE "authentication error|\b401\b|asset" "$LOG"; then
		say "Upload de assets recusado: repetindo com assets embutidos (deploy:inline)"
		$DEPLOY_INLINE_CMD 2>&1 | tee "$LOG" || die "Deploy falhou (veja a saída acima)."
	else
		die "Deploy falhou (veja a saída acima)."
	fi
fi
WORKER_URL="$(grep -oE 'https://[a-zA-Z0-9.-]+\.workers\.dev' "$LOG" | head -1 || true)"
[ -n "$WORKER_URL" ] || say "  URL do Worker não detectada na saída; defina EXECUTAR_URL antes de rodar o doctor."

# ---------------------------------------------------------------- 5. segredos
say "Gravando segredos"
HAVE="$(wr secret list 2>/dev/null | node -e 'try{console.log(JSON.parse(require("fs").readFileSync(0,"utf8")).map(s=>s.name).join(" "))}catch{console.log("")}')"
if [ -z "${ADMIN_TOKEN:-}" ] && [[ " $HAVE " != *" ADMIN_TOKEN "* ]]; then
	STATE="${XDG_STATE_HOME:-$HOME/.local/state}/executar"
	mkdir -p "$STATE" && chmod 700 "$STATE"
	ADMIN_TOKEN="$(node -e 'console.log(require("crypto").randomBytes(32).toString("base64url"))')"
	( umask 077; printf '%s\n' "$ADMIN_TOKEN" >"$STATE/admin-token" )
	say "  ADMIN_TOKEN gerado e guardado em $STATE/admin-token (modo 600; valor não impresso)"
fi
SECRETS="$(AGENT="$EXECUTAR_AGENT_TOKEN" ADMIN="${ADMIN_TOKEN:-}" node -e 'const o={AGENT_TOKEN:process.env.AGENT};if(process.env.ADMIN)o.ADMIN_TOKEN=process.env.ADMIN;console.log(JSON.stringify(o))')"
printf '%s' "$SECRETS" | wr secret bulk >"$LOG" 2>&1 || { cat "$LOG" >&2; die "Falha ao gravar os segredos."; }
say "  AGENT_TOKEN gravado${ADMIN_TOKEN:+ · ADMIN_TOKEN gravado}"
unset SECRETS

# ---------------------------------------------------------------- 6. doctor
say "Conferindo o Worker publicado"
if [ -n "$WORKER_URL" ]; then export EXECUTAR_URL="$WORKER_URL"; fi
node "$APP/scripts/doctor.mjs"
if [ -n "$WORKER_URL" ]; then
	echo
	say "Worker no ar: $WORKER_URL"
	say "Exporte EXECUTAR_URL=$WORKER_URL nas variáveis do ambiente do agente, se for diferente do padrão."
fi
