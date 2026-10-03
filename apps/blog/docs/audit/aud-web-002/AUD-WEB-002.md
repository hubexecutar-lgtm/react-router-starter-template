# AUD-WEB-002 — Home e artigo novos × handoff OPENAI-STORIES-DESIGN-001

| Campo | Valor |
|---|---|
| ID / versão | AUD-WEB-002 · 1.0.0 |
| Alvo | `/` (Home), `/artigos/risco-cognitivo/` (artigo) e `/admin/stories-fixtures/` (blocos com dados sintéticos) |
| Referência | handoff `OPENAI_STORIES_CAPTURE_HANDOFF_v1.0.0` (medidas em `docs/design-system/OPENAI-STORIES-MEASURES.md`) |
| Tokens | `--ref-*` em `app/styles/global.css`, valores literais do handoff (ADR-14) |
| Status | VERIFIED nos itens marcados; o resto está justificado, pendente ou BLOCKED |

## Método e limites

- **Gate de fidelidade:** `tests/stories.spec.ts` lê os estilos computados dos elementos reais a 1363 × 936 e compara
  com os valores literais do handoff (tipografia em valor exato; geometria com tolerância de 0,75 px).
- **Medidas locais:** `node scripts/stories-capture.mjs` grava `after/metrics.json` e a página inteira em 390, 768 e
  1363 px. Só captura **este** site.
- **Referência BLOCKED:** `openai.com` responde **403** ao container (testado em `/pt-BR/stories/` e no artigo, a 390,
  768 e 1363). Não foi contornado. Por isso não há captura própria da referência, nem sobreposição, nem diff por
  pixel; os valores dela são os do handoff. Mesmo com acesso, o diff por pixel não valeria: a fonte, as imagens e o
  conteúdo são outros.
- **Classificação:** MEDIDO = computado no navegador; DO HANDOFF = número do handoff; PROPOSTA = decisão nossa sem
  medida na referência.

## Matriz

| ID | Seção | Diferença | Evidência | Impacto | Correção | Critério de aceite | Status |
|---|---|---|---|---|---|---|---|
| AUD-WEB-002-01 | Tipografia | Site anterior com Inter 700 e escala própria | `tests/stories.spec.ts` (tokens e elementos) | Alto | Tokens `--ref-*` literais + utilitários `stories-h1/h2/body/quote/caption/meta` | h1 61,6864/62,0103/−1,85059/500; h2 46,8432/54,2918/−1,38216/500; corpo 17/27,999/−0,17/400; citação 29,5662/39,0274/500; legenda 14/22,96, em ≥ 1024 px | VERIFIED |
| AUD-WEB-002-02 | Cabeçalho | 65 px com borda | `after/metrics.json` `header.h` | Médio | Barra de 64 px; a régua inferior virou box-shadow | 64 px nas 3 larguras | VERIFIED |
| AUD-WEB-002-03 | Home: abertura | — | `stories.spec` "home: header, title, toolbar…" | Alto | Título (h1 com tokens do h2) em y = 152; barra em y = 222; destaque em y = 326 | y = 152 / 222 / 326 (±1 px) e x = 32 | VERIFIED |
| AUD-WEB-002-04 | Home: destaque | — | `stories.spec` | Alto | Destaque de 3 colunas, 16:9, com pilha lateral de 1 coluna | 968,25 × 544,64 px a 1363 px | VERIFIED |
| AUD-WEB-002-05 | Home: grade | — | `stories.spec` "fixtures: grid…" | Alto | 4 colunas, gap de 24 px, imagem quadrada | cards de 306,75 px, gaps de 24 px | VERIFIED |
| AUD-WEB-002-06 | Home: "Carregar mais" | — | `stories.spec` "fixtures: load more…" | Médio | Cápsula preta, paginação em memória sem duplicar | 40 px de altura, raio 40 px; 16 → 22 cards sem repetir | VERIFIED |
| AUD-WEB-002-07 | Home: ordenação e categorias | Filtro por tópicos e alternância grade/lista do handoff | `stories.spec` (sort e categoria na URL) | Médio | Categorias e "Classificar" no cliente, serializados na URL | Ordenação determinística; recarregar preserva o estado | VERIFIED (parcial: ver 14) |
| AUD-WEB-002-08 | Artigo: hero | Referência usa foto escurecida com título branco | `stories.spec` "article: hero…" | Alto | Hero claro: h1 centralizado (≤ 802 px), subtítulo (≤ 596 px) e a ilustração abaixo, em 1078,5 px | h1 e subtítulo com os tokens; imagem de 1078,5 px | VERIFIED (divergência: ver 09) |
| AUD-WEB-002-09 | Artigo: hero (divergência) | A arte é ilustração sobre fundo branco, não foto | Capturas `after/artigo-*.png` | Médio | Não sobrepor o título à ilustração | Texto escuro legível sobre branco | JUSTIFICADO |
| AUD-WEB-002-10 | Artigo: coluna e corpo | — | `stories.spec` | Alto | Coluna de 637,5 px centralizada, parágrafos com 24 px, h2 com 120 px acima | Coluna = 637,5 px, x = (1363 − 637,5)/2 | VERIFIED |
| AUD-WEB-002-11 | Artigo: MDX do autor | h1 duplicado se o MDX trouxesse o próprio título | `stories.spec` "one h1 only" | Médio | O `# título` do MDX vira nulo; o h1 fica no hero. O arquivo do autor não foi alterado | 1 h1; 13 h2; JSON-LD `Article` presente | VERIFIED |
| AUD-WEB-002-12 | Artigo: painéis plain text | O parser não estruturava blocos "TÍTULO EM CAIXA ALTA + texto" | `stories.spec` "every plain panel…" e `plain.spec` (parser) | Médio | `structure.ts` agrupa esses blocos em lista de definições (palavras, sem mono) | Todo painel do artigo com estrutura e fonte não mono (ADR-12) | VERIFIED |
| AUD-WEB-002-13 | Blocos sem conteúdo real | Citação, carrossel, par assimétrico, figura e CTA existem, mas o artigo atual não os usa | `/admin/stories-fixtures/` | Médio | Componentes por props, validados só com dados sintéticos (noindex) | Tokens da citação e da legenda; gap e card da grade | VERIFIED (fixtures) |
| AUD-WEB-002-14 | Funções da Home fora do escopo | Filtro por tópicos, alternância grade/lista, busca, seletor de idioma | — | Médio | Não implementados: o conteúdo não tem tópicos e o estado de lista não foi validado no handoff | — | PENDENTE |
| AUD-WEB-002-15 | Vídeo e exemplos de conversa | `VideoBlock` e `ConversationExamples` do handoff | — | Médio | Não implementados: dependem de assets e comportamento que não existem | — | PENDENTE |
| AUD-WEB-002-16 | Fonte | "OpenAI Sans" não está no handoff | Computado: Inter | Médio | Mesma escala com a Inter (ADR-11) | A quebra de linha pode diferir da referência | JUSTIFICADO |
| AUD-WEB-002-17 | Responsivo 390/768 | A referência não tem medida mobile/tablet | `after/metrics.json` | Alto | Abaixo de 1024 px a escala é **proposta**: h1 `clamp(2.25rem, 1.2rem + 4.2vw, token)`, h2 `clamp(1.75rem, 1rem + 3.2vw, token)`, citação `clamp(…)`, espaços 72 px e 40 px | `overflowX = 0` nas 3 larguras; tokens literais de 1024 px em diante | PROPOSTA (referência BLOCKED) |
| AUD-WEB-002-18 | Rodapé | O handoff tem cinco colunas de navegação | `FOOTER_NAV` vazio | Baixo | Rodapé branco com marca e painel interno; as colunas voltam com as páginas | — | PENDENTE |
| AUD-WEB-002-19 | Teclado e foco | — | `stories.spec` "keyboard…", gate HIG | Alto | Título do card é o único link do card (::after estica a área) | Link real, foco com sublinhado, skip link coberto em `surfaces.spec` | VERIFIED |
| AUD-WEB-002-20 | Overflow | — | `stories.spec` "no horizontal overflow" | Alto | — | `overflowX = 0` em Home, artigo e fixtures a 390, 768 e 1363 | VERIFIED |
| AUD-WEB-002-21 | Acessibilidade e medida | — | `tests/hig.spec.ts` | Alto | — | axe, títulos, landmarks, alvos ≥ 24 px, medida ≤ 75 caracteres, sem prosa mono: 0 P0/P1 | VERIFIED |
| AUD-WEB-002-22 | Conteúdo do autor | O artigo cita `[Mapa de Risco](/mapa-de-risco)`, página que não existe | Link no MDX | Médio | Mantido como o autor enviou | O link responde 404 até a página existir | PENDENTE (decisão do autor) |
| AUD-WEB-002-23 | Safari / WebKit | — | — | Médio | — | Só Chromium no container | NÃO VERIFICADO |
| AUD-WEB-002-24 | Hover e animações | Estados de hover e movimento da referência | — | Baixo | — | Não medidos | NÃO VERIFICADO |

## Capturas

`after/` guarda a página inteira de cada rota em 390, 768 e 1363 px, mais `metrics.json` e os estilos computados.
Não há capturas "antes": o site anterior foi removido por completo (ADR-13) e não é comparável.
