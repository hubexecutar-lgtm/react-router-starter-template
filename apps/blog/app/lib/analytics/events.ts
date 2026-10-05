// Eventos da jornada (LANC-001 RQ-111, DEC-U11): um contrato só, usado pelo emissor no navegador e pelo Worker que
// grava no Workers Analytics Engine. Sem cookies e sem dado pessoal: só estágio, ação, caminho da página e IDs do
// grafo/conteúdo (ADR-M04). Tudo o que não passa na validação é descartado, nunca "limpo" e gravado.

/** Estágios da jornada (Índex de rotas §11; Teia N8). */
export const STAGES = ["BLOG", "ARTICLE", "TOOL", "RESULT", "BUSINESS"] as const;
export type Stage = (typeof STAGES)[number];

export const ACTIONS = ["view", "cta", "select", "complete"] as const;
export type Action = (typeof ACTIONS)[number];

/** IDs opcionais, na ordem fixa dos blobs do Analytics Engine. */
export const ID_FIELDS = ["problem_id", "solution_id", "capability_id", "asset_id", "qfw_id", "campaign_id"] as const;
export type IdField = (typeof ID_FIELDS)[number];

export type JourneyEvent = { stage: Stage; action: Action; path: string } & Partial<Record<IdField, string>>;

/** IDs do grafo e do conteúdo: maiúsculas/minúsculas, dígitos, hífen, sublinhado e ponto; nada de @, espaço ou barra. */
const ID = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/;
/** Caminho do site, sem query nem fragmento (a query pode carregar texto livre). */
const PATH = /^\/[a-z0-9/_-]{0,200}$/;
/** Padrões que nunca podem aparecer, mesmo que passem no formato (e-mail, telefone, CPF). */
const PERSONAL = [/@/, /\d{8,}/, /\d{3}\.\d{3}\.\d{3}-\d{2}/];

export const MAX_BODY_BYTES = 2048;

/** Valida e normaliza um evento; null quando qualquer campo é inválido. Campos desconhecidos são ignorados. */
export function buildEvent(input: unknown): JourneyEvent | null {
	if (!input || typeof input !== "object" || Array.isArray(input)) return null;
	const v = input as Record<string, unknown>;
	if (!STAGES.includes(v.stage as Stage) || !ACTIONS.includes(v.action as Action)) return null;
	if (typeof v.path !== "string" || !PATH.test(v.path)) return null;
	const event: JourneyEvent = { stage: v.stage as Stage, action: v.action as Action, path: v.path };
	for (const f of ID_FIELDS) {
		const id = v[f];
		if (id === undefined || id === null || id === "") continue;
		if (typeof id !== "string" || !ID.test(id) || PERSONAL.some((p) => p.test(id))) return null;
		event[f] = id;
	}
	return event;
}

/** Linha do Analytics Engine: index = estágio; blobs = ação, caminho e os 6 IDs ("" quando ausente); double = 1. */
export function toDataPoint(e: JourneyEvent): { indexes: string[]; blobs: string[]; doubles: number[] } {
	return { indexes: [e.stage], blobs: [e.action, e.path, ...ID_FIELDS.map((f) => e[f] ?? "")], doubles: [1] };
}

/** Campanha vinda da URL de entrada (?utm_campaign=), só se for um ID válido. */
export function campaignFrom(search: string): string | undefined {
	const c = new URLSearchParams(search).get("utm_campaign");
	return c && ID.test(c) && !PERSONAL.some((p) => p.test(c)) ? c : undefined;
}
