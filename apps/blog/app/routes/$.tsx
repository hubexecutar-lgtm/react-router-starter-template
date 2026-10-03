import { ArrowRight } from "lucide-react";
import { data } from "react-router";

import type { Route } from "./+types/$";

import { PageHero } from "@/components/editorial/PageHero";
import { buttonVariants } from "@/components/ui/button";
import DefaultLayout from "@/layouts/DefaultLayout";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

// Catch-all: every unknown path renders the 404 page with a 404 status.
export function loader() {
	return data(null, { status: 404 });
}

export const meta: Route.MetaFunction = ({ location }) =>
	seo({
		title: "Página não encontrada",
		description: "O endereço procurado não existe ou mudou.",
		pathname: location.pathname,
		noindex: true,
	});

export default function NotFound() {
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
