import type { Route } from "./+types/privacy";
import Content, { frontmatter } from "../../content/pages/privacy.mdx";

import BasicLayout from "@/layouts/BasicLayout";
import { seo } from "@/lib/seo";

// content/pages/privacy.mdx: texto corrido com o BasicLayout (título, eyebrow e lead do frontmatter).
const fm = frontmatter as { title: string; description: string; eyebrow?: string };

export const meta: Route.MetaFunction = ({ location }) =>
	seo({ title: fm.title, description: fm.description, pathname: location.pathname });

export default function Page() {
	return (
		<BasicLayout title={fm.title} description={fm.description} eyebrow={fm.eyebrow}>
			<Content />
		</BasicLayout>
	);
}
