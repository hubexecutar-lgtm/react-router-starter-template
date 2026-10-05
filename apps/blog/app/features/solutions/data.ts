// Gerado por scripts/solutions-from-yaml.mjs de RC_SCHEMA_6_SOLUCOES_v3.0.0.yaml (RC-SCHEMA-001 v3.0.0).
// Não editar à mão: altere o YAML no intake e rode o script.
export type SolutionMetric = { label: string; direction: "up" | "down" };
export type Solution = {
	id: string;
	name: string;
	slug: string;
	pain: string;
	/** Quadrante amarelo: exatamente 12 palavras (card_rule.yellow). */
	yellow12: string;
	study: string;
	work: string;
	functions: { name: string; detail: string }[];
	vulnerability: string;
	risk: string;
	technique: string;
	steps: string[];
	metrics: SolutionMetric[];
	evidenceStatus: string;
	/** Chaves do RC-SRC-002 (app/data/sources-scientific.ts). */
	refs: string[];
};

export const SCHEMA_WORKFLOW = "Dor → Contexto → Demanda → Função → Vulnerabilidade → Risco → Técnica → Aplicação → Indicador → Progresso";
export const SCIENTIFIC_GUARDRAIL = "Evidência de mecanismo não equivale a validação clínica do produto.";

export const SOLUTIONS: Solution[] = [
	{
		"id": "RC-SOL-001",
		"name": "Status Report",
		"slug": "status-report",
		"pain": "No fim de um dia cheio, a pessoa percebe que trabalhou muito, mas não consegue dizer com clareza o que avançou, o que ficou bloqueado e qual deve ser a próxima ação.",
		"yellow12": "Monitoramento insuficiente oculta desvios, bloqueios e progresso até tarde demais na execução.",
		"study": "Registrar conteúdo concluído, lacunas, acertos, erros e próxima revisão; não usar apenas horas estudadas.",
		"work": "Registrar entregável, dependência, bloqueio, evidência e próxima ação em checkpoints curtos.",
		"functions": [
			{
				"name": "Metacognição",
				"detail": "comparar estado real com objetivo."
			},
			{
				"name": "Memória de trabalho",
				"detail": "manter estado, pendências e dependências disponíveis."
			},
			{
				"name": "Flexibilidade cognitiva",
				"detail": "ajustar o plano quando aparece desvio."
			}
		],
		"vulnerability": "Depender da percepção subjetiva para avaliar progresso, risco, bloqueio e conclusão.",
		"risk": "Persistir em execução ineficaz sem perceber desvio ou bloqueio.",
		"technique": "Status Report + checkpoint de progresso",
		"steps": [
			"Registrar feito, bloqueio e evidência observável.",
			"Comparar estado atual com critério de conclusão e risco.",
			"Definir uma próxima ação explícita antes de encerrar."
		],
		"metrics": [
			{
				"label": "Desvios percebidos mais cedo",
				"direction": "up"
			},
			{
				"label": "Bloqueios sem registro",
				"direction": "down"
			},
			{
				"label": "Entregas com evidência",
				"direction": "up"
			},
			{
				"label": "Próxima ação explícita",
				"direction": "up"
			}
		],
		"evidenceStatus": "MECANISMO APOIADO",
		"refs": [
			"harkin2016",
			"boonstra2005"
		]
	},
	{
		"id": "RC-SOL-002",
		"name": "Plano dos 7 Dias",
		"slug": "plano-dos-7-dias",
		"pain": "Prioridades importantes entram em competição durante a semana; urgências, prazos e blocos de foco começam a disputar o mesmo espaço mental.",
		"yellow12": "Sem estrutura temporal, prioridades competem e prazos dependem demais da memória interna.",
		"study": "Separar leituras, exercícios, revisões e entregas por dia; reservar buffer para atraso e recuperação.",
		"work": "Converter entregáveis em blocos diários, com prazo, dependência, capacidade e buffer visíveis.",
		"functions": [
			{
				"name": "Planejamento",
				"detail": "distribuir objetivos em dias e blocos."
			},
			{
				"name": "Memória prospectiva",
				"detail": "lembrar de intenções futuras no momento adequado."
			},
			{
				"name": "Metacognição",
				"detail": "revisar carga, progresso e necessidade de ajuste."
			}
		],
		"vulnerability": "Planejar tarde demais, subestimar capacidade e manter prazos e ordem apenas mentalmente.",
		"risk": "Perda de prazo, sobrecarga e conflito entre prioridades por planejamento temporal insuficiente.",
		"technique": "Planejamento semanal externalizado",
		"steps": [
			"Definir entrega principal e limite de capacidade da semana.",
			"Distribuir etapas em dias, preservando buffer e dependências.",
			"Revisar diariamente e replanejar sem abrir trabalho concorrente desnecessário."
		],
		"metrics": [
			{
				"label": "Prazos esquecidos",
				"direction": "down"
			},
			{
				"label": "Carga acima da capacidade",
				"direction": "down"
			},
			{
				"label": "Entregas semanais concluídas",
				"direction": "up"
			},
			{
				"label": "Replanejamentos explícitos",
				"direction": "up"
			}
		],
		"evidenceStatus": "COMPONENTES APOIADOS",
		"refs": [
			"solanto2010",
			"nakashima2022",
			"lgo2026"
		]
	},
	{
		"id": "RC-SOL-003",
		"name": "Meu Processo de Trabalho",
		"slug": "meu-processo-de-trabalho",
		"pain": "A execução começa antes de a sequência estar fechada; dependências aparecem no meio do caminho e decisões precisam ser refeitas.",
		"yellow12": "Sequências implícitas aumentam decisões, trocas, retrabalho e risco de pular etapas críticas.",
		"study": "Separar pesquisa, compreensão, exercício e revisão; só avançar quando o critério do bloco estiver satisfeito.",
		"work": "Sequenciar preparação, produção, revisão, aprovação e publicação, com gates verificáveis.",
		"functions": [
			{
				"name": "Planejamento",
				"detail": "ordenar etapas e pré-condições."
			},
			{
				"name": "Controle inibitório",
				"detail": "não pular para a etapa seguinte antes do gate."
			},
			{
				"name": "Flexibilidade cognitiva",
				"detail": "ajustar a sequência quando uma dependência muda."
			}
		],
		"vulnerability": "Executar sem sequência explícita, gate de saída e dependências previamente verificadas.",
		"risk": "Retrabalho, salto de dependência e progressão para etapas não prontas.",
		"technique": "Workflow explícito + gates de saída",
		"steps": [
			"Exibir a sequência completa com ponto de entrada e saída.",
			"Definir gate verificável antes de liberar a próxima etapa.",
			"Bloquear avanço quando dependência ou critério ainda estiver aberto."
		],
		"metrics": [
			{
				"label": "Etapas refeitas",
				"direction": "down"
			},
			{
				"label": "Dependências descobertas tarde",
				"direction": "down"
			},
			{
				"label": "Gates atendidos",
				"direction": "up"
			},
			{
				"label": "Sequência executada como planejado",
				"direction": "up"
			}
		],
		"evidenceStatus": "EVIDÊNCIA INDIRETA",
		"refs": [
			"kiesel2010",
			"toli2016"
		]
	},
	{
		"id": "RC-SOL-004",
		"name": "Formulário Padrão do Ciclo",
		"slug": "formulario-padrao-do-ciclo",
		"pain": "Uma tarefa grande começa com objetivo, critérios e variáveis ainda abertos; a execução é interrompida repetidamente para tomar decisões tardias.",
		"yellow12": "Perguntas abertas durante execução consomem memória, ampliam ambiguidade e atrasam decisões importantes.",
		"study": "Antes de estudar, definir objetivo, material, questão-alvo, duração, critério de conclusão e próxima revisão.",
		"work": "Antes de produzir, definir objetivo, entrada, saída, dependências, definição de pronto, prazo e evidência.",
		"functions": [
			{
				"name": "Memória de trabalho",
				"detail": "sustentar múltiplas variáveis durante execução."
			},
			{
				"name": "Planejamento",
				"detail": "esclarecer objetivo, critérios e sequência antes de começar."
			},
			{
				"name": "Metacognição",
				"detail": "identificar lacunas antes que virem interrupções."
			}
		],
		"vulnerability": "Manter objetivo, restrições, critérios e decisões em aberto enquanto a execução já começou.",
		"risk": "Interrupções decisórias, ambiguidade e sobrecarga de memória durante a execução.",
		"technique": "Intake pré-execução + externalização de critérios",
		"steps": [
			"Preencher objetivo, escopo, critérios, datas e evidências antes de começar.",
			"Transformar lacunas em campos A DEFINIR, sem decidir silenciosamente durante a execução.",
			"Liberar execução somente quando as variáveis mínimas estiverem fechadas."
		],
		"metrics": [
			{
				"label": "Perguntas descobertas no meio",
				"direction": "down"
			},
			{
				"label": "Decisões repetidas",
				"direction": "down"
			},
			{
				"label": "Critérios definidos antes",
				"direction": "up"
			},
			{
				"label": "Tempo até primeira ação",
				"direction": "down"
			}
		],
		"evidenceStatus": "MECANISMOS APOIADOS",
		"refs": [
			"burnett2026",
			"toli2016"
		]
	},
	{
		"id": "RC-SOL-005",
		"name": "Plano Operacional Rastreável",
		"slug": "plano-operacional-rastreavel",
		"pain": "Várias frentes, prioridades, dependências e riscos permanecem ativos ao mesmo tempo; fica difícil convertê-los em uma ordem executável sem perder contexto.",
		"yellow12": "Muitas frentes sem dependências explícitas aumentam sobrecarga, conflito e execução desordenada diária.",
		"study": "Transformar prova ou trabalho em entregas pequenas, dependências, ordem e uma próxima ação; registrar evidência de conclusão.",
		"work": "Mapear entregáveis, dependências, riscos, critérios e capacidade; executar uma unidade desbloqueada por vez.",
		"functions": [
			{
				"name": "Planejamento",
				"detail": "decompor objetivo e ordenar dependências."
			},
			{
				"name": "Memória de trabalho",
				"detail": "não sustentar todo o plano internamente."
			},
			{
				"name": "Controle inibitório",
				"detail": "proteger a prioridade e evitar abrir frentes concorrentes."
			}
		],
		"vulnerability": "Objetivos amplos permanecem simultaneamente ativos, sem decomposição, dependências, capacidade e critério de conclusão explícitos.",
		"risk": "Sobrecarga, paralelismo excessivo, ordem incorreta e conclusão apenas declarada.",
		"technique": "Decomposição rastreável + dependências + próxima ação única",
		"steps": [
			"Converter objetivos em tarefas observáveis com critério de conclusão.",
			"Ordenar dependências, capacidade, riscos e gates antes da execução.",
			"Selecionar exatamente uma próxima ação desbloqueada e registrar evidência ao concluir."
		],
		"metrics": [
			{
				"label": "WIP concorrente",
				"direction": "down"
			},
			{
				"label": "Dependências explícitas",
				"direction": "up"
			},
			{
				"label": "Conclusões verificadas",
				"direction": "up"
			},
			{
				"label": "Tempo decidindo o que fazer",
				"direction": "down"
			}
		],
		"evidenceStatus": "COMPONENTES APOIADOS",
		"refs": [
			"boonstra2005",
			"solanto2010",
			"liu2026"
		]
	},
	{
		"id": "RC-SOL-006",
		"name": "Scroll Task",
		"slug": "scroll-task",
		"pain": "Ao abrir um projeto aparecem itens demais; escolher, alternar e reconstruir contexto consome esforço antes mesmo de a próxima ação avançar.",
		"yellow12": "Excesso visual e alternância frequente fragmentam atenção, contexto e continuidade da execução.",
		"study": "Uma questão ou exercício por vez, com bloco de tempo e contexto mínimo; registrar onde retomar.",
		"work": "Uma ação ativa por viewport; interrupções ficam registradas fora do foco e a mudança ocorre apenas deliberadamente.",
		"functions": [
			{
				"name": "Controle inibitório",
				"detail": "manter a unidade ativa apesar de alternativas visíveis."
			},
			{
				"name": "Memória de trabalho",
				"detail": "preservar o contexto da ação atual."
			},
			{
				"name": "Iniciação",
				"detail": "tornar inequívoca a próxima ação executável."
			}
		],
		"vulnerability": "Múltiplas unidades competem visualmente; cada troca exige reconfiguração de objetivo, regras e contexto.",
		"risk": "Troca excessiva de contexto, paralelismo e atraso para iniciar a próxima ação.",
		"technique": "Uma unidade por viewport + WIP 1:1 + timer",
		"steps": [
			"Mostrar somente uma ação central, curta e inequívoca.",
			"Executar com timer previsto; demais unidades ficam fora do foco principal.",
			"Concluir, adiar ou avançar deliberadamente; tempo esgotado nunca equivale a concluído."
		],
		"metrics": [
			{
				"label": "Trocas manuais de contexto",
				"direction": "down"
			},
			{
				"label": "Tempo até iniciar",
				"direction": "down"
			},
			{
				"label": "Conclusões por sessão",
				"direction": "up"
			},
			{
				"label": "Retomadas sem contexto",
				"direction": "down"
			}
		],
		"evidenceStatus": "EVIDÊNCIA INDIRETA",
		"refs": [
			"kiesel2010",
			"senkowski2024",
			"boonstra2005"
		]
	}
];

export const solutionBySlug = (slug: string) => SOLUTIONS.find((s) => s.slug === slug);
