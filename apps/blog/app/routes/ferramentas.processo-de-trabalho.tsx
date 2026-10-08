import type { Route } from "./+types/ferramentas.processo-de-trabalho";

import { PageHead } from "@/components/ds";
import { SITE_NAME } from "@/consts";
import DefaultLayout from "@/layouts/DefaultLayout";
import { seo } from "@/lib/seo";

const DESCRIPTION = "Protótipo demonstrativo do Mini App EXECUTAR para planejar um processo de trabalho e visualizar o Prisma.";

export const meta: Route.MetaFunction = ({ location }) => seo({ title: "Processo de Trabalho + Prisma", description: DESCRIPTION, pathname: location.pathname });

export default function ProcessoDeTrabalho() {
	return (
		<DefaultLayout>
			<div className="ds-page">
				<PageHead
					eyebrow={`${SITE_NAME} · Protótipo demonstrativo`}
					title="Processo de Trabalho + Prisma"
					lead="Teste o fluxo de planejamento e alterne entre a visualização do processo e a folha Prisma."
					notice="Esta é uma demonstração interativa. PWA instalável, persistência local e geração de QR funcional ainda não estão implementados."
				/>
				<section className="ds-section" aria-label="Protótipo interativo">
					<iframe
						title="Protótipo demonstrativo do Mini App EXECUTAR — Processo de Trabalho e Prisma"
						src="/miniapp-prisma/preview-app.html"
						loading="eager"
						style={{ width: "100%", height: "min(82vh, 960px)", minHeight: 680, border: "1px solid var(--cf-border)", borderRadius: 16, background: "#f5f6f8" }}
					/>
				</section>
			</div>
		</DefaultLayout>
	);
}
