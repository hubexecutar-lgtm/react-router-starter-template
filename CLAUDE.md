# CLAUDE.md — Monorepo EXECUTAR

Guidance for Claude Code (and other AI agents) working in this repository.

## Estrutura

```
apps/      um diretório por produto (deploy independente)
  blog/    Risco Cognitivo — React Router 7 + Cloudflare Workers (ver apps/blog/CLAUDE.md)
packages/  código compartilhado entre produtos (vazio até o segundo produto precisar)
docs/      decisões e evidências do monorepo (docs/migrations/*)
```

- npm workspaces, **um único `package-lock.json` na raiz**. Instale sempre na raiz:
  `npm install`; dependência de um app: `npm install <pkg> -w apps/<app>`.
- Scripts da raiz delegam aos apps: `npm run dev` (blog), `npm run build`,
  `npm run typecheck`, `npm run test`, `npm run deploy:blog`.
- Cada app mantém seus próprios ADRs no `CLAUDE.md` do app; leia-o antes de mexer no app.

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
