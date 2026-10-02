// remark-mdx-frontmatter exports the YAML frontmatter of every Markdown/MDX module.
declare module "*.mdx" {
	export const frontmatter: Record<string, unknown>;
}
declare module "*.md" {
	import type { MDXProps } from "mdx/types";
	export const frontmatter: Record<string, unknown>;
	export default function MDXContent(props: MDXProps): JSX.Element;
}
