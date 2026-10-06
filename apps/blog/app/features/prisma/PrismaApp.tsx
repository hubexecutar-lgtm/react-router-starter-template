// Rota /prisma (RC-PWA-PRISMA-ADR-001): INTRO → FORM → PREVIEW → exportar por window.print().
// Local-first: o estado vive em memória; o localStorage só é usado se a pessoa ligar "Salvar neste
// dispositivo". Nenhum conteúdo do formulário é enviado pela rede (nem por analytics).
// A visão vem do hash (#formulario, #prisma): o botão voltar funciona e a introdução continua sendo o
// HTML pré-renderizado.
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import { Download, Eraser, FileDown, Pencil } from "lucide-react";

import { PRISMA_MAP_HREF } from "./PrismaIntro";
import { PrismaSheet } from "./PrismaSheet";
import {
	EMPTY,
	FIELDS,
	GROUPS,
	HORIZONTES,
	clear,
	firstInvalid,
	formatGenerated,
	load,
	normalize,
	save,
	validate,
	type Errors,
	type FieldDef,
	type PrismaData,
} from "./schema";

import { Button, Card, CardGrid, Check, ConfirmDialog, Input, SectionHead, Select, Textarea } from "@/components/ds";
import { TOOL_CORRELATIONS } from "@/features/store/data/correlations";
import { track } from "@/lib/analytics/track";

type View = "intro" | "form" | "preview";

const SHEET_W = 794; // 210 mm a 96 dpi
const SHEET_H = 1123; // 297 mm a 96 dpi

const viewFromHash = (): View => (window.location.hash === "#formulario" ? "form" : window.location.hash === "#prisma" ? "preview" : "intro");

const TITLES: Record<View, string> = { intro: "", form: "Preencha seu Prisma", preview: "Revise seu Prisma" };

// Próxima ação (ADR-BLOG-JORNADA-ROTAS-001 §2.2): só destinos reais, lidos da Teia. As soluções publicadas que
// compartilham a compensação do Prisma em TOOL_CORRELATIONS (ADR-M04), o nó no Mapa e o guia público.
const PRISMA_REFS = new Set((TOOL_CORRELATIONS.find((t) => t.id === "prisma")?.refs.compensation_refs ?? []).map((r) => r.ref));
const RELATED_TOOLS = TOOL_CORRELATIONS.filter((t) => t.id !== "prisma" && (t.refs.compensation_refs ?? []).some((r) => PRISMA_REFS.has(r.ref)));

type BeforeInstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

/** Registra o service worker da rota e entrega a ele os arquivos que a página já carregou (cache offline). */
function useOffline() {
	const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
	useEffect(() => {
		const onPrompt = (e: Event) => {
			e.preventDefault();
			setInstallEvent(e as BeforeInstallPromptEvent);
		};
		window.addEventListener("beforeinstallprompt", onPrompt);
		const secure = window.isSecureContext;
		if (secure && "serviceWorker" in navigator) {
			navigator.serviceWorker
				.register("/prisma/sw.js", { scope: "/prisma/" })
				.then(() => navigator.serviceWorker.ready)
				.then((reg) => {
					const urls = new Set<string>();
					document.querySelectorAll<HTMLElement>("script[src], link[rel=stylesheet], link[rel=modulepreload]").forEach((el) => {
						const u = (el as HTMLScriptElement).src || (el as HTMLLinkElement).href;
						if (u && new URL(u).origin === location.origin) urls.add(u);
					});
					performance.getEntriesByType("resource").forEach((r) => {
						if (new URL(r.name).origin === location.origin) urls.add(r.name);
					});
					reg.active?.postMessage({ type: "CACHE_URLS", urls: [...urls] });
				})
				.catch(() => {
					/* sem service worker o fluxo continua funcionando online */
				});
		}
		return () => window.removeEventListener("beforeinstallprompt", onPrompt);
	}, []);
	return {
		canInstall: installEvent !== null,
		install: async () => {
			if (!installEvent) return;
			await installEvent.prompt();
			setInstallEvent(null);
		},
	};
}

/** Escala a folha de 210 mm para caber na largura disponível (o preview é fiel à impressão). */
function useFit(active: boolean) {
	const ref = useRef<HTMLDivElement>(null);
	const [scale, setScale] = useState(1);
	useEffect(() => {
		const el = ref.current;
		if (!active || !el) return;
		const update = () => setScale(Math.min(1, el.clientWidth / SHEET_W));
		update();
		const ro = new ResizeObserver(update);
		ro.observe(el);
		return () => ro.disconnect();
	}, [active]);
	return { ref, scale };
}

export function PrismaApp({ intro }: { intro: ReactNode }) {
	const [view, setView] = useState<View>("intro");
	const [data, setData] = useState<PrismaData>(EMPTY);
	const [errors, setErrors] = useState<Errors>({});
	const [saveOn, setSaveOn] = useState(false);
	const [hydrated, setHydrated] = useState(false);
	const [status, setStatus] = useState("");
	const [generatedAt, setGeneratedAt] = useState("");
	const headingRef = useRef<HTMLHeadingElement>(null);
	const lastView = useRef<View>("intro");
	const baseTitle = useRef("");
	const { canInstall, install } = useOffline();
	const fit = useFit(view === "preview");

	// Rascunho salvo neste dispositivo (opt-in) e visão inicial vinda do hash.
	useEffect(() => {
		baseTitle.current = document.title;
		const saved = load();
		if (saved) {
			setData(saved);
			setSaveOn(true);
			setStatus("Rascunho carregado deste dispositivo.");
		}
		setView(viewFromHash());
		setHydrated(true);
		const onHash = () => setView(viewFromHash());
		window.addEventListener("hashchange", onHash);
		return () => window.removeEventListener("hashchange", onHash);
	}, []);

	useEffect(() => {
		if (hydrated && saveOn) save(data);
	}, [data, saveOn, hydrated]);

	// O preview só existe com os campos obrigatórios; sem eles a pessoa volta ao formulário (FR-005, FR-007).
	useEffect(() => {
		if (!hydrated || view !== "preview") return;
		const found = validate(normalize(data));
		if (Object.keys(found).length) {
			setErrors(found);
			window.location.replace("#formulario");
			return;
		}
		setGeneratedAt(formatGenerated(new Date()));
	}, [view, hydrated]);

	// Foco no título da nova visão (WCAG 2.4.3) e título da aba.
	useEffect(() => {
		if (!hydrated) return;
		const changed = lastView.current !== view;
		lastView.current = view;
		document.title = view === "intro" ? baseTitle.current : `${TITLES[view]} · ${baseTitle.current}`;
		if (changed) {
			window.scrollTo({ top: 0, behavior: "instant" });
			const h = headingRef.current ?? document.querySelector<HTMLElement>("#introducao h1");
			if (h && !h.hasAttribute("tabindex")) h.setAttribute("tabindex", "-1");
			h?.focus({ preventScroll: true });
		}
	}, [view, hydrated]);

	const set = useCallback((key: keyof PrismaData, value: string) => {
		setData((d) => ({ ...d, [key]: value }));
		setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
	}, []);

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		const clean = normalize(data);
		const found = validate(clean);
		setErrors(found);
		const first = firstInvalid(found);
		if (first) {
			document.getElementById(`prisma-${first}`)?.focus();
			setStatus(`${Object.keys(found).length} campo(s) para corrigir.`);
			return;
		}
		setData(clean);
		setStatus("");
		window.location.hash = "#prisma";
	};

	const toggleSave = (on: boolean) => {
		setSaveOn(on);
		if (on) {
			const ok = save(data);
			setStatus(ok ? "Rascunho salvo neste dispositivo." : "Não foi possível salvar neste dispositivo. Você pode continuar sem salvar.");
			if (!ok) setSaveOn(false);
		} else {
			clear();
			setStatus("Rascunho removido deste dispositivo.");
		}
	};

	const wipe = () => {
		setData(EMPTY);
		setErrors({});
		setSaveOn(false);
		clear();
		setStatus("Dados apagados deste dispositivo.");
		window.location.hash = "#formulario";
	};

	const SaveControls = (
		<div className="ds-toolbar" data-split="">
			<Check label="Salvar neste dispositivo" checked={saveOn} onChange={(e) => toggleSave(e.target.checked)} />
			<ConfirmDialog
				trigger={
					<Button variant="ghost">
						<Eraser size={18} aria-hidden="true" /> Limpar dados
					</Button>
				}
				title="Apagar tudo o que você preencheu?"
				text="O formulário volta a ficar vazio e a cópia salva neste dispositivo é removida. Não dá para desfazer."
				confirm="Apagar dados"
				cancel="Manter dados"
				onConfirm={wipe}
			/>
		</div>
	);

	const hasErrors = Object.keys(errors).some((k) => errors[k as keyof Errors]);

	return (
		<>
			<p role="status" aria-live="polite" className="sr-only">
				{status}
			</p>

			{view === "intro" && intro}

			{view === "form" && (
				<section className="ds-page ds-tool prisma-noprint" aria-labelledby="prisma-view-title">
					<header className="ds-pagehead ds-tool-head">
						<p className="ds-eyebrow">Passo 1 de 3 · Preencha</p>
						<h1 id="prisma-view-title" ref={headingRef} tabIndex={-1}>
							{TITLES.form}
						</h1>
						<p className="ds-pagehead-lead">Escreva com as suas palavras. Campos opcionais que ficarem vazios aparecem como “A DEFINIR” na folha.</p>
						<p className="ds-tool-note" style={{ marginTop: 12 }}>
							Seus dados ficam neste dispositivo. Nada é enviado para a internet.
						</p>
					</header>

					<form noValidate onSubmit={submit} className="ds-tool-body">
						{hasErrors && (
							<div role="alert" className="ds-alert">
								<p className="ds-alert-title">Falta preencher alguns campos.</p>
								<p>A folha precisa deles. Use os links para ir a cada campo.</p>
								<ul>
									{FIELDS.filter((f) => errors[f.key]).map((f) => (
										<li key={f.key}>
											<a
												href={`#prisma-${f.key}`}
												onClick={(ev) => {
													ev.preventDefault();
													document.getElementById(`prisma-${f.key}`)?.focus();
												}}
											>
												{errors[f.key]}
											</a>
										</li>
									))}
								</ul>
							</div>
						)}

						{GROUPS.map((g) => (
							<fieldset key={g.id} className="ds-fieldset">
								<legend>{g.title}</legend>
								<p className="ds-fieldset-lead">{g.lead}</p>
								<div className="ds-fieldset-body">
									{FIELDS.filter((f) => f.group === g.id).map((f) => (
										<PrismaField key={f.key} def={f} value={data[f.key]} error={errors[f.key]} onChange={(v) => set(f.key, v)} />
									))}
								</div>
							</fieldset>
						))}

						<div className="ds-toolbar">
							<Button type="submit" size="lg" data-cta="primary">
								Ver meu Prisma
							</Button>
							<Button href="#introducao" variant="ghost">
								Voltar ao início
							</Button>
						</div>
						{SaveControls}
					</form>
				</section>
			)}

			{view === "preview" && (
				<section className="ds-page ds-tool" data-width="wide" aria-labelledby="prisma-view-title">
					<div className="prisma-noprint">
						<header className="ds-pagehead ds-tool-head">
							<p className="ds-eyebrow">Passos 2 e 3 de 3 · Revise e exporte</p>
							<h1 id="prisma-view-title" ref={headingRef} tabIndex={-1}>
								{TITLES.preview}
							</h1>
							<p className="ds-pagehead-lead">Esta é a folha que sai no PDF. Se algo estiver errado, volte e edite: seus dados continuam aqui.</p>
							<div className="ds-toolbar" style={{ marginTop: 24 }}>
								<Button
									size="lg"
									data-cta="primary"
									onClick={() => {
										// RQ-111: resultado gerado; o conteúdo da folha nunca entra no evento.
										track({ stage: "RESULT", action: "complete", asset_id: "prisma" });
										window.print();
									}}
								>
									<FileDown size={18} aria-hidden="true" /> Exportar PDF
								</Button>
								<Button href="#formulario" variant="outline" size="lg">
									<Pencil size={18} aria-hidden="true" /> Editar
								</Button>
							</div>
							<p className="ds-tool-note" style={{ marginTop: 12 }}>
								No diálogo de impressão, escolha “Salvar como PDF”.
							</p>
							<div style={{ marginTop: 16 }}>{SaveControls}</div>
						</header>
					</div>

					<div ref={fit.ref} className="prisma-stage" style={{ width: "100%", maxWidth: SHEET_W, marginInline: "auto", height: SHEET_H * fit.scale }}>
						<div className="prisma-fit" style={{ width: SHEET_W, height: SHEET_H, transform: `scale(${fit.scale})`, transformOrigin: "top left" }}>
							<PrismaSheet data={normalize(data)} generatedAt={generatedAt} />
						</div>
					</div>

					<section className="prisma-noprint" style={{ marginTop: "var(--cf-section-gap)" }} aria-labelledby="proxima-acao" data-next-action>
						<SectionHead
							id="proxima-acao"
							label="Depois da folha"
							heading="Próxima ação"
							lead="Com a folha pronta, continue por uma ferramenta ou conteúdo ligado à externalização cognitiva."
							align="left"
						/>
						<CardGrid cols={3}>
							{RELATED_TOOLS.map((t) => (
								<Card key={t.id} href={t.href} eyebrow="Solução relacionada" title={t.name} text="Usa a mesma compensação do Prisma na Teia." cta="Abrir" />
							))}
							<Card href={PRISMA_MAP_HREF} eyebrow="Mapa Cognitivo" title="Externalização no Mapa" text="Veja causas, impactos e soluções ligados a esta compensação." cta="Abrir no Mapa" />
							<Card href="/artigos/riscos-cognitivos-guia/" eyebrow="Blog" title="Guia: riscos cognitivos" text="Entenda os riscos que o Prisma ajuda a organizar." cta="Ler artigo" />
						</CardGrid>
					</section>
				</section>
			)}

			{canInstall && view !== "preview" && (
				<div className="ds-container prisma-noprint" style={{ paddingBottom: 48 }}>
					<Button variant="outline" onClick={install}>
						<Download size={18} aria-hidden="true" /> Instalar no dispositivo
					</Button>
				</div>
			)}
		</>
	);
}

/** Campo do Prisma: anatomia `ds-field` do DS com IDs estáveis (`prisma-<campo>`), DS-CF-001-prisma §1.1. */
function PrismaField({ def, value, error, onChange }: { def: FieldDef; value: string; error?: string; onChange: (v: string) => void }) {
	const id = `prisma-${def.key}`;
	const describedBy = [def.hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;
	const shared = { id, name: def.key, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy, "aria-required": def.required || undefined } as const;
	return (
		<div className="ds-field">
			<label htmlFor={id} className="ds-field-label">
				{def.label}
				{def.required ? <span className="ds-field-req"> (obrigatório)</span> : null}
			</label>
			{def.hint && (
				<p id={`${id}-hint`} className="ds-field-help">
					{def.hint}
				</p>
			)}
			{def.kind === "textarea" ? (
				<Textarea {...shared} rows={3} maxLength={def.max} value={value} onChange={(e) => onChange(e.target.value)} />
			) : def.kind === "select" ? (
				<Select {...shared} value={value} onChange={(e) => onChange(e.target.value)}>
					<option value="">Escolha uma opção</option>
					{HORIZONTES.map((h) => (
						<option key={h} value={h}>
							{h}
						</option>
					))}
				</Select>
			) : (
				<Input {...shared} type="text" maxLength={def.max} value={value} onChange={(e) => onChange(e.target.value)} />
			)}
			<div className="ds-field-foot">
				<p id={`${id}-error`} className="ds-field-error">
					{error}
				</p>
				{def.kind !== "select" && (
					<span className="ds-field-count" aria-hidden="true">
						{value.length}/{def.max}
					</span>
				)}
			</div>
		</div>
	);
}
