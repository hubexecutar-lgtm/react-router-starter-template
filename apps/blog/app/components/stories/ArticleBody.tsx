// Corpo do artigo (Editorial Hybrid v4, ADR-22): coluna de leitura de 637,5 px (.hy-article), 17/27,999, h2 com régua
// de ação e h3 em 27. O MDX do autor fica intacto: o `# título` dele vira nulo porque o h1 já está no cabeçalho;
// painéis plain text e diagramas vêm do próprio MDX e mantêm a tipografia deles.
import type { ComponentType } from "react";

import type { MDXContent } from "@/lib/articles";

const components: Record<string, ComponentType<any>> = { h1: () => null };

export function ArticleBody({ Content }: { Content: MDXContent }) {
	return (
		<div className="px-[var(--ref-gutter)] pt-[var(--hy-section)]" data-article-body>
			<div className="hy-article">
				<Content components={components} />
			</div>
		</div>
	);
}
