// /login/ preservada: o blog não tem contas de leitor; conteúdo é aberto.
import { ArrowRight } from "lucide-react";

import type { Route } from "./+types/login";

import { IMAGES } from "@/components/editorial/HeroArt";
import { PageHero } from "@/components/editorial/PageHero";
import { buttonVariants } from "@/components/ui/button";
import DefaultLayout from "@/layouts/DefaultLayout";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const meta: Route.MetaFunction = ({ location }) =>
	seo({
		title: "Acesso",
		description: "O Risco Cognitivo não exige conta para leitura.",
		pathname: location.pathname,
		noindex: true,
	});

export default function Page() {
	return (
		<DefaultLayout>
			<PageHero
				eyebrow="Acesso"
				title="Não é preciso entrar"
				lead="O blog não tem contas de leitor: artigos, mapas, guias e evidências são abertos."
				image={IMAGES.maoChaves}
			>
				<div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
					<a href="/blog/" className={cn(buttonVariants({ size: "lg" }), "gap-2")}>
						Ler os artigos <ArrowRight className="size-4" aria-hidden="true" />
					</a>
					<a href="/signup/" className="rc-link">
						Receber novidades
					</a>
				</div>
			</PageHero>
		</DefaultLayout>
	);
}
