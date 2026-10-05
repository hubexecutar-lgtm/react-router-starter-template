import { createRequestHandler } from "react-router";

import { MAX_BODY_BYTES, buildEvent, toDataPoint } from "../app/lib/analytics/events";

declare module "react-router" {
	export interface AppLoadContext {
		cloudflare: {
			env: Env;
			ctx: ExecutionContext;
		};
	}
}

const requestHandler = createRequestHandler(
	() => import("virtual:react-router/server-build"),
	import.meta.env.MODE,
);

/**
 * Eventos da jornada (LANC-001 RQ-111): POST /api/eventos grava no Workers Analytics Engine (binding EVENTS).
 * Não lê IP, user agent nem cookies, e não devolve cookie; evento inválido é recusado (400) e nada é gravado.
 */
async function handleEvent(request: Request, env: Env): Promise<Response> {
	if (request.method !== "POST") return new Response(null, { status: 405, headers: { allow: "POST" } });
	const body = await request.text();
	if (body.length > MAX_BODY_BYTES) return new Response(null, { status: 413 });
	let event = null;
	try {
		event = buildEvent(JSON.parse(body));
	} catch {
		// JSON inválido: cai no 400 abaixo
	}
	if (!event) return new Response(null, { status: 400 });
	env.EVENTS?.writeDataPoint(toDataPoint(event));
	return new Response(null, { status: 204, headers: { "cache-control": "no-store" } });
}

export default {
	fetch(request, env, ctx) {
		if (new URL(request.url).pathname === "/api/eventos") return handleEvent(request, env);
		return requestHandler(request, {
			cloudflare: { env, ctx },
		});
	},
} satisfies ExportedHandler<Env>;
