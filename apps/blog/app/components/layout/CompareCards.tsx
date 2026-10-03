// Cards de comparação (anatomia Apple Developer Programs, "Explore benefits"): duas opções lado a
// lado em células, com subtítulo, lista de benefícios e ação.
import { Check } from "lucide-react";

import { ChevronLink } from "./ChevronLink";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CompareOption = {
	title: string;
	subtitle: string;
	benefits: string[];
	cta: { href: string; label: string };
	more?: { href: string; label: string };
};

export function CompareCards({ options }: { options: CompareOption[] }) {
	return (
		<div className="grid gap-[var(--table-gap)] md:grid-cols-2">
			{options.map((o, i) => (
				<article key={o.title} className="rc-cell rc-surface flex flex-col p-6 sm:p-8">
					<h3 className="rc-title text-[length:var(--text-h3)]">{o.title}</h3>
					<p className="rc-eyebrow mt-2">{o.subtitle}</p>
					<ul className="mt-6 space-y-3">
						{o.benefits.map((b) => (
							<li key={b} className="flex gap-3">
								<Check className="text-primary mt-1 size-4 shrink-0" aria-hidden="true" />
								<span>{b}</span>
							</li>
						))}
					</ul>
					{o.more && (
						<div className="mt-6">
							<ChevronLink href={o.more.href}>{o.more.label}</ChevronLink>
						</div>
					)}
					<div className="mt-auto pt-8">
						<a
							href={o.cta.href}
							className={cn(buttonVariants({ size: "lg", variant: i === 0 ? "default" : "outline" }), "w-full")}
						>
							{o.cta.label}
						</a>
					</div>
				</article>
			))}
		</div>
	);
}
