import type { Route } from "./+types/about";

import { Background } from "@/components/background";
import { AboutHero } from "@/components/blocks/about-hero";
import { AboutSection } from "@/components/blocks/about-section";
import { Investors } from "@/components/blocks/investors";
import { DashedLine } from "@/components/dashed-line";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/consts";
import DefaultLayout from "@/layouts/DefaultLayout";
import { seo } from "@/lib/seo";

export const meta: Route.MetaFunction = ({ location }) =>
	seo({ title: SITE_TITLE, description: SITE_DESCRIPTION, pathname: location.pathname });

export default function Page() {
	return (
		<DefaultLayout>
			<Background>
				<div className="py-28 lg:py-32 lg:pt-44">
					<AboutHero />
					<AboutSection />
					<div className="pt-28 lg:pt-32">
						<DashedLine className="container max-w-5xl scale-x-115" />
						<Investors />
					</div>
				</div>
			</Background>
		</DefaultLayout>
	);
}
