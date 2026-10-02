import type { ReactNode } from "react";

import { Footer } from "@/components/blocks/footer";
import { Navbar } from "@/components/blocks/navbar";
// Copy buttons of PlainTextPanel / AsciiDiagram (ADR-05): delegated listener, bound on
// module load in the browser (no-op on the server).
import "@/lib/plain/copy";

export default function DefaultLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<Navbar />
			<main>{children}</main>
			<Footer />
		</>
	);
}
