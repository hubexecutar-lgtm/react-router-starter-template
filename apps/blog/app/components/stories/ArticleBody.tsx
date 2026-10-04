// Corpo do artigo (handoff): coluna de leitura de 637,5 px centralizada, h2 46,8432/54,2918, corpo 17/27,999,
// parágrafos separados por 24 px e blocos separados por 120 px. O MDX do autor fica intacto: o `# título`
// dele vira nulo aqui porque o h1 já está no hero; painéis plain text e diagramas vêm do próprio MDX.
import type { ComponentProps, ComponentType } from "react";

import type { MDXContent } from "@/lib/articles";

const h2 = (props: ComponentProps<"h2">) => (
	<h2 {...props} className="stories-h2 mt-[var(--ref-section-gap)] mb-[var(--ref-block-gap)] first:mt-0" />
);
const p = (props: ComponentProps<"p">) => <p {...props} className="stories-body mb-[var(--ref-block-gap)]" />;
const ul = (props: ComponentProps<"ul">) => (
	<ul {...props} className="stories-body mb-[var(--ref-block-gap)] list-disc space-y-2 pl-6" />
);
const ol = (props: ComponentProps<"ol">) => (
	<ol {...props} className="stories-body mb-[var(--ref-block-gap)] list-decimal space-y-2 pl-6" />
);
const a = (props: ComponentProps<"a">) => (
	<a {...props} className="text-primary underline underline-offset-4 hover:no-underline" />
);
const strong = (props: ComponentProps<"strong">) => <strong {...props} className="font-semibold" />;

const components: Record<string, ComponentType<any>> = { h1: () => null, h2, p, ul, ol, a, strong };

export function ArticleBody({ Content }: { Content: MDXContent }) {
	return (
		<div className="stories-container pt-[var(--ref-section-gap)]" data-article-body>
			<div className="mx-auto max-w-[var(--ref-reading-width)]">
				<Content components={components} />
			</div>
		</div>
	);
}
