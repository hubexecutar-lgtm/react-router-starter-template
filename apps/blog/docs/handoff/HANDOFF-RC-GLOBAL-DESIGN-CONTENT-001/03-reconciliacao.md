# 03 · Reconciliação: imagem → banco → campo → componente → rota

Responsabilidades: imagens = apresentação e copy visível; banco (seed do Hub) = registros, IDs e relações;
handoff = contrato de superfícies; UI existente = implementação canônica.

## Mapa rastreável

| Imagem / trecho | Registro do banco | Campo | Componente | Rota |
|---|---|---|---|---|
| 01 · hero “RISCO COGNITIVO / Conhecimento que vira estrutura.” | DEC-RC-0001 (marca = fenômeno) | `Decisao_tomada` | `pages/index.astro` (h1 `.rc-display`), `SITE_TAGLINE` em `consts.ts` | `/` |
| 01 · card Missão | — (copy de marca do mood board, sem conflito) | — | `index.astro` aside `SURFACE` | `/` |
| 01 · “Modelo em destaque” (bloco de código) | TAX-RC-002…007 (`Inclui`) | `Inclui` | `PlainTextPanel` + `ANALYSIS_TEMPLATE` (`data/editorial/framework.ts`) | `/`, `/guias/` |
| 01 · “Referências-chave” | EVD-RC-0006, 0007, 0011, 0013–0017 (notas “padrão-ouro”) | `Autor`, `Data`, `URL` | tabela `.ds-table` | `/` |
| 01/02/04 · artigo em destaque e recentes | CNT-RC-0001…0008 | `Titulo_final`, `Resumo_lead` → `title`/`description` | `ArticleCard` (feature/row/compact) via `getPosts()` | `/`, `/blog/` |
| 04 · chips de filtro | TAX-RC-001…008 | `Rota_pilar` (rótulo curto) | `FilterChips` | `/blog/?tema=` |
| 04 · ID mono + min + data | CNT-RC-* / `reading-time.ts` / `pubDate` | `Content_ID` | `ArticleMeta` | `/blog/`, artigos |
| 03 · eyebrow tema / tipo | TAX + `type` | `Rota_pilar` | `blog/[...slug].astro` | `/blog/:slug/` |
| 03 · “Princípio” | TAX | `Pergunta_central`, `Nao_confundir` | aside `SURFACE` “Pergunta do território” | `/blog/:slug/` |
| 03 · “Leia também” | ordem TAX (CTA do banco “Continuar para…”) | `CTA` | aside | `/blog/:slug/` |
| 03 · “Assuntos” | frontmatter `tags` | — | chips → `/buscar/?q=` | `/blog/:slug/` |
| 05 · mapa conceitual | TAX-RC-008 (`Inclui`: fatores…gestão) | `Inclui` | `AsciiDiagram` `FRAMEWORK_DIAGRAM` | `/mapas/`, `/` |
| 05 · “Modelos relacionados” | CNT-RC-0003/0004/0006/0007/0008 | referência padrão-ouro | lista `SURFACE_LINK` | `/mapas/` |
| 06 · tabela de evidências | EVD-RC-0001…0017 | todos | `EvidenceTable` | `/evidencias/`, artigos |
| 06 · classes | `vocab.classeEpistemica` | — | `dl` em `SURFACE` | `/evidencias/` |
| 07 · 3 cards de guia | Next 01 de cada Quick Framework (CNT-RC-0001…0008) | seção 10 | `guias/index.astro` | `/guias/` |
| 07 · newsletter | — | — | `NewsletterNotice` (desativada, L-02) | `/signup/`, `/guias/` |
| 08 · busca, abas, ordenar | coleção + TAX + EVD | índice JSON gerado | `buscar/index.astro` | `/buscar/` |
| 08/09 · árvore / mapa de temas | TAX-RC-001…008 | `Rota_pilar`, `Funcao` | `AsciiDiagram` `TERRITORY_TREE`, `TerritoryCard` | `/temas/`, `/buscar/` |
| 10 · gramática (canvas/subtle/tabular/diagram) | — | — | tokens ADR-09 (`--surface-*`, `--border-*`) | todas |

## Divergências e decisões

| ID | Imagem | Banco / sistema | Tipo | Decisão |
|---|---|---|---|---|
| C-01 | ~30 títulos de artigo sobre memória, produtividade e vieses (slides 01–09) | taxonomia TAX-RC-001…008 sobre o framework de risco cognitivo | **material** (mensagem/conteúdo) | banco prevalece; títulos registrados como ideias IDE-RC-0003…0032 no backlog (origem “Mood board slide NN”), não publicados |
| C-02 | cinzas `#F5F5F4`, `#EAEAE8`, painel `#EFF6FF` | `#F8F8F8`, `#EBEBEB`, `--color-brand-subtle` (ADR-09/ADR-03) | formatação | tokens existentes prevalecem; nenhuma matiz nova |
| C-03 | azul `#2563EB` / `#0A6FDB` | `--primary` `#306DD4` (ADR-09) | formatação | token existente |
| C-04 | autor “Ana Martins”, datas de 2024, tempos de leitura | autor “Risco Cognitivo”; `pubDate` real; tempo calculado | material (dado) | não usar dado ilustrativo |
| C-05 | slide 06 “EVID-001”, “Ex.: PubMed” (declarado ilustrativo) | EVD-RC-* reais com URL verificada | material | só registros reais |
| C-06 | slide 08 contagens e “buscas recentes” | contagens calculadas no navegador | material | sem histórico fictício |
| C-07 | nav dos slides varia (Início/Temas/Evidências/Métodos; Artigos/Guias/Mapas/Ferramentas) | rotas reais | formatação | nav única: Artigos, Temas, Mapas, Guias, Evidências, Loja, Sobre + busca |
| C-08 | fotos de arquitetura/pessoas | não existem como arquivo | ausência | reaproveitar `public/about/1–4.webp` (decisão do usuário); demais cards tipográficos |
| C-09 | slide 05 “Arquitetura externa da memória” (PARA, Zettelkasten) | TAX-RC-008 framework | material | mapa do framework; título do slide vai ao backlog (IDE-RC-0022) |
| C-10 | Mermaid no template da skill | ADR-05 (nunca Mermaid no site) | formatação | Mermaid convertido 1:1 em `ascii` no MDX; registro mantém Mermaid |

## URLs preservadas e redirecionamentos

| Antes | Depois | Mecanismo |
|---|---|---|
| `/blog/post-1/`…`/blog/post-5/` (demo Mainline) | `/blog/eventos-de-risco-cognitivo/`, `controles-cognitivos`, `indicadores-de-risco-cognitivo`, `gestao-do-risco-cognitivo`, `framework-de-risco-cognitivo` | `public/_redirects` (301) |
| `/about/ /faq/ /contact/ /pricing/ /login/ /signup/ /privacy/` | mesmas URLs, conteúdo reescrito | — |
