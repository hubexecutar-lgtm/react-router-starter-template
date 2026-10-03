#!/usr/bin/env node
// Pré-voo do agente EXECUTAR: confere ambiente, arquivos e Worker e diz a correção exata de cada falha.
// Uso: npm run doctor -w apps/workflow [-- --offline] [-- --json]
//   --offline  só checagens locais (sem rede): usado no CI e no hook de sessão
//   --json     saída legível por máquina
// Nunca imprime o token. Sai com 1 se houver FAIL.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const args = new Set(process.argv.slice(2));
const OFFLINE = args.has("--offline");
const AS_JSON = args.has("--json");
const DEFAULT_URL = "https://workflows-starter-template.hub-executar.workers.dev";
const URL_BASE = (process.env.EXECUTAR_URL || DEFAULT_URL).replace(/\/$/, "");
const TOKEN = process.env.EXECUTAR_AGENT_TOKEN || "";

const results = [];
const add = (level, id, msg, fix) => results.push({ level, id, msg, ...(fix ? { fix } : {}) });

function repoRoot() {
	let dir = dirname(fileURLToPath(import.meta.url));
	for (let i = 0; i < 6; i++) {
		if (existsSync(join(dir, ".claude", "skills", "executar-flow"))) return dir;
		dir = resolve(dir, "..");
	}
	return null;
}

// ---------------------------------------------------------------- locais
const major = Number(process.versions.node.split(".")[0]);
if (major >= 22) add("PASS", "node", `Node ${process.versions.node}`);
else add("FAIL", "node", `Node ${process.versions.node} (precisa de 22 ou mais)`, "Instale Node 22+ (nvm install 22).");

const root = repoRoot();
if (!root) {
	add("FAIL", "repo", "Raiz do monorepo não encontrada (.claude/skills/executar-flow ausente)", "Rode dentro do clone de hubexecutar-lgtm/react-router-starter-template.");
} else {
	const need = [
		".claude/skills/executar-flow/scripts/flow.mjs",
		".claude/skills/cadeia-valor-unica/scripts/validar_cadeia.py",
		".claude/skills/plano-operacional-rastreavel/scripts/validar_plano.py",
		"plugins/executar-cop/.claude-plugin/plugin.json",
		"plugins/agent-handoff/.claude-plugin/plugin.json",
		".claude-plugin/marketplace.json",
		".handoff/config.md",
	];
	const missing = need.filter((f) => !existsSync(join(root, f)));
	if (missing.length) add("FAIL", "arquivos", `Faltam: ${missing.join(", ")}`, "git pull origin main (a migração WORKFLOW-001 traz esses arquivos).");
	else add("PASS", "arquivos", "Skills, plugins, marketplace e .handoff presentes");

	const agentsDir = join(root, ".claude", "agents");
	const agents = existsSync(agentsDir) ? readdirSync(agentsDir).filter((f) => f.endsWith(".md")) : [];
	const wanted = ["clp-orchestrator", "research-agent", "plano-ops-agent", "analytics-agent", "blog-publisher", "cadeia-valor-unica"];
	const lacking = wanted.filter((a) => !agents.includes(`${a}.md`));
	if (lacking.length) add("FAIL", "agentes", `Faltam agentes: ${lacking.join(", ")}`, "git pull origin main.");
	else add("PASS", "agentes", `${wanted.length} subagentes presentes`);

	if (existsSync(join(root, "node_modules"))) add("PASS", "deps", "Dependências instaladas (node_modules)");
	else add("FAIL", "deps", "node_modules ausente", "Na raiz: npm ci");

	try {
		const cfg = readFileSync(join(root, "apps/workflow/wrangler.jsonc"), "utf8");
		const repo = /"BLOG_REPO":\s*"([^"]+)"/.exec(cfg)?.[1];
		add(repo ? "PASS" : "WARN", "blog", repo ? `CMS publica em ${repo} (apps/blog)` : "BLOG_REPO ausente no wrangler.jsonc", repo ? undefined : "Defina BLOG_REPO em apps/workflow/wrangler.jsonc.");
	} catch {
		add("WARN", "blog", "wrangler.jsonc do app não lido");
	}
}

try {
	execFileSync("python3", ["--version"], { stdio: "ignore" });
	add("PASS", "python3", "python3 disponível (juízes das skills)");
} catch {
	add("WARN", "python3", "python3 ausente: os juízes validar_cadeia.py e validar_plano.py não rodam", "Instale python3 (stdlib basta).");
}

if (TOKEN.length >= 24) add("PASS", "token", `EXECUTAR_AGENT_TOKEN definido (${TOKEN.length} caracteres)`);
else if (TOKEN) add("FAIL", "token", "EXECUTAR_AGENT_TOKEN curto demais (mínimo 24)", "Gere um valor aleatório longo e defina no ambiente; depois npm run agent:token -w apps/workflow.");
else add("FAIL", "token", "EXECUTAR_AGENT_TOKEN não definido", "Cloud: Edit → variáveis de ambiente. Local: export EXECUTAR_AGENT_TOKEN=… (nunca no chat nem no repositório).");
add("INFO", "url", `EXECUTAR_URL = ${URL_BASE}${process.env.EXECUTAR_URL ? "" : " (padrão)"}`);

// ---------------------------------------------------------------- rede
async function http(path, init = {}) {
	const ctrl = new AbortController();
	const timer = setTimeout(() => ctrl.abort(), 15000);
	try {
		return await fetch(`${URL_BASE}${path}`, { ...init, signal: ctrl.signal, redirect: "manual" });
	} finally {
		clearTimeout(timer);
	}
}

async function network() {
	let health;
	try {
		health = await http("/api/health");
	} catch (e) {
		add("FAIL", "worker", `Sem resposta de ${URL_BASE} (${e.cause?.code || e.name})`, "Confira EXECUTAR_URL e a rede; se o Worker não existe, rode npm run bootstrap -w apps/workflow.");
		return;
	}
	const body = await health.text();
	// O Worker responde JSON; um 404 em texto/HTML (erro 1042 ou "Page not found") é a Cloudflare dizendo que não há Worker aí.
	if (health.status === 404 && !body.trim().startsWith("{")) {
		add("FAIL", "worker", "Nenhum Worker publicado nesse endereço (a Cloudflare respondeu 404 sem JSON)", "Publique: npm run bootstrap -w apps/workflow (cria R2, KV, segredos e faz o deploy).");
		return;
	}
	if (health.status !== 200) {
		add("FAIL", "worker", `/api/health respondeu ${health.status}`, "Veja os logs do Worker no painel; se for deploy novo, rode npm run bootstrap -w apps/workflow.");
		return;
	}
	add("PASS", "worker", "/api/health 200");

	const anon = await http("/api/tasks");
	if (anon.status === 401) add("PASS", "auth-agente", "/api/tasks exige token (401 sem credencial)");
	else if (anon.status === 503) add("FAIL", "auth-agente", "AGENT_TOKEN não está configurado no Worker (503)", "npm run agent:token -w apps/workflow (ou npm run bootstrap).");
	else add("FAIL", "auth-agente", `/api/tasks sem token respondeu ${anon.status} (esperado 401)`, "Rota de agente aberta: revise worker/agent-api.ts antes de usar.");

	if (TOKEN) {
		const withTok = await http("/api/tasks", { headers: { Authorization: `Bearer ${TOKEN}` } });
		if (withTok.status === 200) add("PASS", "auth-token", "Token do ambiente aceito pelo Worker (200)");
		else if (withTok.status === 401) add("FAIL", "auth-token", "Token do ambiente difere do segredo do Worker (401)", "npm run agent:token -w apps/workflow para sincronizar.");
		else add("WARN", "auth-token", `/api/tasks com token respondeu ${withTok.status}`);
	}

	const defs = await http("/api/definitions");
	add(defs.status === 200 ? "PASS" : "WARN", "definicoes", `/api/definitions ${defs.status}`, defs.status === 200 ? undefined : "Worker desatualizado: npm run bootstrap -w apps/workflow.");

	const mcp = await http("/mcp", {
		method: "POST",
		headers: { "content-type": "application/json", accept: "application/json, text/event-stream" },
		body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "doctor", version: "1" } } }),
	});
	if (mcp.status === 401 && /Bearer/i.test(mcp.headers.get("www-authenticate") || "")) add("PASS", "mcp", "/mcp no ar e exige OAuth (ADMIN_TOKEN no /authorize)");
	else add("FAIL", "mcp", `/mcp respondeu ${mcp.status} (esperado 401 com desafio Bearer)`, "Worker sem a rota MCP: npm run bootstrap -w apps/workflow.");

	const admin = await http("/api/hub");
	add(admin.status === 401 ? "PASS" : "FAIL", "cms", `/api/hub ${admin.status}${admin.status === 401 ? " (CMS fechado sem login)" : ""}`, admin.status === 401 ? undefined : "CMS exposto ou ADMIN_TOKEN ausente: npm run bootstrap -w apps/workflow.");
}

if (!OFFLINE) await network();
else add("INFO", "rede", "Checagens de rede puladas (--offline)");

// ---------------------------------------------------------------- saída
const icon = { PASS: "✓", WARN: "!", FAIL: "✗", INFO: "·" };
const fails = results.filter((r) => r.level === "FAIL");
// --offline não exige token (CI e hook de sessão): token ausente vira aviso.
if (OFFLINE) for (const r of fails) if (r.id === "token") r.level = "WARN";
const failed = results.filter((r) => r.level === "FAIL");

if (AS_JSON) {
	console.log(JSON.stringify({ ok: failed.length === 0, url: URL_BASE, offline: OFFLINE, results }, null, 2));
} else {
	for (const r of results) {
		console.log(`${icon[r.level]} ${r.id.padEnd(12)} ${r.msg}`);
		if (r.fix && r.level !== "PASS") console.log(`    → ${r.fix}`);
	}
	console.log(
		failed.length
			? `\n✗ ${failed.length} falha(s). Corrija na ordem acima e rode de novo.`
			: OFFLINE
				? "\n✓ Ambiente local ok. Rode sem --offline para conferir o Worker e o token."
				: "\n✓ Pronto: o agente pode rodar /executar-flow e /cadeia-unica.",
	);
}
process.exit(failed.length ? 1 : 0);
