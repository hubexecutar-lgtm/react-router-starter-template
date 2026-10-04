// Modelo de dados do Prisma V1 (RC-PWA-PRISMA-ADR-001 §5, FRD-001 §5). Tudo roda no navegador:
// nenhum conteúdo do formulário sai do dispositivo. Os limites existem para o texto caber na folha A4.

export type PrismaData = {
	nome: string;
	contexto: string;
	objetivo: string;
	horizonte: string;
	tempo_disponivel: string;
	demanda_principal: string;
	atrito_principal: string;
	compensacao: string;
	prioridade_1: string;
	prioridade_2: string;
	prioridade_3: string;
	bloqueios: string;
	proxima_acao: string;
};

export type PrismaKey = keyof PrismaData;

export const HORIZONTES = ["Hoje", "Esta semana", "Este mês", "Este trimestre"] as const;

export type FieldDef = {
	key: PrismaKey;
	label: string;
	hint?: string;
	kind: "text" | "textarea" | "select";
	required: boolean;
	max: number;
	group: "situacao" | "estrutura" | "acao";
	placeholder?: string;
};

export const GROUPS: { id: FieldDef["group"]; title: string; lead: string }[] = [
	{ id: "situacao", title: "Sua situação", lead: "Onde você está e aonde quer chegar." },
	{ id: "estrutura", title: "O que pesa", lead: "A demanda, o atrito que ela causa e o apoio que você usa." },
	{ id: "acao", title: "O que fazer", lead: "As prioridades, o que bloqueia e o próximo passo." },
];

export const FIELDS: FieldDef[] = [
	{ key: "nome", label: "Nome", hint: "Opcional. Aparece no topo da folha.", kind: "text", required: false, max: 60, group: "situacao" },
	{ key: "contexto", label: "Contexto", hint: "Onde isso acontece: trabalho, estudo, casa, projeto.", kind: "textarea", required: true, max: 240, group: "situacao" },
	{ key: "objetivo", label: "Objetivo", hint: "O que você precisa entregar ou resolver.", kind: "textarea", required: true, max: 180, group: "situacao" },
	{ key: "horizonte", label: "Horizonte", hint: "Em quanto tempo.", kind: "select", required: true, max: 40, group: "situacao" },
	{ key: "tempo_disponivel", label: "Tempo disponível", hint: "Opcional. Por exemplo: 2 horas por dia.", kind: "text", required: false, max: 60, group: "situacao" },
	{ key: "demanda_principal", label: "Demanda principal", hint: "O que está sendo pedido a você agora.", kind: "textarea", required: true, max: 200, group: "estrutura" },
	{ key: "atrito_principal", label: "Atrito principal", hint: "O que atrapalha: esquecer etapas, perder o fio, não começar.", kind: "textarea", required: true, max: 200, group: "estrutura" },
	{ key: "compensacao", label: "Apoio que você usa ou quer usar", hint: "Opcional. Lista, lembrete, agenda, quadro, timer.", kind: "textarea", required: false, max: 200, group: "estrutura" },
	{ key: "prioridade_1", label: "Prioridade 1", kind: "text", required: true, max: 90, group: "acao" },
	{ key: "prioridade_2", label: "Prioridade 2", kind: "text", required: false, max: 90, group: "acao" },
	{ key: "prioridade_3", label: "Prioridade 3", kind: "text", required: false, max: 90, group: "acao" },
	{ key: "bloqueios", label: "Bloqueios", hint: "Opcional. O que impede ou depende de outra pessoa.", kind: "textarea", required: false, max: 200, group: "acao" },
	{ key: "proxima_acao", label: "Próxima ação", hint: "O menor passo concreto que você pode dar.", kind: "textarea", required: true, max: 180, group: "acao" },
];

export const EMPTY: PrismaData = Object.fromEntries(FIELDS.map((f) => [f.key, ""])) as PrismaData;

/** Rótulo mostrado na folha quando um campo opcional ficou vazio (regra do template: nada é inventado). */
export const A_DEFINIR = "A DEFINIR";

export const STORAGE_KEY = "rc.prisma.v1";
export const STORAGE_VERSION = "1.0.0";

export type Errors = Partial<Record<PrismaKey, string>>;

/** Normaliza quebras de linha e espaços nas pontas; o conteúdo nunca é reescrito. */
export function normalize(data: PrismaData): PrismaData {
	const out = { ...EMPTY };
	for (const f of FIELDS) {
		const raw = typeof data[f.key] === "string" ? data[f.key] : "";
		out[f.key] = raw.replace(/\r\n?/g, "\n").trim().slice(0, f.max);
	}
	return out;
}

export function validate(data: PrismaData): Errors {
	const errors: Errors = {};
	for (const f of FIELDS) {
		const v = (data[f.key] ?? "").trim();
		if (f.required && !v) errors[f.key] = f.kind === "select" ? `Escolha o ${f.label.toLowerCase()}.` : `Preencha o campo ${f.label.toLowerCase()}.`;
		else if (v.length > f.max) errors[f.key] = `${f.label} aceita até ${f.max} caracteres.`;
		else if (f.kind === "select" && v && !(HORIZONTES as readonly string[]).includes(v)) errors[f.key] = "Escolha uma das opções.";
	}
	return errors;
}

/** Primeiro campo inválido, na ordem do formulário (FR-005: o foco vai para ele). */
export function firstInvalid(errors: Errors): PrismaKey | null {
	return FIELDS.find((f) => errors[f.key])?.key ?? null;
}

type Stored = { version: string; updatedAt: string; data: Partial<PrismaData> };

/** Lê o rascunho salvo. Retorna null se não houver, se estiver corrompido ou se o storage estiver indisponível. */
export function load(): PrismaData | null {
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw) as Stored;
		if (!parsed || typeof parsed !== "object" || typeof parsed.data !== "object" || parsed.data === null) return null;
		const out = { ...EMPTY };
		for (const f of FIELDS) {
			const v = (parsed.data as Record<string, unknown>)[f.key];
			if (typeof v === "string") out[f.key] = v.slice(0, f.max);
		}
		return out;
	} catch {
		return null;
	}
}

export function save(data: PrismaData): boolean {
	try {
		const payload: Stored = { version: STORAGE_VERSION, updatedAt: new Date().toISOString(), data };
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
		return true;
	} catch {
		return false;
	}
}

export function clear(): boolean {
	try {
		window.localStorage.removeItem(STORAGE_KEY);
		return true;
	} catch {
		return false;
	}
}

/** Data local legível (FR-020), no fuso do dispositivo. */
export function formatGenerated(d: Date): string {
	return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeStyle: "short" }).format(d);
}
