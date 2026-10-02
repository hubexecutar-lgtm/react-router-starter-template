import type { ReactNode } from "react";

export function PageHero({
	eyebrow,
	title,
	lead,
	id = "page-title",
	children,
}: {
	eyebrow: string;
	title: string;
	lead?: string;
	id?: string;
	children?: ReactNode;
}) {
	return (
		<section className="container pt-12 pb-10 lg:pt-20" aria-labelledby={id}>
			<p className="rc-eyebrow">{eyebrow}</p>
			<h1 id={id} className="rc-display mt-4 text-5xl sm:text-6xl lg:text-7xl">
				{title}
			</h1>
			{lead && <p className="rc-lead mt-5 max-w-3xl text-lg sm:text-xl">{lead}</p>}
			{children}
		</section>
	);
}
