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
| `npm test` | Playwright: rotas (ADR-06), plain text e design system, com screenshots |
| `npm run parity` | compara cada rota com o deploy de referência do site original |
| `npm run deploy` | build + `wrangler deploy` |

## Estrutura

```
app/
  routes.ts          todas as rotas (registre também em app/data/routes.ts — ADR-06)
  routes/            páginas, RSS, sitemaps e o 404 (catch-all)
  layouts/           DefaultLayout, BasicLayout, ReportLayout
  components/        blocks, ui (shadcn), plain, design-system
  lib/               content (coleção do blog), seo, plain, routes/scan
  data/              pages.ts (sitemap/prerender), routes.ts (hub de rotas)
  styles/global.css  tokens do design system
content/
  blog/              artigos (.md/.mdx com frontmatter validado por zod)
  pages/             páginas MDX (privacy, relatório de exemplo)
public/              assets e ferramentas estáticas (hub-editorial, skills, catalogo-offline)
docs/design-system/  especificações (callouts, dados, plain text, hub de rotas)
tests/               Playwright
```

Regras do projeto: `CLAUDE.md` (ADR-01 a ADR-07).
