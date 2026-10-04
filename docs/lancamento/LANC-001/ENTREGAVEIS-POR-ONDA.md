# LANC-001 — Entregáveis por onda (saídas esperadas)

- **ID:** RC-LANC-001-OUT · **Versão:** 0.2.0 · **Base:** `requirements/requisitos.json` (60 RQ) e `00-PLANO-DE-IMPORTANCIA.md`
- **Como ler:** cada PR lista o que você terá ao final: arquivos, ADRs, rotas, comportamento visível, testes e
  evidência. Caminhos relativos a `apps/blog/`, salvo indicação. Um item só conta como entregue quando o PR está
  em `main` (produção) com CI verde e os critérios de aceite dos RQ cumpridos.
- **Evidência comum a todo PR:** PR pronto com checklist do template; preview Cloudflare; `npm run typecheck`,
  `npm run build` e `npm test` verdes (inclui o gate HIG); `.handoff/review.md` do `/verify`; os RQ citados no
  corpo do PR.

---

## Onda 0 · Fundação

### PR-A · Logo e favicon (RQ-001, RQ-002)

| Saída | Detalhe |
|---|---|
| Ícones | `public/favicon/`: `favicon.ico` (16/32/48/64), PNG 16/32/96, `apple-touch-icon.png` 180, PWA 192/512, maskable 512, todos com o sha256 do intake |
| Manifesto | `public/favicon/site.webmanifest` com nome "Risco Cognitivo" e ícones PWA |
| HTML | `app/root.tsx` com os 5 `<link>` do README do pacote em todas as rotas |
| Logo | `public/images/logo-*.png` publicado para uso como `Organization.logo` (usado no PR-E) |
| Visível | aba do navegador, atalho do iPhone e app instalado com o logo novo |
| Testes | verificação dos `<link>` e do manifesto em `tests/routes.spec.ts` (ou spec nova) |

### PR-B · Tokens e ADR-13 (RQ-010…015)

| Saída | Detalhe |
|---|---|
| ADR | **ADR-13** em `apps/blog/CLAUDE.md`: Brand Local v7 é a identidade única, o amarelo/preto do v6 foi descartado, RC-BRAND-STYLING-001 só como camada de ilustração |
| Tokens | `app/styles/global.css`: `--illu-ink/blue/coral/blue-soft/canvas`; `--graph-*` (aliases); `--ease`, `--dur-fast/base/slow`; `@keyframes heroReveal`; `--radius-sheet`, `--radius-pill`, `--shadow-overlay`; bloco `prefers-reduced-motion` |
| Regras | coral e azul claro proibidos como texto; marca gráfica com significado ≥ 3:1 |
| Showroom | `/admin/design-system` mostra a camada de ilustração e o motion |
| Testes | `tests/tokens.spec.ts` trava valores e `--ease`; `tests/surfaces.spec.ts` trava hex só em `global.css`; teste novo de contraste dos `--graph-*` |
| Visível | quase nada para quem lê (é a base); o showroom muda |

---

## Onda 1 · Leitura

### PR-C · Shell v6/v7 (RQ-020…026)

| Saída | Detalhe |
|---|---|
| Componentes | `app/components/site/SiteHeader.tsx` refeito (nav desktop + trilha de categorias); `MobileDrawer` e `BottomBar` novos; `nav.ts` com Artigos · Mapa · Ferramentas · Sobre |
| Comportamento | ≥ 900px: links visíveis, sem menu. < 900px: drawer `min(84vw,360px)` + barra Início · Mapa · Ferramentas. Nav e barra escondem juntas ao descer e voltam ao subir |
| Motion | hero com `heroReveal`; carrossel com scroll-snap, sem autoplay; tudo parado com reduced-motion |
| Acessibilidade | drawer com foco preso, Esc, retorno de foco, fundo inert; alvos ≥ 44px na nav |
| Testes | Playwright: chrome some e volta no scroll; drawer por teclado; 44px; reduced-motion; `hig.spec.ts` em todas as rotas |
| Auditoria | `docs/audit/HIG-WEB-AUDIT.{json,md}` regenerado (reteste) |

### PR-D · Imagens (RQ-030…033)

| Saída | Detalhe |
|---|---|
| Arquivos | 6 ilustrações RC em `public/images/` como WebP, cada uma com variante 16:9 e retrato (≤ 250 KB cada) |
| Banco | `docs/banco-imagens/manifest.json` com 6 entradas novas (`tem_texto: false`, alt, uso, sha256 de origem); `REF_*` ausentes de `public/` |
| Componente | `ArticleHeroImage` (`<picture>` retrato/16:9, 100vh, `fetchpriority=high`, width/height) |
| Regra | **todo artigo tem imagem**; sem ilustração própria → ilustração do pilar |
| ADR | emenda ao ADR-12 ("artigo sem ilustração fica sem imagem" deixa de valer) |
| Testes | falha se algum artigo publicado não tiver imagem; reflow 320px; CLS ≤ 0,1 |

### PR-E · Conteúdo canônico (RQ-040…046)

| Saída | Detalhe |
|---|---|
| Home | `/` com o texto RC-LP-001 sem reescrita: hero, 3 pilares com "Saiba mais ›", "Por onde começar?" |
| Artigos | 4 MDX novos em `content/blog/` (RC-ART-P1-001, P2-001, P3-001, MASTER-001) com pilar, imagem e IDs; artigos existentes mantidos |
| Fontes | 12 fontes do RC-SRC-001 como referências e em `/evidencias` |
| SEO | JSON-LD `BlogPosting` em todo artigo + `Organization` com logo |
| Regra editorial | "processo neuroadaptativo" e a cadeia Risco → Compensação → Solução sempre rotulados como conceito do projeto |
| Hub | 4 rotas novas em `app/data/routes.ts` e no sitemap |
| Testes | comparação de parágrafos com o canônico; `content:check`; `routes:check` |

### PR-F · Jornada e menu (RQ-050…054)

| Saída | Detalhe |
|---|---|
| Menu | Artigos (`/blog`) · Mapa (`/mapas`) · Ferramentas (`/ferramentas`) · Sobre (`/about`) no desktop, no drawer e no rodapé |
| Páginas | toda página responde onde estou / o que significa / por que importa / próxima ação |
| CTAs | escada de compromisso; 1 CTA primário por região; bloco "Próximo passo" no fim de todo artigo |
| Blog | `/blog` como índice por problemas (chips Atenção, Memória, Sobrecarga, Interrupções, Decisão, Organização); RQ-054 fecha depois do PR-G |
| Testes | `hig.spec.ts` checa 1 CTA primário por região; chips como links compartilháveis |

### PR-J1 · Ferramentas cognitivas no lugar da Loja (RQ-103, RQ-100)

| Saída | Detalhe |
|---|---|
| Rotas | `/ferramentas`, `/ferramentas/:tipo`, `/ferramentas/:tipo/:slug` com o catálogo atual; `/loja/*` → 301 em `public/_redirects` |
| Código | `app/features/store/` reaproveitado (renomear para `features/tools` ou manter com novos rótulos: decidido no `/plan`); nenhum texto "Loja" ou de compra |
| ADR | ADR novo de Ferramentas cognitivas substitui o ADR-08 em `apps/blog/CLAUDE.md` |
| Hub | `app/data/routes.ts`, `pages.ts`, `access.ts`, prerender e sitemap atualizados |
| Testes | `tests/store.spec.ts` migrado para Ferramentas; teste dos 301 |

---

## Onda 2 · Exploração

### PR-G · Grafo canônico (RQ-060…065)

| Saída | Detalhe |
|---|---|
| Schema | `CORRELATION_RECORD.schema.json` da Teia copiado para o app (com referência ao intake) |
| Dados | `app/data/graph/rc-graph.json`: nós de fator, capacidade, compensação, controle e evidência extraídos de P1/P3 e RC-SRC-001, com `source_refs`, proveniência e status |
| Código | `app/lib/graph/` com carga, validação e projeção para os 9 tipos visuais |
| Regras | relação não explícita = `E_INFERRED` + `PROPOSED`; nenhum número sem `evidence_refs`; sem `NEURODIVERGENCE_PROFILE` no público |
| Testes | validação contra o schema + as 7 regras do `06-DATA-SPEC` §5 no `npm test` |
| Visível | nada ainda (dados) |

### PR-H · Mapa causal (RQ-070…080)

| Saída | Detalhe |
|---|---|
| Rotas | `/mapas/explorar` e `/mapas/explorar/:fatorId` (no hub); `/mapas` ganha a entrada "Explorar" |
| Dependências | `@xyflow/react` + `dagre` (ou `@dagrejs/dagre`), só nessa rota, em lazy load e client-only |
| Telas | grafo radial com ≤ 8 nós iniciais; toque seleciona, destaca, esmaece, recentra e expande; bottom sheet com 3 alturas e abas Causas · Impactos · Soluções · Evidências; aba Lista; chips por tipo; modo "Por quê?" e presets Problemas · Soluções · Evidências |
| Semântica | forma + rótulo por tipo de nó; traço + rótulo por tipo de aresta; inferido tracejado |
| Acessibilidade | lista como via principal para leitor de tela; teclado no desktop; 44px; 320px sem rolagem horizontal |
| Testes | ≤ 8 nós na carga; abrir fator e voltar só por toque; lista com todas as arestas; tudo sem hover; reflow 320px; bundle das outras rotas sem crescimento |
| Performance | INP ≤ 200ms e LCP ≤ 2,5s no mapa (mobile) |

---

## Onda 3 · Personalização, medição e Teia

### PR-I · Personalizar (RQ-090)

| Saída | Detalhe |
|---|---|
| Rota | `/mapas/personalizar` em 3 passos: focos de trabalho, interesses, "Mostrar evidências" |
| Dados | preferências só no navegador; nenhum dado sai do dispositivo |
| Efeito | o mapa reordena e destaca, sem mudar fatos |
| Testes | limpar armazenamento volta ao padrão; mapa muda a ordem do foco inicial |

### PR-K · Medição (RQ-110, RQ-111)

| Saída | Detalhe |
|---|---|
| Analytics | beacon do Cloudflare Web Analytics no `root.tsx` (páginas + Core Web Vitals de campo) |
| Eventos | binding `analytics_engine` no `wrangler.jsonc`; emissor de eventos por estágio (BLOG, ARTICLE, TOOL, RESULT, BUSINESS) com IDs do grafo; sem cookies nem dado pessoal |
| Painel | consultas SQL do Analytics Engine documentadas para o funil artigo → mapa → ferramenta |
| Testes | unitário do emissor; payload sem identificador pessoal |

### PR-L · Adapters da Teia (RQ-120…122)

| Saída | Detalhe |
|---|---|
| Registries | problems, operational_functions, cognitive_capacities, factors, compensations, controls, capabilities, app_features |
| Quick Framework | `correlation_refs` + `solution_candidates` sem mudar as 12 seções; `build-quick-frameworks.mjs` valida |
| Ferramentas | `correlation_refs` por item; filtro por problema + função + compensação + fit em `/ferramentas` |
| Código | se o `apps/workflow` passar a ler o grafo, ele vai para `packages/rc-graph` (ADR-M01/M04) |
| Testes | todo `correlation_ref` aponta para nó existente |

---

## Onda 4 · Bloqueada (não entra sem decisão)

| PR | Saída prevista | Falta |
|---|---|---|
| PR-J2 | Ferramenta piloto "Mapeie as interrupções do seu processo" (5–8 perguntas) + `/resultado/:id` com 3 ações, 1 artigo, 1 ferramenta e próximo passo | GAP-02 (perguntas e regra), GAP-07 (política de dados) |

---

## Estado final ao fim das ondas 0–3

| Área | Você terá |
|---|---|
| Identidade | Brand Local v7 em todas as rotas; camada de ilustração e motion com tokens e testes; logo e ícones novos |
| Navegação | nav desktop visível; drawer + barra inferior no mobile; chrome que some no scroll |
| Conteúdo | home RC-LP-001; 4 artigos canônicos novos + os existentes; todo artigo com imagem; 12 fontes; JSON-LD |
| Jornada | menu Artigos · Mapa · Ferramentas · Sobre; CTA "Próximo passo" em todo artigo; blog por problemas |
| Ferramentas | `/ferramentas` com o catálogo; `/loja` redirecionando |
| Mapa | `/mapas/explorar` interativo e acessível (grafo + lista + detalhe); `/mapas/personalizar` |
| Dados | grafo canônico no formato da Teia, validado no `npm test`, com proveniência em toda relação |
| Medição | Cloudflare Web Analytics + eventos no Analytics Engine com IDs do grafo |
| Governança | ADR-13, emenda ao ADR-12, ADR de Ferramentas (substitui o ADR-08), ADR-M04 (Teia); auditoria HIG atualizada |
| Rastreabilidade | todo PR cita RQ; todo RQ cita fonte no intake; `requisitos.json` com o status final de cada RQ |
