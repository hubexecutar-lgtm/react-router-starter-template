// Componentes React do RC-DS-CF (ADR-26). Especificação em docs/design-system/DS-CF-001.md (§3 e §4); CSS em
// app/styles/ds.css; showroom em /admin/design-system/. Rotas públicas e de admin usam só daqui (tests/ds.spec.ts).
import { useEffect, useId, useState, type ComponentPropsWithoutRef, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";

import * as AlertDialog from "@radix-ui/react-alert-dialog";
import * as RadixTabs from "@radix-ui/react-tabs";
import { ChevronRight } from "lucide-react";

type Variant = "primary" | "outline" | "ghost";

/** Botão (§3/§4): pílula de 44 px (lg = 50 px). `href` vira link; sem href, `<button>`. */
export function Button({
	variant = "primary",
	size,
	href,
	children,
	...rest
}: { variant?: Variant; size?: "lg"; href?: string; children: ReactNode } & ComponentPropsWithoutRef<"button"> &
	Pick<ComponentPropsWithoutRef<"a">, "rel" | "target" | "download">) {
	const common = { className: `ds-btn ${rest.className ?? ""}`.trim(), "data-variant": variant, "data-size": size };
	if (href) {
		const { rel, target, download, onClick } = rest;
		return (
			<a href={href} rel={rel} target={target} download={download} onClick={onClick as never} {...common} {...dataAttrs(rest)}>
				{children}
			</a>
		);
	}
	return (
		<button type="button" {...rest} {...common}>
			{children}
		</button>
	);
}

const dataAttrs = (props: object) => Object.fromEntries(Object.entries(props).filter(([k]) => k.startsWith("data-") || k.startsWith("aria-")));

/** Link de texto com chevron ("Saiba mais ›"). */
export function MoreLink({ href, children, ...rest }: { href: string; children: ReactNode } & ComponentPropsWithoutRef<"a">) {
	return (
		<a href={href} {...rest} className={`ds-link ${rest.className ?? ""}`.trim()}>
			{children}
			<ChevronRight size={16} aria-hidden="true" />
		</a>
	);
}

/** Aviso de layout demonstrativo (§4.11). */
export function DemoNotice({ children }: { children?: ReactNode }) {
	return (
		<p className="ds-notice" role="note" data-demo-notice>
			<b>Layout demonstrativo</b>
			<span>{children ?? "Esta página está em reconstrução no design system novo; o conteúdo exibido é real."}</span>
		</p>
	);
}

export type Crumb = { label: string; href?: string };

/** Breadcrumb (§4.2). */
export function Breadcrumb({ items }: { items: Crumb[] }) {
	return (
		<nav className="ds-crumbs" aria-label="Trilha">
			<ol>
				{items.map((c, i) => (
					<li key={c.label}>
						{c.href && i < items.length - 1 ? <a href={c.href}>{c.label}</a> : <span aria-current="page">{c.label}</span>}
					</li>
				))}
			</ol>
		</nav>
	);
}

/** Cabeçalho de página interna (§4.1): h1 único, lead e ações. */
export function PageHead({
	eyebrow,
	title,
	lead,
	actions,
	crumbs,
	notice = true,
	align = "left",
	children,
}: {
	eyebrow?: string;
	title: ReactNode;
	lead?: ReactNode;
	actions?: ReactNode;
	crumbs?: Crumb[];
	notice?: boolean | ReactNode;
	align?: "left" | "center";
	children?: ReactNode;
}) {
	return (
		<header className="ds-pagehead" data-align={align}>
			{crumbs && <Breadcrumb items={crumbs} />}
			{notice && <DemoNotice>{notice === true ? undefined : notice}</DemoNotice>}
			{eyebrow && <p className="ds-eyebrow">{eyebrow}</p>}
			<h1>{title}</h1>
			{lead && <p className="ds-pagehead-lead">{lead}</p>}
			{actions && <div className="ds-pagehead-actions">{actions}</div>}
			{children}
		</header>
	);
}

/** Quadro da referência com quadradinhos nos cantos (§3). */
export function Frame({
	children,
	className = "",
	as: Tag = "div",
	style,
	...rest
}: { children: ReactNode; className?: string; as?: "div" | "section"; style?: CSSProperties } & Record<`data-${string}` | `aria-${string}`, string | undefined>) {
	return (
		<Tag className={`ds-frame ${className}`.trim()} style={style} {...rest}>
			<span className="ds-corner" data-corner="tl" aria-hidden="true" />
			<span className="ds-corner" data-corner="tr" aria-hidden="true" />
			<span className="ds-corner" data-corner="bl" aria-hidden="true" />
			<span className="ds-corner" data-corner="br" aria-hidden="true" />
			{children}
		</Tag>
	);
}

/** Cabeçalho de seção (§3): h2 + lead; `align="left"` para páginas internas. */
export function SectionHead({ id, label, heading, lead, size = "md", align = "center" }: { id: string; label?: string; heading: ReactNode; lead?: ReactNode; size?: "md" | "lg"; align?: "center" | "left" }) {
	return (
		<header className="ds-head" data-size={size} data-align={align}>
			{label && <p className="ds-label">{label}</p>}
			<h2 id={id}>{heading}</h2>
			{lead && <p>{lead}</p>}
		</header>
	);
}

/** Faixa de pontos entre seções (só no celular). */
export const Dots = () => <div className="ds-dots" aria-hidden="true" />;

/** Card (§4.3): o título é o link; a área clicável cobre o card. */
export function Card({
	href,
	eyebrow,
	title,
	text,
	meta,
	icon,
	media,
	cta,
	badge,
	variant = "cell",
	size,
	headingLevel = 3,
	...rest
}: {
	href?: string;
	eyebrow?: ReactNode;
	title: ReactNode;
	text?: ReactNode;
	meta?: ReactNode;
	icon?: ReactNode;
	media?: ReactNode;
	cta?: string;
	badge?: ReactNode;
	variant?: "cell" | "panel";
	size?: "lg";
	headingLevel?: 2 | 3 | 4;
} & Record<`data-${string}`, string | undefined>) {
	const H = `h${headingLevel}` as "h3";
	return (
		<article className="ds-card" data-variant={variant} data-size={size} {...rest}>
			{media && <div className="ds-card-media">{media}</div>}
			{icon && <span className="ds-card-icon" aria-hidden="true">{icon}</span>}
			{(eyebrow || badge) && (
				<div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
					{eyebrow && <span className="ds-card-eyebrow">{eyebrow}</span>}
					{badge}
				</div>
			)}
			<H>
				{href ? (
					<a href={href} className="ds-card-link">
						{title}
					</a>
				) : (
					title
				)}
			</H>
			{text && <p>{text}</p>}
			{meta && <div className="ds-card-meta">{meta}</div>}
			{href && cta && (
				<span className="ds-card-cta" aria-hidden="true">
					{cta} ›
				</span>
			)}
		</article>
	);
}

/** Grade de cards em células de quadro. */
export function CardGrid({ cols = 3, children, label, gap, ...rest }: { cols?: 2 | 3 | 4; children: ReactNode; label?: string; gap?: boolean } & Record<`data-${string}`, string | undefined>) {
	return (
		<Frame className="ds-grid" style={{ ["--ds-cols" as string]: cols }} {...rest} data-gap={gap ? "" : undefined} aria-label={label}>
			{children}
		</Frame>
	);
}

/** Badge (§4.14). */
export function Badge({ variant = "neutral", children, ...rest }: { variant?: "neutral" | "accent" | "demo"; children: ReactNode } & Record<`data-${string}`, string | undefined>) {
	return (
		<span className="ds-badge" data-variant={variant} {...rest}>
			{children}
		</span>
	);
}

export type ChipItem = { label: string; href?: string; count?: number; current?: boolean; soon?: boolean };

/** Chips de faceta (§4.4): sem href = "em preparação", nunca link. */
export function Chips({ items, label }: { items: ChipItem[]; label: string }) {
	return (
		<ul className="ds-chips" aria-label={label}>
			{items.map((c) =>
				c.href && !c.soon ? (
					<li key={c.label}>
						<a className="ds-chip" href={c.href} aria-current={c.current ? "true" : undefined}>
							{c.label}
							{c.count !== undefined && <span className="ds-chip-count">{c.count}</span>}
						</a>
					</li>
				) : (
					<li key={c.label}>
						<span className="ds-chip" data-state="soon">
							{c.label} <span className="ds-chip-count">em preparação</span>
						</span>
					</li>
				),
			)}
		</ul>
	);
}

/** Abas (§3): Radix só pelo comportamento (setas, foco, aria). */
export function Tabs({ label, items, defaultValue }: { label: string; items: { value: string; label: ReactNode; content: ReactNode }[]; defaultValue?: string }) {
	return (
		<RadixTabs.Root defaultValue={defaultValue ?? items[0]?.value} className="ds-tabs-root">
			<RadixTabs.List className="ds-tabs" aria-label={label}>
				{items.map((t) => (
					<RadixTabs.Trigger key={t.value} value={t.value} className="ds-tab">
						{t.label}
					</RadixTabs.Trigger>
				))}
			</RadixTabs.List>
			{items.map((t) => (
				<RadixTabs.Content key={t.value} value={t.value} className="ds-tab-panel">
					{t.content}
				</RadixTabs.Content>
			))}
		</RadixTabs.Root>
	);
}

/** Estado vazio (§4.10): o quê + por quê + como começar, com um link real. */
export function EmptyState({ title, text, action, level = 2 }: { title: string; text: ReactNode; action?: { label: string; href: string }; level?: 2 | 3 }) {
	const H = `h${level}` as "h2";
	return (
		<div className="ds-empty" data-empty>
			<H>{title}</H>
			<p>{text}</p>
			{action && <MoreLink href={action.href}>{action.label}</MoreLink>}
		</div>
	);
}

/** Campo (§4.12): label explícito, ajuda e erro por aria-describedby. */
export function Field({
	label,
	help,
	error,
	children,
}: {
	label: ReactNode;
	help?: ReactNode;
	error?: ReactNode;
	children: (ids: { id: string; describedBy?: string; invalid: boolean }) => ReactNode;
}) {
	const id = useId();
	const helpId = help ? `${id}-help` : undefined;
	const errId = error ? `${id}-err` : undefined;
	const describedBy = [helpId, errId].filter(Boolean).join(" ") || undefined;
	return (
		<div className="ds-field">
			<label htmlFor={id} className="ds-field-label">
				{label}
			</label>
			{children({ id, describedBy, invalid: Boolean(error) })}
			{help && (
				<p id={helpId} className="ds-field-help">
					{help}
				</p>
			)}
			{error && (
				<p id={errId} className="ds-field-error">
					{error}
				</p>
			)}
		</div>
	);
}

export const Input = (props: ComponentPropsWithoutRef<"input">) => <input {...props} className={`ds-field-control ${props.className ?? ""}`.trim()} />;
export const Textarea = (props: ComponentPropsWithoutRef<"textarea">) => <textarea {...props} className={`ds-field-control ${props.className ?? ""}`.trim()} />;
export const Select = (props: ComponentPropsWithoutRef<"select">) => <select {...props} className={`ds-field-control ${props.className ?? ""}`.trim()} />;

/** Checkbox/radio nativos com rótulo (§4.12). */
export function Check({ label, ...props }: { label: ReactNode } & ComponentPropsWithoutRef<"input">) {
	return (
		<label className="ds-check">
			<input type="checkbox" {...props} />
			<span>{label}</span>
		</label>
	);
}

/** Diálogo de confirmação (§4.13): Radix AlertDialog pelo comportamento; botões rotulados pela ação. */
export function ConfirmDialog({
	trigger,
	title,
	text,
	confirm,
	cancel,
	onConfirm,
}: {
	trigger: ReactNode;
	title: string;
	text: ReactNode;
	confirm: string;
	cancel: string;
	onConfirm: () => void;
}) {
	return (
		<AlertDialog.Root>
			<AlertDialog.Trigger asChild>{trigger}</AlertDialog.Trigger>
			<AlertDialog.Portal>
				<AlertDialog.Overlay className="ds-dialog-overlay" />
				<AlertDialog.Content className="ds-dialog">
					<AlertDialog.Title asChild>
						<h2>{title}</h2>
					</AlertDialog.Title>
					<AlertDialog.Description asChild>
						<p>{text}</p>
					</AlertDialog.Description>
					<div className="ds-dialog-actions">
						<AlertDialog.Cancel asChild>
							<button type="button" className="ds-btn" data-variant="outline">
								{cancel}
							</button>
						</AlertDialog.Cancel>
						<AlertDialog.Action asChild>
							<button type="button" className="ds-btn" data-variant="primary" onClick={onConfirm}>
								{confirm}
							</button>
						</AlertDialog.Action>
					</div>
				</AlertDialog.Content>
			</AlertDialog.Portal>
		</AlertDialog.Root>
	);
}

/** Tabela (§4.8): empilha no celular em células rotuladas (data-label). */
export function Table({ head, rows, caption, stack = true }: { head: string[]; rows: ReactNode[][]; caption?: string; stack?: boolean }) {
	return (
		<div className="ds-table-wrap">
			<table className="ds-table" data-stack={stack ? "" : undefined}>
				{caption && <caption className="sr-only">{caption}</caption>}
				<thead>
					<tr>
						{head.map((h) => (
							<th key={h} scope="col">
								{h}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((r, i) => (
						<tr key={i}>
							{r.map((c, j) => (
								<td key={j} data-label={head[j]}>
									{c}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

/** Meta do artigo (§4.5). */
export function ArticleMeta({ publisher, date, minutes, id }: { publisher: string; date?: string; minutes: number; id?: string }) {
	const human = date ? new Date(`${date}T12:00:00Z`).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }) : undefined;
	return (
		<dl className="ds-meta" data-article-meta>
			<dt>Publicado por</dt>
			<dd>{publisher}</dd>
			{date && (
				<>
					<dt>Data</dt>
					<dd>
						<time dateTime={date}>{human}</time>
					</dd>
				</>
			)}
			<dt>Leitura</dt>
			<dd>{minutes} min de leitura</dd>
			{id && (
				<>
					<dt>ID do conteúdo</dt>
					<dd data-mono="">{id}</dd>
				</>
			)}
		</dl>
	);
}

/** Sumário de H2 (§4.6): lateral no desktop, recolhível no celular. */
export function Toc({ items }: { items: { id: string; label: string }[] }) {
	// Aberto no HTML (desktop e sem JS); depois da hidratação recolhe abaixo de 1100 px, onde o sumário não é lateral.
	const [open, setOpen] = useState(true);
	useEffect(() => {
		if (window.matchMedia("(max-width: 1099.98px)").matches) setOpen(false);
	}, []);
	if (!items.length) return null;
	return (
		<nav className="ds-toc" aria-label="Nesta página" data-toc>
			<details open={open} onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)} className="ds-toc-details">
				<summary>Nesta página</summary>
				<ol>
					{items.map((i) => (
						<li key={i.id}>
							<a href={`#${i.id}`}>{i.label}</a>
						</li>
					))}
				</ol>
			</details>
		</nav>
	);
}

/** Pontos principais (§4.7): só com conteúdo existente. */
export function KeyPoints({ items }: { items: string[] }) {
	if (!items.length) return null;
	return (
		<aside className="ds-keypoints" aria-labelledby="pontos-principais">
			<h2 id="pontos-principais">Pontos principais</h2>
			<ul>
				{items.map((i) => (
					<li key={i}>{i}</li>
				))}
			</ul>
		</aside>
	);
}

/** FAQ (§4.7): details/summary nativos. */
export function Faq({ items }: { items: { q: string; a: ReactNode }[] }) {
	if (!items.length) return null;
	return (
		<section className="ds-faq" aria-labelledby="perguntas">
			<h2 id="perguntas">Perguntas frequentes</h2>
			{items.map((i) => (
				<details key={i.q}>
					<summary>{i.q}</summary>
					<div>{i.a}</div>
				</details>
			))}
		</section>
	);
}

/** Navegação por setas num grupo de botões (padrão dos seletores do cérebro e dos chips de filtro). */
export function arrowNav(event: KeyboardEvent<HTMLElement>, index: number, total: number, focus: (i: number) => void) {
	const delta = ({ ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 } as Record<string, number>)[event.key];
	if (!delta) return false;
	event.preventDefault();
	focus((index + delta + total) % total);
	return true;
}
