import { corsHeaders } from "./agent-api";
import { fail, isAdmin, ok, store } from "./hub-api";
import type { HubRecord } from "./hub-store";

// Entrypoint único: CMS (Hub Editorial) ↔ blog Risco Cognitivo ↔ workflow EXECUTAR.

const ACTOR = "admin";
const PUBLISHABLE = ["ACEITO", "VALIDADA", "PRONTO", "AGENDADO"];
export const CMS_RUN = "cms";
const POSTS_TTL_S = 600;

type Vars = { BLOG_REPO?: string; BLOG_URL?: string; GITHUB_TOKEN?: string };
export const DEFAULT_BLOG_REPO = "hubexecutar-lgtm/react-router-starter-template";
export const DEFAULT_BLOG_URL = "https://react-router-starter-template.hub-executar.workers.dev";
/** Pasta do blog dentro do monorepo e dos arquivos que o fluxo de publicação toca. */
export const BLOG_APP_DIR = "apps/blog";
export const BLOG_POSTS_DIR = `${BLOG_APP_DIR}/content/blog`;
export const BLOG_QF_DIR = `${BLOG_APP_DIR}/app/data/editorial/quick-frameworks`;
const blogRepo = (env: Env) => (env as Env & Vars).BLOG_REPO || DEFAULT_BLOG_REPO;
const blogUrl = (env: Env) => ((env as Env & Vars).BLOG_URL || DEFAULT_BLOG_URL).replace(/\/$/, "");
const board = (env: Env) => env.TASK_BOARD.get(env.TASK_BOARD.idFromName("global"));

export const slugify = (value: string) =>
	value
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 80);

export const isSlug = (value: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length <= 80;

/** Tarefa de publicação do CMS: identificada pelo run reservado e pelo executor, nunca só pelo runId. */
export const isCmsTask = (task: { runId: string; executor: string; nodeId: string }) =>
	task.runId === CMS_RUN && task.executor === "agent:blog-publisher" && task.nodeId === "PUBLISH";

/** URL de PR aceita: https://github.com/<BLOG_REPO>/pull/<n> (case-insensitive no repo). */
export function isBlogPrUrl(env: Env, url: string) {
	const m = url.match(/^https:\/\/github\.com\/([^/]+\/[^/]+)\/pull\/\d+$/);
	return Boolean(m && m[1].toLowerCase() === blogRepo(env).toLowerCase());
}

const text = (v: unknown) => (v === null || v === undefined || v === "" ? "TBD" : String(v));

function section(title: string, records: HubRecord[] | undefined) {
	if (!records?.length) return `### ${title}\n(nenhum registro vinculado: TBD)`;
	return [
		`### ${title}`,
		...records.map((r) => {
			const { _id, ...fields } = r;
			void _id;
			return Object.entries(fields)
				.filter(([, v]) => v !== null && v !== "")
				.map(([k, v]) => `- ${k}: ${v}`)
				.join("\n");
		}),
	].join("\n\n");
}

/** Território do blog (TAX-RC-*) = slug da "Rota editorial" do CMS ("Fatores de Risco Cognitivo" → fatores-de-risco-cognitivo). */
export const territorySlug = (content: HubRecord) => slugify(String(content.Rota_editorial ?? ""));

/** IDs EVD-RC-NNNN citados nos registros ligados, sem repetição e em ordem. */
export const evidenceIds = (related: Record<string, HubRecord[]>) =>
	[...new Set(JSON.stringify(related.evidence ?? []).match(/EVD-RC-\d{4}/g) ?? [])].sort();

// Prompt self-contained da publicação (estrutura de prompt-self-contained.md).
// O blog (apps/blog, ADR-10) gera o .mdx a partir de um registro Quick Framework: o agente escreve o
// registro e roda o gerador; nunca edita o .mdx à mão.
export function buildPublishPrompt(
	env: Env,
	taskId: string,
	content: HubRecord,
	related: Record<string, HubRecord[]>,
) {
	const title = text(content.Titulo_final || content.Titulo_trabalho);
	const contentId = text(content.Content_ID);
	const saved = String(content.Blog_slug || "");
	const slug = isSlug(saved) ? saved : slugify(String(content.Titulo_final || content.Titulo_trabalho || content.Content_ID));
	const territory = territorySlug(content) || "TBD";
	const evidence = evidenceIds(related);
	const repo = blogRepo(env);
	const record = `${BLOG_QF_DIR}/${contentId}.md`;
	return [
		`<tarefa id="${taskId}">`,
		"  <contexto>",
		`    Blog Risco Cognitivo (${repo}, app em ${BLOG_APP_DIR}, React Router 7). Publicação do conteúdo ${contentId} · "${title}", pedida no CMS (Hub Editorial) do Programa EXECUTAR. Status editorial: ${text(content.Status_editorial)}.`,
		"  </contexto>",
		`  <objetivo>Abrir um Pull Request pronto para revisão (não draft) no repositório ${repo} com o registro Quick Framework ${record} e os arquivos que o gerador do blog produz a partir dele, escrito a partir dos dados abaixo.</objetivo>`,
		"  <entrada>",
		"## Conteúdo (CMS)",
		...Object.entries(content)
			.filter(([k, v]) => k !== "_id" && v !== null && v !== "")
			.map(([k, v]) => `- ${k}: ${v}`),
		"",
		section("Brief", related.brief),
		section("Argumentos", related.arguments),
		section("Evidências", related.evidence),
		section("Produção de texto", related.production),
		section("SEO & metadados", related.seo),
		"  </entrada>",
		"  <restricoes>",
		"    Não invente dado, citação, número ou fonte ausente: use TBD e liste como GAP na conclusão.",
		`    Frontmatter do registro (obrigatório): contentId: ${contentId}; slug: ${slug}; territory: ${territory}; title; description; pubDate (hoje, YYYY-MM-DD). Opcionais, só se houver dado: seoTitle, tags, evidence${evidence.length ? ` (${evidence.join(", ")})` : ""}.`,
		`    territory precisa existir na taxonomia do blog (${BLOG_APP_DIR}/app/data/editorial/seed.json, campo Slug sem as barras). Se ${territory} não existir, pare e relate como bloqueio.`,
		`    Formato do registro: template ${BLOG_APP_DIR}/tools/executar-block-quick-frameworks/assets/quick-framework-template.md; valide com python3 ${BLOG_APP_DIR}/tools/executar-block-quick-frameworks/scripts/validate_output.py ${record}.`,
		`    Não edite o .mdx gerado à mão: ele sai de node scripts/build-quick-frameworks.mjs (rode dentro de ${BLOG_APP_DIR}), que também atualiza ${BLOG_APP_DIR}/app/data/editorial/seed.json só para ${contentId}.`,
		"    ADR-01/ADR-M02 do monorepo: branch a partir da main e PR pronto para revisão, NUNCA em draft.",
		`    Branch: cms/${slug}. Só mudam o registro, o .mdx gerado e o upsert do seed deste conteúdo; nenhum outro post nem configuração.`,
		"  </restricoes>",
		"  <passos>",
		`    Criar o branch e escrever ${record} com o texto da produção, apoiado nos argumentos e nas evidências (com fontes).`,
		`    Validar o registro, rodar o gerador e, quando possível, npm ci na raiz e npm run content:check -w ${BLOG_APP_DIR}; corrigir só o próprio conteúdo.`,
		"    Abrir o PR (não draft) e concluir a tarefa com --pr-url e --slug.",
		"  </passos>",
		`  <criterio_de_conclusao>PR aberto, não draft, em https://github.com/${repo}/pull/<n>, contendo somente os arquivos deste conteúdo; tarefa concluída com --pr-url e --slug.</criterio_de_conclusao>`,
		`  <formato_de_saida>${record} + ${BLOG_POSTS_DIR}/${slug}.mdx (gerado) + PR no GitHub. Após o merge, o post fica em ${blogUrl(env)}/blog/${slug}/.</formato_de_saida>`,
		"  <evidencia_esperada>URL do PR, slug, território, lista de fontes usadas, resultado do validador e do content:check, e GAPs.</evidencia_esperada>",
		"</tarefa>",
	].join("\n");
}

type GitHubEntry = { name: string; type: string; html_url: string };
type BlogPost = { slug: string; file: string | null; url: string; githubUrl: string };

const POST_FILE = /\.mdx?$/;

export function postsFromGithub(env: Env, entries: GitHubEntry[]): BlogPost[] {
	return entries
		.filter((e) => e.type === "file" && POST_FILE.test(e.name))
		.map((e) => {
			const slug = e.name.replace(POST_FILE, "");
			return { slug, file: e.name, url: `${blogUrl(env)}/blog/${slug}/`, githubUrl: e.html_url };
		});
}

/** Resposta de https://data.jsdelivr.com/v1/packages/gh/<repo>@main?structure=flat (público, sem credencial). */
export function postsFromJsdelivr(env: Env, data: { files?: { name: string }[] }): BlogPost[] {
	const prefix = `/${BLOG_POSTS_DIR}/`;
	return (data.files ?? [])
		.filter((f) => f.name.startsWith(prefix) && !f.name.slice(prefix.length).includes("/") && POST_FILE.test(f.name))
		.map((f) => {
			const file = f.name.slice(prefix.length);
			const slug = file.replace(POST_FILE, "");
			return {
				slug,
				file,
				url: `${blogUrl(env)}/blog/${slug}/`,
				githubUrl: `https://github.com/${blogRepo(env)}/blob/main/${BLOG_POSTS_DIR}/${file}`,
			};
		});
}

async function cachedJson(url: string, headers: Record<string, string>): Promise<unknown | null> {
	const cache = (caches as unknown as { default: Cache }).default;
	const key = new Request(url);
	let res = await cache.match(key);
	if (!res) {
		const live = await fetch(url, { headers: { "User-Agent": "executar-cms", ...headers } });
		if (!live.ok) return null;
		res = new Response(await live.text(), {
			headers: { "Content-Type": "application/json", "Cache-Control": `max-age=${POSTS_TTL_S}` },
		});
		await cache.put(key, res.clone());
	}
	return res.json();
}

// 1) API do GitHub (com GITHUB_TOKEN, se existir, para fugir do limite compartilhado do IP do Worker);
// 2) jsDelivr, que serve repositórios públicos sem credencial. O RSS do blog não serve: fica atrás do Access.
async function listBlogPosts(env: Env): Promise<BlogPost[]> {
	const repo = blogRepo(env);
	const token = (env as Env & Vars).GITHUB_TOKEN;
	const github = await cachedJson(`https://api.github.com/repos/${repo}/contents/${BLOG_POSTS_DIR}`, {
		Accept: "application/vnd.github+json",
		...(token ? { Authorization: `Bearer ${token}` } : {}),
	});
	if (Array.isArray(github)) return postsFromGithub(env, github as GitHubEntry[]);
	const cdn = await cachedJson(`https://data.jsdelivr.com/v1/packages/gh/${repo}@main?structure=flat`, {});
	if (cdn && typeof cdn === "object") return postsFromJsdelivr(env, cdn as { files?: { name: string }[] });
	throw new Error("GitHub e jsDelivr indisponíveis");
}

/** Rotas /api/cms/* e /api/workflows/publish (sessão de administrador). */
export async function handleCmsApi(request: Request, env: Env, url: URL): Promise<Response | null> {
	const path = url.pathname;
	if (!path.startsWith("/api/cms/") && path !== "/api/workflows/publish") return null;
	if (!(await isAdmin(request, env))) return fail(401, "Login de administrador necessário");
	const hub = store(env);
	const method = request.method;

	if (path === "/api/cms/blog/posts" && method === "GET") {
		try {
			const posts = await listBlogPosts(env);
			const contents = (await hub.listModule("content")).filter((c) => c.Blog_slug);
			return ok({
				repo: blogRepo(env),
				blogUrl: blogUrl(env),
				posts: posts.map((p) => ({
					...p,
					contents: contents
						.filter((c) => c.Blog_slug === p.slug)
						.map((c) => ({ recordId: c._id, contentId: c.Content_ID })),
				})),
			});
		} catch (error) {
			return fail(502, `Não foi possível ler os posts do blog: ${String((error as Error).message)}`);
		}
	}

	if (path === "/api/cms/tasks" && method === "GET") {
		return ok(await board(env).list({ runId: CMS_RUN, limit: 100 }));
	}

	const body = method === "POST" ? ((await request.json().catch(() => ({}))) as { recordId?: unknown }) : {};
	const recordId = typeof body.recordId === "string" ? body.recordId : "";

	if (path === "/api/cms/campaigns" && method === "POST") {
		const content = recordId ? await hub.get("content", recordId) : null;
		if (!content) return fail(404, "Conteúdo não encontrado");
		const contentId = String(content.Content_ID || "");
		if (!contentId) return fail(400, "Conteúdo sem Content_ID");
		const existing = String(content.Run_ID || "");
		if (existing) return ok({ runId: existing, url: `/?run=${existing}`, existing: true });
		const instance = await env.MY_WORKFLOW.create({
			params: { campaignId: contentId, metadata: { contentRecordId: recordId } },
		});
		await hub.patchFields(ACTOR, "content", recordId, { Run_ID: instance.id });
		return ok({ runId: instance.id, url: `/?run=${instance.id}` }, { status: 201 });
	}

	if (path === "/api/workflows/publish" && method === "POST") {
		const content = recordId ? await hub.get("content", recordId) : null;
		if (!content) return fail(404, "Conteúdo não encontrado");
		const status = String(content.Status_editorial ?? "");
		if (!PUBLISHABLE.includes(status)) {
			return fail(409, `Status ${status || "vazio"} não é publicável (${PUBLISHABLE.join(", ")})`);
		}
		const contentId = String(content.Content_ID || recordId);
		const taskId = `${CMS_RUN}~publish-${slugify(contentId)}-${Date.now().toString(36)}`;
		const related = await hub.related(contentId);
		await board(env).publish({
			taskId,
			runId: CMS_RUN,
			campaignId: contentId,
			nodeId: "PUBLISH",
			item: recordId,
			iteration: 1,
			attempt: 1,
			executor: "agent:blog-publisher",
			title: `Publicar no blog: ${content.Titulo_final || content.Titulo_trabalho || contentId}`,
			prompt: buildPublishPrompt(env, taskId, content, related),
			doneEvent: "cms-publish",
			status: "despachada",
			note: null,
		});
		await hub.patchFields(ACTOR, "content", recordId, { Blog_PR: `Tarefa ${taskId} despachada` });
		return Response.json(
			{ success: true, result: { instanceId: null, status: "queued", taskId } },
			{ headers: corsHeaders },
		);
	}

	return fail(404, "Not Found");
}
