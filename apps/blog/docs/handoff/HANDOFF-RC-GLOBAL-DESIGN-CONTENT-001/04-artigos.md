# 04 · Registro dos artigos e fontes

Workflow: `executar-block-quick-frameworks` v1.0.0 (`tools/executar-block-quick-frameworks/`), um tópico
por vez (WIP = 1): ENTENDER → PESQUISAR → VALIDAR → ESTRUTURAR → REDIGIR → VALIDAR → ENTREGAR.

- **Registro editorial** (saída exata da skill, com Mermaid): `app/data/editorial/quick-frameworks/CNT-RC-NNNN.md`.
- **Publicação**: `content/blog/<slug>.mdx`, gerado por `scripts/build-quick-frameworks.mjs`
  (idempotente; `--check` no teste). Conversões: Mermaid → ```` ```ascii ```` com os mesmos nós e arestas
  (cadeia linear = caixas empilhadas; grafo não linear = lista de arestas `A ──▶ B`); Aviso →
  `<Callout variant="attention">`; seção 12 → ```` ```plain ```` “Briefing do infográfico 16:9” e registro
  `VIS-RC-QF-NNNN` no banco; fontes → links.
- **Validação**: `validate_output.py` = `STATUS: VERIFIED` nos 8 (rodado em `tests/content.spec.ts`).
- **Tempo de leitura**: palavras do corpo final ÷ 200, para cima, mínimo 1 (`app/lib/reading-time.ts`).
- **Autor e data**: “Risco Cognitivo”; `pubDate` 2026-10-01 (data real desta publicação no branch).

| ID | Slug | Território | Base no banco | Ampliação editorial | Referência padrão-ouro | Fontes (EVD) |
|---|---|---|---|---|---|---|
| CNT-RC-0001 | `o-que-e-risco-cognitivo` | TAX-RC-001 | brief, tese, ARG-0001…0003, EVD-0001…0003 | texto completo; exemplo do relatório | Sidney Dekker (EVD-0006) | 0001, 0002, 0003, 0006, 0013 |
| CNT-RC-0002 | `fatores-de-risco-cognitivo` | TAX-RC-002 | brief, ARG-0004…0005, EVD-0004…0005, IDE-0002 (automation bias) | texto; dados de sono e interrupções | HSE, HSG48 (EVD-0007) | 0004, 0005, 0007, 0008, 0009, 0010 |
| CNT-RC-0003 | `exposicao-cognitiva` | TAX-RC-003 | brief, ARG-0006…0007, short AST-RC-0006 (“uma notificação versus cem”) | texto; ISO 10075 e NASA-TLX | ISO, ISO 10075-1 (EVD-0011) | 0009, 0011, 0012 |
| CNT-RC-0004 | `eventos-de-risco-cognitivo` | TAX-RC-004 | TAX (`Inclui`, `Nao_confundir`) | **registro novo**; taxonomia de Reason | James Reason (EVD-0013) | 0006, 0013 |
| CNT-RC-0005 | `controles-cognitivos` | TAX-RC-005 | TAX | **registro novo**; checklist cirúrgico da OMS | OMS / Haynes et al. (EVD-0014) | 0013, 0014 |
| CNT-RC-0006 | `indicadores-de-risco-cognitivo` | TAX-RC-006 | TAX (leading/lagging) | **registro novo** | HSE, HSG254 (EVD-0015) | 0012, 0015 |
| CNT-RC-0007 | `gestao-do-risco-cognitivo` | TAX-RC-007 | TAX (`Inclui`: identificar…aprender) | **registro novo** | ISO, ISO 31000 (EVD-0016) | 0007, 0016 |
| CNT-RC-0008 | `framework-de-risco-cognitivo` | TAX-RC-008 | TAX, DEC-RC-0001 | **registro novo**; bow tie | CCPS + Energy Institute (EVD-0017) | 0013, 0016, 0017 |
| — | `do-risco-cognitivo-a-execucao-assistida` | TAX-RC-001 | — (ensaio anterior) | só `territory`, `type: ensaio`, `tags` | — | — |

## Evidências novas (EVD-RC-0006…0017)

Todas com URL conferida: DOIs resolvidos e títulos confirmados no Crossref (Haynes 2009, Reason 2000,
Williamson & Feyer 2000, Mark et al. 2008, Parasuraman & Manzey 2010, Hart & Staveland 1988); páginas
oficiais do HSE (HSG48, HSG254) respondendo 200; ISO, AIChE/CCPS e Routledge por busca (os servidores
bloqueiam acesso automatizado com 403, sem indicar URL inválida).

## O que é evidência e o que é framework

- Afirmações de estudos (sono ≈ álcool; interrupções → estresse; checklist → menos mortes) citam números
  exatamente como publicados e o contexto em que valem (Aviso em CNT-RC-0005).
- Definições e taxonomias do projeto (definição operacional, cinco classes de fatores, quatro dimensões
  de exposição, adaptação do bow tie e da ISO 31000 à cognição) estão rotuladas como proposta no Aviso
  de cada artigo, conforme `Limites_cautelas` dos briefs.
- Nenhuma citação direta foi usada (opcional no contrato); nenhum autor, data, métrica ou resultado foi
  inventado.

## Revisão humana pendente

Os 8 artigos estão IMPLEMENTED e com estrutura VERIFIED; o conteúdo factual foi pesquisado e conferido
pelo agente, mas `Status_editorial = PUBLICADO` no banco precisa de revisão humana antes do release
(próxima ação registrada em cada CNT).
