import { type PostView, formatDate } from "@/lib/posts";
import { cn } from "@/lib/utils";

export function ArticleMeta({
	post,
	showId = true,
	className,
}: {
	post: PostView;
	showId?: boolean;
	className?: string;
}) {
	return (
		<p className={cn("rc-meta flex flex-wrap items-center gap-x-3 gap-y-1", className)}>
			{showId && post.contentId && <span>{post.contentId}</span>}
			{showId && post.contentId && <span aria-hidden="true" className="h-3 border-l border-[var(--border-strong)]"></span>}
			<span>{post.minutes} min de leitura</span>
			<span aria-hidden="true" className="h-3 border-l border-[var(--border-strong)]"></span>
			<time dateTime={post.pubDate.toISOString().slice(0, 10)}>{formatDate(post.pubDate)}</time>
		</p>
	);
}
