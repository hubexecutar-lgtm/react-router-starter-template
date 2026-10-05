import type { ReactNode } from "react";

import { BottomBar } from "@/components/site/BottomBar";
import { CategoryRail } from "@/components/site/CategoryRail";
import { MobileDrawer } from "@/components/site/MobileDrawer";
import { ShellProvider, useShell } from "@/components/site/shell";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
// Copy buttons of PlainTextPanel / AsciiDiagram (ADR-05): delegated listener, bound on
// module load in the browser (no-op on the server).
import "@/lib/plain/copy";

// Shell (LANC-001 PR-C + Editorial Hybrid v4, ADR-22): cabeçalho, faixa de categorias, drawer e barra inferior no mobile.
function Shell({ children }: { children: ReactNode }) {
	const { drawerOpen } = useShell();
	// Com o drawer aberto, o resto da página fica inert (RQ-023). Sem wrapper: o cabeçalho continua
	// filho direto do body (landmark banner).
	const inert = drawerOpen ? { inert: true } : {};
	return (
		<>
			<a
				href="#conteudo"
				className="bg-primary text-primary-foreground sr-only z-[60] rounded-md px-4 py-2 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
				{...inert}
			>
				Pular para o conteúdo
			</a>
			<SiteHeader inert={drawerOpen} />
			<CategoryRail inert={drawerOpen} />
			<main id="conteudo" {...inert}>
				{children}
			</main>
			<SiteFooter inert={drawerOpen} />
			<BottomBar inert={drawerOpen} />
			{/* espaço da barra inferior fixa no mobile */}
			<div className="h-[calc(var(--bottombar-h)+env(safe-area-inset-bottom))] min-[900px]:hidden" aria-hidden="true" />
			<MobileDrawer />
		</>
	);
}

export default function DefaultLayout({ children }: { children: ReactNode }) {
	return (
		<ShellProvider>
			<Shell>{children}</Shell>
		</ShellProvider>
	);
}
