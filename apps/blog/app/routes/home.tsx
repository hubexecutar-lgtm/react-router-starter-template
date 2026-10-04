// Home (LANC-001 RQ-040): o texto canônico RC-LP-001 sobre o Stories. A listagem de artigos mudou para /artigos/.
import type { Route } from "./+types/home";

import { Landing } from "@/components/landing/Landing";
import { SITE_DESCRIPTION } from "@/consts";
import { RC_IMAGES } from "@/data/article-media";
import DefaultLayout from "@/layouts/DefaultLayout";
import { seo } from "@/lib/seo";

export const meta: Route.MetaFunction = ({ location }) =>
	seo({ title: undefined, description: SITE_DESCRIPTION, image: RC_IMAGES.binoculosMapaCerebral.landscape.src, pathname: location.pathname });

export default function Page() {
	return (
		<DefaultLayout>
			<Landing />
		</DefaultLayout>
	);
}
