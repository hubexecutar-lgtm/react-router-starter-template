# STORE-ROUTE-MAP

Astro estático: as rotas são arquivos em `src/pages/loja`. `getStaticPaths` gera uma página por
tipo e por item do repositório de dados.

| ROUTE | PURPOSE | LAYOUT | FILTER | COMPONENT | DATA SOURCE | STATUS |
|-------|---------|--------|--------|-----------|-------------|--------|
| `/loja/` | Store Hub: categorias, destaque, Skills, E-books | Browse | tabs (tipo) + área + busca | `StoreCatalog` | `repository.listItems()` (mock) | implementada |
| `/loja/skills/` | catálogo de Skills | plugin-like (lista) | `type=skill` fixo | `StoreCatalog lockedType` | idem | implementada |
| `/loja/agentes/` | catálogo de Agentes | plugin-like | `type=agent` | idem | idem (vazio → Empty) | implementada |
| `/loja/prompts/` | catálogo de Prompts | plugin-like | `type=prompt` | idem | idem | implementada |
| `/loja/ebooks/` | catálogo de E-books | connector-like (grid) | `type=ebook` | idem | idem | implementada |
| `/loja/pdfs/` | catálogo de PDFs | connector-like | `type=pdf` | idem | idem (vazio → Empty) | implementada |
| `/loja/html/` | ferramentas HTML | connector-like | `type=html` | idem | idem | implementada |
| `/loja/workbooks/` | workbooks | connector-like | `type=workbook` | idem | idem | implementada |
| `/loja/assets/` | assets visuais | connector-like | `type=asset` | idem | idem | implementada |
| `/loja/:type/:slug/` | detalhe (report-like) | 2 colunas ≥ lg; 1 coluna abaixo | — | `ItemDetail` | `repository.getItem()` | implementada |

## Query params (estado compartilhável)

| Param | Efeito |
|-------|--------|
| `q` | texto da busca |
| `tipo` | segmento do tipo (`skills`, `ebooks`…) — só em `/loja/` |
| `area` | `institutional`, `editorial`, `skills`, `operations`, `tools`, `data` |
| `estado` | `carregando` / `erro` — pré-visualiza LOADING/ERROR na fase mock |

Rotas existentes não foram renomeadas. `/artigos` e `/skills` do desenho funcional não viram
rotas novas: o conteúdo editorial segue em `/blog`, e "Skills" é a área/tipo dentro da Loja.
