import type { CSSProperties } from "react";

/** Inline CSS string (`"background: var(--x); color: white"`) to a React style object. */
export function css(source: string): CSSProperties {
	const style: Record<string, string> = {};
	for (const decl of source.split(";")) {
		const i = decl.indexOf(":");
		if (i < 0) continue;
		const prop = decl.slice(0, i).trim();
		const value = decl.slice(i + 1).trim();
		if (!prop) continue;
		const key = prop.startsWith("--")
			? prop
			: prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
		style[key] = value;
	}
	return style as CSSProperties;
}
