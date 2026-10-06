// Layout de relatório operacional (REPORT-GENERATOR-CONTRACT-001) no RC-DS-CF (ADR-26, DS-CF-001-admin §1): PageHead com o
// título e a descrição do frontmatter, e o MDX no corpo de leitura do artigo (ArticleBody: `ds-prose`, tabela empilhada,
// PlainTextPanel e AsciiDiagram na pele do DS). O `# título` do MDX vira nulo porque o h1 está no PageHead. Só o admin usa.
import { ArticleBody } from "@/components/article/ArticleBody";
import { PageHead } from "@/components/ds";
import DefaultLayout from "@/layouts/DefaultLayout";
import type { MDXContent } from "@/lib/articles";

export type ReportFrontmatter = { title: string; description: string; eyebrow?: string };

export default function ReportLayout({ fm, Content }: { fm: ReportFrontmatter; Content: MDXContent }) {
	return (
		<DefaultLayout>
			<div className="ds-page">
				<PageHead
					crumbs={[{ label: "Painel", href: "/admin/" }, { label: fm.eyebrow ?? fm.title }]}
					eyebrow={fm.eyebrow}
					title={fm.title}
					lead={fm.description}
					notice="Relatório interno no design system novo; o texto vem do MDX sem reescrita."
				/>
				<div className="ds-reading pb-24" data-report>
					<ArticleBody Content={Content} />
				</div>
			</div>
		</DefaultLayout>
	);
}
