import { data } from "react-router";

import type { Route } from "./+types/$";

import { NotFoundPage } from "@/components/site/NotFoundPage";
import { seo } from "@/lib/seo";

// Catch-all: every unknown path renders the 404 page with a 404 status.
export function loader() {
	return data(null, { status: 404 });
}

export const meta: Route.MetaFunction = ({ location }) =>
	seo({
		title: "Página não encontrada",
		description: "O endereço procurado não existe ou mudou.",
		pathname: location.pathname,
		noindex: true,
	});

export default function NotFound() {
	return <NotFoundPage />;
}
