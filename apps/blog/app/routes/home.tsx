// Home do site novo (RC-FRONT-001): composição "Stories" do handoff OPENAI-STORIES-DESIGN-001, sobre os
// tokens --ref-* do global.css e os artigos de content/artigos.
import type { Route } from "./+types/home";

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
	seo({ title: undefined, description: SITE_DESCRIPTION, image: SHARE_IMAGE.src, pathname: location.pathname });

export default function Page({ loaderData }: Route.ComponentProps) {
	return (
		<DefaultLayout>
			<StoriesHome stories={loaderData.stories} title="Artigos" />
		</DefaultLayout>
	);
}
