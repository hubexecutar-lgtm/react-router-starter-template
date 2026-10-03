# WORKFLOW-001 — Migração do Workflow EXECUTAR (+ CMS + plugins) para o monorepo

| Campo | Valor |
|---|---|
| Contrato | EXECUTAR-MONOREPO-WORKFLOW-001 v1.0.0 |
| Data | 2026-10-03 |
| Origem | `executar-23/workflows-starter-template` @ `bd9eb43` (branch `main`) |
| Destino | `apps/workflow` (app), `.claude/`, `plugins/`, `.claude-plugin/`, `.handoff/` e `.github/workflows/` na raiz |
| Repositório de origem | não alterado pela migração |
| Produção | não tocada: Worker `workflows-starter-template` (conta Hub.executar) segue publicado com os mesmos bindings |

## 1. Decisões

- **Paridade antes de melhoria (ADR-M01):** código movido como está. Só mudaram os caminhos que dependiam da raiz do repositório (seção 3).
- **Lockfile único:** `package-lock.json` da raiz regenerado com o novo workspace; o do app original foi descartado.
- **Sem `packages/*` novo:** nada é compartilhado com `apps/blog` ainda (ADR-M01).
- **Versões-base já alinhadas** com o blog: React 19.2.1, Vite ^7, Tailwind 4.1.17, TypeScript 5.9.3, wrangler 4.136.1.

## 2. Mapa origem → destino

| Origem | Destino |
|---|---|
| `admin/ src/ worker/ shared/ test/ public/ scripts/ examples/ assets/ workflow.json wrangler*.jsonc tsconfig*.json vite.config.ts vitest.config.ts eslint.config.js index.html package.json README.md .gitignore` | `apps/workflow/` |
| `CLAUDE.md` | `apps/workflow/CLAUDE.md` (seção Git substituída pelo ADR-M02 da raiz) |
| `.claude/` (agentes, skills, hooks, settings) | `.claude/` (raiz) |
| `plugins/` e `.claude-plugin/marketplace.json` | idem (raiz) |
| `.handoff/` | `.handoff/` (raiz) |
| `.github/workflows/admin-workflow-handoff-ci.yml` | `.github/workflows/workflow-app-ci.yml` (reescrito para o monorepo) |
| `package-lock.json` | descartado; novo lockfile na raiz |

## 3. Ajustes de caminho (únicos desvios de código)

- `apps/workflow/scripts/embed-cadeia-prompt.mjs`: lê `.claude/` da raiz do monorepo (`../../..` a partir de `scripts/`). A saída `worker/generated/cadeia-prompt.ts` fica no app e saiu **idêntica** à original.
- `apps/workflow/scripts/generate-ai-registry.mjs`: lê `.claude/` e `plugins/` da raiz; grava no app. `sourcePath` do registro passa a ser relativo à raiz.
- CI: instala na raiz (`npm ci`) e roda cada passo com `-w apps/workflow`.

## 4. Verificação (executada numa cópia do monorepo @ `5ba2099` com o pacote aplicado)

| Verificação | Resultado |
|---|---|
| `npm install` na raiz | ok (918 pacotes); `npm ci` depois, com o lockfile gerado, também ok |
| `npm run registry:generate -w apps/workflow` | 48 entidades |
| `npx tsc -b` em `apps/workflow` | 0 erros |
| `npm run lint -w apps/workflow` | limpo |
| `npm test -w apps/workflow` | 8 arquivos, 62 testes passando |
| `npm run build -w apps/workflow` | ok |
| `npm run typecheck -w apps/blog` | sem erros (blog não afetado) |
| `cadeia-prompt.ts` | idêntico ao do repositório de origem |

Não verificado: `npm test -w apps/blog` (Playwright), Workers Builds e o deploy.

## 5. Pendências (viram issues no repositório de destino)

Ver `LEIA-ME-PRIMEIRO.md`, seção "Depois da migração".
