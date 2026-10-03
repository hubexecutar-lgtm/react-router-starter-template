// Home provisória do site novo (ADR-13): só o shell e a abertura, sobre os tokens de anatomia
// (--content-max, --gutter, --section-pad-y, --text-hero). As seções entram uma a uma.
import type { Route } from "./+types/home";

import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/consts";
import DefaultLayout from "@/layouts/DefaultLayout";
import { seo } from "@/lib/seo";

export const meta: Route.MetaFunction = ({ location }) => seo({ description: SITE_DESCRIPTION, pathname: location.pathname });

export default function Page() {
	return (
		<DefaultLayout>
			<section className="container py-[var(--section-pad-y)]" aria-labelledby="hero-title">
				<div className="flex flex-col items-center gap-6 text-center">
					<h1 id="hero-title" className="rc-display text-[length:var(--text-hero)] leading-[0.92] uppercase">
						{SITE_NAME}
					</h1>
					<p className="rc-title text-[length:var(--text-hero-lead)] leading-snug font-medium">{SITE_TAGLINE}</p>
					<p className="rc-lead mx-auto text-lg">Site em construção.</p>
				</div>
			</section>
		</DefaultLayout>
	);
}
