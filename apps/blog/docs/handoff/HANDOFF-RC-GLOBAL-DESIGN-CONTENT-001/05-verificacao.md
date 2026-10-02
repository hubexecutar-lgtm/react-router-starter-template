# 05 · Verificação e estado

## Estado por etapa

| Etapa | Estado | Evidência |
|---|---|---|
| Inspecionar entradas | VERIFIED | `00-entradas.md` (hashes, conteúdo, lacunas) |
| Inventário de rotas | VERIFIED | `01-inventario-rotas.md`; `routes.spec.ts` (registry ↔ código) |
| Extração dos mood boards | PREPARED | `02-extracao-imagens.md` (leitura visual; sem OCR automatizado) |
| Reconciliação | PREPARED | `03-reconciliacao.md` (C-01…C-10) |
| Tokens / componentes | IMPLEMENTED + VERIFIED | ADR-09 já na `main`; nesta entrega `rc-*`, `SURFACE`, `public/ds/surfaces.css` |
| Conteúdo editorial (8 artigos + páginas) | IMPLEMENTED; estrutura VERIFIED | `validate_output.py` = VERIFIED ×8; revisão humana pendente |
| Integração/persistência | IMPLEMENTED + VERIFIED | `seed.json` único → site + Hub (`content.spec.ts`) |
| Visual em todas as rotas | VERIFIED (automatizado) | `surfaces.spec.ts` › editorial routes |
| Release (produção) | **NOT RELEASED** | deploy não autorizado nesta sessão; o worker `risco-cognitivo-blog` não existe na conta Hub.executar (URL canônica responde 404) |

AUTOMATION_LEVEL alcançado: **A3** — implementação e verificação automáticas; release e revisão editorial
dependem de decisão humana.

## Comandos executados (todos verdes no estado final)

| Comando | Resultado |
|---|---|
| `npm run build` (prebuild: quick frameworks, seed do Hub, tokens das ferramentas) | OK, sem erros |
| `npx eslint .` | 0 problemas |
| `npx playwright test` | suíte completa verde (ver PR) |
| `npm run routes:check` | 9/9 |
| `node scripts/build-quick-frameworks.mjs --check` · `node scripts/export-surface-tokens.mjs --check` | em dia |
| `python3 tools/executar-block-quick-frameworks/scripts/check_skill.py` | STATUS: VERIFIED |

## Cobertura dos critérios do handoff (§9)

1. Rotas na matriz: sim (`01-inventario-rotas.md`).
2. Landing com o novo contrato: sim (`/`, teste de superfície e regressão visual `surface-home-*`).
3. Imagens ↔ banco ↔ conteúdo: mapa em `03-reconciliacao.md`; divergências materiais decididas (C-01, C-04…C-06).
4. Artigos previstos: 8 territórios produzidos e integrados; títulos de mockup sem base → backlog IDE-RC-0003…0032.
5. Sem texto de template: `content.spec.ts` varre todo `dist/` (Mainline, lorem, John/Jane Doe, shadcnblocks).
6. Cards, tabelas, Plain e Hub na mesma fonte de tokens: `surfaces.spec.ts` (rotas editoriais e ferramentas).
7. Links, CTAs, filtros, busca, navegação: `content.spec.ts` (links internos do build inteiro, filtro, busca, menu móvel, artigo).
8. 390 / 768 / 1363 px, claro e escuro: sem rolagem horizontal e superfícies conferidas em 17 rotas.
9. Foco, contraste, teclado, texto longo, scroll interno: axe sem violações sérias/críticas nas 17 rotas;
   skip link e foco visível; contraste AA dos tokens (`surfaces.spec.ts` › tokens); tabelas e diagramas rolam
   dentro do contêiner.
10. Build, lint e testes: verdes.

## Regressão visual

Baselines atualizadas por mudança intencional (novo cabeçalho/rodapé e layout editorial): `article-decision-*`
(4), `surface-{admin,blog,article,loja}-{desktop,mobile}` (8). Novas: `surface-{home,temas,evidencias}-*` (6).
`playwright.config.ts` aplica `tests/screenshot.css` (cabeçalho fixo vira estático) só durante capturas.

## Screenshots

Em `screenshots/` (WebP, 60% da largura): 14 rotas a 1363 e 390 px no claro e 3 no escuro. Comparação
lado a lado com `referencias/moodboard-NN.webp`, conforme o mapa da `02-extracao-imagens.md`.

Limitações do ambiente: as capturas usam fontes de fallback (Google Fonts bloqueado no sandbox). O Hub
Editorial depende de React e Babel via cdnjs, que o proxy do sandbox bloqueia: o teste injeta uma tabela
estática para verificar o CSS, mas não há screenshot do Hub renderizado.

## Pendências e próximo nó executável

WIP = 1. Próximo nó: **revisão humana dos 8 artigos** (fontes, tom, avisos) e decisão de release.
Demais pendências estão em `00-entradas.md` (L-01…L-07) e são registradas como issues do repositório
(regra “Issues no GitHub” do `CLAUDE.md`).
