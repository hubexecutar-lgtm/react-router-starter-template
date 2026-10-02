import type { ReactNode } from "react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
// Copy buttons of PlainTextPanel / AsciiDiagram (ADR-05): delegated listener, bound on
// module load in the browser (no-op on the server).
import "@/lib/plain/copy";

export default function DefaultLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<a
				href="#conteudo"
				className="bg-primary text-primary-foreground sr-only z-[60] rounded-md px-4 py-2 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
			>
				Pular para o conteúdo
			</a>
			<SiteHeader />
			<main id="conteudo">{children}</main>
			<SiteFooter />
		</>
	);
}
