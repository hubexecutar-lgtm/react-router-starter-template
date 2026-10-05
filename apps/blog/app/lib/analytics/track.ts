// Emissor no navegador (RQ-111): manda o evento ao Worker por sendBeacon, sem cookie e sem esperar resposta.
// Respeita "Do Not Track" e nunca quebra a página: sem suporte, ou com erro, o evento simplesmente não sai.
import { useEffect } from "react";

import { buildEvent, campaignFrom, type JourneyEvent } from "./events";

export const EVENTS_ENDPOINT = "/api/eventos";

export function track(input: Omit<JourneyEvent, "path" | "campaign_id"> & { path?: string }) {
	try {
		if (typeof window === "undefined" || navigator.doNotTrack === "1") return false;
		const event = buildEvent({ ...input, path: input.path ?? window.location.pathname, campaign_id: campaignFrom(window.location.search) });
		if (!event) return false;
		return navigator.sendBeacon?.(EVENTS_ENDPOINT, new Blob([JSON.stringify(event)], { type: "application/json" })) ?? false;
	} catch {
		return false;
	}
}

/** Evento de visualização ao montar (e quando `key` muda); nada no servidor nem no prerender. */
export function useTrackView(input: Parameters<typeof track>[0] | null, key: string) {
	useEffect(() => {
		if (input) track(input);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [key]);
}
