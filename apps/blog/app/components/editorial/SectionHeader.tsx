import { ArrowRight } from "lucide-react";

export function SectionHeader({
	eyebrow,
	title,
	id,
	href,
	linkLabel = "Ver todos",
	level = 2,
}: {
	eyebrow?: string;
	title: string;
	id?: string;
	href?: string;
	linkLabel?: string;
	level?: 2 | 3;
}) {
	const H = `h${level}` as "h2" | "h3";
	return (
		<div className="flex flex-wrap items-end justify-between gap-4">
			<div>
				{eyebrow && <p className="rc-eyebrow">{eyebrow}</p>}
				<H id={id} className="rc-title mt-2 text-2xl sm:text-3xl">
					{title}
				</H>
			</div>
			{href && (
				<a href={href} className="rc-link inline-flex items-center gap-1.5 text-sm">
					{linkLabel} <ArrowRight className="size-4" aria-hidden="true" />
				</a>
			)}
		</div>
	);
}
