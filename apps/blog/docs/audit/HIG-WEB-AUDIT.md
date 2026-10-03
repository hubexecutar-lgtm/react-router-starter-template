# HIG-WEB-AUDIT — apps/blog

Gerado por `scripts/hig-audit.mjs` em 2026-10-03. Regra: **UX-GOV-HIG-001** (`docs/governance/UX-GOV-HIG-001.md`,
ADR-M03). Gate automatizado: `tests/hig.spec.ts` (axe WCAG 2.0/2.1/2.2 A+AA, títulos, landmarks, alvos ≥ 24 px,
reflow 320 px, medida ≤ 75 caracteres, sem prosa mono, `alt`, halftone fora do texto, foco visível) em
7 rotas, a 1440, 390 e 320 px, mais amostra no tema escuro.

**Release: PASS** — P0/P1 abertos: 0.

## Resumo

| Fase | Resultado |
|---|---|
| Linha de base (main @ ab685e2 (antes do RC-UX-HIG-002 PR D)) | 799 verificações · 790 PASS · 0 PARTIAL · 9 FAIL (P0 1, P1 8, P2 0, P3 0) |
| Reteste (automatizado) | 126 verificações · 126 PASS · 0 PARTIAL · 0 FAIL (P0 0, P1 0, P2 0, P3 0) |
| Checklist manual | 8 verificações · 4 PASS · 4 PARTIAL · 0 FAIL (P0 0, P1 0, P2 3, P3 1) |

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
| AUD-HIG-08 | `todas` | política de privacidade | PARTIAL | P2 | A página /privacy/ foi removida (ADR-13) e o site ainda carrega Inter e IBM Plex Mono do Google Fonts; não há política nem canal de direitos publicados. | Publicar a política (controlador e canal de contato) junto com o novo front-end, antes de divulgar o site |
| AUD-HIG-06 | `todas (tema escuro)` | tokens .dark | PARTIAL | P3 | Escuro derivado e marcado PROVISIONAL (ADR-11); contraste AA verificado por amostra no gate | Especificar o tema escuro |
| AUD-HIG-05 | `todas` | navegadores | PARTIAL | P2 | Gate executado em Chromium (1440, 390 e 320 px; iPhone emulado por viewport); o container não tem WebKit | Rodar a checagem visual no Safari real (iOS e macOS) no host de produção |

## Checklist manual (domínios não automatizáveis)

| Regra | Rota | Componente | Status | Sev. | Evidência | Correção |
|---|---|---|---|---|---|---|
| AUD-HIG-01 | `todas` | PageHero / Section | PASS | P1 | Site do zero (ADR-13): 404 usa PageHero; a home provisória tem h1, lead e landmarks. As seções com "Saiba mais ›" voltam com o novo front-end e entram neste gat | — |
| AUD-HIG-02 | `todas` | SiteHeader (menu), ThemeToggle | PASS | P1 | Menu móvel fecha com Esc e devolve o foco quando há navegação (hoje vazia); skip link e foco visível cobertos em surfaces.spec; tema reversível. | — |
| AUD-HIG-03 | `todas` | tokens (global.css), rc-cell, Button, ChevronLink | PASS | P1 | tokens.spec e surfaces.spec travam valores, célula (sem contorno, raio 2px) e ausência de hex fora de global.css | — |
| AUD-HIG-04 | `todas` | navegação e anatomia | PASS | P2 | Leads ≤ 60ch, parágrafos ≤ 68ch (--measure) e plain text estruturado nas páginas existentes (home, 404, /admin/*). | — |
| AUD-HIG-08 | `/admin/*` | rotas internas | PARTIAL | P2 | Sem guarda de autenticação no app (ADR-06, "Interno exposto"); o host de produção inteiro está atrás do Cloudflare Access | Waiver: Cloudflare Access protege o host; guarda no app quando o site for público (BLOG-001 §8) |
| AUD-HIG-08 | `todas` | política de privacidade | PARTIAL | P2 | A página /privacy/ foi removida (ADR-13) e o site ainda carrega Inter e IBM Plex Mono do Google Fonts; não há política nem canal de direitos publicados. | Publicar a política (controlador e canal de contato) junto com o novo front-end, antes de divulgar o site |
| AUD-HIG-06 | `todas (tema escuro)` | tokens .dark | PARTIAL | P3 | Escuro derivado e marcado PROVISIONAL (ADR-11); contraste AA verificado por amostra no gate | Especificar o tema escuro |
| AUD-HIG-05 | `todas` | navegadores | PARTIAL | P2 | Gate executado em Chromium (1440, 390 e 320 px; iPhone emulado por viewport); o container não tem WebKit | Rodar a checagem visual no Safari real (iOS e macOS) no host de produção |

## Rotas cobertas

`/` · `/admin/` · `/admin/design-system/` · `/admin/handoff/` · `/admin/relatorio-exemplo/` · `/admin/rotas/` · `/rota-inexistente-hig/`

O detalhe completo (todas as 126 verificações automatizadas, inclusive PASS) está em
`HIG-WEB-AUDIT.json`. Para atualizar: `HIG_AUDIT=1 npx playwright test tests/hig.spec.ts && node scripts/hig-audit.mjs`.
