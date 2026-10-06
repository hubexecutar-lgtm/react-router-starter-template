// Corpo do artigo no RC-DS-CF (ADR-26, DS-CF-001 §4.8): `ds-prose` com medida de 68ch. O MDX do autor fica intacto: o
// `# título` vira nulo porque o h1 está no cabeçalho; painéis plain text e diagramas vêm do próprio MDX
// (@/components/plain, pele do DS) e as tabelas Markdown viram a tabela empilhada do DS.
import type { ComponentType } from "react";

import { ArticleTable } from "./ArticleTable";

import type { MDXContent } from "@/lib/articles";

const components: Record<string, ComponentType<any>> = { h1: () => null, table: ArticleTable };

export function ArticleBody({ Content }: { Content: MDXContent }) {
	return (
		<div className="ds-prose" data-article-body>
			<Content components={components} />
		</div>
	);
}
