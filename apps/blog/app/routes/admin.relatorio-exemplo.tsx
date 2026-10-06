import type { Route } from "./+types/admin.relatorio-exemplo";
import Content, { frontmatter } from "../../content/pages/relatorio-exemplo.mdx";

import ReportLayout, { type ReportFrontmatter } from "@/layouts/ReportLayout";
import { seo } from "@/lib/seo";

// content/pages/relatorio-exemplo.mdx no layout de relatório do RC-DS-CF (ADR-05, ADR-26). Interno, noindex.
const fm = frontmatter as ReportFrontmatter;

export const meta: Route.MetaFunction = ({ location }) =>
	seo({ title: fm.title, description: fm.description, pathname: location.pathname, noindex: true });

export default function Page() {
	return <ReportLayout fm={fm} Content={Content} />;
}
