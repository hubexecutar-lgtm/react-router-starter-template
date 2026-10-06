// Componentes do showroom do RC-DS-CF (/admin/design-system/), especificados em docs/design-system/DS-CF-001-admin.md:
// Specimen (§2.1), Swatch e ContrastTable (§2.2). CSS em app/styles/ds-admin.css. Os valores dos tokens são lidos no
// navegador (getComputedStyle), nunca copiados para cá: o hex vive só no bloco RC-DS-CF do global.css.
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { Table } from "@/components/ds";

/* ------------------------------------------------------------------ leitura de tokens e contraste */

type Rgb = [number, number, number];

/** Resolve qualquer cor CSS (inclusive oklch e cores com alfa, compostas sobre `base`) para sRGB num canvas 1×1. */
function toRgb(ctx: CanvasRenderingContext2D, color: string, base: string): Rgb {
	ctx.clearRect(0, 0, 1, 1);
	ctx.fillStyle = base;
	ctx.fillRect(0, 0, 1, 1);
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, 1, 1);
	const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
	return [r, g, b];
}

const luminance = ([r, g, b]: Rgb) => {
	const lin = (v: number) => {
		const s = v / 255;
		return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
	};
	return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};

export const ratio = (a: Rgb, b: Rgb) => {
	const [x, y] = [luminance(a), luminance(b)];
	return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

const hex = ([r, g, b]: Rgb) => `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`.toUpperCase();

type TokenInfo = { raw: string; rgb?: Rgb };
type TokenMap = Record<string, TokenInfo>;

const TokenContext = createContext<{ tokens: TokenMap; ready: boolean }>({ tokens: {}, ready: false });

/**
 * Lê os tokens no `html` depois da hidratação e de novo a cada troca de tema (classe `dark`) ou de largura (as escalas
 * mudam abaixo de 768 px). `colors` são resolvidos para sRGB para o cálculo de contraste.
 */
export function TokenProvider({ names, colors, children }: { names: string[]; colors: string[]; children: ReactNode }) {
	const [state, setState] = useState<{ tokens: TokenMap; ready: boolean }>({ tokens: {}, ready: false });
	useEffect(() => {
		const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
		const read = () => {
			const cs = getComputedStyle(document.documentElement);
			const next: TokenMap = {};
			const base = cs.getPropertyValue("--cf-bg").trim() || "white";
			for (const n of new Set([...names, ...colors])) {
				const raw = cs.getPropertyValue(n).trim();
				next[n] = { raw, rgb: ctx && colors.includes(n) && raw ? toRgb(ctx, raw, base) : undefined };
			}
			setState({ tokens: next, ready: true });
		};
		read();
		const mo = new MutationObserver(read);
		mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });
		const mq = window.matchMedia("(max-width: 767.98px)");
		mq.addEventListener("change", read);
		return () => {
			mo.disconnect();
			mq.removeEventListener("change", read);
		};
		// names/colors são listas estáticas do módulo da rota
	}, []);
	return <TokenContext.Provider value={state}>{children}</TokenContext.Provider>;
}

const useToken = (name: string) => {
	const { tokens, ready } = useContext(TokenContext);
	return { info: tokens[name], ready };
};

const PENDING = "calculado no navegador";

/** Valor do token como texto (hex para cores, valor computado para o resto). */
export function TokenValue({ name }: { name: string }) {
	const { info, ready } = useToken(name);
	const text = !ready ? PENDING : info?.rgb ? hex(info.rgb) : info?.raw || "—";
	return (
		<span className="ds-swatch-value" data-token-value={name}>
			{text}
		</span>
	);
}

/* ------------------------------------------------------------------ Swatch (§2.2) */

export function Swatch({ token, role, kind = "color", contrastOn }: { token: string; role: string; kind?: "color" | "radius" | "size"; contrastOn?: string }) {
	const { tokens, ready } = useContext(TokenContext);
	const style =
		kind === "color"
			? { background: `var(${token})` }
			: kind === "radius"
				? { borderRadius: `var(${token})` }
				: { width: `min(100%, var(${token}))` };
	const fg = tokens[token]?.rgb;
	const bg = contrastOn ? tokens[contrastOn]?.rgb : undefined;
	const r = fg && bg ? ratio(fg, bg) : undefined;
	return (
		<div className="ds-swatch" data-kind={kind} data-token={token}>
			<span className="ds-swatch-chip" style={style} aria-hidden="true" />
			<span className="ds-swatch-name">{token}</span>
			<span className="ds-swatch-role">{role}</span>
			<TokenValue name={token} />
			{contrastOn && (
				<span className="ds-swatch-value" data-swatch-contrast={contrastOn} data-ratio={r?.toFixed(2)}>
					{ready && r ? `${r.toFixed(2)}:1 sobre ${contrastOn}` : PENDING}
				</span>
			)}
		</div>
	);
}

export type ContrastPair = { fg: string; bg: string; min: number; use: string };

/** Tabela de contraste (§2.2): razão WCAG calculada no tema atual; resultado em texto, nunca só cor. */
export function ContrastTable({ pairs }: { pairs: ContrastPair[] }) {
	const { tokens, ready } = useContext(TokenContext);
	const rows = pairs.map((p) => {
		const a = tokens[p.fg]?.rgb;
		const b = tokens[p.bg]?.rgb;
		const r = a && b ? ratio(a, b) : undefined;
		const ok = r !== undefined && r >= p.min;
		return [
			<code key="fg">{p.fg}</code>,
			<code key="bg">{p.bg}</code>,
			<span
				key="s"
				className="ds-contrast-sample"
				style={{ color: `var(${p.fg})`, background: `var(${p.bg})`, fontSize: p.min < 4.5 ? 24 : 16 }}
				data-contrast-pair={`${p.fg}|${p.bg}`}
				data-ratio={r?.toFixed(2)}
				data-min={p.min}
			>
				Aa {p.min < 4.5 ? "grande" : "texto"}
			</span>,
			<span key="r" data-ratio-text>
				{ready && r ? `${r.toFixed(2)}:1` : PENDING}
			</span>,
			`${p.min}:1`,
			<strong key="ok" data-contrast-result>
				{!ready || r === undefined ? "—" : ok ? (p.min < 4.5 ? "AA (texto grande ou não texto)" : "AA") : "Abaixo do mínimo"}
			</strong>,
			p.use,
		];
	});
	return <Table caption="Pares de contraste do RC-DS-CF, calculados no tema atual" head={["Texto", "Fundo", "Amostra", "Razão", "Mínimo", "Resultado", "Uso"]} rows={rows} />;
}

/* ------------------------------------------------------------------ Specimen (§2.1) */

export function Specimen({
	id,
	name,
	api,
	lead,
	a11y,
	dos,
	donts,
	children,
}: {
	id: string;
	name: string;
	api: string;
	lead?: ReactNode;
	a11y: string[];
	dos: string[];
	donts: string[];
	children: ReactNode;
}) {
	return (
		<section className="ds-specimen" aria-labelledby={id} data-specimen={id}>
			<header>
				<h3 id={id}>{name}</h3>
				<p className="ds-specimen-api">{api}</p>
				{lead && <p>{lead}</p>}
			</header>
			{children}
			<div className="ds-specimen-notes">
				<div>
					<h3>Acessibilidade</h3>
					<ul data-a11y-notes>
						{a11y.map((n) => (
							<li key={n}>{n}</li>
						))}
					</ul>
				</div>
				<div className="ds-dodont">
					<div data-kind="do">
						<h4>Fazer</h4>
						<ul>
							{dos.map((n) => (
								<li key={n}>
									<span aria-hidden="true">✓</span>
									<span>{n}</span>
								</li>
							))}
						</ul>
					</div>
					<div data-kind="dont">
						<h4>Evitar</h4>
						<ul>
							{donts.map((n) => (
								<li key={n}>
									<span aria-hidden="true">✕</span>
									<span>{n}</span>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</section>
	);
}

/** Palco do Specimen: variantes e estados lado a lado. */
export function Stage({ children, accent, cols }: { children: ReactNode; accent?: boolean; cols?: 1 }) {
	return (
		<div className="ds-specimen-stage" data-stage={accent ? "accent" : undefined} data-cols={cols}>
			{children}
		</div>
	);
}

/** Uma variante ou um estado, com legenda. */
export function Variant({ label, children }: { label: string; children: ReactNode }) {
	return (
		<figure className="ds-variant">
			<figcaption>{label}</figcaption>
			<div className="ds-variant-row">{children}</div>
		</figure>
	);
}
