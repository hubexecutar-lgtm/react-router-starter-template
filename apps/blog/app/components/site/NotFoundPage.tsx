import { ArrowRight } from "lucide-react";

import { PageHero } from "@/components/editorial/PageHero";
import { buttonVariants } from "@/components/ui/button";
import DefaultLayout from "@/layouts/DefaultLayout";
import { cn } from "@/lib/utils";

/** Conteúdo do 404: usado pela rota catch-all e pelos artigos com slug inexistente. */
export function NotFoundPage() {
	return (
		<DefaultLayout>
			<PageHero
				eyebrow="Erro 404"
				title="Página não encontrada"
				lead="O endereço não existe ou mudou de lugar."
			>
				<div className="mt-8">
					<a href="/" className={cn(buttonVariants({ size: "lg" }), "gap-2")}>
						Ir para a página inicial <ArrowRight className="size-4" aria-hidden="true" />
					</a>
				</div>
			</PageHero>
		</DefaultLayout>
	);
}
