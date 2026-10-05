// Textos das 6 soluções (RC-PUB-PACK-003): MDX em content/solucoes, compilado pelo mesmo pipeline dos artigos.
// O card 2×2 vem de ./data.ts (YAML do schema); o MDX é o corpo da página, sem reescrita.
import { z } from "zod";

import type { MDXContent } from "@/lib/articles";

const schema = z.object({
	title: z.string().min(1),
	description: z.string().min(1),
	slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
	status: z.enum(["draft", "ready"]),
	contentType: z.enum(["article"]),
});

type MDXModule = { default: MDXContent; frontmatter?: unknown };
const modules = import.meta.glob<MDXModule>("/content/solucoes/*.mdx", { eager: true });

const all = Object.entries(modules).map(([file, mod]) => {
	const parsed = schema.safeParse(mod.frontmatter ?? {});
	if (!parsed.success) throw new Error(`${file}: frontmatter inválido\n${parsed.error.message}`);
	if (!file.endsWith(`/${parsed.data.slug}.mdx`)) throw new Error(`${file}: slug "${parsed.data.slug}" difere do nome do arquivo`);
	return { data: parsed.data, Content: mod.default };
});

export const solutionContent = (slug: string) => all.find((s) => s.data.slug === slug && s.data.status === "ready");
