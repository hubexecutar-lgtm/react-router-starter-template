# ADR-TEIA-UNICA-001

STATUS: PROPOSED_FOR_APPROVAL

## Contexto

Os documentos analisados descrevem camadas do mesmo sistema usando vocabulários diferentes:
problema, processo, progresso, função de gestão, capacidade humana, fator cognitivo,
vulnerabilidade, impacto, compensação, solução, capability, asset, métrica e learning.

## Decisão

Criar um Typed Property Graph canônico. Os schemas atuais continuam existindo e passam
a ser alimentados/interpretados por adapters.

## Motivos

- evita um superobjeto monolítico com centenas de campos nulos;
- suporta relações N:N;
- preserva provenance e classes epistêmicas;
- separa evidência clínica de decisão de produto;
- permite descoberta semântica de soluções;
- permite retroalimentação por uso real sem destruir histórico.

## Consequências

- IDs estáveis tornam-se obrigatórios nas novas projeções;
- cada relação precisa de provenance/status;
- inferências cruzadas ficam explicitamente marcadas;
- Quick Framework e Solution Store ganham correlation_refs.
