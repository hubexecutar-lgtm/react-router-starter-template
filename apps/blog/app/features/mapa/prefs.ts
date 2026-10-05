// Preferências do mapa (LANC-001 RQ-090, SCR-04): focos de trabalho, interesses e "Mostrar evidências".
// Mudam só a ordem e o destaque, nunca os fatos. Ficam só neste navegador (localStorage), sem conta e sem rede;
// limpar os dados do navegador (ou "Restaurar padrão") volta ao mapa padrão.
import { PROBLEMS, type ProblemId } from "@/data/article-meta";
import { RC_GRAPH, nodeById } from "@/lib/graph";

export const PREFS_KEY = "rc.mapa.prefs.v1";

export type MapPrefs = { focos: ProblemId[]; interesses: string[]; evidencias: boolean };

export const EMPTY_PREFS: MapPrefs = { focos: [], interesses: [], evidencias: false };

const FOCUS_IDS = PROBLEMS.map((p) => p.id) as readonly string[];

/** Lê e valida; qualquer coisa estranha (ou storage bloqueado) vira o padrão. */
export function loadPrefs(): MapPrefs | null {
	try {
		const raw = window.localStorage.getItem(PREFS_KEY);
		if (!raw) return null;
		const v = JSON.parse(raw) as Partial<MapPrefs>;
		const focos = (Array.isArray(v.focos) ? v.focos : []).filter((f): f is ProblemId => FOCUS_IDS.includes(f as string));
		const interesses = (Array.isArray(v.interesses) ? v.interesses : []).filter((id): id is string => typeof id === "string" && !!nodeById(RC_GRAPH, id));
		return { focos, interesses, evidencias: v.evidencias === true };
	} catch {
		return null;
	}
}

export function savePrefs(prefs: MapPrefs) {
	try {
		window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
		return true;
	} catch {
		return false;
	}
}

export function clearPrefs() {
	try {
		window.localStorage.removeItem(PREFS_KEY);
	} catch {
		// storage bloqueado: não havia nada salvo
	}
}

/** Nó do grafo ligado a cada foco de trabalho (o mesmo dos chips de problema dos artigos, ADR-M04). */
export const focusNode = (id: ProblemId) => PROBLEMS.find((p) => p.id === id)!.node;

/** Nó que abre no centro do Explorar: o do primeiro foco escolhido. */
export function preferredFocus(prefs: MapPrefs | null): string | null {
	const first = prefs?.focos[0];
	return first ? focusNode(first) : null;
}

/** Ordena preferidos primeiro, sem tirar nem acrescentar nada. */
export function preferredFirst<T extends { id: string }>(items: T[], prefs: MapPrefs | null): T[] {
	if (!prefs) return items;
	const rank = (id: string) => (prefs.interesses.includes(id) ? 0 : prefs.focos.some((f) => focusNode(f) === id) ? 1 : 2);
	return items.map((it, i) => ({ it, i })).sort((a, b) => rank(a.it.id) - rank(b.it.id) || a.i - b.i).map(({ it }) => it);
}
