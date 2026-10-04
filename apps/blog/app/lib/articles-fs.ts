// Descobre os artigos publicados lendo content/artigos pelo sistema de arquivos. Só depende de node:fs:
// serve ao prerender (react-router.config.ts) e aos testes de rotas, onde import.meta.glob não existe.
// A validação completa do frontmatter fica em app/lib/articles.ts.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/** Slugs (nome do arquivo) dos artigos com `status: ready` no frontmatter. */
export function readyArticleSlugs(root = process.cwd()): string[] {
	const dir = join(root, "content/artigos");
	if (!existsSync(dir)) return [];
	return readdirSync(dir)
		.filter((f) => f.endsWith(".mdx"))
		.filter((f) => {
			const front = readFileSync(join(dir, f), "utf8").match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "";
			return /^status:\s*["']?ready["']?\s*$/m.test(front);
		})
		.map((f) => f.replace(/\.mdx$/, ""))
		.sort();
}
