# HIG-WEB-AUDIT — apps/blog

Gerado por `scripts/hig-audit.mjs` em 2026-10-02. Regra: **UX-GOV-HIG-001** (`docs/governance/UX-GOV-HIG-001.md`,
ADR-M03). Gate automatizado: `tests/hig.spec.ts` (axe WCAG 2.0/2.1/2.2 A+AA, títulos, landmarks, alvos ≥ 24 px,
reflow 320 px, medida ≤ 75 caracteres, sem prosa mono, `alt`, halftone fora do texto, foco visível) em
47 rotas, a 1440, 390 e 320 px, mais amostra no tema escuro.

**Release: PASS** — P0/P1 abertos: 0.

## Resumo

| Fase | Resultado |
|---|---|
| Linha de base (main @ ab685e2 (antes do RC-UX-HIG-002 PR D)) | 799 verificações · 790 PASS · 0 PARTIAL · 9 FAIL (P0 1, P1 8, P2 0, P3 0) |
| Reteste (automatizado) | 846 verificações · 846 PASS · 0 PARTIAL · 0 FAIL (P0 0, P1 0, P2 0, P3 0) |
| Checklist manual | 9 verificações · 5 PASS · 4 PARTIAL · 0 FAIL (P0 0, P1 0, P2 3, P3 1) |

## Falhas da linha de base e correção

| Regra | Rota | Componente | Status | Sev. | Evidência | Correção |
|---|---|---|---|---|---|---|
| AUD-HIG-05 | `/about/` | página@320 | FAIL | P0 | overflow=20px | PageHero: colunas com min-w-0 e display com clamp() a partir de 320 px |
| AUD-HIG-06 | `/admin/design-system/` | texto@1440 | FAIL | P1 | p.text-muted-foreground.mt-2 76ch; p.text-muted-foreground.mt-2 76ch; p.text-muted-foreground.mt-2 76ch; p.text-muted-foreground.mt-2 110ch; p.text-muted-foregr | Regra transversal de medida: p/li/dd em main com max-width: var(--measure) (68ch) |
| AUD-HIG-07 | `/admin/design-system/` | axe-core@1440 | FAIL | P1 | aria-input-field-name×1 (.ring-ring\/50); scrollable-region-focusable×1 (.rounded-\[inherit\]) | Slider: aria-label repassado ao thumb; ScrollArea: viewport focável com aria-label |
| AUD-HIG-06 | `/admin/rotas/` | texto@1440 | FAIL | P1 | p.text-muted-foreground.mt-4 76ch; p.text-muted-foreground-subtle.mt-2 86ch | Regra transversal de medida: p/li/dd em main com max-width: var(--measure) (68ch) |
| AUD-HIG-06 | `/buscar/` | texto@1440 | FAIL | P1 | li.py-5 86ch; p.text-muted-foreground.mt-1\.5 86ch; li.py-5 86ch; p.text-muted-foreground.mt-1\.5 86ch; li.py-5 86ch; p.text-muted-foreground.mt-1\.5 86ch; li.p | Regra transversal de medida: p/li/dd em main com max-width: var(--measure) (68ch) |
| AUD-HIG-06 | `/faq/` | texto@1440 | FAIL | P1 | p.text-muted-foreground.max-w-3xl 86ch; p.text-muted-foreground.max-w-3xl 86ch; p.text-muted-foreground.max-w-3xl 86ch; p.text-muted-foreground.max-w-3xl 86ch;  | Regra transversal de medida: p/li/dd em main com max-width: var(--measure) (68ch) |
| AUD-HIG-07 | `/temas/` | page@1440 | FAIL | P1 | h1=1; H3 "Risco Cognitivo" depois de H1 | h2 (visível ou sr-only) antes dos cards h3 da página |
| AUD-HIG-06 | `/temas/` | texto@1440 | FAIL | P1 | p.text-muted-foreground.mt-4 86ch | Regra transversal de medida: p/li/dd em main com max-width: var(--measure) (68ch) |
| AUD-HIG-07 | `/temas/` | page@390 | FAIL | P1 | h1=1; H3 "Risco Cognitivo" depois de H1 | h2 (visível ou sr-only) antes dos cards h3 da página |

## Itens abertos (reteste + manual)

| Regra | Rota | Componente | Status | Sev. | Evidência | Correção |
|---|---|---|---|---|---|---|
| AUD-HIG-08 | `/admin/*` | rotas internas | PARTIAL | P2 | Sem guarda de autenticação no app (ADR-06, "Interno exposto"); o host de produção inteiro está atrás do Cloudflare Access | Waiver: Cloudflare Access protege o host; guarda no app quando o site for público (BLOG-001 §8) |
| AUD-HIG-08 | `/privacy/` | política de privacidade | PARTIAL | P2 | A página descreve tema em localStorage, Hub local, Cloudflare e Google Fonts (Inter e IBM Plex Mono); controlador e canal ainda "a definir" | Definir controlador e canal de contato e atualizar /privacy/ |
| AUD-HIG-06 | `todas (tema escuro)` | tokens .dark | PARTIAL | P3 | Escuro derivado e marcado PROVISIONAL (ADR-11); contraste AA verificado por amostra no gate | Especificar o tema escuro |
| AUD-HIG-05 | `todas` | navegadores | PARTIAL | P2 | Gate executado em Chromium (1440, 390 e 320 px; iPhone emulado por viewport); o container não tem WebKit | Rodar a checagem visual no Safari real (iOS e macOS) no host de produção |

## Checklist manual (domínios não automatizáveis)

| Regra | Rota | Componente | Status | Sev. | Evidência | Correção |
|---|---|---|---|---|---|---|
| AUD-HIG-01 | `todas` | PageHero / Section / FeatureBlock | PASS | P1 | Heroes em PageHero (about, faq, contact, pricing, login, signup, 404, blog, temas, mapas, evidencias, guias) e home; seções via Section/FeatureRow; capturas em  | — |
| AUD-HIG-02 | `todas` | SiteHeader (menu), FilterChips, buscar, FAQ, ThemeToggle | PASS | P1 | Menu móvel fecha com Esc e devolve o foco (content.spec); filtros voltam a "Todos" e refletem a URL; busca mantém ?q; perguntas em <details> nativo; tema revers | — |
| AUD-HIG-03 | `todas` | tokens (global.css), rc-cell, Button, ChevronLink | PASS | P1 | tokens.spec e surfaces.spec travam valores, célula (sem contorno, raio 2px) e ausência de hex fora de global.css | — |
| AUD-HIG-04 | `todas` | navegação e anatomia | PASS | P2 | Leads ≤ 60ch, parágrafos ≤ 68ch (--measure), plain text estruturado (dl/listas/tabela), FAQ e painéis recolhíveis | — |
| AUD-HIG-08 | `/admin/*` | rotas internas | PARTIAL | P2 | Sem guarda de autenticação no app (ADR-06, "Interno exposto"); o host de produção inteiro está atrás do Cloudflare Access | Waiver: Cloudflare Access protege o host; guarda no app quando o site for público (BLOG-001 §8) |
| AUD-HIG-08 | `/privacy/` | política de privacidade | PARTIAL | P2 | A página descreve tema em localStorage, Hub local, Cloudflare e Google Fonts (Inter e IBM Plex Mono); controlador e canal ainda "a definir" | Definir controlador e canal de contato e atualizar /privacy/ |
| AUD-HIG-09 | `/loja/*` | estados de carregando, vazio e erro | PASS | P1 | store.spec cobre carregando, vazio, erro com "Tentar novamente" | — |
| AUD-HIG-06 | `todas (tema escuro)` | tokens .dark | PARTIAL | P3 | Escuro derivado e marcado PROVISIONAL (ADR-11); contraste AA verificado por amostra no gate | Especificar o tema escuro |
| AUD-HIG-05 | `todas` | navegadores | PARTIAL | P2 | Gate executado em Chromium (1440, 390 e 320 px; iPhone emulado por viewport); o container não tem WebKit | Rodar a checagem visual no Safari real (iOS e macOS) no host de produção |

## Rotas cobertas

`/` · `/about/` · `/admin/` · `/admin/design-system/` · `/admin/handoff/` · `/admin/relatorio-exemplo/` · `/admin/rotas/` · `/blog/` · `/blog/controles-cognitivos/` · `/blog/do-risco-cognitivo-a-execucao-assistida/` · `/blog/eventos-de-risco-cognitivo/` · `/blog/exposicao-cognitiva/` · `/blog/fatores-de-risco-cognitivo/` · `/blog/framework-de-risco-cognitivo/` · `/blog/gestao-do-risco-cognitivo/` · `/blog/indicadores-de-risco-cognitivo/` · `/blog/o-que-e-risco-cognitivo/` · `/buscar/` · `/contact/` · `/evidencias/` · `/faq/` · `/guias/` · `/login/` · `/loja/` · `/loja/agentes/` · `/loja/assets/` · `/loja/ebooks/` · `/loja/html/` · `/loja/pdfs/` · `/loja/prompts/` · `/loja/skills/` · `/loja/skills/skill-001/` · `/loja/workbooks/` · `/mapas/` · `/pricing/` · `/privacy/` · `/rota-inexistente-hig/` · `/signup/` · `/temas/` · `/temas/controles-cognitivos/` · `/temas/eventos-de-risco-cognitivo/` · `/temas/exposicao-cognitiva/` · `/temas/fatores-de-risco-cognitivo/` · `/temas/framework-de-risco-cognitivo/` · `/temas/gestao-do-risco-cognitivo/` · `/temas/indicadores-de-risco-cognitivo/` · `/temas/risco-cognitivo/`

O detalhe completo (todas as 846 verificações automatizadas, inclusive PASS) está em
`HIG-WEB-AUDIT.json`. Para atualizar: `HIG_AUDIT=1 npx playwright test tests/hig.spec.ts && node scripts/hig-audit.mjs`.
