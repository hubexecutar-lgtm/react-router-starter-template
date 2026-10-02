// /signup/ preservada: inscrição na newsletter (mood board 07), desativada até haver provedor.
import type { Route } from "./+types/signup";

import { NewsletterNotice } from "@/components/editorial/NewsletterNotice";
import { PageHero } from "@/components/editorial/PageHero";
import DefaultLayout from "@/layouts/DefaultLayout";
import { seo } from "@/lib/seo";

export const meta: Route.MetaFunction = ({ location }) =>
	seo({
		title: "Receber novidades",
		description: "Inscrição na newsletter do Risco Cognitivo.",
		pathname: location.pathname,
		noindex: true,
	});

export default function Page() {
	return (
		<DefaultLayout>
			<PageHero
				eyebrow="Receba novos guias"
				title="Conteúdo prático no seu e-mail"
				lead="Novos artigos, modelos e guias para aplicar o framework no dia a dia."
			/>
			<section className="container max-w-3xl">
				<NewsletterNotice />
			</section>
		</DefaultLayout>
	);
}
