# Risco Cognitivo — `apps/blog`

Blog do ecossistema EXECUTAR: React Router 7 com SSR em Cloudflare Workers, páginas
pré-renderizadas, conteúdo em Markdown/MDX e o design system do projeto (shadcn/ui,
Tailwind 4). Migrado do Astro em EXECUTAR-MONOREPO-BLOG-001
(`docs/migrations/BLOG-001.md` na raiz).

## Rodar

Na raiz do monorepo:

```bash
npm install
npm run dev            # http://localhost:5173
```

No diretório do app (`apps/blog`):

| Comando | O que faz |
|---|---|
| `npm run build` | build de produção + prerender (`build/client`, `build/server`) |
| `npm run preview` | build + Worker local (workerd) |
| `npm run typecheck` | typegen do React Router + `tsc -b` |
| `npm run lint` | ESLint |
| `npm test` | Playwright: rotas (ADR-06), plain text, design system, superfícies, conteúdo e loja, com screenshots |
| `npm run content:check` | Quick Frameworks e arquivos gerados em dia + `tests/content.spec.ts` (ADR-10) |
| `npm run parity` | histórico: comparação com o site Astro original (não vale para o conteúdo novo) |
| `npm run deploy` | build + `wrangler deploy` |

## Estrutura

```
app/
  routes.ts          todas as rotas (registre também em app/data/routes.ts — ADR-06)
  routes/            páginas, RSS, sitemaps e o 404 (catch-all)
  layouts/           DefaultLayout, BasicLayout, ReportLayout
  components/        site (header/footer), editorial, ui (shadcn), plain, design-system
  lib/               content + posts (coleção do blog), editorial (banco), seo, plain, routes/scan
  data/              pages.ts (sitemap/prerender), routes.ts (hub de rotas), editorial/ (seed + Quick Frameworks)
  styles/global.css  tokens do design system
content/
  blog/              artigos (.mdx gerados dos Quick Frameworks; frontmatter validado por zod)
  pages/             páginas MDX (privacy, relatório de exemplo, handoff)
public/              assets, ferramentas estáticas (hub-editorial, skills, catalogo-offline), ds/surfaces.css e _redirects
scripts/             prebuild: Quick Frameworks → MDX, seed do Hub, tokens das ferramentas
docs/design-system/  especificações (callouts, dados, plain text, hub de rotas)
tests/               Playwright
```

Regras do projeto: `CLAUDE.md` (ADR-01 a ADR-10).
