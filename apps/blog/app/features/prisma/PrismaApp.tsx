// Rota /prisma (RC-PWA-PRISMA-ADR-001): INTRO → FORM → PREVIEW → exportar por window.print().
// Local-first: o estado vive em memória; o localStorage só é usado se a pessoa ligar "Salvar neste
// dispositivo". Nenhum conteúdo do formulário é enviado pela rede (nem por analytics).
// A visão vem do hash (#formulario, #prisma): o botão voltar funciona e a introdução continua sendo o
// HTML pré-renderizado.
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import { Download, Eraser, FileDown, Pencil } from "lucide-react";

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

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type View = "intro" | "form" | "preview";

const SHEET_W = 794; // 210 mm a 96 dpi
const SHEET_H = 1123; // 297 mm a 96 dpi

const viewFromHash = (): View => (window.location.hash === "#formulario" ? "form" : window.location.hash === "#prisma" ? "preview" : "intro");

const TITLES: Record<View, string> = { intro: "", form: "Preencha seu Prisma", preview: "Revise seu Prisma" };

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
			const h = headingRef.current ?? document.getElementById("prisma-view-title");
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
		<div className="flex flex-wrap items-center gap-x-6 gap-y-3">
			<label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
				<input
					type="checkbox"
					className="accent-primary size-5"
					checked={saveOn}
					onChange={(e) => toggleSave(e.target.checked)}
				/>
				<span>Salvar neste dispositivo</span>
			</label>
			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Button type="button" variant="ghost" className="min-h-11">
						<Eraser aria-hidden="true" /> Limpar dados
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Apagar tudo o que você preencheu?</AlertDialogTitle>
						<AlertDialogDescription>O formulário volta a ficar vazio e a cópia salva neste dispositivo é removida. Não dá para desfazer.</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancelar</AlertDialogCancel>
						<AlertDialogAction onClick={wipe}>Apagar dados</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);

	return (
		<>
			<p role="status" aria-live="polite" className="sr-only">
				{status}
			</p>

			{view === "intro" && intro}

			{view === "form" && (
				<section className="container max-w-3xl pt-12 pb-16 lg:pt-16 prisma-noprint" aria-labelledby="prisma-view-title">
					<p className="rc-eyebrow">Passo 1 de 3 · Preencha</p>
					<h1 id="prisma-view-title" ref={headingRef} tabIndex={-1} className="rc-display mt-3 text-[length:var(--text-h2)] outline-none">
						{TITLES.form}
					</h1>
					<p className="rc-lead mt-4">Escreva com as suas palavras. Campos opcionais que ficarem vazios aparecem como “A DEFINIR” na folha.</p>
					<p className="text-muted-foreground mt-3 text-sm">Seus dados ficam neste dispositivo. Nada é enviado para a internet.</p>

					<form noValidate onSubmit={submit} className="mt-10 space-y-12">
						{Object.keys(errors).some((k) => errors[k as keyof Errors]) && (
							<div role="alert" className="rc-cell rc-surface border-l-4 p-5" style={{ borderColor: "var(--destructive)" }}>
								<p className="font-semibold">Falta preencher alguns campos.</p>
								<ul className="mt-2 list-disc pl-5 text-sm">
									{FIELDS.filter((f) => errors[f.key]).map((f) => (
										<li key={f.key}>
											<a className="text-primary underline underline-offset-4" href={`#prisma-${f.key}`} onClick={(ev) => { ev.preventDefault(); document.getElementById(`prisma-${f.key}`)?.focus(); }}>
												{errors[f.key]}
											</a>
										</li>
									))}
								</ul>
							</div>
						)}

						{GROUPS.map((g) => (
							<fieldset key={g.id} className="min-w-0">
								<legend className="rc-title text-[length:var(--text-h3)]">{g.title}</legend>
								<p className="text-muted-foreground mt-1 mb-6 text-sm">{g.lead}</p>
								<div className="grid gap-6">
									{FIELDS.filter((f) => f.group === g.id).map((f) => (
										<Field key={f.key} def={f} value={data[f.key]} error={errors[f.key]} onChange={(v) => set(f.key, v)} />
									))}
								</div>
							</fieldset>
						))}

						<div className="flex flex-wrap items-center gap-4">
							<Button type="submit" size="lg" className="min-h-12 px-8 text-base">
								Ver meu Prisma
							</Button>
							<Button asChild variant="ghost" className="min-h-11">
								<a href="#introducao">Voltar ao início</a>
							</Button>
						</div>
						{SaveControls}
					</form>
				</section>
			)}

			{view === "preview" && (
				<section className="container pt-12 pb-16 lg:pt-16" aria-labelledby="prisma-view-title">
					<div className="prisma-noprint mx-auto max-w-3xl">
						<p className="rc-eyebrow">Passos 2 e 3 de 3 · Revise e exporte</p>
						<h1 id="prisma-view-title" ref={headingRef} tabIndex={-1} className="rc-display mt-3 text-[length:var(--text-h2)] outline-none">
							{TITLES.preview}
						</h1>
						<p className="rc-lead mt-4">Esta é a folha que sai no PDF. Se algo estiver errado, volte e edite: seus dados continuam aqui.</p>
						<div className="mt-6 flex flex-wrap items-center gap-3">
							<Button type="button" size="lg" className="min-h-12 px-6" onClick={() => window.print()}>
								<FileDown aria-hidden="true" /> Exportar PDF
							</Button>
							<Button asChild variant="outline" size="lg" className="min-h-12 px-6">
								<a href="#formulario">
									<Pencil aria-hidden="true" /> Editar
								</a>
							</Button>
						</div>
						<p className="text-muted-foreground mt-3 text-sm">No diálogo de impressão, escolha “Salvar como PDF”.</p>
						<div className="mt-6">{SaveControls}</div>
					</div>

					<div ref={fit.ref} className="prisma-stage mx-auto mt-10 w-full" style={{ maxWidth: SHEET_W, height: SHEET_H * fit.scale }}>
						<div className="prisma-fit" style={{ width: SHEET_W, height: SHEET_H, transform: `scale(${fit.scale})`, transformOrigin: "top left" }}>
							<PrismaSheet data={normalize(data)} generatedAt={generatedAt} />
						</div>
					</div>
				</section>
			)}

			{canInstall && view !== "preview" && (
				<div className="container pb-12 prisma-noprint">
					<Button type="button" variant="outline" className="min-h-11" onClick={install}>
						<Download aria-hidden="true" /> Instalar no dispositivo
					</Button>
				</div>
			)}
		</>
	);
}

function Field({ def, value, error, onChange }: { def: FieldDef; value: string; error?: string; onChange: (v: string) => void }) {
	const id = `prisma-${def.key}`;
	const describedBy = [def.hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;
	const shared = { id, name: def.key, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy, "aria-required": def.required || undefined } as const;
	return (
		<div>
			<Label htmlFor={id} className="text-base font-semibold">
				{def.label}
				{def.required ? <span className="text-muted-foreground font-normal"> (obrigatório)</span> : null}
			</Label>
			{def.hint && (
				<p id={`${id}-hint`} className="text-muted-foreground mt-1 text-sm">
					{def.hint}
				</p>
			)}
			<div className="mt-2">
				{def.kind === "textarea" ? (
					<Textarea {...shared} rows={3} maxLength={def.max} value={value} onChange={(e) => onChange(e.target.value)} className="min-h-24 text-base" />
				) : def.kind === "select" ? (
					<select
						{...shared}
						value={value}
						onChange={(e) => onChange(e.target.value)}
						className={cn(
							"border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive h-11 w-full rounded-lg border px-3 text-base shadow-xs outline-none focus-visible:ring-[3px]",
						)}
					>
						<option value="">Escolha uma opção</option>
						{HORIZONTES.map((h) => (
							<option key={h} value={h}>
								{h}
							</option>
						))}
					</select>
				) : (
					<Input {...shared} type="text" maxLength={def.max} value={value} onChange={(e) => onChange(e.target.value)} className="h-11 text-base" />
				)}
			</div>
			<div className="mt-1 flex justify-between gap-4 text-sm">
				<p id={`${id}-error`} className="text-destructive font-medium">
					{error}
				</p>
				{def.kind !== "select" && (
					<span className="text-muted-foreground ml-auto tabular-nums" aria-hidden="true">
						{value.length}/{def.max}
					</span>
				)}
			</div>
		</div>
	);
}
