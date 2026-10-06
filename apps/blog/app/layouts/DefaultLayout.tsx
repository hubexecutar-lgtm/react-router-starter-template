import type { ReactNode } from "react";

import { BottomBar } from "@/components/site/BottomBar";
import { MobileDrawer } from "@/components/site/MobileDrawer";
import { ShellProvider, useShell } from "@/components/site/shell";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
// Copy buttons of PlainTextPanel / AsciiDiagram (ADR-05): delegated listener, bound on
// module load in the browser (no-op on the server).
import "@/lib/plain/copy";

// Shell (LANC-001 PR-C, ADR-25/26): cabeçalho e rodapé no padrão da cloudflare.com, drawer e barra inferior no mobile, todos
// no RC-DS-CF. A trilha dos pilares saiu do site (ADR-26); o rodapé-diretório tem a coluna "Jornada". O skip link usa
// `ds-skip` (DS-CF-001-prisma §2.8).
function Shell({ children }: { children: ReactNode }) {
	const { drawerOpen } = useShell();
	// Com o drawer aberto, o resto da página fica inert (RQ-023). Sem wrapper: o cabeçalho continua
	// filho direto do body (landmark banner).
	const inert = drawerOpen ? { inert: true } : {};
	return (
		<>
			<a
				href="#conteudo"
				className="ds-skip sr-only"
				{...inert}
			>
				Pular para o conteúdo
			</a>
			<SiteHeader inert={drawerOpen} />
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
