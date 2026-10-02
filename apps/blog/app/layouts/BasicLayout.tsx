// Página de texto corrido (Markdown/MDX em content/pages), ex.: /privacy/.
import type { ReactNode } from "react";

import DefaultLayout from "@/layouts/DefaultLayout";

export default function BasicLayout({
	title,
	description,
	eyebrow,
	children,
}: {
	title?: string;
	description?: string;
	eyebrow?: string;
	children: ReactNode;
}) {
	return (
		<DefaultLayout>
			<section className="container max-w-3xl pt-12 pb-8 lg:pt-20">
				{eyebrow && <p className="rc-eyebrow">{eyebrow}</p>}
				{title && <h1 className="rc-display mt-4 text-4xl sm:text-5xl lg:text-6xl">{title}</h1>}
				{description && <p className="rc-lead mt-6 text-lg sm:text-xl">{description}</p>}
			</section>
			<article className="prose prose-lg dark:prose-invert prose-headings:rc-title container max-w-3xl" data-plain-page>
				{children}
			</article>
		</DefaultLayout>
	);
}
