import type { Route } from "./+types/privacy";
import Content from "../../content/pages/privacy.mdx";

import BasicLayout from "@/layouts/BasicLayout";
import { seo } from "@/lib/seo";

// content/pages/privacy.mdx (was src/pages/privacy.mdx with `layout: BasicLayout`). Astro
// handed MDX layouts `frontmatter`, not `title`, so the page used the site defaults.
export const meta: Route.MetaFunction = ({ location }) => seo({ pathname: location.pathname });

export default function Page() {
	return (
		<BasicLayout>
			<Content />
		</BasicLayout>
	);
}
