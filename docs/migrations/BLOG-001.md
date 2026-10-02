# BLOG-001 — Migração do Blog Risco Cognitivo para o monorepo EXECUTAR

| Campo | Valor |
|---|---|
| Contrato | EXECUTAR-MONOREPO-BLOG-001 v1.0.0 |
| Data | 2026-10-02 |
| Origem | `executar-23/Risco-cognitivo-blog` @ `11f78e42a9c10df077b50c169b05ec4da7718f68` (Astro 5.14.5, saída estática) |
| Referência publicada | https://risco-cognitivo-blog.executar-rotina-8b7.workers.dev |
| Destino | `apps/blog` deste repositório (React Router 7.9.6, SSR + prerender, Cloudflare Workers) |
| Repositório de origem | não alterado |

## 1. Decisões

- **Monorepo:** npm workspaces (`apps/*`, `packages/*`), lockfile único na raiz. O app React Router
  da fundação foi movido com `git mv` para `apps/blog/` (histórico preservado) e recebeu o Blog.
- **Paridade antes de melhoria:** conteúdo, identidade e comportamento migrados como estão,
  inclusive o que hoje parece errado (seção 6). Correções vêm em PRs separados.
- **Renderização:** todas as páginas, artigos, RSS e sitemaps são pré-renderizados no build
  (equivalente ao `output: "static"` do Astro). O Worker serve SSR para o resto, inclusive o 404.
- **Deploy:** Worker existente `react-router-starter-template` (conta hub-executar). A produção
  atual do Blog fica em outra conta, sem acesso nesta sessão, e não foi tocada.

## 2. Mapa Astro → React Router

| Astro (`src/`) | React Router (`apps/blog/`) |
|---|---|
| `pages/index.astro` | `app/routes/home.tsx` |
| `pages/{about,contact,faq,pricing,login,signup}.astro` | `app/routes/<nome>.tsx` |
| `pages/privacy.mdx` (layout BasicLayout) | `app/routes/privacy.tsx` + `content/pages/privacy.mdx` |
| `pages/blog/index.astro` (+ `<script>` de filtro) | `app/routes/blog._index.tsx` (filtro em estado React, mesmos `data-*`/`aria-pressed`) |
| `pages/blog/[...slug].astro` | `app/routes/blog.$slug.tsx` (404 para slug inexistente) |
| `pages/admin.astro` | `app/routes/admin._index.tsx` |
| `pages/admin/design-system.astro` | `app/routes/admin.design-system.tsx` |
| `pages/admin/relatorio-exemplo.mdx` (ReportLayout) | `app/routes/admin.relatorio-exemplo.tsx` + `content/pages/relatorio-exemplo.mdx` |
| `pages/admin/rotas.astro` (QR no build) | `app/routes/admin.rotas.tsx` (QR no loader, executado no prerender) |
| `pages/rss.xml.js` (@astrojs/rss) | `app/routes/rss[.]xml.ts` |
| @astrojs/sitemap | `app/routes/sitemap-index[.]xml.ts`, `app/routes/sitemap-0[.]xml.ts` |
| `pages/404.astro` | `app/routes/$.tsx` (catch-all, status 404) |
| `content.config.ts` + `astro:content` | `app/lib/content.ts` (mesmo schema zod) + `app/lib/content.server.ts` (corpo bruto) |
| `components/BaseHead.astro` | `app/lib/seo.ts` + `links`/`<head>` de `app/root.tsx` |
| `layouts/*.astro` | `app/layouts/*.tsx` |
| `components/**` (81 TSX), `lib/`, `data/`, `hooks/`, `styles/` | `app/` com o mesmo alias `@/*` |
| `public/**` (inclui hub-editorial, skills, catalogo-offline) | `public/**` (byte a byte) |
| `tests/**` + 25 screenshots | `tests/**` (paths `src/` → `app/`) + `tests/parity.spec.ts` |

Pipeline de Markdown/MDX (`vite.config.ts`): `@mdx-js/rollup` com `remark-frontmatter`,
`remark-mdx-frontmatter`, `remark-gfm`, `remark-smartypants`, `remarkPlain` (ADR-05),
`rehype-slug` e `@shikijs/rehype` (github-dark), reproduzindo os padrões do Astro.

## 3. Adaptações técnicas

| Ponto | Tratamento |
|---|---|
| Ilhas `client:only` / `client:visible` | Removidas: tudo renderiza no servidor e hidrata. Nenhum componente acessa `window` fora de `useEffect`, então não houve guarda. |
| Scripts inline do Astro | Tema anti-flash: `<script>` no `<head>` do root. Cópia (ADR-05): import de efeito em `DefaultLayout` (liga o listener ao carregar o módulo). Filtros: estado React. |
| `?raw` com `@mdx-js/rollup` | O plugin ignora a query string e compilaria o `?raw`; o wrapper em `vite.config.ts` só compila ids sem query. |
| Alias `@/` dentro de MDX | `vite-tsconfig-paths` só cobre TS/JS; adicionado `resolve.alias`. |
| `scan.ts` (ADR-06) | Lê `app/routes.ts` em vez de varrer `src/pages`. |
| Hub de rotas | `/sitemap-0.xml` virou rota declarada: registrada em `app/data/routes.ts` (exigência do ADR-06). |
| Tipos | `BlogPost` tipado com `Post`; `VariantProps` como import de tipo; `@ts-expect-error` documentado em `rootTabIndex` (recharts 2.x, código original). |
| ESLint | Configuração sem os plugins do Astro; ignora saídas geradas. |

## 4. Evidências de validação

Executado em 2026-10-02 nesta sessão (build de produção servido por `vite preview` em workerd).

| Verificação | Resultado |
|---|---|
| `tsc -b` | sem erros |
| `eslint .` | sem erros |
| `react-router build` | OK — 13 páginas + 6 artigos + 3 XML pré-renderizados |
| `wrangler deploy --dry-run` | OK — 3619 KiB (gzip 720 KiB), 176 assets, sem bindings |
| `playwright test` (suítes originais) | **60/60** — `routes.spec` 9, `plain.spec` 20, `design-system.spec` 31 (inclui as 25 screenshots do Astro, tolerância 1%, sem atualizar baselines) |
| `npm run parity` (vs. referência publicada) | **31/31** |

Matriz de paridade (`tests/parity.spec.ts`): para cada página compara status HTTP, `<title>`,
meta description, canonical, `h1`, conjunto de links e de imagens após renderização, e exige
zero erro de console na versão migrada.

| Rota | Status | Título/desc./canonical/h1 | Links | Imagens |
|---|---|---|---|---|
| `/`, `/about/`, `/contact/`, `/faq/`, `/pricing/`, `/privacy/`, `/login/`, `/signup/` | = | = | = | = |
| `/blog/` + 6 artigos | = | = | = | = |
| `/admin/`, `/admin/design-system/`, `/admin/relatorio-exemplo/` | = | = | = | = |
| `/admin/rotas/` | = | = | = + `/sitemap-0.xml` (intencional) | = |
| `/hub-editorial/`, `/skills/`, `/catalogo-offline/` | = | = | = | = (arquivos idênticos byte a byte) |
| `/sitemap-index.xml`, `/sitemap-0.xml` | = | — | — | idênticos byte a byte |
| `/rss.xml` | = | canal idêntico | mesmos 6 itens | ordem dos itens difere (6.2) |
| `/about` → `/about/` | 307 = 307 | | | |
| rota inexistente | 404 = 404 | página "Page Not Found" | | |
| `/admin/tools/qr-python.zip` | 200, idêntico | | | |

## 5. Diferenças intencionais ou inevitáveis

1. `/admin/rotas/` lista `/sitemap-0.xml` (ADR-06; antes era gerado sem registro).
2. Ordem dos itens do RSS: o Astro emitia na ordem interna do glob loader (do-risco, post-5,
   post-2, post-3, post-4, post-1); agora é a ordem dos arquivos. Mesmos itens e conteúdo.
3. `<meta name="generator" content="Astro v5.14.5">` não existe mais.
4. Navbar, logos, depoimentos, preços, FAQ e o artigo vêm no HTML do servidor (antes eram
   `client:only`, renderizados só no navegador). Melhora SEO e leitura sem JavaScript.
5. `/admin/design-system/` em produção lança o erro de hidratação React #418 (texto
   divergente); a versão migrada não tem erro de console.
Verificado sem diferença: em `post-5.mdx`, `<HeaderLink onclick="alert('clicked!')">` sai sem
`onclick` nas duas versões (o React descarta atributos de evento em string também na produção atual).

## 6. Pendências herdadas (não corrigidas, por decisão de paridade)

- Identidade do template: `SITE_TITLE` "Mainline - Modern Astro Template", metadados e
  palavras-chave do shadcnblocks, home `/` e páginas about/pricing/faq/login/signup do template,
  política de privacidade em inglês.
- `SITE_URL = https://example.com` (era o `site` do Astro): canonical, og:url, RSS e sitemaps
  apontam para example.com.
- `/admin/*` sem autenticação ("Interno exposto", ADR-06).
- QRs de `/admin/rotas/` apontam para `DEFAULT_BASE_URL` (o host Astro atual); ajustar quando
  o domínio de produção do monorepo for definido (`PUBLIC_ROUTES_BASE_URL`).

## 7. Deploy

`wrangler deploy` foi executado contra o Worker `react-router-starter-template` e **falhou no
upload de assets** (`POST /workers/assets/upload` → 401) depois de criar a sessão de upload.
Causa: o upload autentica com o JWT da sessão, e o proxy desta sessão de trabalho substitui o
header `Authorization` de `api.cloudflare.com` pela credencial injetada. Nada foi publicado: o
Worker continua com a versão anterior (modificada em 2026-10-02T14:27:47Z, antes da sessão).

Para publicar, de um ambiente com credencial própria (máquina local ou CI):

```bash
npm install
npm run deploy:blog        # react-router build && wrangler deploy (apps/blog)
PARITY_BASE_URL=https://risco-cognitivo-blog.executar-rotina-8b7.workers.dev npm run parity -w apps/blog
```

## 8. Próximos passos do monorepo

1. Publicar `apps/blog` e repetir a paridade contra o host publicado.
2. PR de identidade: título/metadados "Risco Cognitivo", `SITE_URL` real, revisão das páginas do template.
3. Proteger `/admin/*` (ex.: Cloudflare Access).
4. Próximo repositório → `apps/<nome>`; extrair `packages/ui` (shadcn + tokens) quando dois apps o usarem.
