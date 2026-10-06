import type { Route } from "./+types/admin.handoff";
import Content, { frontmatter } from "../../content/pages/handoff.mdx";

import ReportLayout, { type ReportFrontmatter } from "@/layouts/ReportLayout";
import { seo } from "@/lib/seo";

// content/pages/handoff.mdx no layout de relatório do RC-DS-CF (como /admin/relatorio-exemplo/). Interno, noindex.
const fm = frontmatter as ReportFrontmatter;

export const meta: Route.MetaFunction = ({ location }) =>
	seo({ title: fm.title, description: fm.description, pathname: location.pathname, noindex: true });

export default function Page() {
	return <ReportLayout fm={fm} Content={Content} />;
}
