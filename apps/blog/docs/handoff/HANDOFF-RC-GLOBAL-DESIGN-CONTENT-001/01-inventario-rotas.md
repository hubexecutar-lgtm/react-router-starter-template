# 01 · Inventário de rotas

Fontes da descoberta: `src/pages/**` (incl. dinâmicas), coleção `blog`, `public/*/index.html`,
`src/data/routes.ts` (hub, ADR-06), navegação e build (`dist/`).
Status: IMPLEMENTED = código no branch; VERIFIED = coberto por teste automatizado verde nesta entrega
(`tests/content.spec.ts`, `tests/surfaces.spec.ts` editorial routes 390/768/1363 × claro/escuro + axe).

| Rota | Arquivo / componente | Origem do conteúdo | Contrato visual | Ação | Status | Evidência |
|---|---|---|---|---|---|---|
| `/` | `pages/index.astro` | coleção + TAX + EVD + copy de marca (slide 01) | editorial + `SURFACE` | reescrita (era landing Mainline) | VERIFIED | surfaces.spec, content.spec (busca), screenshot |
| `/blog/` | `pages/blog/index.astro`, `FilterChips`, `ArticleCard` | coleção + TAX | editorial (slide 04) | reescrita | VERIFIED | content.spec (filtro) |
| `/blog/:slug/` (9) | `pages/blog/[...slug].astro` (SSR; era `client:only`) | MDX gerado dos Quick Frameworks + EVD | editorial (slide 03) + `.rc-prose` | reescrita | VERIFIED | content.spec (artigo), plain.spec (tabela), design-system.spec |
| `/blog/post-1…5/` | `public/_redirects` | — | — | removidos, 301 | VERIFIED (arquivo) / runtime A VERIFICAR no Workers | content.spec (destinos existem) |
| `/temas/` | `pages/temas/index.astro` | TAX | `SURFACE` + `AsciiDiagram` | nova | VERIFIED | surfaces.spec |
| `/temas/:slug/` (8) | `pages/temas/[slug].astro` | TAX + coleção | `SURFACE` | nova | VERIFIED (amostra `controles-cognitivos`) | surfaces.spec |
| `/mapas/` | `pages/mapas/index.astro` | TAX-RC-008 + CNT | `SURFACE` + `AsciiDiagram` (slide 05) | nova | VERIFIED | surfaces.spec |
| `/guias/` | `pages/guias/index.astro` | seção “Next 01” dos artigos | `SURFACE` (slide 07) | nova | VERIFIED | surfaces.spec |
| `/evidencias/` | `pages/evidencias/index.astro`, `EvidenceTable` | EVD-RC-0001…0017 | `.ds-table` (slide 06) | nova | VERIFIED | surfaces.spec |
| `/buscar/` | `pages/buscar/index.astro` | índice JSON (coleção + TAX + EVD) | slide 08 | nova | VERIFIED | content.spec (busca, abas) |
| `/about/` | `pages/about.astro` | DEC-RC-0001, pilares do artigo-tese, workflow QF | `SURFACE` | reescrita (era About Mainline) | VERIFIED | surfaces.spec |
| `/faq/` | `pages/faq.astro` | ARG, TAX, briefs | `details` | reescrita (lorem) | VERIFIED | surfaces.spec |
| `/contact/` | `pages/contact.astro` | — | Callout `pending` | reescrita, sem formulário falso (L-03) | VERIFIED | surfaces.spec |
| `/pricing/` | `pages/pricing.astro` | `vocab.canal` + `assets` | `.ds-table` | reescrita como “Acesso e formatos” | VERIFIED | surfaces.spec |
| `/signup/` | `pages/signup.astro`, `NewsletterNotice` | — | `SURFACE`, form `disabled` | reescrita, `noindex` (L-02) | VERIFIED | surfaces.spec |
| `/login/` | `pages/login.astro` | — | editorial | reescrita (“não é preciso entrar”), `noindex` | VERIFIED | surfaces.spec |
| `/privacy/` | `pages/privacy.mdx`, `BasicLayout` | comportamento técnico real do site | prose | reescrita pt-BR (L-04) | VERIFIED | surfaces.spec |
| `/404` | `pages/404.astro` | — | editorial | reescrita pt-BR | VERIFIED | surfaces.spec (`/rota-inexistente/`) |
| `/rss.xml` | `pages/rss.xml.js` | coleção | — | itens explícitos, pt-BR | IMPLEMENTED | build |
| `/sitemap-index.xml` | integração | — | — | `site` de produção | IMPLEMENTED | build |
| `/admin/` | `pages/admin.astro` | — | Card ADR-09 | padding do novo cabeçalho | VERIFIED | surfaces.spec (cards planos) |
| `/admin/design-system/` | `pages/admin/design-system.astro` | — | showroom | padding; showroom já documenta superfícies | VERIFIED | design-system.spec, plain.spec |
| `/admin/rotas/` | `pages/admin/rotas.astro` | `data/routes.ts` | ADR-09 | 5 rotas novas registradas | VERIFIED | routes.spec |
| `/admin/relatorio-exemplo/`, `/admin/handoff/` | MDX + `ReportLayout` | — | prose sem capitular | padding | VERIFIED | plain.spec |
| `/loja/`, `/loja/:tipo/`, `/loja/:tipo/:slug/` | `features/store` (ADR-08) | mock rotulado “Catálogo de exemplo” | ADR-09 | só cabeçalho/padding | VERIFIED | store.spec, surfaces.spec |
| `/hub-editorial/` | `public/hub-editorial/index.html` + `seed.js` (gerado) | `src/data/editorial/seed.json` | `/ds/surfaces.css`; tabela segmentada | tokens, tabela, seed externo | VERIFIED (CSS) | surfaces.spec (tools), content.spec |
| `/skills/` | `public/skills/index.html` | dados embutidos | `/ds/surfaces.css` | tokens, bordas de campo | VERIFIED (tokens) | surfaces.spec |
| `/catalogo-offline/` | `public/catalogo-offline/index.html` | dados embutidos | `/ds/surfaces.css` | tokens; raio 28px de cards → 12px | VERIFIED (tokens) | surfaces.spec |
| Layouts | `DefaultLayout`, `BasicLayout`, `ReportLayout`, `SiteHeader`, `SiteFooter` | `consts.ts`, `site/nav.ts` | editorial | `lang="pt-BR"`, skip link, cabeçalho SSR | VERIFIED | content.spec (pt-BR), surfaces.spec (teclado) |

Pendências de rota: o comportamento 301 de `public/_redirects` no runtime do Workers só pode ser conferido
após deploy (RELEASED não autorizado nesta entrega). `/catalogo-offline/` depende de `/ds/surfaces.css`
servido pelo site; aberto como arquivo isolado, perde os tokens (registrar se o uso offline real exigir
fallback).
