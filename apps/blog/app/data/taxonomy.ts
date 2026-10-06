// Taxonomia única com facetas distintas (ADR-BLOG-JORNADA-ROTAS-001 §3, ADR-26). O mesmo vocabulário classifica artigos,
// itens do catálogo e entradas do mapa; cada faceta tem significado próprio. "Neurodivergência" é tema guarda-chuva:
// não supõe que todas as pessoas compartilhem a mesma condição ou necessidade. Filtro do Blog por ?tema=<id>; páginas
// próprias de tema só existem quando houver conteúdo, taxonomia e requisito de SEO definidos (nenhuma rota vazia).
export type FacetId = "perfis" | "funcoes" | "dominios" | "contextos";

export const FACETS: { id: FacetId; label: string; values: { id: string; label: string }[] }[] = [
	{
		id: "perfis",
		label: "Neurodivergências e perfis",
		values: [
			{ id: "neurodivergencia", label: "Neurodivergência" },
			{ id: "tdah", label: "TDAH" },
			{ id: "dislexia", label: "Dislexia" },
			{ id: "altas-habilidades", label: "Altas habilidades" },
		],
	},
	{
		id: "funcoes",
		label: "Funções cognitivas",
		values: [
			{ id: "funcoes-executivas", label: "Funções executivas" },
			{ id: "memoria-de-trabalho", label: "Memória de trabalho" },
			{ id: "controle-inibitorio", label: "Controle inibitório" },
			{ id: "flexibilidade-cognitiva", label: "Flexibilidade cognitiva" },
		],
	},
	{
		id: "dominios",
		label: "Domínios de conhecimento",
		values: [
			{ id: "gestao-de-projetos", label: "Gestão de projetos" },
			{ id: "gestao-de-processos", label: "Gestão de processos" },
			{ id: "tecnologia-e-ia", label: "Tecnologia e IA" },
		],
	},
	{
		id: "contextos",
		label: "Contextos",
		values: [
			{ id: "rotina", label: "Rotina" },
			{ id: "trabalho", label: "Trabalho" },
			{ id: "estudos", label: "Estudos" },
		],
	},
];

/**
 * Facetas dos artigos públicos, por slug. Só entra o que o próprio texto sustenta: o guia trata de funções executivas
 * (memória de trabalho, controle inibitório, flexibilidade), cita TDAH adulto (Boonstra 2005, Song 2021) e autismo
 * (IBGE 2025) e tem rotina, estudos e trabalho no título.
 */
export const ARTICLE_FACETS: Record<string, string[]> = {
	"riscos-cognitivos-guia": [
		"neurodivergencia",
		"tdah",
		"funcoes-executivas",
		"memoria-de-trabalho",
		"controle-inibitorio",
		"flexibilidade-cognitiva",
		"rotina",
		"estudos",
		"trabalho",
	],
};

export const facetValue = (id: string) => FACETS.flatMap((f) => f.values).find((v) => v.id === id);
