// A folha A4 do Prisma (RC-PWA-PRISMA-FRD-001 §6). É a mesma folha no preview e na impressão:
// 210 × 297 mm, margem de 10 mm, sempre clara (papel), só com tokens --ps-* de global.css.
// O texto do usuário entra como texto React (escapado): nenhum HTML digitado é executado (FR-019).
import { A_DEFINIR, type PrismaData } from "./schema";

const CHAIN: { key: keyof PrismaData; label: string; fallback?: boolean }[] = [
	{ key: "contexto", label: "Contexto" },
	{ key: "demanda_principal", label: "Demanda" },
	{ key: "atrito_principal", label: "Atrito" },
	{ key: "compensacao", label: "Compensação", fallback: true },
];

export function PrismaSheet({ data, generatedAt }: { data: PrismaData; generatedAt: string }) {
	const priorities = [data.prioridade_1, data.prioridade_2, data.prioridade_3].filter(Boolean);
	return (
		<article className="prisma-sheet" aria-labelledby="prisma-sheet-title">
			<header className="prisma-sheet__head">
				<p className="prisma-sheet__brand">Risco Cognitivo</p>
				<h2 id="prisma-sheet-title" className="prisma-sheet__title">
					Prisma de execução
				</h2>
				{data.nome && <p className="prisma-sheet__name">{data.nome}</p>}
			</header>

			<dl className="prisma-sheet__goal">
				<div className="prisma-sheet__goal-main">
					<dt>Objetivo</dt>
					<dd>{data.objetivo}</dd>
				</div>
				<div>
					<dt>Horizonte</dt>
					<dd>{data.horizonte}</dd>
				</div>
				<div>
					<dt>Tempo disponível</dt>
					<dd>{data.tempo_disponivel || A_DEFINIR}</dd>
				</div>
			</dl>

			<ol className="prisma-sheet__chain" aria-label="Do contexto à ação">
				{CHAIN.map((step) => (
					<li key={step.key} className="prisma-sheet__step">
						<span className="prisma-sheet__label">{step.label}</span>
						<p>{data[step.key] || (step.fallback ? A_DEFINIR : "")}</p>
					</li>
				))}
				<li className="prisma-sheet__step prisma-sheet__step--action">
					<span className="prisma-sheet__label">Próxima ação</span>
					<p>{data.proxima_acao}</p>
				</li>
			</ol>

			<div className="prisma-sheet__cols">
				<section aria-labelledby="prisma-prioridades">
					<h3 id="prisma-prioridades" className="prisma-sheet__label">
						Prioridades
					</h3>
					<ol className="prisma-sheet__prio">
						{priorities.map((p, i) => (
							<li key={i}>{p}</li>
						))}
					</ol>
				</section>
				<section aria-labelledby="prisma-bloqueios">
					<h3 id="prisma-bloqueios" className="prisma-sheet__label">
						Bloqueios
					</h3>
					<p>{data.bloqueios || A_DEFINIR}</p>
				</section>
			</div>

			<footer className="prisma-sheet__foot">
				<p>Gerado em {generatedAt}. Organiza as informações que você forneceu; não é diagnóstico nem avaliação clínica.</p>
				<p className="prisma-sheet__brand">Risco Cognitivo · Prisma</p>
			</footer>
		</article>
	);
}
