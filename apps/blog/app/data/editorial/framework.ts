// Diagramas e modelos do framework (TAX-RC-008), reutilizados na home, em /mapas/ e em /temas/.
// Texto plain (ADR-05): copiável, pesquisável e sem SVG/Mermaid.

export const FRAMEWORK_DIAGRAM = `FATORES DE RISCO COGNITIVO
  o que aumenta a probabilidade
        │
        ▼
EXPOSIÇÃO COGNITIVA
  intensidade · frequência · duração · criticidade
        │  ◀── controles preventivos
        ▼
EVENTO DE RISCO COGNITIVO
  deslize · lapso · engano · violação
        │  ◀── controles mitigadores
        ▼
CONSEQUÊNCIA
  dano · retrabalho · decisão pior

INDICADORES  acompanham exposição, controles e eventos
GESTÃO       identificar → avaliar → tratar → monitorar`;

export const ANALYSIS_TEMPLATE = `# Estrutura de análise de risco cognitivo
tarefa: ...
fatores: [individual, estado, ambiente, organização, tecnologia]
exposição: {intensidade, frequência, duração, criticidade}
eventos_possíveis: [deslize, lapso, engano, violação]
controles: {preventivos: [...], mitigadores: [...]}
indicadores: {antecedentes: [...], de_resultado: [...]}
próxima_revisão: AAAA-MM-DD`;

/** Mapa de temas (mood board 09) em árvore: o framework no centro, os territórios em volta. */
export const TERRITORY_TREE = `RISCO COGNITIVO  (fenômeno)
├── Fatores de Risco Cognitivo ........ causas
├── Exposição Cognitiva ............... condição
├── Eventos de Risco Cognitivo ........ ocorrências
├── Controles Cognitivos .............. mitigação
├── Indicadores de Risco Cognitivo .... mensuração
├── Gestão do Risco Cognitivo ......... prática
└── Framework de Risco Cognitivo ...... método que conecta tudo`;
