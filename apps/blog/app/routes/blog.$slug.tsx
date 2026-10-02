import { data } from "react-router";

import type { Route } from "./+types/blog.$slug";

import { BlogPost } from "@/components/blocks/blog-post";
import { AsciiDiagram, PlainTextPanel } from "@/components/plain";
import DefaultLayout from "@/layouts/DefaultLayout";
import { getPost, getPostContent } from "@/lib/content";
import { seo } from "@/lib/seo";

export function loader({ params }: Route.LoaderArgs) {
	const post = getPost(params.slug);
	if (!post) throw data(null, { status: 404 });
	return { post };
}

// The Astro page rendered <DefaultLayout> without title/description: the site defaults apply.
export const meta: Route.MetaFunction = ({ location }) => seo({ pathname: location.pathname });

export default function Page({ loaderData, params }: Route.ComponentProps) {
	const Content = getPostContent(params.slug)!;
	return (
		<DefaultLayout>
			<div className="py-28 lg:pt-44 lg:pb-32">
				<BlogPost post={loaderData.post}>
					<Content components={{ AsciiDiagram, PlainTextPanel }} />
				</BlogPost>
			</div>
		</DefaultLayout>
	);
}
