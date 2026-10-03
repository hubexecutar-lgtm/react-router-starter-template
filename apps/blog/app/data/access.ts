// Opções de acesso (cards de comparação): uma só fonte de copy para /pricing/ e a comparação final
// da home (AUD-WEB-001-11). Textos da marca, sem preço inventado.
import type { CompareOption } from "@/components/layout/CompareCards";

export const ACCESS_OPTIONS: CompareOption[] = [
	{
		title: "Ler o Risco Cognitivo",
		subtitle: "Aberto · sem cadastro",
		benefits: [
			"Todos os artigos e ensaios do framework",
			"Mapas, guias e o modelo de análise para copiar",
			"Banco de evidências com autor, ano e link",
			"Feed RSS para acompanhar novas publicações",
		],
		cta: { href: "/blog/", label: "Ler os artigos" },
		more: { href: "/rss.xml", label: "Assinar o RSS" },
	},
	{
		title: "Produtos EXECUTAR",
		subtitle: "Catálogo de exemplo",
		benefits: [
			"Skills, agentes e prompts para aplicar o método",
			"E-books, PDFs e workbooks derivados dos artigos",
			"Ferramentas HTML e assets de apoio",
		],
		cta: { href: "/loja/", label: "Ver a loja" },
	},
];
