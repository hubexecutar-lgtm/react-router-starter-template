import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { Post } from "@/lib/content";

const BlogPost = ({
  post,
  children,
}: {
  post: Post;
  children: React.ReactNode;
}) => {
  const { title, authorName, image, pubDate, description, authorImage } =
    post.data;
  return (
    <section>
      <div className="container max-w-5xl">
        <div className="mx-auto flex flex-col items-center gap-5 text-center">
          <h1 className="max-w-3xl text-3xl tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="text-muted-foreground max-w-3xl text-lg font-medium md:text-xl">
            {description}
          </p>
          <div className="flex items-center gap-3 text-sm font-medium md:text-base">
            <Avatar className="h-8 w-8 border">
              <AvatarImage src={authorImage} />
              <AvatarFallback>{authorName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>
              <span className="text-foreground">{authorName}</span>
              <span className="text-muted-foreground ml-1">
                · {format(pubDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </span>
            </span>
          </div>
          <img
            src={image}
            alt=""
            className="mt-4 mb-10 aspect-video w-full rounded-2xl object-cover"
          />
        </div>
      </div>
      <div className="container max-w-5xl">
        <div className="prose prose-lg dark:prose-invert prose-headings:font-medium prose-headings:tracking-tight prose-headings:text-foreground prose-h2:text-primary prose-h2:text-3xl md:prose-h2:text-4xl prose-headings:break-words prose-p:text-muted-foreground prose-p:font-medium prose-li:text-muted-foreground prose-li:font-medium prose-strong:text-foreground prose-a:text-primary prose-blockquote:text-primary prose-blockquote:font-medium prose-blockquote:border-primary prose-img:rounded-2xl prose-table:block prose-table:overflow-x-auto mx-auto max-w-2xl">
          {children}
        </div>
      </div>
    </section>
  );
};

export { BlogPost };
