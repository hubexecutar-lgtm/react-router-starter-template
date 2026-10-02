// Remark plugin for the plain text system (ADR-BLOG-ASCII-001 §11, annex §2).
//
// (a) <AsciiDiagram>{`…`}</AsciiDiagram> and <PlainTextPanel>{`…`}</PlainTextPanel>:
//     the template literal is lifted into a `source` string prop, because Astro
//     would otherwise hand React the children as pre-rendered HTML (no string,
//     no normalisation).
// (b) Fenced ```ascii / ```plain blocks become <AsciiDiagram> / <PlainTextPanel>.
//     Leading `key: value` lines (id, kind, title, caption, …) become props.

type Node = {
  type: string;
  position?: { start: { offset?: number }; end: { offset?: number } };
  name?: string | null;
  lang?: string | null;
  meta?: string | null;
  value?: string;
  children?: Node[];
  attributes?: { type: string; name: string; value: unknown }[];
  data?: { estree?: { body?: { type: string; expression?: Estree }[] } };
};
type Estree = {
  type: string;
  value?: unknown;
  expressions?: unknown[];
  quasis?: { value: { cooked?: string | null; raw: string } }[];
};

const COMPONENTS = new Set(["AsciiDiagram", "PlainTextPanel"]);
const FENCES: Record<string, string> = { ascii: "AsciiDiagram", plain: "PlainTextPanel" };
const HEADER_KEYS = new Set([
  "id",
  "kind",
  "title",
  "caption",
  "ariaLabel",
  "wrap",
  "copyable",
  "collapsible",
  "density",
  "fontSize",
  "maxHeight",
  "theme",
]);

// MDX strips container indentation from lines inside {…} expressions, which
// would break diagram geometry (AC-01). When the original source is available,
// re-read the template literal verbatim from it.
function verbatimTemplate(node: Node, source: string | undefined): string | null {
  const start = node.position?.start.offset;
  const end = node.position?.end.offset;
  if (source === undefined || start === undefined || end === undefined) return null;
  const raw = source.slice(start, end);
  const open = raw.indexOf("`");
  const close = raw.lastIndexOf("`");
  if (open < 0 || close <= open) return null;
  // Cook the escapes a template literal allows in static text.
  return raw.slice(open + 1, close).replace(/\\([`$\\])/g, "$1");
}

function staticString(node: Node, source: string | undefined): string | null {
  if (node.type !== "mdxFlowExpression" && node.type !== "mdxTextExpression") return null;
  const expr = node.data?.estree?.body?.[0]?.expression;
  if (!expr) return null;
  if (expr.type === "Literal" && typeof expr.value === "string") return expr.value;
  if (expr.type === "TemplateLiteral" && expr.expressions?.length === 0 && expr.quasis?.length === 1) {
    const q = expr.quasis[0].value;
    return verbatimTemplate(node, source) ?? q.cooked ?? q.raw;
  }
  return null;
}

function attr(name: string, value: string) {
  return { type: "mdxJsxAttribute", name, value };
}

export function parseFence(value: string): { props: Record<string, string>; source: string } {
  const lines = value.replace(/\r\n?/g, "\n").split("\n");
  const props: Record<string, string> = {};
  let i = 0;
  for (; i < lines.length; i++) {
    const m = /^([A-Za-z]+):\s?(.*)$/.exec(lines[i]);
    if (!m || !HEADER_KEYS.has(m[1])) break;
    props[m[1]] = m[2].trim();
  }
  return { props, source: lines.slice(i).join("\n") };
}

function visit(node: Node, parent: Node | null, index: number, source: string | undefined) {
  if (node.type === "code" && node.lang && FENCES[node.lang] && parent?.children) {
    const { props, source } = parseFence(node.value ?? "");
    parent.children[index] = {
      type: "mdxJsxFlowElement",
      name: FENCES[node.lang],
      attributes: [...Object.entries(props).map(([k, v]) => attr(k, v)), attr("source", source)],
      children: [],
    };
    return;
  }

  if (
    (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") &&
    node.name &&
    COMPONENTS.has(node.name)
  ) {
    const kids = (node.children ?? []).filter(
      (c) => !(c.type === "text" && !c.value?.trim()),
    );
    // Children may arrive wrapped in a paragraph when written inline.
    const only =
      kids.length === 1 && kids[0].type === "paragraph" && kids[0].children?.length === 1
        ? kids[0].children[0]
        : kids.length === 1
          ? kids[0]
          : null;
    const text = only ? staticString(only, source) : null;
    const hasSource = node.attributes?.some((a) => a.name === "source");
    if (text !== null && !hasSource) {
      node.attributes = [...(node.attributes ?? []), attr("source", text)];
      node.children = [];
    }
  }

  node.children?.forEach((child, i) => visit(child, node, i, source));
}

export default function remarkPlain() {
  return (tree: Node, file?: { value?: unknown }) =>
    visit(tree, null, 0, typeof file?.value === "string" ? file.value : undefined);
}
