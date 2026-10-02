// Link de texto com chevron (anatomia Apple Developer Programs: "Learn more ›"), ADR-12.
// O movimento do chevron só acontece com prefers-reduced-motion: no-preference.
import type { ReactNode } from "react";

import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export function ChevronLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
	return (
		<a href={href} className={cn("rc-link group inline-flex min-h-6 items-center gap-1", className)}>
			{children}
			<ChevronRight
				className="size-4 shrink-0 transition-transform motion-safe:group-hover:translate-x-0.5"
				aria-hidden="true"
			/>
		</a>
	);
}
