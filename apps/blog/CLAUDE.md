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
  - O primário do site (#0A6FDB, botões e links) não muda.
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
    data). Só é AA sobre `card`, `background` e `popover`; sobre `muted`, `secondary` e
    `accent` use `--muted-foreground`.
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
  - `AsciiDiagram` preserva geometria (`white-space: pre`, rolagem horizontal);
    `PlainTextPanel` quebra texto longo (`pre-wrap`). Conteúdo nunca é reescrito, só
    normalizado (BOM, fim de linha, linhas em branco nas pontas).
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

