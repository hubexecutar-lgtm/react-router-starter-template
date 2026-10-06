// Tabela Markdown do artigo na tabela do site (ADR-05/12): células `ds-table` e, no celular, linhas empilhadas em
// células rotuladas (`data-stack`, DS-CF-001 §4.8). O rótulo de cada célula é o texto do cabeçalho da coluna, lido do próprio MDX.
import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";

type El = ReactElement<{ children?: ReactNode; "data-label"?: string }>;

const text = (node: ReactNode): string =>
	typeof node === "string" || typeof node === "number"
		? String(node)
		: Array.isArray(node)
			? node.map(text).join("")
			: isValidElement<{ children?: ReactNode }>(node)
				? text(node.props.children)
				: "";

const elements = (node: ReactNode) => Children.toArray(node).filter(isValidElement) as El[];

export function ArticleTable({ children }: { children?: ReactNode }) {
	const parts = elements(children);
	const head = parts.find((p) => p.type === "thead");
	const labels = head ? elements(elements(head.props.children)[0]?.props.children).map((th) => text(th.props.children)) : [];
	const label = (row: El) =>
		cloneElement(
			row,
			undefined,
			elements(row.props.children).map((cell, i) => cloneElement(cell, { key: i, "data-label": labels[i] })),
		);
	return (
		<table className="ds-table" data-stack="">
			{parts.map((p, i) =>
				p.type === "tbody" ? cloneElement(p, { key: i }, elements(p.props.children).map((row, j) => cloneElement(label(row), { key: j }))) : cloneElement(p, { key: i }),
			)}
		</table>
	);
}
