// Layout for operational reports (REPORT-GENERATOR-CONTRACT-001): Markdown narrative
// + PlainTextPanel + AsciiDiagram, with the blog's editorial typography.
import type { ReactNode } from "react";

import DefaultLayout from "@/layouts/DefaultLayout";

export default function ReportLayout({ eyebrow, children }: { eyebrow?: string; children: ReactNode }) {
	return (
		<DefaultLayout>
			<section className="py-28 lg:pt-44 lg:pb-32">
				<div className="container max-w-5xl">
					{eyebrow && (
						<p className="text-muted-foreground mx-auto max-w-2xl text-sm font-medium">
							<a href="/admin" className="hover:text-foreground underline-offset-4 hover:underline">
								Painel
							</a>{" "}
							/ {eyebrow}
						</p>
					)}
					<article
						className="prose prose-lg dark:prose-invert prose-headings:font-medium prose-headings:tracking-tight prose-headings:text-foreground prose-h1:text-4xl md:prose-h1:text-5xl prose-h2:text-primary prose-h2:text-3xl md:prose-h2:text-4xl prose-headings:break-words prose-p:text-muted-foreground prose-p:font-medium prose-li:text-muted-foreground prose-li:font-medium prose-strong:text-foreground prose-a:text-primary prose-table:block prose-table:overflow-x-auto mx-auto mt-4 max-w-2xl"
						data-report
					>
						{children}
					</article>
				</div>
			</section>
		</DefaultLayout>
	);
}
