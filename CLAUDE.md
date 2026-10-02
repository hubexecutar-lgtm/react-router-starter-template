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

### ADR-M02: Trabalhar a partir de `main`, PR pronto (sem draft) e auto-merge

- **Status:** Aceita — importada do ADR-01 do Blog (`apps/blog/CLAUDE.md`) e estendida ao
  monorepo inteiro.
- **Contexto:** O fluxo do Blog (branch curta a partir de `main`, PR aberto já pronto) passa a
  valer para todos os apps. Várias branches de trabalho podem estar abertas ao mesmo tempo, e
  cada uma deve entrar em `main` sozinha assim que estiver verde, sem esperar as outras.
- **Decisão:**
  - Toda branch de trabalho nasce de `main` atualizada (nunca de outra branch de feature) e
    tem um único objetivo.
  - Ao concluir a mudança, abrir o Pull Request **pronto para revisão, nunca em draft**, salvo
    pedido explícito do usuário para um caso pontual.
  - Habilitar **auto-merge** no PR (método *merge commit*, que preserva o histórico e a
    proveniência das migrações). O PR entra em `main` sozinho quando o CI (Workers Builds) passa.
    Se o GitHub recusar o auto-merge porque o PR já está mergeável, mergear direto com o CI verde.
  - Branches paralelas: cada uma tem seu PR com auto-merge. Se `main` andar e gerar conflito,
    trazer `main` para a branch (merge, sem rebase de branch já publicada), validar e enviar;
    o auto-merge conclui sozinho.
- **Consequências:**
  - Sem branches de longa duração nem stacks de PRs dependentes.
  - `main` é sempre o estado publicado: o merge dispara o deploy de produção pelo Workers Builds.
  - Antes de enviar, rodar as verificações do app (`npm run typecheck`, `npm run build`,
    testes); o CI vermelho bloqueia o auto-merge.
