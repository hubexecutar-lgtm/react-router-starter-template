import type { Route } from "./+types/admin.handoff";
import Content, { frontmatter } from "../../content/pages/handoff.mdx";

import ReportLayout from "@/layouts/ReportLayout";
import { seo } from "@/lib/seo";

// content/pages/handoff.mdx (layout de relatório, como /admin/relatorio-exemplo/).
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
