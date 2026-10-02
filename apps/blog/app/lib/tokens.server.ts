// Valores de token lidos da fonte única (app/styles/global.css), para documentação no showroom.
// Só no servidor/prerender: o CSS bruto não vai para o bundle do cliente.
import tokenCss from "@/styles/global.css?raw";

export const tokenValue = (name: string) =>
	(new RegExp(`${name}:\\s*([^;]+);`).exec(tokenCss)?.[1] ?? "").replace(/\s*\/\*.*$/, "").toUpperCase();
