# Plano de reset: só a Landing e o Mapa, no Nocturne com a paleta Coliseu (PR seguinte)

Decisão do usuário (2026-10-07):
- "a única rota que deve existir é a de home landing page. O resto das páginas serão criadas do zero. Todo conteúdo
  existente pode acabar, ficam só landing page e mapa e nada mais";
- o Nocturne é a fonte de verdade do DS, com a paleta Coliseu.

Este documento é o inventário e a sequência. **Nada aqui foi executado.** O reset é o PR seguinte, depois da aprovação
dos mockups.

## Decisões em aberto (pedir ao usuário antes do PR)

| # | Pergunta | Proposta |
|---|---|---|
| R-1 | O "Mapa" inclui `/mapas/explorar/`, `/mapas/explorar/:fatorId/` e `/mapas/personalizar/`, ou só `/mapas/`? | **Só `/mapas/`.** O link "Explorar as relações ›" fica oculto até a sub-rota voltar redesenhada |
| R-2 | O `/admin/*` sai? Ele hospeda o hub de rotas do ADR-06 e o showroom do DS | **Sai.** O registro de rotas continua em `app/data/routes.ts` + `npm run routes:check`; o ADR-06 é emendado (sem página do hub) |
| R-3 | O 404 fica? | **Fica** (`$.tsx`), no Nocturne: não é página de conteúdo, é a resposta do Worker |
| R-4 | URLs antigas: 404 (como no ADR-13) ou redirect para `/`? | **Redirect 302 para `/`** só das 4 entradas de maior tráfego (`/artigos/`, `/ferramentas/`, `/prisma/`, `/sobre/`); o resto cai no 404 |
| R-5 | O endpoint de analytics (`POST /api/eventos`, ADR-20) e o grafo (`app/data/graph/`) ficam? | **Ficam.** O Mapa emite `TOOL · select` com os IDs do grafo, e o grafo é a fonte dos IDs das funções |

## Inventário

### Sai

| Tipo | Itens |
|---|---|
| Rotas | `/artigos/`, `/artigos/:slug/`, `/fontes/`, `/sobre/`, `/comece/`, `/prisma/`, `/ferramentas/`, `/ferramentas/:type/`, `/ferramentas/:type/:slug/`, `/mapas/explorar/`, `/mapas/explorar/:fatorId/` e `/mapas/personalizar/` (se R-1), `/admin/*` (se R-2) |
| Conteúdo | `content/artigos/*` (10 MDX), `content/solucoes/*` (6), `content/pages/*` (2) |
| Dados | `app/data/{article-media,article-meta,landing,pages*,sources,sources-scientific,taxonomy}.ts` (\*`pages.ts` passa a listar só `/` e `/mapas/`) |
| Features | `app/features/{prisma,solutions,store}`, `app/features/mapa` (se R-1) |
| Componentes | `app/components/{article,landing,admin,plain}`, `app/components/ds/*` (RC-DS-CF) |
| Estilos | `app/styles/ds*.css` e o bloco RC-DS-CF do `global.css` |
| Assets | `public/prisma/*` (PWA), `public/images/*` das ilustrações, `public/ds/surfaces.css`, `public/models/home-brain/brain-points.bin` |
| Redirects | As 28 linhas 302 do `public/_redirects` (artigos e itens mock), que perdem o alvo |
| Testes | `editorial`, `plain`, `prisma`, `solutions`, `store`, `teia` (adapters de Ferramentas/QF), `personalizar`, `mapa` (se R-1), `design-system`, `analytics` (só os casos de rotas removidas) |

### Fica

| Tipo | Itens |
|---|---|
| Rotas | `/` (Landing), `/mapas/` (Mapa), `*` (404) |
| Worker | `workers/app.ts`, `POST /api/eventos`, `wrangler.jsonc` |
| Grafo | `app/data/graph/rc-graph.json` e `app/lib/graph/*` (só o que o Mapa e os IDs usam; o resto vira código morto e sai no lint) |
| Cérebro | `app/features/home-brain/*` refeito (HANDOFF §Código) e `public/models/home-brain/*` novos |
| Shell | `DefaultLayout`, `SiteHeader`, `SiteFooter` reescritos no Nocturne, com nav Início · Mapa |
| Testes | `home-brain` (ampliado), `routes`, `hig` (2 rotas + 404), `shell`, `analytics` (eventos do Mapa), `graph`, novo `nocturne.spec` (no lugar do `ds.spec`) |

## Rascunho do ADR-27 (para o `apps/blog/CLAUDE.md`)

> ### ADR-27: Nocturne com paleta Coliseu; site reduzido à Landing e ao Mapa (BRAIN-NOCT-001)
>
> - **Status:** Proposta.
>   - Substitui o ADR-26 (RC-DS-CF) e emenda o ADR-06 (sem página de hub), o ADR-13 (novo reset) e o ADR-23/25/26
>     (cérebro).
>   - Handoff em `docs/handoff/BRAIN-NOCT-001/`.
> - **Contexto:** o usuário escolheu (2026-10-07):
>   - o design system Nocturne (Claude Design `02c4ffae…`) como fonte de verdade;
>   - a paleta do Coliseu ("Coliseu manda");
>   - o cérebro oco do projeto Claude Design `343a6542…`;
>   - um site só com a Landing e o Mapa, com todo o resto refeito do zero.
> - **Decisão:**
>   - **Estrutura Nocturne:** Inter 500, raio 8, densidade 0,7×, botão com contorno, regras que esmaecem 48 px nas
>     pontas, layout à esquerda, ícones Phosphor.
>   - **Paleta Coliseu nos papéis do Nocturne:**
>     - `--color-bg` #FFFFFF, `--color-text` #212121, `--color-accent` #6E72F0 (só traço e marca) e
>       `--color-accent-text` #4F53D9 (texto em acento);
>     - ramps 100–900;
>     - camada `--brain-*` da cena.
>   - **Desvios registrados do Nocturne:**
>     - claro em vez de escuro;
>     - corpo de 16 px (o Nocturne usa 15);
>     - controles com 44 px de altura (o `.btn` do Nocturne tem ≈ 28 px);
>     - callout com raio de 2 px (assinatura do globo).
>   - **Cérebro:** representação oca (`brain-hollow.js`), com contornos e pontos pré-calculados no build a partir do
>     OpenNeuro ds006128 (CC0), hashes conferidos, e contrato de motion e callouts do HANDOFF.
>   - **Rotas:** `/`, `/mapas/` e o 404. O resto sai (inventário no RESET-PLAN). MDX, canônicos e intake ficam no
>     histórico do git (último commit com o site completo: `383d4e0`, merge do PR #39).
> - **Consequências:**
>   - `nocturne.spec` trava os tokens, impede `--color-accent` como cor de texto e exige alvos de 44 px.
>   - `home-brain.spec` cobre a projeção dos pins, os callouts, o limiar de 8 px e a pausa no foco.
>   - O gate HIG roda nas 2 rotas + 404.
>   - Página nova = ADR próprio + registro em `app/data/routes.ts`.

## Sequência do PR seguinte (WIP = 1)

1. Responder R-1 a R-5 com o usuário. Fazer o pré-voo AUD-ORDEM-001 e criar a branch a partir de `main`.
2. Tokens Nocturne + Coliseu no `global.css` (fonte: `prototype/tokens.css`) e componentes Nocturne (`.btn`, `.card`,
   `.nav`, `.tag`, `.hr`, campos) com as classes do readme do Nocturne.
3. Assets do cérebro gerados pelo `build-brain-assets.js`, mais o pré-cálculo de contornos e âncoras (HANDOFF §Código).
4. `brain-renderer.client.ts` + `BrainHero.tsx` refeitos, com testes do cérebro.
5. Landing e Mapa nos layouts dos mockups.
6. Remoções do inventário, `routes.ts`, `pages.ts`, prerender, sitemap, `_redirects` (R-4) e `routes:check`.
7. `npm run typecheck`, `npm run build`, `npx playwright test`, `npm run test:brain`, `routes:check` e auditoria HIG.
8. ADR-27 no `CLAUDE.md`, PR pronto e merge commit com o CI verde.
