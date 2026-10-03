#!/usr/bin/env bash
# SessionStart: deixa o ambiente do agente pronto e mostra só o que precisa de atenção.
# Nunca falha a sessão (sempre exit 0) e nunca imprime token.
cd "${CLAUDE_PROJECT_DIR:-.}" 2>/dev/null || exit 0

if [ ! -d node_modules ]; then
	echo "Instalando dependências (npm ci)…"
	if npm ci --no-audit --no-fund >/dev/null 2>&1; then echo "✓ dependências instaladas"; else echo "! npm ci falhou: rode 'npm ci' na raiz e veja o erro"; fi
fi

DOCTOR="apps/workflow/scripts/doctor.mjs"
[ -f "$DOCTOR" ] || exit 0
if [ -n "${EXECUTAR_AGENT_TOKEN:-}" ]; then ARGS=""; else ARGS="--offline"; fi
# shellcheck disable=SC2086
OUT="$(timeout 40 node "$DOCTOR" $ARGS 2>&1)"
PROBLEMS="$(printf '%s\n' "$OUT" | grep -E -A1 '^(✗|!)' || true)"
if [ -n "$PROBLEMS" ]; then
	echo "Pré-voo EXECUTAR (npm run doctor) encontrou pendências:"
	printf '%s\n' "$PROBLEMS"
	if printf '%s\n' "$PROBLEMS" | grep -q '^✗ worker'; then echo "Para publicar o Worker do zero: npm run bootstrap -w apps/workflow (runbook: docs/AGENT-RUNBOOK.md)."; fi
else
	echo "✓ Pré-voo EXECUTAR ok${ARGS:+ (offline: defina EXECUTAR_AGENT_TOKEN para conferir o Worker)}."
fi
exit 0
