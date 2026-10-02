import type { Route } from "./+types/admin.relatorio-exemplo";
import Content, { frontmatter } from "../../content/pages/relatorio-exemplo.mdx";

import ReportLayout from "@/layouts/ReportLayout";
import { seo } from "@/lib/seo";

// content/pages/relatorio-exemplo.mdx (was src/pages/admin/relatorio-exemplo.mdx with
// `layout: ReportLayout`).
const fm = frontmatter as { title: string; description: string; eyebrow?: string };

export const meta: Route.MetaFunction = ({ location }) =>
	seo({ title: fm.title, description: fm.description, pathname: location.pathname });

export default function Page() {
	return (
		<ReportLayout eyebrow={fm.eyebrow}>
			<Content />
		</ReportLayout>
	);
}
