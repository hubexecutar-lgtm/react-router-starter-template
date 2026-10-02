// Classes da superfície neutra (ADR-09) para blocos editoriais.
// Card = célula da tabela (ADR-12): fundo --table-surface, sem contorno, raio 2px, sem sombra;
// hover por superfície; separação por gutter entre cards.
// `rc-surface` troca o texto secundário pelo tom AA sobre cinza (ADR-11).
export const SURFACE =
  "rc-surface rc-cell";
export const SURFACE_LINK = `${SURFACE} transition-colors hover:bg-[var(--surface-hover)] focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]`;
