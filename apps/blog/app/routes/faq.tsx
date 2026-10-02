import type { Route } from "./+types/faq";

import { Background } from "@/components/background";
import { FAQ } from "@/components/blocks/faq";
import { Testimonials } from "@/components/blocks/testimonials";
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
				<FAQ
					className="py-28 text-center lg:pt-44 lg:pb-32"
					className2="max-w-xl lg:grid-cols-1"
					headerTag="h1"
				/>
				<DashedLine className="mx-auto max-w-xl" />
				<Testimonials dashedLineClassName="hidden" />
			</Background>
		</DefaultLayout>
	);
}
