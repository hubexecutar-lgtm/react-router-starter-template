# CLAUDE.md — apps/blog (Risco Cognitivo)

Guidance for Claude Code (and other AI agents) working on the blog. The blog is the first
product of the EXECUTAR monorepo: read the root `CLAUDE.md` first. Paths below are relative
to `apps/blog/`.

## ADRs (Architecture / Process Decision Records)

### ADR-01: Trabalhar diretamente em `main` e abrir PR automaticamente (sem rascunho)

- **Status:** Aceita — promovida a regra do monorepo como **ADR-M02** (`CLAUDE.md` da raiz),
  que acrescenta auto-merge para branches paralelas.
- **Contexto:** Este é um projeto simples (site estático), sem necessidade de um
  fluxo de branches elaborado.
- **Decisão:**
  - Todo o desenvolvimento deve ser feito diretamente a partir da branch `main`
    (criar a branch de trabalho a partir de `main`, nunca de outra branch de feature).
  - Ao concluir uma mudança, abrir o Pull Request automaticamente, **sem marcar
    como rascunho (draft)** — o PR deve ser criado já pronto para revisão/merge.
- **Consequências:**
  - Não usar branches de longa duração nem stacks de PRs dependentes.
  - PRs em draft não devem ser usados neste repositório, a menos que
    explicitamente solicitado pelo usuário para um caso pontual.

### ADR-02: Callouts editoriais com um único primitive (DS-CALLOUT-001)

- **Status:** Aceita — implementada
- **Contexto:** Destaques em artigos e páginas eram feitos com estilos ad hoc. A
  especificação completa está em `docs/design-system/DS-CALLOUT-001.md`.
- **Decisão:**
  - Todo destaque editorial ou operacional usa `<Callout>`
    (`app/components/ui/callout.tsx`). Não criar componentes por tipo.
  - As 26 variantes, com símbolo Lucide, rótulo e família, vivem só no registry
    `app/components/ui/callout-registry.ts`.
  - Tamanhos `sm | md | lg` (padrão `md`) e tons `outline | tinted`. Cor, raio e ícone
    não são props públicas: vêm dos tokens `--callout-*` em `app/styles/global.css`.
  - Em MDX, descrição rica entra como filho (`<Callout ...>…</Callout>`); JSX em prop
    não funciona em MDX com React.
  - `dismissible` depende de hidratação; em React Router toda página hidrata (não há
    diretiva `client:*` como no Astro).
  - A geometria deriva dos tokens do Button, `--radius` e `--spacing` (md = altura do CTA,
    40px); não há escala própria. Glifo sem contêiner; assunto na fonte do texto (700) e
    mensagem em `--font-mono` (400). As medidas do handoff são de um raster 3×.
  - Layout pelo conteúdo: só headline → barra compacta; com descrição/ações → anatomia
    completa (referência Material X): header tonal com rótulo e ✕, corpo com emblema
    (outline) e título mono, rodapé com ações à direita (primária na cor da família).
- **Consequências:**
  - Páginas e artigos não definem hex, raio ou ícone de callout localmente.
  - O showroom oficial é `/admin/design-system#callouts`.
  - `Alert` (shadcn) fica restrito a mensagens de sistema e formulários.

### ADR-03: Paleta dos callouts em 3 famílias e 4 camadas (DS-CALLOUT-001-PAL-ANNEX-01)

- **Status:** Aceita — implementada; tokens escuros provisórios
- **Contexto:** A especificação está em
  `docs/design-system/DS-CALLOUT-001-PAL-ANNEX-01.md`.
- **Decisão:**
  - Só 3 famílias cromáticas: `brand` (#304E83), `attention` (#8A5A00) e
    `critical` (#A33A32). Os neutros do site são infraestrutura, não uma 4ª família.
  - Quatro camadas: primitivo (`--brand-50…950`, único lugar com cor concreta) →
    semântico (`--color-{família}-{subtle,soft,default,strong,on-strong}`) →
    componente (`--callout-*`) → variante (`data-family` / `data-tone`).
    Nunca variante → hex.
  - O primário do site (botões e links) não pertence às 3 famílias; o valor atual vem do ADR-11 (`#2563EB`).
  - Modo escuro: papéis semânticos invertidos no `.dark`, marcados como PROVISIONAL
    até existir especificação de tema escuro.
- **Consequências:**
  - Não criar cores novas (lavender, purple etc.). Tons claros vêm de `--color-brand-subtle`.
  - Recalibrar a aparência mexe só na camada primitiva, sem tocar em artigos.

### ADR-04: Dados e gráficos nos tokens do sistema (DS-DATA-001)

- **Status:** Aceita — implementada
- **Contexto:** Os `--chart-1…5` eram cores padrão do template (laranja, verde-água), fora
  das 3 famílias do ADR-03, e não havia showroom de dados. Especificação em
  `docs/design-system/DS-DATA-001.md`.
- **Decisão:**
  - A paleta de gráficos é uma camada semântica sobre as famílias e o neutro:
    `--chart-1` brand.default, `--chart-2` attention.default, `--chart-3` critical.default,
    `--chart-4` `--brand-500` (série única clara), `--chart-5` `--muted-foreground`
    (meta/referência). Nenhuma matiz nova; cada cor tem contraste ≥ 3:1 sobre `--card`
    no claro e no escuro.
  - Séries nunca se distinguem só por cor: legenda, tooltip e, em linhas de referência,
    traço tracejado. Todo gráfico tem `role="group"` + `aria-label` e, quando possível,
    alternativa em tabela.
  - `--muted-foreground-subtle` é o cinza extra do texto (legendas, notas, carimbos de
    data). Desde o ADR-11 é igual a `--muted-foreground` e segue a mesma troca automática
    para o tom AA dentro de superfícies cinza.
  - Novo papel semântico por família `--color-{família}-on-default` (texto sobre a cor
    `default`, usado na ação primária dos callouts).
  - O showroom oficial é `/admin/design-system#dados` (indicadores, 6 tipos de gráfico,
    tabela de dados, estados de carregando/vazio/erro).
- **Consequências:**
  - Gráficos novos usam `ChartContainer` com `var(--chart-N)`; não definir cor localmente.
  - Alterar a paleta de gráficos mexe só nos tokens, não nas páginas.

### ADR-05: Diagramas e textos operacionais em plain text (ADR-BLOG-ASCII-001 + anexo A)

- **Status:** Aceita — implementada; tokens escuros provisórios
- **Contexto:** Fluxogramas, organogramas, árvores, mapas mentais, planos e textos
  operacionais precisam ser copiáveis, pesquisáveis e acessíveis. Especificação em
  `docs/design-system/ADR-BLOG-ASCII-001.md`, `ANX-ADR-BLOG-ASCII-001-A.md` e
  `REPORT-GENERATOR-CONTRACT-001.md`.
- **Decisão:**
  - Diagramas são texto UTF-8 com caracteres de desenho de caixa, renderizados por
    `<AsciiDiagram>`; textos operacionais por `<PlainTextPanel>`. Nunca Mermaid, SVG,
    Canvas ou imagem para esse conteúdo.
  - Os dois usam a mesma base `PlainSurface` (`app/components/plain/`) e só os tokens
    `--plain-*` de `app/styles/global.css`. `--plain-accent` é `var(--primary)`: nada de
    matiz nova (ADR-03).
  - `AsciiDiagram` preserva geometria (`white-space: pre`, rolagem horizontal) e é o único lugar
    com mono de bloco. `PlainTextPanel` mostra uma **visão de leitura estruturada** (emenda do
    ADR-12): o texto continua sendo a fonte e o que se copia (`[data-plain-source]`), mas o leitor
    vê lista de definições, listas, tabela e parágrafos na fonte de texto. Conteúdo nunca é
    reescrito, só normalizado (BOM, fim de linha, linhas em branco nas pontas).
  - Em MDX, o conteúdo vai como `` {`…`} `` filho único ou em blocos ` ```ascii ` /
    ` ```plain `; o plugin `app/lib/plain/remarkPlain.ts` passa o texto verbatim como
    `source`. Em TSX, use `source` (ou `renderTree(json)` para árvores).
  - Copiar funciona sem hidratação (script delegado `app/lib/plain/copy.ts` no
    `DefaultLayout`); sem JavaScript o bloco segue legível.
  - Relatórios seguem o `REPORT-GENERATOR-CONTRACT-001`: Markdown para a narrativa,
    blocos plain text só onde o conteúdo é operacional ou estrutural, sempre com `kind`.
- **Consequências:**
  - O showroom oficial é `/admin/design-system#plain`; exemplo em `/admin/relatorio-exemplo/`.
  - Relatórios (`ReportLayout`) não usam capitular.
  - Toda tabela (`Table` de `app/components/ui/table.tsx`, classe `.ds-table` ou tabela
    Markdown em `.prose`) segue o padrão STORE-WIREFRAMES: células cinza separadas
    (`--table-*`), cabeçalho em caixa alta, valores técnicos em mono, sem bordas locais.

### ADR-06: Hub de rotas e links — toda nova rota ou link entra no hub

- **Status:** Aceita — implementada
- **Contexto:** Rotas e links (previews, deploys, compartilhamentos) se espalhavam sem
  catálogo, e um catálogo de QR gerado à parte apontava para o preview de outra branch.
  Fluxo detalhado em `docs/design-system/ROUTES-HUB-WORKFLOW-001.md`.
- **Decisão:**
  - O hub é `/admin/rotas/` (linkado no painel `/admin`), gerado a partir de
    `app/data/routes.ts`, a fonte única. Os artigos de `content/blog` entram sozinhos.
  - Todo PR que cria rota em `app/routes.ts`, ferramenta em `public/*/index.html` ou um
    link gerado/compartilhado (preview, deploy, QR) registra a entrada no mesmo PR.
  - `npm run routes:check` (`tests/routes.spec.ts`) falha se uma rota existir sem registro,
    se um registro não tiver rota ou se uma entrada estiver malformada; o checklist do PR
    (`.github/pull_request_template.md`) repete a regra.
  - Os QRs apontam para `PUBLIC_ROUTES_BASE_URL` (padrão: o host de produção), nunca para
    preview de branch, e o teste decodifica cada QR e compara com a URL exibida.
  - Rotas em `/admin/*` seguem sem guarda de autenticação e ficam marcadas "Interno exposto".
- **Consequências:**
  - Rota nova sem registro não passa nos testes; rota removida exige remover a entrada.
  - `tools/qr-python/` é arquivo de referência (gerador DESK-OS Sprint, incompleto) e fica
    fora do build; não gera este catálogo.

### ADR-07: React Router 7 em Cloudflare Workers, dentro do monorepo (EXECUTAR-MONOREPO-BLOG-001)

- **Status:** Aceita — implementada
- **Contexto:** O blog nasceu em Astro 5 (repositório `executar-23/Risco-cognitivo-blog`,
  commit `11f78e4`) e foi o primeiro produto migrado para o monorepo EXECUTAR. Evidências em
  `docs/migrations/BLOG-001.md` (raiz do repositório).
- **Decisão:**
  - App em `apps/blog/`, React Router 7 com SSR no Worker e `prerender` de todas as páginas,
    artigos, RSS e sitemaps (`react-router.config.ts`). O HTML pré-gerado é servido como asset;
    o Worker responde o resto, inclusive o 404.
  - Rotas declaradas em `app/routes.ts`; páginas estáticas listadas em `app/data/pages.ts`
    (sitemap e prerender). Artigos em `content/blog/*.md(x)`, compilados por `@mdx-js/rollup`
    com o mesmo schema zod da antiga coleção (`app/lib/content.ts`).
  - Metadados de `<head>` por `seo()` (`app/lib/seo.ts`); `SITE_URL` em `app/consts.ts`.
  - `npm run parity` compara cada rota com o deploy de referência do site original.
- **Consequências:**
  - Página nova: rota em `app/routes.ts` + arquivo em `app/routes/` + entrada em
    `app/data/pages.ts` (se estática) + registro no hub (ADR-06).
  - Componentes compartilháveis entre produtos migram para `packages/*` quando o segundo
    produto precisar deles (ver `CLAUDE.md` da raiz).


### ADR-08: Loja (`/loja`) com dados de exemplo e marcadores de área (ADR-STORE-ROUTES-UI-001)

- **Status:** Aceita — implementada
- **Contexto:** A Loja foi construída no repositório original (`executar-23/Risco-cognitivo-blog`,
  branch `claude/trusting-gates-go053v`, commit `c3a4219`) e trazida para cá depois da migração.
  Decisão completa em `docs/adr/ADR-STORE-ROUTES-UI-001.md`; mapas e wireframes em
  `docs/handoff/store-routes/`.
- **Decisão:**
  - Rotas `/loja/` (hub), `/loja/<tipo>/` (8 catálogos) e `/loja/<tipo>/<slug>/` (detalhe), todas
    pré-renderizadas a partir de `app/features/store/data/paths.ts` (prerender e sitemap).
  - Código em `app/features/store/`; dados só por `data/repository.ts` (hoje mock, sem preços,
    métricas nem integrações). Trocar o mock não mexe em rotas nem componentes.
  - Camada `--area-*` em `app/styles/global.css`: verde, verde-azulado e violeta existem só como
    marcadores de área; callouts e gráficos seguem nas 3 famílias do ADR-03.
  - Link "Loja" na navbar; a Loja entra no hub de rotas (ADR-06) como `/loja/`.
- **Consequências:**
  - `tests/store.spec.ts` cobre hub, filtros, estados, detalhe, navegação, áreas e acessibilidade.
  - Catálogo real, preços e checkout são uma etapa futura (substituir o repositório de dados).

### ADR-09: Superfícies, bordas e elevação (DS-SURFACE-UNIFICATION-001)

- **Status:** Aceita — implementada; tema escuro provisório
- **Contexto:** O visual aprovado das tabelas (cinza muito claro, separação limpa, borda discreta)
  vivia só em `--plain-*`, enquanto cards usavam `--card`/`--border` e cinco níveis de sombra
  sem regra. Decidido e implementado no repositório original (branch `claude/trusting-gates-go053v`,
  lá ADR-08) e portado com o redesign editorial (RC-DESIGN-MOCKUPS-001, PR A). Handoff em
  `docs/handoff/surface-unification/`; contrato em `docs/design-system/DS-SURFACE-UNIFICATION-001.md`.
- **Decisão:**
  - Camada "Surfaces & Elevation" em `app/styles/global.css`: `--surface-{page,subtle,default,hover,selected}`,
    `--border-{subtle,default,strong}`, `--elevation-{flat,raised,overlay}`. É o único lugar com
    hex neutro; `--plain-*`, `--table-*`, `--card`, `--border`, `--muted` são aliases.
  - Card, painel, célula de tabela, Plain/Ascii: `surface-default` + **sem sombra**; desde o ADR-12
    o card é a própria célula da tabela (sem contorno, raio 2px).
    Hover por superfície (`surface-hover`), não por sombra.
  - Sombra só indica elevação: `raised` em controles (`shadow-xs/sm`), `overlay` em popover, dialog,
    drawer, sheet, hover-card e menus (`shadow-md…`). Tabela dentro de card usa células na superfície da página.
  - Borda neutra é estrutural (contraste ~1,1:1): nunca texto, ícone ou estado só por borda; contorno de
    campos segue em `--input`.
  - Callouts semânticos mantêm suas famílias cromáticas; só o card perde a sombra.
  - Valores (texto, marca, cinzas, `--surface-tabular`, `--surface-model`): ADR-11.
- **Consequências:**
  - Código novo não usa hex neutro nem `shadow-md/lg/xl` fora de overlay (`tests/surfaces.spec.ts`).
  - Mudar a aparência neutra do blog mexe só nesse bloco de tokens.

### ADR-10: Conteúdo editorial a partir do banco, visual editorial em todas as rotas (HANDOFF-RC-GLOBAL-DESIGN-CONTENT-001)

- **Status:** Aceita — implementada; revisão humana dos artigos pendente
- **Contexto:** O blog ainda era o template Mainline (landing, nav, páginas e posts demo). O redesign
  editorial e as rotas dos mood boards foram feitos no repositório original (branch
  `claude/trusting-gates-go053v` @ `8b567b1`, lá ADR-09) e portados para React Router no PR A do
  RC-DESIGN-MOCKUPS-001. Registros em `docs/handoff/HANDOFF-RC-GLOBAL-DESIGN-CONTENT-001/`.
- **Decisão:**
  - Banco editorial canônico: `app/data/editorial/seed.json` (CNT, ARG, EVD, TAX, IDE…). O Hub Editorial
    recebe `public/hub-editorial/seed.js`, gerado no `prebuild`; nunca editar o seed dentro do HTML.
  - Artigos seguem a skill `executar-block-quick-frameworks` (`tools/`): registro em
    `app/data/editorial/quick-frameworks/CNT-RC-NNNN.md` (validado por `validate_output.py`) e MDX gerado em
    `content/blog/` por `scripts/build-quick-frameworks.mjs` — não editar os `.mdx` gerados. Mermaid vira
    ```` ```ascii ```` (ADR-05).
  - Todo post declara `territory` (TAX) e, quando houver, `contentId` e `evidence`. Listagens, cards, temas,
    busca e artigos consomem `getPosts()` / `getPostViewsWithBody()` (`app/lib/posts.server.ts`, só em
    loaders) e `app/lib/editorial.ts`, sem copy duplicada.
  - Rotas dos mood boards: `/` (01–02), `/blog/` (04), `/blog/:slug/` (03), `/mapas/` (05), `/evidencias/` (06),
    `/guias/` (07), `/buscar/` (08), `/temas/` e `/temas/:slug/` (09). Todas pré-renderizadas
    (`app/data/pages.ts`, `TERRITORY_PATHS`) e registradas no hub (ADR-06).
  - Títulos de mockup sem registro no banco vão para o backlog (IDE-RC), não para o site. Dados ilustrativos
    (autores, datas, contagens) nunca viram conteúdo.
  - Shell editorial único (`app/components/site/SiteHeader.tsx`/`SiteFooter.tsx`, `site/nav.ts`), `lang="pt-BR"`,
    utilitários `rc-*` (`global.css`) e superfícies via `SURFACE` (`components/editorial/surface.ts`) sobre os
    tokens do ADR-09. Componentes editoriais em `app/components/editorial/`.
  - Ferramentas em `public/` consomem `public/ds/surfaces.css`, gerado de `global.css`
    (`scripts/export-surface-tokens.mjs`); só cores de estado próprias ficam locais.
  - URLs antigas removidas (posts de demonstração) ganham 301 em `public/_redirects` (Workers assets).
- **Consequências:**
  - `tests/content.spec.ts` (`npm run content:check`) falha com arquivo gerado defasado, Quick Framework
    inválido, território/evidência inexistente, copy de template no build, página sem pt-BR ou link quebrado.
  - Novo artigo = novo registro QF + `node scripts/build-quick-frameworks.mjs` (ou `npm run build`).
  - A paridade com o site Astro (`tests/parity.spec.ts`) virou registro histórico, fora do `npm test`.

### ADR-11: Identidade visual dos mockups em todas as rotas (RC-DESIGN-MOCKUPS-001)

- **Status:** Aceita — implementada; tema escuro provisório
- **Contexto:** O usuário enviou 10 mood boards e pediu a refatoração transversal da identidade visual: fundo
  branco, tipografia, nova paleta, bordas, raio e sombras em todas as rotas, com os **valores exatos do mockup**.
  Isso inverte as decisões C-02/C-03 da reconciliação anterior (`HANDOFF-RC-GLOBAL-DESIGN-CONTENT-001`), que
  tinha mantido os tokens antigos. Registro, desvios AA e antes/depois em `docs/handoff/RC-DESIGN-MOCKUPS-001/`.
- **Decisão:**
  - Quatro superfícies do mood board 10, só em `app/styles/global.css`: Canvas `#FFFFFF` (`--background`),
    Subtle `#F5F5F4` (`--surface-subtle` = `--surface-default` = `--card`), Tabular `#EAEAE8`
    (`--surface-tabular` = cabeçalho de tabela, seleção e `--border-default`) e Diagram `#EFF6FF`
    (`--surface-model` = `--primary-soft`). O contrato estrutural do ADR-09 (aliases, sem sombra em cards) continua.
  - Texto `#202124`, secundário `#6B7280`, ação `#2563EB` (hover `#1D4ED8`), também anel de foco.
  - Tipografia: Inter (display 700, tracking −0,03em; corpo 18/28) e IBM Plex Mono para rótulos, IDs e
    metadados, carregadas do Google Fonts em `app/root.tsx`. DM Sans/DM Mono saíram. Diagramas plain text
    continuam em `ui-monospace` (ADR-05).
  - Botões com raio 8 (`rounded-lg`); `outline` com borda e texto primários; chips em pílula. Cards: ver ADR-12
    (célula da tabela, raio 2px).
  - Desvio AA: `#6B7280` só no canvas. Dentro de superfícies cinza, `global.css` troca `--muted-foreground` por
    `--muted-foreground-on-gray` `#5F6670` (seletores de card, tabela, plain, `rc-surface` e `bg-[var(--surface-*)]`);
    nada de texto azul sobre Tabular (4,29:1); `--surface-hover` `#F0F0EE` mantém links ≥ 4,5:1.
  - Callouts (ADR-03), gráficos (ADR-04) e `--area-*` (ADR-08) não mudam. O showroom
    `/admin/design-system/#gramatica` reproduz o mood board 10 com os valores lidos de `global.css`.
- **Consequências:**
  - `tests/tokens.spec.ts` trava os valores, as fontes, os botões e o contraste dentro das superfícies cinza;
    `tests/surfaces.spec.ts` impede hex da paleta fora de `global.css`.
  - Superfície cinza nova: usar `SURFACE` (`components/editorial/surface.ts`), `Card` ou
    `bg-[var(--surface-*)]` para herdar o tom AA; fundo cinza montado de outro jeito precisa da classe `rc-surface`.

### ADR-12: Transversal de leitura — cards-célula, plain estruturado, halftone e banco de imagens (RC-UX-HIG-002)

- **Status:** Aceita — implementada (PR C e PR D). Registro em `docs/handoff/RC-UX-HIG-002/`; auditoria em `docs/audit/`
- **Contexto:** Revisando o site no iPhone, o usuário apontou painéis plain text com corpo em mono corrido,
  sem estrutura, num blog que é de leitura; pediu cards iguais à tabela, um fundo de bolinhas orgânico
  (halftone) e as imagens do seu banco. Regra herdada do monorepo: UX-GOV-HIG-001 (Apple HIG + WCAG 2.2 AA).
- **Decisão:**
  - **Card = célula da tabela.** Utilitário `rc-cell` (`global.css`): fundo `--table-surface`, sem contorno,
    raio `--table-radius` (2px), separação por gutter. `SURFACE`, `Card`, painéis plain, callout card, cards
    do hub e da Loja usam essa célula; o cabeçalho de painel é a faixa Tabular (`--surface-header`), como o
    `th`. Contorno só em controles (`--input`, raio 8).
  - **Nada de texto desestruturado.** `PlainTextPanel` estrutura o plain text (`app/lib/plain/structure.ts`):
    `Rótulo: valor` e `CHAVE␣␣valor` → `<dl>`; `-`/`1.`/`01␣␣` → listas; colunas com cabeçalho em caixa alta →
    tabela; o resto → parágrafo verbatim. Mono só em diagramas e em termos-identificador. Tokens de texto
    nomeados: `--text-display/h2/h3/body/small/mono`, `--measure` (68ch), `--measure-lead` (60ch),
    `--space-section`.
  - **Halftone orgânico** (`components/editorial/DotField.tsx`): SVG determinístico (ruído de valor com
    semente), `--dot-color` = `--primary`, decorativo (`aria-hidden`), nunca sob texto. Entra na arte dos
    heroes (`HeroArt`, `PageHero`) e na faixa acima do rodapé.
  - **Banco de imagens** em `docs/banco-imagens/` (16 peças, `manifest.json` com transcrição). Nas páginas só
    entram imagens **sem texto**: hoje binóculo (hero da home e de Sobre, OG), equipe com tablet (Sobre) e mão
    com chaves (login, cadastro), registradas em `IMAGES` (`HeroArt.tsx`) com `alt` descritivo. Artigos sem
    ilustração ficam sem imagem; o schema ganhou `imageAlt`.
  - **Anatomia de página** (UX-GOV-HIG-001 / ADR-M03, referência developer.apple.com/programs), em
    `app/components/layout/`: `PageHero` (eyebrow, h1, lead ≤ 60ch, ações, arte), `Section` (h2, lead,
    "Saiba mais ›"), `FeatureBlock`/`FeatureRow` (ícone ou mídia, título, parágrafo curto, link),
    `CompareCards` e `ChevronLink`. Links de texto usam chevron; botões, seta. Ritmo entre seções:
    `--space-section`. Todo `p/li/dd` de `main` respeita `--measure`; tabelas com `ds-table--stack` viram
    células rotuladas no celular (grades de dados declaradas com `data-wide-table` + região focável).
- **Consequências:**
  - `tests/hig.spec.ts` é o gate UX-GOV-HIG-001 em todas as rotas (P0/P1 falham o `npm test`);
    `HIG_AUDIT=1` + `node scripts/hig-audit.mjs` regeneram `docs/audit/HIG-WEB-AUDIT.{json,md}`.
  - `tests/plain.spec.ts` trava o parser e exige que todo painel dos artigos tenha estrutura e não use mono;
    `tests/surfaces.spec.ts` trava a célula (sem contorno, raio 2px) nos cards.
  - Imagem nova no site: `tem_texto: false` no manifest, webp em `public/images/`, `alt` e uso registrados.


### ADR-13: Brand Local v7 como identidade única; RC-BRAND-STYLING-001 só como camada de ilustração (LANC-001)

- **Status:** Aceita — implementada no PR-B do LANC-001 (RQ-010…015). Decisões em
  `docs/lancamento/LANC-001/requirements/01-DECISOES-E-AMBIGUIDADES.md` (DEC-U2, DEC-U3, CF-01…04); tokens em
  `05-TOKENS-SPEC.md`. Citado pelos PR-B a PR-H.
- **Contexto:** O pacote de lançamento trouxe três referências visuais concorrentes: o Editorial Hybrid v6
  (amarelo/preto), o Brand Local v7 e o RC-BRAND-STYLING-001 (paleta de ilustração azul/coral). Sem uma regra,
  cada PR escolheria uma.
- **Decisão:**
  - **Interface = Brand Local v7 = ADR-11**, em todas as rotas, artigos inclusive: `#2563EB` (ação), `#202124`
    (texto), superfícies do ADR-09, Inter + IBM Plex Mono. O amarelo/preto do v6 foi descartado; do v6/v7 ficam
    só a arquitetura, a interação e o motion.
  - **RC-BRAND-STYLING-001 é só a camada de ilustração e vetor**, `--illu-ink/blue/coral/blue-soft/canvas` em
    `global.css`: SVG, ilustrações, fundos decorativos, halftone. Os valores de texto dele (`#18346F`,
    `#56647A`) não entram na interface (CF-01).
  - **Coral e azul claro nunca como texto** nem como único indicador de significado. Marca gráfica com
    significado (nó, aresta, série, ícone de estado) tem contraste ≥ 3:1 contra o fundo; coral e azul claro só
    como preenchimento decorativo ou com contorno ≥ 3:1 (`--graph-accent-event-outline`).
  - **Grafo causal** usa aliases `--graph-*` sobre a interface e a ilustração, sem hex novo; gráficos seguem o
    ADR-04 (`--chart-*`).
  - **Motion do v7:** `--ease` `cubic-bezier(.22,1,.36,1)`, `--dur-fast/base/slow` (150/250/450 ms, proposta),
    `@keyframes heroReveal` (opacidade 0→1, `translateY(18px)`→0, classe `rc-hero-reveal`). Sob
    `prefers-reduced-motion` toda animação e transição cai para ≤ 0,01 s e as durações nomeadas para 0.
  - **Geometria de componentes novos:** `--radius-sheet` 20px (topo do bottom sheet), `--radius-pill`/
    `--radius-node` 40px, `--radius-control` 8px, `--shadow-overlay` (= `--elevation-overlay`) para drawer e
    sheet. Cards continuam célula de 2px (`--radius-card`, ADR-12).
- **Consequências:**
  - Hex só em `app/styles/global.css` (já valia pelo ADR-11; agora inclui os `--illu-*`).
  - `tests/tokens.spec.ts` trava os valores `--illu-*`, `--ease`, durações e geometria, mede o contraste dos
    `--graph-*` (≥ 3:1, nos dois temas) e verifica o reduced-motion; `tests/surfaces.spec.ts` impede hex
    `--illu-*` fora de `global.css` e `color:` com `--illu-coral`/`--illu-blue-soft`.
  - O showroom `/admin/design-system/` mostra a camada de ilustração, o grafo e o motion.
