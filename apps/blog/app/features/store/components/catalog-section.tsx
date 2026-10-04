import type { ReactNode } from "react";

import { ArrowRight } from "lucide-react";

export function CatalogSection({
  id,
  title,
  href,
  hrefLabel = "Ver todos",
  children,
}: {
  id: string;
  title: string;
  href?: string;
  hrefLabel?: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="mt-12">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <h2 id={id} className="text-xl font-medium">
          {title}
        </h2>
        {href && (
          <a
            href={href}
            className="text-primary focus-visible:ring-ring/50 inline-flex min-h-10 items-center gap-1 rounded-md text-sm font-medium outline-none hover:underline focus-visible:ring-[3px]"
          >
            {hrefLabel}
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        )}
      </div>
      {children}
    </section>
  );
}
