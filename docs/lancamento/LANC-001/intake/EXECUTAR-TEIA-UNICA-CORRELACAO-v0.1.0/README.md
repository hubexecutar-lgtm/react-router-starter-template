# EXECUTAR — Teia Única de Correlação

ID: ARCH-EXEC-CORRELATION-GRAPH-001
VERSION: 0.1.0
STATUS: PROPOSED_FOR_APPROVAL
OWNER: A DEFINIR
AUTOMATION_LEVEL: A1

## Decisão proposta

Usar um grafo canônico tipado como núcleo e manter Quick Framework, Knowledge Pack,
Education, Solution Store, Store UI e Runtime como projeções especializadas.

CONTEXT → PROBLEM → OPERATIONAL_FUNCTION → COGNITIVE_DEMAND → IMPACT
                  ↘ FACTOR / VULNERABILITY / EXPOSURE / RISK
PROBLEM → COMPENSATION → CONTROL / METHOD → SOLUTION → CAPABILITY → APP_FEATURE
          ↑                                           ↓
QUICK_FRAMEWORK / KNOWLEDGE_PACK / EDUCATION      EXECUTION
          ↓                                           ↓
        ASSET / CTA                              EVENT / METRIC
                                                      ↓
                                                   LEARNING

## Regra de fonte de verdade

- Knowledge Pack: fonte canônica dos objetos de conhecimento que declara.
- Evidence: fonte externa/primária; editorial não substitui evidência.
- solution.yaml: fonte canônica da solução/capability.
- Quick Framework gerado: projeção explicativa; não cria nova evidência científica.
- Store Card: projeção da SOLUTION; não é fonte.
- Eventos observados: fonte do comportamento real.
- Learning: fonte de decisões pós-medição.
- Correlação não explícita entre documentos = E_INFERRED + PROPOSED.

## Elo entre as duas skills

Quick Framework:
tema → contexto → problema → evidência → mecanismo → processo → progresso → próximos passos.

Solution Store:
problema → fit → compensação → solução → capability → Start/Download → execução → resultado.

Ponte:
1. Quick Framework passa a emitir correlation_refs e solution_candidates.
2. Solution Store passa a emitir correlation_refs.
3. O match deixa de depender somente de texto/tags e passa a usar:
   problem_id + operational_function_id + compensation_id + fit_conditions.
