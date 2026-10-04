# Grafo canônico do Risco Cognitivo

- `CORRELATION_RECORD.schema.json`: cópia literal do schema da Teia Única v0.1.0
  (`docs/lancamento/LANC-001/intake/EXECUTAR-TEIA-UNICA-CORRELACAO-v0.1.0/`, ADR-M04). Não editar aqui.
- `rc-graph.json`: o grafo (fonte única). O mapa, os artigos, as Ferramentas e o analytics são projeções dele
  (`app/lib/graph/`). Regras em `docs/lancamento/LANC-001/requirements/06-DATA-SPEC-GRAFO-CAUSAL.md` §5.

Ao editar o grafo:

1. Todo nó cita um documento canônico em `source_refs` e traz `source_quote`, um trecho literal desse documento.
2. Relação escrita no texto: `D_INTERNAL` + `FRAMEWORK` (ou `SYNTHESIS` para `SUPPORTED_BY`), `VALIDATED`, com
   `source_ref` e `source_quote`. Relação que não está no texto: `E_INFERRED` + `HYPOTHESIS` + `PROPOSED`, com
   `limitations`.
3. Evento operacional: `OPERATIONAL_IMPACT` + tag `stage:event`; impacto: tag `stage:impact` (CF-16).
4. Nenhum número sem `evidence_refs`. Nenhum `NEURODIVERGENCE_PROFILE`.
5. `npm test` (`tests/graph.spec.ts`) valida o schema, as regras e cada `source_quote` contra o texto.
