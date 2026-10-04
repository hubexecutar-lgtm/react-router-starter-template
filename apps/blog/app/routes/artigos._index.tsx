// Listagem de artigos (RC-FRONT-001): composição "Stories" do handoff OPENAI-STORIES-DESIGN-001, sobre os
// tokens --ref-* do global.css e os artigos de content/artigos. Era a home; desde o LANC-001 PR-E vive em /artigos/.
import type { Route } from "./+types/artigos._index";

import { StoriesHome } from "@/components/stories/StoriesHome";
import { SITE_DESCRIPTION } from "@/consts";
import { SHARE_IMAGE } from "@/data/article-media";
import DefaultLayout from "@/layouts/DefaultLayout";
import { getStories } from "@/lib/articles";
import { seo } from "@/lib/seo";

export function loader() {
	return { stories: getStories() };
}

export const meta: Route.MetaFunction = ({ location }) =>
	seo({ title: "Artigos", description: SITE_DESCRIPTION, image: SHARE_IMAGE.src, pathname: location.pathname });

export default function Page({ loaderData }: Route.ComponentProps) {
	return (
		<DefaultLayout>
			<StoriesHome stories={loaderData.stories} title="Artigos" problems />
		</DefaultLayout>
	);
}
