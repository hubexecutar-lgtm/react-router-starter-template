// Server-only part of the blog collection: raw Markdown bodies (Astro's `entry.body`).
import { getPosts, idOf, type Post } from "@/lib/content";

const sources = import.meta.glob<string>("/content/blog/**/*.{md,mdx}", {
	eager: true,
	query: "?raw",
	import: "default",
});

const bodies = Object.fromEntries(
	Object.entries(sources).map(([file, src]) => [
		idOf(file),
		src.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, ""),
	]),
);

export type PostWithBody = Post & { body: string };

export function getPostsWithBody(): PostWithBody[] {
	return getPosts().map((p) => ({ ...p, body: bodies[p.id] ?? "" }));
}
