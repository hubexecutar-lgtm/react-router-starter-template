# MIGRATION PLAN

## N1 — Registry canônico
Criar registries para problems, operational_functions, cognitive_capacities, factors,
compensations, controls, capabilities e app_features.

## N2 — Quick Framework adapter
Adicionar correlation_refs sem alterar as 12 seções existentes.
Ferramentas recomendadas passam a emitir solution_candidates.

## N3 — Solution adapter
Adicionar correlation_refs ao solution.yaml sem remover campos existentes.

## N4 — RC Knowledge Pack
Registrar TP-001, FRC-01..20, claims, evidências, RC-SOLUTION-001, assets e métricas.

## N5 — Gestão/Cognição
Quebrar cada linha de DATA-ADHD-PM-001 em relações tipadas.
Associação clínica e decisão de produto ficam em edges diferentes.

## N6 — METHOD/runtime
Registrar WIP, dependência, tempo, DoD, Flow e Context como control/method/capability.

## N7 — Store
Manter area/type/tags para UX, mas adicionar descoberta por:
problem + operational_function + compensation + capability + fit.

## N8 — Analytics/Learning
Eventos passam a carregar IDs quando disponíveis:
problem_id, solution_id, capability_id, asset_id, qfw_id, campaign_id.

DoD final:
responder de ponta a ponta:
qual problema → qual explicação → qual compensação → qual solução → qual execução
→ qual resultado → qual learning.
