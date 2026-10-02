import type { Route } from "./+types/admin._index";

import DefaultLayout from "@/layouts/DefaultLayout";
import { seo } from "@/lib/seo";

const links = [
	{
		href: "/admin/design-system",
		label: "Design System",
		description: "Mood board, storyboard, tokens, callouts, dados, plain text e todos os componentes.",
	},
	{
		href: "/admin/rotas/",
		label: "Rotas e links (QR)",
		description: "Hub de todas as rotas e links do projeto, com QR Code. Toda nova rota entra aqui.",
	},
	{
		href: "/admin/relatorio-exemplo/",
		label: "Relatório de exemplo",
		description: "Relatório composto com Markdown, PlainTextPanel e AsciiDiagram (ADR-05).",
	},
	{
		href: "/admin/handoff/",
		label: "Handoff — Knowledge Work Skills",
		description: "Estado da adaptação de HANDOFF-KNOWLEDGE-WORK-SKILLS-001 e da campanha de copy.",
	},
	{
		href: "/blog",
		label: "Blog",
		description: "Artigos publicados no site — conteúdo editorial do Risco Cognitivo.",
	},
	{
		href: "/hub-editorial/",
		label: "Hub Editorial",
		description: "Painel de gestão do pipeline editorial (Risco Cognitivo).",
	},
	{
		href: "/skills/",
		label: "Catálogo de Skills EXECUTAR",
		description: "Catálogo navegável de skills do ecossistema EXECUTAR, com busca e filtros.",
	},
	{
		href: "/catalogo-offline/",
		label: "Catálogo EXECUTAR (offline)",
		description: "Versão offline do catálogo de skills, com detalhamento 3P por item.",
	},
];

export const meta: Route.MetaFunction = ({ location }) =>
	seo({
		title: "Painel",
		description: "Painel de acesso ao blog e às ferramentas do ecossistema EXECUTAR.",
		pathname: location.pathname,
	});

export default function Admin() {
	return (
		<DefaultLayout>
			<div className="pt-12 pb-20 lg:pt-20 lg:pb-28">
				<div className="container">
					<div className="mb-10 flex items-center justify-between">
						<h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Painel</h1>
					</div>
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						{links.map((link) => (
							<a
								key={link.href}
								href={link.href}
								className="rc-cell rc-surface text-card-foreground flex flex-col gap-2 p-6 transition-colors hover:bg-[var(--surface-hover)]"
							>
								<span className="text-sm font-medium tracking-tight">{link.label}</span>
								<span className="text-muted-foreground text-sm">{link.description}</span>
							</a>
						))}
					</div>
				</div>
			</div>
		</DefaultLayout>
	);
}
