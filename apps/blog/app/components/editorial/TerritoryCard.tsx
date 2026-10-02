import { ArrowRight } from "lucide-react";

import { SURFACE_LINK } from "./surface";

import { type Territory, territoryHref } from "@/lib/editorial";
import { cn } from "@/lib/utils";

export function TerritoryCard({ territory, count }: { territory: Territory; count?: number }) {
	return (
		<article className={cn("group relative flex h-full flex-col p-5", SURFACE_LINK)}>
			<p className="rc-eyebrow flex items-center justify-between gap-2">
				<span>
					{territory.id.replace("TAX-RC-", "")} · {territory.role}
				</span>
				{count !== undefined && (
					<span>
						{count} {count === 1 ? "artigo" : "artigos"}
					</span>
				)}
			</p>
			<h3 className="rc-title mt-3 text-lg">
				<a
					href={territoryHref(territory)}
					className="after:absolute after:inset-0 after:rounded-[var(--surface-radius-card)] focus-visible:underline"
				>
					{territory.name}
				</a>
			</h3>
			<p className="text-muted-foreground mt-2 text-sm leading-relaxed">{territory.question}</p>
			<span className="rc-link mt-auto inline-flex items-center gap-1.5 pt-4 text-sm group-hover:underline">
				Explorar tema <ArrowRight className="size-4" aria-hidden="true" />
			</span>
		</article>
	);
}
