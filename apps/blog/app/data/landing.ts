// Texto canônico da home (RC-LP-001 v1.0.0), gerado do arquivo do intake sem reescrita (LANC-001 RQ-040):
// docs/lancamento/LANC-001/intake/DOCS-002/RC_EDITORIAL_PLAIN_TXT_v1.0.0/01_CANONICO/01_RC_LANDING_3_PILARES.txt
// Não editar à mão: tests/content.spec.ts compara cada parágrafo com o canônico.
export type LandingBlock = { p: string } | { term: string; text: string } | { pillar: string };
export type LandingSection = { heading: string | null; blocks: LandingBlock[] };

export const LANDING: { id: string; version: string; title: string; cta: string; sections: LandingSection[] } = {
  "id": "RC-LP-001",
  "version": "1.0.0",
  "title": "Riscos Cognitivos: entenda o problema, redesenhe o trabalho e transforme análise em solução",
  "cta": "Comece por \"Riscos cognitivos: o que são, como surgem e por que importam\".",
  "sections": [
    {
      "heading": null,
      "blocks": [
        {
          "p": "Riscos cognitivos ajudam a observar como tarefas, processos, ambientes e tecnologias podem aumentar a demanda sobre atenção, memória, planejamento, decisão e outras capacidades necessárias para executar um trabalho."
        },
        {
          "p": "Neste projeto, o objetivo não é transformar características individuais em risco."
        },
        {
          "p": "A proposta é entender a interação entre Pessoa × Tarefa × Ambiente × Processo × Projeto × Tecnologia e identificar onde o próprio sistema de trabalho pode criar demanda cognitiva evitável."
        },
        {
          "p": "A arquitetura editorial segue três pilares:"
        },
        {
          "p": "Riscos Cognitivos → Processos Neuroadaptativos → Ferramentas e Soluções"
        },
        {
          "p": "Em termos simples:"
        },
        {
          "p": "Problema → Método → Aplicação"
        }
      ]
    },
    {
      "heading": "O QUE SÃO RISCOS COGNITIVOS?",
      "blocks": [
        {
          "p": "Neste projeto, usamos \"risco cognitivo\" como um conceito operacional."
        },
        {
          "p": "Ele serve para investigar situações em que determinadas demandas cognitivas, dentro de um objetivo e contexto, podem criar exposição e contribuir para eventos que prejudicam a execução."
        },
        {
          "p": "A cadeia de análise é:"
        },
        {
          "p": "Objetivo → Contexto → Demanda Cognitiva → Vulnerabilidade → Exposição → Risco Cognitivo → Evento → Impacto"
        },
        {
          "p": "Essa cadeia é um framework metodológico deste projeto."
        }
      ]
    },
    {
      "heading": "OS 3 PILARES DO RISCOS COGNITIVOS",
      "blocks": [
        {
          "pillar": "1. RISCOS COGNITIVOS: ENTENDER O PROBLEMA"
        },
        {
          "p": "O primeiro pilar cria o vocabulário."
        },
        {
          "p": "Aqui investigamos fatores de risco cognitivo, demandas cognitivas, vulnerabilidades, exposição, eventos, impactos, sobrecarga, interrupções, perda de contexto, memória, atenção e tomada de decisão."
        },
        {
          "p": "Pergunta central:"
        },
        {
          "p": "O que está tornando a execução mais difícil e onde essa dificuldade está surgindo?"
        },
        {
          "pillar": "2. PROCESSOS NEUROADAPTATIVOS: TRANSFORMAR CONHECIMENTO EM MÉTODO"
        },
        {
          "p": "Reconhecer um problema não basta."
        },
        {
          "p": "Precisamos entender como o trabalho foi projetado."
        },
        {
          "p": "É aqui que entram gestão de projetos, gestão de processos, BPM, BPMN, gestão de riscos, análise e auditoria de processos, desenho e redesenho, controles, runbooks e melhoria contínua."
        },
        {
          "p": "Neste projeto, chamamos de processo neuroadaptativo um processo redesenhado para reduzir demanda cognitiva evitável e tornar informação, estado, dependências e próximas ações mais explícitos."
        },
        {
          "p": "Esse é um conceito metodológico próprio, não uma norma técnica estabelecida."
        },
        {
          "pillar": "3. FERRAMENTAS E SOLUÇÕES: COLOCAR O MÉTODO EM PRÁTICA"
        },
        {
          "p": "Depois de identificar o problema e redesenhar o processo, podemos escolher uma solução."
        },
        {
          "p": "Ela pode ser checklist, procedimento, runbook, workflow, automação, agente, skill, interface, software, Executar ou MapOS."
        },
        {
          "p": "Pergunta central:"
        },
        {
          "p": "O que o sistema pode assumir para que a pessoa não precise administrar mentalmente tudo o que o trabalho exige?"
        }
      ]
    },
    {
      "heading": "DO PROJETO AO APRENDIZADO",
      "blocks": [
        {
          "term": "PROJETO",
          "text": "O que queremos mudar."
        },
        {
          "term": "PROCESSO",
          "text": "Como o trabalho acontece."
        },
        {
          "term": "RISCO",
          "text": "O que pode impedir o objetivo."
        },
        {
          "term": "ANÁLISE",
          "text": "Por que e como isso pode acontecer."
        },
        {
          "term": "RISCO COGNITIVO",
          "text": "Onde a demanda cognitiva cria exposição."
        },
        {
          "term": "COMPENSAÇÃO",
          "text": "O que pode ser reduzido, externalizado ou automatizado."
        },
        {
          "term": "SOLUÇÃO",
          "text": "Como transformar a compensação em algo utilizável."
        },
        {
          "term": "EXECUÇÃO",
          "text": "Aplicar a mudança."
        },
        {
          "term": "MEDIÇÃO",
          "text": "Saber se funcionou."
        },
        {
          "term": "APRENDIZADO",
          "text": "Usar o resultado para melhorar o próximo ciclo."
        }
      ]
    },
    {
      "heading": "POR ONDE COMEÇAR?",
      "blocks": [
        {
          "p": "Se você ainda precisa entender o fenômeno, comece por Riscos Cognitivos."
        },
        {
          "p": "Se já identificou o problema e precisa alterar a forma de trabalhar, avance para Processos Neuroadaptativos."
        },
        {
          "p": "Se já sabe o que precisa ser compensado, explore Ferramentas e Soluções."
        }
      ]
    }
  ]
};
