// Texto da home RC-HOME-002 (HOME-BRAIN-001), do esboço risco-cognitivo-home-css-v4.html, sem reescrita.
// Canônico: docs/lancamento/LANC-001/intake/HOME-002/RC_HOME_002.txt. tests/editorial.spec.ts compara a home com ele,
// linha a linha: mudar um texto aqui exige mudar o canônico (e o MANIFEST.sha256 do intake) no mesmo PR.
// Os seletores do cérebro usam os IDs do grafo (app/data/graph/rc-graph.json); o mapa abre com ?foco=<ID>.

export const HOME_ID = "RC-HOME-002";

export const HOME_HERO = {
	eyebrow: "Gestão e Controle de Riscos Cognitivos",
	title: "Você sabe o que precisa fazer, mas nem sempre consegue transformar intenção em execução?",
	lead: [
		"O tempo escapa. As prioridades se acumulam. Uma tarefa simples vira várias. Você começa, interrompe, retoma e perde o ponto em que estava.",
		"Para algumas pessoas, essas dificuldades podem estar relacionadas às demandas de planejar, organizar, iniciar, lembrar, controlar distrações e adaptar um plano.",
	],
	cta: "Explorar o mapa",
};

export type HomeSource = { id: string; label: string; url: string };

/** Fontes primárias dos números da home, conferidas em 2026-10-05 (listadas também em /fontes/). */
export const HOME_SOURCES: HomeSource[] = [
	{
		id: "SRC-HOME-IBGE-CENSO-2022-TEA",
		label: "IBGE — Censo Demográfico 2022: pessoas com diagnóstico de autismo",
		url: "https://educa.ibge.gov.br/jovens/materias-especiais/22700-censo-2022-contou-2-4-milhoes-de-pessoas-diagnosticadas-com-autismo-no-brasil.html",
	},
	{
		id: "SRC-HOME-SONG-2021-ADHD",
		label:
			"Song P. et al. (2021). The prevalence of adult attention-deficit hyperactivity disorder: A global systematic review and meta-analysis. Journal of Global Health, 11:04009",
		url: "https://doi.org/10.7189/jogh.11.04009",
	},
];

export const HOME_STATS = {
	heading: "Milhões de pessoas convivem com condições associadas a diferenças no funcionamento executivo",
	lead: "Isso não significa que todas as pessoas tenham os mesmos déficits — nem que uma condição determine como alguém irá funcionar.",
	cards: [
		{ tag: "Brasil", strong: "2,4 milhões", text: "de pessoas declararam diagnóstico de autismo no Censo 2022 — 1,2% da população.", source: HOME_SOURCES[0] },
		{ tag: "Mundo", strong: "366 milhões", text: "de adultos com TDAH sintomático em 2020, segundo uma meta-análise internacional.", source: HOME_SOURCES[1] },
	],
	closing:
		"Para milhões de pessoas, pode ser útil compreender como memória de trabalho, controle inibitório, planejamento, flexibilidade e autorregulação interagem com as exigências da vida real.",
};

export const HOME_RISK = {
	heading: "O que é um risco cognitivo?",
	lead: "Um risco cognitivo aparece quando aquilo que uma tarefa exige encontra um ponto de vulnerabilidade e aumenta a chance de alguma coisa dar errado.",
	examples: [
		{
			title: "Exemplo 1: quando a memória é sobrecarregada",
			chain: ["Lembrar várias etapas", "Memória de trabalho", "Sobrecarga", "Etapa esquecida", "Erro, atraso ou retrabalho"],
		},
		{
			title: "Exemplo 2: quando há muitas distrações",
			chain: ["Estímulos concorrentes", "Controle inibitório", "Interrupções vencem a prioridade", "Mudança repetida de atividade", "Trabalho demora mais ou permanece incompleto"],
		},
	],
	closing: "Isso é o que chamamos, neste método, de risco cognitivo.",
};

export type HomeFunction = {
	/** Nó COGNITIVE_CAPACITY do grafo. */
	id: string;
	label: string;
	summary: string;
	demand: string;
	difficulty: string;
	strategy: string;
	/** Posição do marcador sobre a figura (% da largura e da altura), como no esboço. Conceitual, não anatômica. */
	marker: { x: number; y: number; side: "left" | "right" };
};

export const HOME_MAP = {
	eyebrow: "Mapa interativo",
	heading: "Entenda sua execução.",
	lead: "Explore as relações entre funções executivas, demandas e estratégias.",
	note: "Os marcadores são seletores conceituais e não representam localização anatômica isolada das funções.",
	defaultId: "COG-PLANEJAMENTO",
	functions: [
		{
			id: "COG-PLANEJAMENTO",
			label: "Planejamento",
			summary: "Define metas, organiza passos e prioriza ações.",
			demand: "organizar etapas e decidir por onde começar.",
			difficulty: "começa, para, muda de direção e perde sequência.",
			strategy: "dividir em passos visíveis, priorizar um foco e revisar o próximo passo.",
			marker: { x: 20, y: 29, side: "left" },
		},
		{
			id: "COG-MEMORIA-TRABALHO",
			label: "Memória de trabalho",
			summary: "Mantém e manipula informações no curto prazo.",
			demand: "manter informações ativas enquanto executa uma sequência.",
			difficulty: "perde instruções, esquece etapas e precisa reconstruir o raciocínio.",
			strategy: "externalizar passos, reduzir informação simultânea e usar pistas visuais.",
			marker: { x: 18, y: 62, side: "left" },
		},
		{
			id: "COG-CONTROLE-INIBITORIO",
			label: "Controle inibitório",
			summary: "Ajuda a focar e evitar distrações.",
			demand: "proteger a prioridade diante de estímulos concorrentes.",
			difficulty: "interrupções vencem a prioridade e provocam trocas repetidas de atividade.",
			strategy: "reduzir gatilhos, explicitar a próxima ação e criar pausas antes da troca.",
			marker: { x: 82, y: 36, side: "right" },
		},
		{
			id: "COG-FLEXIBILIDADE",
			label: "Flexibilidade cognitiva",
			summary: "Permite adaptar estratégias e lidar com mudanças.",
			demand: "mudar estratégia quando contexto, regra ou prioridade se altera.",
			difficulty: "insiste na mesma abordagem ou trava quando o plano deixa de funcionar.",
			strategy: "preparar alternativas, explicitar critérios de troca e revisar o contexto.",
			marker: { x: 82, y: 67, side: "right" },
		},
	] satisfies HomeFunction[],
};

export const HOME_PILLARS = [
	{ n: "01", title: "Entenda", text: "Conheça as funções executivas e como elas influenciam sua execução no dia a dia.", href: "/artigos/riscos-cognitivos/" },
	{ n: "02", title: "Estruture", text: "Relacione demandas, vulnerabilidades e estratégias de apoio com base em evidências.", href: "/artigos/processos-neuroadaptativos/" },
	{ n: "03", title: "Execute", text: "Aplique sistemas simples para reduzir o custo cognitivo e aumentar sua consistência.", href: "/ferramentas/" },
];

export const HOME_REQUIREMENTS = {
	heading: "Seu planejamento pode estar correto — e ainda assim existir um risco na execução",
	lead: "Além de perguntar o que fazer e quando fazer, vale perguntar: quais capacidades cognitivas esse plano exige de mim para realmente funcionar?",
	columns: ["Para executar", "Pode exigir"] as const,
	rows: [
		["Começar", "iniciação e autorregulação"],
		["Organizar", "planejamento e memória de trabalho"],
		["Priorizar", "raciocínio e controle executivo"],
		["Manter o foco", "controle inibitório"],
		["Lembrar etapas", "memória de trabalho"],
		["Perceber erros", "metacognição"],
		["Mudar o plano", "flexibilidade cognitiva"],
		["Continuar diante da dificuldade", "autocontrole e persistência"],
	] as const,
	closing: "É aqui que a gestão de riscos encontra as funções executivas.",
};

export const HOME_PROBLEMS = {
	heading: "Transforme dificuldades abstratas em problemas concretos",
	cards: [
		{
			title: "“Minha vida é uma bagunça”",
			rows: [
				["Situação", "organização diária."],
				["O que acontece", "tarefas deixam de ser registradas ou priorizadas."],
				["Exigência", "planejamento, memória de trabalho e monitoramento."],
				["Risco", "esquecimento, sobrecarga e perda de prazo."],
				["Estratégia", "externalização cognitiva, checklist, agenda visual ou sistema único de tarefas."],
			],
		},
		{
			title: "“O tempo simplesmente escapa”",
			rows: [
				["Dor", "perda da percepção do andamento da atividade."],
				["Demanda", "monitoramento temporal."],
				["Risco", "permanecer tempo excessivo em uma tarefa."],
				["Impacto", "atrasar as tarefas seguintes."],
				["Estratégia", "marcos, temporizadores e checkpoints."],
			],
		},
		{
			title: "“Tenho vários objetivos, mas abandono quando fica difícil”",
			rows: [["Investigue", "demanda → função → gatilho → comportamento → consequência. Só então escolha uma intervenção."]],
		},
	] as { title: string; rows: [string, string][] }[],
};

export const HOME_METHOD = {
	heading: "Gestão e Controle de Riscos Cognitivos",
	lead: "A proposta é simples: não esperar a dificuldade acontecer para só então tentar corrigi-la.",
	steps: [
		{ title: "O que você precisa realizar", text: "Qual é o objetivo?" },
		{ title: "O que essa atividade exige cognitivamente", text: "Planejamento? Memória? Inibição? Flexibilidade? Monitoramento?" },
		{ title: "Onde existe maior vulnerabilidade", text: "Em quais situações você costuma perder tempo, esquecer, abandonar, interromper ou se sobrecarregar?" },
		{ title: "Qual é o risco operacional", text: "O que pode acontecer com o objetivo?" },
		{ title: "O que pode ser feito antes", text: "Que estratégia, ferramenta ou modificação reduz essa demanda?" },
		{ title: "O resultado", text: "A estratégia realmente diminuiu erros, atrasos, interrupções ou sobrecarga?" },
	],
	chain: ["Dor", "Demanda", "Função executiva", "Vulnerabilidade", "Risco", "Estratégia", "Controle", "Progresso"],
};

export const HOME_SUPPORT = {
	heading: "Não dependa apenas da sua cabeça",
	lead: "Uma das estratégias investigadas por este projeto é a externalização cognitiva: transferir informações importantes para sistemas externos.",
	listTitle: "Você não precisa manter apenas na memória:",
	items: ["Prazos", "Próximas ações", "Prioridades", "Decisões", "Horários", "Estado do trabalho"],
	examples: "Calendários, listas, lembretes, agendas visuais e sistemas únicos de tarefas são exemplos de apoio externo.",
	caveat:
		"Externalizar intenções pode apoiar a memória prospectiva, embora o benefício dependa da tarefa e não substitua necessariamente aprendizagem ou memória interna.",
};

export const HOME_FINAL = {
	heading: "Entenda → Estruture → Execute.",
	lead: "Comece por uma dificuldade concreta, identifique a demanda cognitiva, antecipe o risco e teste um apoio verificável.",
	cta: "Explorar funções executivas",
	note: "Risco Cognitivo · EXECUTAR — Conteúdo educacional e operacional; não substitui avaliação clínica.",
};
