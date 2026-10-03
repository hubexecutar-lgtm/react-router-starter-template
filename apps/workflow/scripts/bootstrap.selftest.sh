#!/usr/bin/env bash
# Autoteste do bootstrap.sh com um wrangler simulado (sem rede, sem credencial).
#   npm run bootstrap:selftest -w apps/workflow
# Cobre: conta vazia, conta já pronta (idempotência), listagem de segredos falhando,
# fallback de assets embutidos, deploy sem URL e ausência de token.
set -uo pipefail
cd "$(dirname "$0")/.."
T="$(mktemp -d)"
cp wrangler.jsonc "$T/wrangler.jsonc.bak"; cp wrangler.inline.jsonc "$T/wrangler.inline.jsonc.bak"
restore() { cp "$T/wrangler.jsonc.bak" wrangler.jsonc; cp "$T/wrangler.inline.jsonc.bak" wrangler.inline.jsonc; rm -rf "$T"; }
trap restore EXIT
CUR="$(node -e 'console.log(/"OAUTH_KV",\s*"id":\s*"([0-9a-f]{32})"/.exec(require("fs").readFileSync("wrangler.jsonc","utf8"))[1])')"
NEWID="aaaabbbbccccddddeeeeffff00001111"
FAILS=0
ok() { printf '  ✓ %s\n' "$1"; }
bad() { printf '  ✗ %s\n' "$1"; FAILS=$((FAILS + 1)); }
check() { if eval "$2"; then ok "$1"; else bad "$1"; fi; }

# wrangler simulado: $1 = JSON da lista de KV, $2 = bucket listado, $3 = comando do 'secret list'
stub() {
	cat >"$T/wr.sh" <<STUB
#!/usr/bin/env bash
echo "wrangler \$*" >> "$T/calls.log"
case "\$1 \$2 \$3" in
  "kv namespace list") echo '$1';;
  "kv namespace create") echo '{ "id": "$NEWID" }';;
  "r2 bucket list"*) echo "$2";;
  "r2 bucket create"*) echo "Created bucket";;
  "secret list"*) $3;;
  "secret bulk"*) cat > "$T/secrets.json";;
esac
STUB
	chmod +x "$T/wr.sh"
}
printf '%s\n' '#!/usr/bin/env bash' 'echo "Uploaded"; echo "  https://workflows-starter-template.selftest.workers.dev"' >"$T/deploy-ok.sh"
printf '%s\n' '#!/usr/bin/env bash' 'echo "✘ [ERROR] Authentication error [code: 10000]"; exit 1' >"$T/deploy-401.sh"
printf '%s\n' '#!/usr/bin/env bash' 'echo "Uploaded sem url"' >"$T/deploy-nourl.sh"
chmod +x "$T"/deploy-*.sh
# o doctor roda no fim; com a URL fictícia a rede falha de propósito, então só olhamos o que o bootstrap fez
run() { rm -f "$T/secrets.json" "$T/calls.log"; env -u EXECUTAR_URL EXECUTAR_AGENT_TOKEN=agent-token-de-teste-1234567890 STUB_T="$T" "$@" bash scripts/bootstrap.sh >"$T/out.log" 2>&1; }
keys() { node -e 'try{console.log(Object.keys(JSON.parse(require("fs").readFileSync(process.argv[1],"utf8"))).join(","))}catch{console.log("-")}' "$T/secrets.json"; }

echo "A) conta vazia: cria bucket e KV, troca o id, grava os dois segredos"
stub '[{"id":"11111111111111111111111111111111","title":"outro"}]' "" "echo '[]'"
XDG_STATE_HOME="$T/stA" run WRANGLER_BIN="$T/wr.sh" DEPLOY_CMD="$T/deploy-ok.sh"
check "criou o bucket" "grep -q 'r2 bucket create' $T/calls.log"
check "criou o KV" "grep -q 'kv namespace create' $T/calls.log"
check "trocou o id do KV nos dois wrangler*.jsonc" "grep -q $NEWID wrangler.jsonc && grep -q $NEWID wrangler.inline.jsonc"
check "gravou AGENT_TOKEN e ADMIN_TOKEN" "[ \"\$(keys)\" = 'AGENT_TOKEN,ADMIN_TOKEN' ]"
check "admin-token guardado com modo 600" "[ \"\$(stat -c %a $T/stA/executar/admin-token)\" = 600 ]"
check "nenhum token impresso" "! grep -q 'agent-token-de-teste' $T/out.log"
cp "$T/wrangler.jsonc.bak" wrangler.jsonc; cp "$T/wrangler.inline.jsonc.bak" wrangler.inline.jsonc

echo "B) conta pronta: nada é criado e o ADMIN_TOKEN existente é preservado"
stub "[{\"id\":\"$CUR\",\"title\":\"executar-oauth\"}]" "executar-artifacts" "echo '[{\"name\":\"ADMIN_TOKEN\"},{\"name\":\"AGENT_TOKEN\"}]'"
XDG_STATE_HOME="$T/stB" run WRANGLER_BIN="$T/wr.sh" DEPLOY_CMD="$T/deploy-ok.sh"
check "não criou bucket nem KV" "! grep -qE 'bucket create|namespace create' $T/calls.log"
check "só regravou AGENT_TOKEN" "[ \"\$(keys)\" = 'AGENT_TOKEN' ]"

echo "C) listagem de segredos falha: não gera nem sobrescreve ADMIN_TOKEN"
stub "[{\"id\":\"$CUR\",\"title\":\"executar-oauth\"}]" "executar-artifacts" "exit 1"
XDG_STATE_HOME="$T/stC" run WRANGLER_BIN="$T/wr.sh" DEPLOY_CMD="$T/deploy-ok.sh"
check "só gravou AGENT_TOKEN" "[ \"\$(keys)\" = 'AGENT_TOKEN' ]"
check "não criou admin-token" "[ ! -e $T/stC/executar/admin-token ]"

echo "D) deploy recusado (401): repete com assets embutidos"
stub "[{\"id\":\"$CUR\",\"title\":\"executar-oauth\"}]" "executar-artifacts" "echo '[]'"
XDG_STATE_HOME="$T/stD" run WRANGLER_BIN="$T/wr.sh" DEPLOY_CMD="$T/deploy-401.sh" DEPLOY_INLINE_CMD="$T/deploy-ok.sh"
check "caiu para o deploy inline e seguiu" "grep -q 'assets embutidos' $T/out.log && [ \"\$(keys)\" = 'AGENT_TOKEN,ADMIN_TOKEN' ]"

echo "E) deploy sem URL detectável e sem EXECUTAR_URL: não envia o token a URL nenhuma"
XDG_STATE_HOME="$T/stE" run WRANGLER_BIN="$T/wr.sh" DEPLOY_CMD="$T/deploy-nourl.sh"
check "pulou a checagem de rede (nenhuma checagem de worker/auth)" "grep -q 'conferência de rede pulada' $T/out.log && grep -q 'Checagens de rede puladas' $T/out.log && ! grep -qE '^(✓|✗|!) (worker|auth-agente|auth-token)' $T/out.log"

echo "F) sem EXECUTAR_AGENT_TOKEN: para antes de tocar na Cloudflare"
rm -f "$T/calls.log"
env -u EXECUTAR_AGENT_TOKEN WRANGLER_BIN="$T/wr.sh" bash scripts/bootstrap.sh >"$T/out.log" 2>&1; code=$?
check "saiu com erro e sem chamar o wrangler" "[ $code -ne 0 ] && [ ! -e $T/calls.log ] && grep -q 'EXECUTAR_AGENT_TOKEN não definido' $T/out.log"

if [ "$FAILS" -ne 0 ]; then echo "✗ $FAILS verificação(ões) falharam"; exit 1; fi
echo "✓ bootstrap: todos os cenários passaram"
