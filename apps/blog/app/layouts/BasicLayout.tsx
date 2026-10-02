import type { ReactNode } from "react";

import { Footer } from "@/components/blocks/footer";
import { Navbar } from "@/components/blocks/navbar";

export default function BasicLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<Navbar />
			<main>
				<section className="mx-auto max-w-2xl px-4 py-28 lg:pt-44 lg:pb-32">
					<article className="prose prose-lg dark:prose-invert">{children}</article>
				</section>
			</main>
			<Footer />
		</>
	);
}
