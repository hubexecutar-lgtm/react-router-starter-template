import type { Route } from "./+types/prisma";

import { PrismaApp } from "@/features/prisma/PrismaApp";
import { PrismaIntro } from "@/features/prisma/PrismaIntro";
import DefaultLayout from "@/layouts/DefaultLayout";
import { seo } from "@/lib/seo";

// Primeira solução da Loja (RC-PWA-PRISMA-ADR-001): formulário → folha A4 → PDF, local-first.
// `handle.manifest` troca o Web App Manifest do site pelo da rota (start_url e scope em /prisma/).
export const handle = { manifest: "/prisma/manifest.webmanifest" };

export const meta: Route.MetaFunction = ({ location }) =>
	seo({
		title: "Prisma de execução",
		description:
			"Preencha um formulário, veja seu contexto, demanda, atrito, compensação e próxima ação organizados numa folha A4 e exporte em PDF. Funciona offline e não envia seus dados.",
		pathname: location.pathname,
	});

export default function Prisma() {
	return (
		<DefaultLayout>
			<PrismaApp intro={<PrismaIntro />} />
		</DefaultLayout>
	);
}
