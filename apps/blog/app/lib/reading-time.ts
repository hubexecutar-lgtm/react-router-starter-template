// Regra única de tempo de leitura (HANDOFF-RC-GLOBAL-DESIGN-CONTENT-001, Fase 2):
// palavras do corpo final ÷ 200 palavras/minuto, arredondado para cima, mínimo 1.
// Conta o texto do MDX sem imports, tags JSX/HTML, cercas de código e sintaxe Markdown;
// diagramas ASCII entram como palavras porque são lidos.
export const WORDS_PER_MINUTE = 200;

export function countWords(body = ""): number {
  const text = body
    .replace(/^import .*$/gm, " ")
    .replace(/^```.*$/gm, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_`|[\]()─│┌┐└┘├┤┬┴┼▶▼→←↓↑]/g, " ")
    .replace(/https?:\/\/\S+/g, " ");
  return text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}

export function readingTime(body = ""): number {
  return Math.max(1, Math.ceil(countWords(body) / WORDS_PER_MINUTE));
}
