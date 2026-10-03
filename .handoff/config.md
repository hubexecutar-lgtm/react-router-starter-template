# Handoff Config

## Verification Commands

test:      npm test -w apps/workflow
typecheck: (cd apps/workflow && npx tsc -b)
lint:      npm run lint -w apps/workflow
build:     npm run build -w apps/workflow

> Monorepo npm workspaces (lockfile na raiz). App: `apps/workflow`. Deploy (não é verificação): `npm run deploy:inline -w apps/workflow` com `CLOUDFLARE_API_TOKEN=proxy-managed`.

## Conventions

response_language: pt-BR
handoff_dir:       .handoff
commit_style:      conventional (mensagens em pt-BR)
convention_docs:   CLAUDE.md

## Project Documentation Index

### Agent guidance
- [CLAUDE.md](CLAUDE.md) — regras do agente na raiz; [apps/workflow/CLAUDE.md](apps/workflow/CLAUDE.md) — operação do fluxo
- [.claude/agents/](.claude/agents/) — subagentes do fluxo EXECUTAR
- [.claude/skills/](.claude/skills/) — skills locais (handoff, plano ops, executar-flow)

### Project docs
- [apps/workflow/README.md](apps/workflow/README.md) — visão geral, API e deploy
- [apps/workflow/workflow.json](apps/workflow/workflow.json) — grafo de dependências (fonte única do fluxo)
- [apps/workflow/shared/schema.ts](apps/workflow/shared/schema.ts) — tipos e helpers compartilhados Worker/UI

### Detected toolchain
- package manager: npm (package-lock.json)
- monorepo: não
- frameworks: Cloudflare Workers + Workflows + Durable Objects, React 19 + Vite + Tailwind v4, Vitest (vitest-pool-workers)
