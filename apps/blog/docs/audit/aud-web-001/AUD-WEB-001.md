# AUD-WEB-001 — Home e componentes compartilhados × developer.apple.com/programs

| Campo | Valor |
|---|---|
| ID / versão | AUD-WEB-001 · 1.0.0 |
| Área | UX/UI e Frontend (UX-GOV-HIG-001 / ADR-M03) |
| Alvo | `/` (`app/routes/home.tsx`) e componentes compartilhados: `container`, `Section`, `CompareCards`, `HeroArt`, `SiteHeader`, `SiteFooter`, tokens em `app/styles/global.css` |
| Referência | https://developer.apple.com/programs/ (alvo de composição e comportamento; nenhum logotipo, texto ou imagem da Apple incorporado) |
| Fluxo | Inspecionar → Comparar → Implementar → Validar |
| Status | **VERIFIED** nos itens marcados abaixo; pendências reais no fim |

## Método

- **Capturas:** `node scripts/ux-compare.mjs <rótulo> [--ref] [--base URL]` captura a página inteira e cada seção a 390, 768 e 1440 px no Chromium do container. Também grava `metrics.json` com valores computados (`getComputedStyle` / `getBoundingClientRect`).
  - O "antes" é `main` @ `cd0e831`, servido de uma worktree.
  - O "depois" é esta branch.
  - A referência fica fora do git (`ref/`, `compare/`).
- **Comparação:** `node scripts/ux-sidebyside.mjs ref before after` gera o lado a lado e a sobreposição a 50% por largura, em `compare/` (local).
- **Aceite:** `node scripts/ux-verify.mjs` checa overflow, sobreposição de seções, recortes, links internos e foco visível em todas as paradas de Tab. O resultado fica em `after/verify.json`.
- **Classificação dos valores:**
  - **M** (medido): computado pelo navegador.
  - **E** (estimado): lido da captura.
  - **NV** (não verificável): não foi possível medir neste ambiente.
  - A menos que indicado, todo valor da matriz é **M**.

## Matriz

Ordem: estrutura e proporções → tipografia e espaçamento → detalhes e interações. Valores em px, por largura (390 · 768 · 1440).

| ID | Seção | Diferença (ref × antes) | Evidência | Impacto | Correção | Critério de aceite | Status |
|---|---|---|---|---|---|---|---|
| 01 | Todas (container) | Largura útil: ref 341 · 692 · 980; antes 342 · 720 · 1172 | `metrics.json` `sections[1].contentWidth` | Alto: linhas e grades mais largas que o alvo; medida do desktop 20% maior | `container` = `min(--content-max, 100% − 2·--gutter)`, com `--content-max: 61.25rem` (980) e `--gutter: max(1.5rem, 5vw)` | Depois: 342 · 691 · 980 (±1 px da ref) | VERIFIED |
| 02 | Abertura | Ref: texto centralizado, mídia abaixo; antes: duas colunas alinhadas à esquerda, arte à direita | `full-*.png`; `h1.textAlign` ref `center`, antes `start` | Alto: a composição de entrada é o traço mais reconhecível da referência | Hero da home vira coluna única centralizada: h1 → lead → descrição → ações → busca → arte | `h1.textAlign = center` nas 3 larguras; ordem dos elementos igual à da ref | VERIFIED |
| 03 | Abertura (mídia) | Ref: imagem com largura total do conteúdo, 980×613 (1,6:1), abaixo do texto; antes: arte 1fr ao lado | `section-hero` ref; `HeroArt` | Médio | `HeroArt wide`: faixa de largura total, 2:1 no desktop, 16:9 no tablet, 4:3 no celular. Figura centralizada, halftone nas laterais | Arte com 980 px de largura a 1440, abaixo das ações. Proporção 2:1 em vez de 1,6:1 porque a ilustração é vertical (593×720) e esticá-la a 1,6:1 deixaria só vazio lateral | VERIFIED (desvio justificado) |
| 04 | Ritmo e faixas | Ref: seções com padding 51 (<735) e 68 (≥735), sequência de fundos `wwwGwGwG`; antes: margem 64 · 78 · 112 e tudo branco (`wwwww`) | `sections[].paddingTop`, `sections[].bg` | Alto: sem alternância a página não tem as "paradas" da referência | Tokens `--section-pad-y` (3.1875rem → 4.25rem a partir de 48rem) e `--space-section = 2·pad`; utilitário `rc-band` (faixa Subtle de ponta a ponta) e `Section band` | Depois: padding 51 · 68 · 68; fundos `wwwGwGwG`, idênticos à ref | VERIFIED |
| 05 | Header | Ref: barra fixa de 48 · 48 · 52, `rgba(250,250,252,.8)`, `saturate(1.8) blur(20px)`; antes: 65 · 65 · 73, 85%, `blur(8px)` | `stickyAfterScroll`, probe da `#localnav` | Médio: a barra ocupa 40% a mais da altura útil | `--header-h` 3rem / 3.25rem (lg); `bg-background/80 backdrop-blur-[20px] backdrop-saturate-[1.8]`; sublinhado do item ativo realinhado | Depois: barra de 48 · 48 · 52 (+1 de borda), fixa após rolar 1500 px. A ref tem dois níveis (global, que rola, e local, fixa); aqui há um só nível, que já é o de navegação do site | VERIFIED |
| 06 | Painel arredondado | Ref: 2ª seção é um painel Subtle centralizado com padding 51 · 68 · 68 e raio 17. Antes não existia: a missão ficava numa célula lateral | `section-beta` ref | Médio | Missão vira painel centralizado (`rc-cell rc-surface`, `py-[--section-pad-y]`) com eyebrow, h2 e "Conheça o projeto ›" | Painel com as mesmas proporções e o mesmo padding; raio de 2 px mantido (ADR-12, card = célula) | VERIFIED (raio = marca) |
| 07 | Destaque (texto + mídia) | Ref: seção de duas colunas texto + mídia, título alinhado à esquerda. Antes: artigo + aside (missão + modelo) | `section-capabilities` ref | Baixo | Mantém duas colunas (artigo em destaque, modelo plain), já sem a missão | Duas colunas ≥1024, empilha abaixo; alinhamento `start` como na ref | VERIFIED |
| 08 | Seções de uma coluna | Ref: cabeçalho centralizado (h2, parágrafo e link "›" abaixo). Antes: cabeçalho à esquerda com link à direita; mapa e referências espremidos lado a lado | `h2.textAlign`; capturas | Médio | `Section align="center"` em Recentes, Temas, Referências, Mapa e Acesso. Mapa e referências viram seções de largura total (a 980 a tabela pedia rolagem e o diagrama era cortado) | `h2` centralizado; tabela e diagrama sem rolagem horizontal a 1440 | VERIFIED |
| 09 | Tipografia h2 | Ref 28 · 32 · 40; antes `--text-h2` 28 · 31,5 · 36 | `h2.fontSize` | Médio | `--text-h2: clamp(1.75rem, 1.4rem + 1.2vw, 2.5rem)` | Depois 28 · 31,6 · 39,7 | VERIFIED |
| 10 | Tipografia da abertura | Ref: h1 32 · 40 · 48 (600); lead 19/27 · 21/29. Antes: h1 52 · 69 · 112 (700, caixa alta) e tagline 24/30 · 34/42,5 | `h1`, `heroParagraphs[0]` | Alto: o h1 do desktop tinha 2,3× o tamanho da ref e empurrava o conteúdo | `--text-hero: clamp(3rem, 2rem + 4vw, 4.5rem)` e `--text-hero-lead` 19 → 21; tagline com `leading-snug` | Lead depois: 19/26,1 · 21/28,9 (ref 19/27 · 21/29). h1 depois: 48 · 62,7 · 72. Fica maior que a ref de propósito: o h1 é o wordmark da marca em display caixa alta (ADR-11) | VERIFIED (h1 = marca) |
| 11 | Comparação final | Ref termina em faixa `bg-alt` com h2, parágrafo, dois cards e ações; a home não tinha esse bloco | `section-compare` ref | Alto: faltava o fechamento com chamada para ação | `Section band align="center"` + `CompareCards` com `ACCESS_OPTIONS` (`app/data/access.ts`), a mesma copy de `/pricing/`, agora numa só fonte | Bloco presente a 390 · 768 · 1440; botões levam a `/blog/` e `/loja/` (200) | VERIFIED |
| 12 | Cards de comparação | Ref: card Canvas sobre a faixa, padding 25,5 · 34 · 34, h3 22,1 · 25,5 · 25,5, ação com a largura do card, no pé, raio 18. Antes: card Subtle, h3 22 · 22 · 22, ações em linha | probe `.tile`, `.button` | Médio | Na faixa, `--table-surface`/`--plain-surface` = Canvas; `--text-h3` 22 → 25,5 a partir de 48rem; ação `w-full` no pé e "Assinar o RSS ›" acima | Depois: card branco, padding 24 · 32 · 32, h3 22 · 25,5 · 25,5, botão com a largura do card; raio de 2 px (ADR-12) | VERIFIED |
| 13 | Rodapé | Ref: rodapé-diretório em faixa `#f5f5f7`, links de 12 px. Antes: rodapé branco, links de 15,2 px | probe `footer#footer` | Baixo | Diretório numa faixa Subtle (`rc-surface`) de ponta a ponta; links em `--text-small` (14); halftone continua acima, no Canvas | Faixa `rgb(245,245,244)` nas 3 larguras. Fica em 14 px, não em 12: a medida é o piso de leitura do DS | VERIFIED (14 px = DS) |
| 14 | Botões | Ref: 36 de altura, raio 8, 14/400. Antes e depois: 40, raio 8, 14/500 | `ctas[]` | Baixo | Sem mudança | Botões do DS (ADR-11) e alvo ≥ 24 px; 4 px a mais preservam o alvo de toque | JUSTIFICADO |
| 15 | Corpo e cor do lead | Ref: corpo 17/25 em SF Pro, lead em `#1d1d1f`. Nosso: corpo 18/28 em Inter, lead em cinza | `body`, `rc-lead` | Baixo | Sem mudança | Identidade do ADR-11 (mood boards: "lead em cinza", corpo 18/28) | JUSTIFICADO |
| 16 | Ícones de seção | Ref usa ícones de app de 128 px no topo de seções centralizadas | `section-beta img` 128×128 | Baixo | Não incorporado | Não há ícones da marca equivalentes e os da Apple não podem entrar; eyebrow mono cumpre o papel de rótulo | JUSTIFICADO |
| 17 | Teclado e foco | — | `after/verify.json` | Alto (P0 se falhar) | — | 45 paradas de Tab em `main` por largura, todas com anel visível; o skip link continua coberto pelo `surfaces.spec` | VERIFIED |
| 18 | Links e ações | — | `after/verify.json` `links` | Alto | — | 34 links internos da home respondem 200 | VERIFIED |
| 19 | Overflow, cortes e sobreposição | — | `after/verify.json`; `surfaces.spec` (390/768/1363, claro e escuro) | Alto | — | `overflowX = 0`, 0 sobreposições e 0 elementos cortados (halftone excluído, pois é recortado pelo próprio SVG) nas 3 larguras | VERIFIED |
| 20 | Propagação | O `container`, o header, o rodapé e `--text-h2`/`--text-h3` valem para as 47 rotas | `HIG-WEB-AUDIT.md`; suíte Playwright | Médio | Baselines visuais regeneradas só nos testes afetados (22 testes, 28 arquivos) | Gate HIG: 846/846 PASS, P0/P1 = 0; `npm test`: 229 passed | VERIFIED |
| 21 | Estados de hover | Ref: links "›" sem sublinhado em repouso | probe `text-decoration: none` | Baixo | Sem mudança (`rc-link` sublinha no hover) | Hover da ref não medido: o container não tem ponteiro real e a ref não expõe o estado de forma estável | NV |
| 22 | Safari / WebKit | — | — | Médio | — | Medições e capturas só em Chromium; o container não tem WebKit | NV — pendente |

## Tokens alterados (`app/styles/global.css`)

| Token | Antes | Depois | Justificativa (medida da referência) |
|---|---|---|---|
| `container` | `padding-inline: 1.5rem`; `max-width: 1220px` (≥1400) | `padding-inline: var(--gutter)`; `max-width: calc(var(--content-max) + 2·var(--gutter))` | Largura útil 341 · 692 · 980 (01) |
| `--content-max` | — | `61.25rem` (980) | `section-content` da ref = 980 |
| `--gutter` | — | `max(1.5rem, 5vw)` | Margens 24 · 38 da ref |
| `--section-pad-y` | — | `3.1875rem` (51); `4.25rem` (68) a partir de 48rem | `section` padding 51 / 68 |
| `--space-section` | `clamp(4rem, 2.5rem + 5vw, 7rem)` | `calc(2 * var(--section-pad-y))` | Duas seções vizinhas = 2 × padding (102 · 136) |
| `--header-h` | — (`h-16`, `lg:h-[4.5rem]`) | `3rem`; `3.25rem` a partir de 64rem | `#localnav` 48 / 52 |
| `--text-h2` | `clamp(1.75rem, 1.2rem + 1.6vw, 2.25rem)` | `clamp(1.75rem, 1.4rem + 1.2vw, 2.5rem)` | h2 28 · 32 · 40 |
| `--text-h3` | `1.375rem` | `1.375rem`; `1.59375rem` a partir de 48rem | h3 22,1 · 25,5 |
| `--text-hero` | — (`clamp(3.25rem, 9vw, 7rem)` inline) | `clamp(3rem, 2rem + 4vw, 4.5rem)` | Proporção h1 : conteúdo; wordmark acima da ref de propósito (10) |
| `--text-hero-lead` | — (`clamp(1.5rem, 2.6vw, 2.125rem)` inline) | `1.1875rem`; `1.3125rem` a partir de 48rem | Lead 19 / 21 |
| `rc-band` (novo utilitário) | — | Faixa Subtle com `--section-pad-y` e células, tabelas e plain em Canvas | Alternância `wwwGwGwG` e cards brancos sobre `#f5f5f7` |

## Capturas

| Largura | Antes (`main`) | Depois |
|---|---|---|
| 390 | [before/full-390.png](before/full-390.png) | [after/full-390.png](after/full-390.png) |
| 768 | [before/full-768.png](before/full-768.png) | [after/full-768.png](after/full-768.png) |
| 1440 | [before/full-1440.png](before/full-1440.png) | [after/full-1440.png](after/full-1440.png) |

O lado a lado e a sobreposição com a referência (`compare/side-*.png`, `compare/overlay-*.png`) são regenerados localmente e não são versionados, porque contêm imagens da Apple.

## Evidências de validação

| Verificação | Comando | Resultado |
|---|---|---|
| Tipos | `npm run typecheck` | sem erros |
| Lint | `npx eslint .` | sem erros |
| Build | `npm run build` | ok (prerender completo) |
| Suíte | `npx playwright test` | 229 passed |
| Gate HIG | `HIG_AUDIT=1 npx playwright test tests/hig.spec.ts && node scripts/hig-audit.mjs` | PASS · 47 rotas · 846/846 · P0/P1 = 0 |
| Aceite da home | `node scripts/ux-verify.mjs` | PASS · 34 links · 3 larguras |

## Pendências e limitações reais

- **Safari/WebKit (22):** não há WebKit no container. A checagem visual em Safari real (iOS e macOS) continua pendente, como o AUD-HIG-05 já registra.
- **Heroes das páginas internas (`PageHero`):** continuam em duas colunas. A referência é uma landing page só, e centralizar o hero das 12 rotas internas não tem medida que o justifique. Fica como decisão de produto.
- **Coluna do artigo:** com o conteúdo em 980 px e o aside de 22rem, o texto do artigo fica com cerca de 564 px (≈ 58ch). Está dentro da medida (gate AUD-HIG-06 em PASS), mas é mais estreito que antes.
- **Hover da referência (21):** não foi medido.
- **Proporções que diferem por decisão de marca (03, 06, 10, 12–16):** cada uma está registrada na linha correspondente.
