// Painel interno (ADR-26, DS-CF-001-admin §1): PageHead + uma grade de cards, um por ferramenta interna. Noindex.
import { FileText, LayoutGrid, ListChecks, Palette, QrCode } from "lucide-react";

import type { Route } from "./+types/admin._index";

import { Card, CardGrid, PageHead } from "@/components/ds";
import DefaultLayout from "@/layouts/DefaultLayout";
import { seo } from "@/lib/seo";

const links = [
	{
		href: "/admin/design-system/",
		label: "Design System",
		description: "Showroom do RC-DS-CF: tokens, componentes, variantes, estados, acessibilidade e do/don't.",
		icon: Palette,
	},
	{
		href: "/admin/rotas/",
		label: "Rotas e links (QR)",
		description: "Hub de todas as rotas e links do projeto, com QR Code. Toda nova rota entra aqui.",
		icon: QrCode,
	},
	{
		href: "/admin/relatorio-exemplo/",
		label: "Relatório de exemplo",
		description: "Relatório composto com Markdown, PlainTextPanel e AsciiDiagram (ADR-05).",
		icon: FileText,
	},
	{
		href: "/admin/stories-fixtures/",
		label: "Fixtures de artigo",
		description: "Componentes do template de artigo com dados sintéticos, para conferir grade, sumário, meta e estados.",
		icon: LayoutGrid,
	},
	{
		href: "/admin/handoff/",
		label: "Handoff — Knowledge Work Skills",
		description: "Estado da adaptação de HANDOFF-KNOWLEDGE-WORK-SKILLS-001 e da campanha de copy.",
		icon: ListChecks,
	},
];

export const meta: Route.MetaFunction = ({ location }) =>
	seo({
		title: "Painel",
		description: "Painel interno do site.",
		pathname: location.pathname,
		noindex: true,
	});

export default function Admin() {
	return (
		<DefaultLayout>
			<div className="ds-page">
				<PageHead
					eyebrow="Interno"
					title="Painel"
					lead="Ferramentas internas do site: design system, rotas, relatórios e fixtures. Nenhuma destas páginas é indexada."
					notice="Painel interno no design system novo; os links abrem as ferramentas reais."
				/>
				<div className="ds-container pb-24">
					<CardGrid cols={3} label="Ferramentas internas" data-admin-links="">
						{links.map(({ href, label, description, icon: Icon }) => (
							<Card key={href} href={href} icon={<Icon size={24} strokeWidth={1.6} />} title={label} text={description} cta="Abrir" headingLevel={2} data-admin-card="" />
						))}
					</CardGrid>
				</div>
			</div>
		</DefaultLayout>
	);
}
