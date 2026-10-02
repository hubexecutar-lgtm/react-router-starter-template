// Evidências (mood board 06): registros reais EVD-RC-* do banco editorial, sem exemplos ilustrativos.
import type { Route } from "./+types/evidencias";

import { EvidenceTable } from "@/components/editorial/EvidenceTable";
import { PageHero } from "@/components/editorial/PageHero";
import { SURFACE } from "@/components/editorial/surface";
import { PlainTextPanel } from "@/components/plain";
import seed from "@/data/editorial/seed.json";
import DefaultLayout from "@/layouts/DefaultLayout";
import { EVIDENCE } from "@/lib/editorial";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const meta: Route.MetaFunction = ({ location }) =>
	seo({
		title: "Evidências",
		description: "Fontes do Risco Cognitivo: estudos, normas e guias com autor, ano, link e o que cada uma sustenta.",
		pathname: location.pathname,
	});

const classes = seed.vocab.classeEpistemica as string[];
const count = (c: string) => EVIDENCE.filter((e) => e.epistemicClass === c).length;
const CLASS_TEXT: Record<string, string> = {
	"A · Observado": "visto diretamente em campo",
	"B · Primário": "fonte original: estudo, norma ou guia institucional",
	"C · Publicado": "livro ou texto profissional publicado",
	"D · Interno": "definição ou decisão do próprio framework",
	"E · Inferido": "conclusão derivada de outras fontes",
};
const PROCESS = `PERGUNTA      o que precisa ser sustentado?
   │
   ▼
BUSCA         fonte original → instituição → pesquisa → secundária confiável
   │
   ▼
REGISTRO      EVD-RC-NNNN: autor, ano, URL, o que sustenta, classe
   │
   ▼
LEITURA       citar só o que a fonte demonstra; limites no texto`;

export default function Page() {
	return (
		<DefaultLayout>
			<PageHero
				id="evid-title"
				eyebrow="Evidências"
				title="Da pergunta à evidência"
				lead="Cada afirmação central dos artigos aponta para um registro deste banco. Aqui estão todos, com o que cada fonte sustenta — e o que ela não sustenta."
				seed={19}
			/>

			<section className="container grid gap-10 lg:grid-cols-[1.8fr_1fr] lg:gap-14 [&>*]:min-w-0" aria-label="Banco de evidências">
				<div className="min-w-0">
					<p className="rc-meta mb-4">{EVIDENCE.length} registros · atualizados pelo Hub Editorial</p>
					<EvidenceTable items={EVIDENCE} caption="Banco de evidências do Risco Cognitivo" />
				</div>
				<aside className="flex flex-col gap-6">
					<PlainTextPanel
						id="EVIDENCE-PROCESS-001"
						kind="procedure"
						title="Como registramos"
						source={PROCESS}
						density="compact"
						fontSize="sm"
					/>
					<div className={cn(SURFACE, "p-6")}>
						<p className="rc-eyebrow">Classes epistêmicas</p>
						<dl className="mt-4 space-y-3 text-sm">
							{classes.map((c) => (
								<div key={c}>
									<dt className="font-medium">
										{c} <span className="rc-meta ml-1">{count(c)}</span>
									</dt>
									<dd className="text-muted-foreground">{CLASS_TEXT[c] ?? ""}</dd>
								</div>
							))}
						</dl>
					</div>
				</aside>
			</section>
		</DefaultLayout>
	);
}
