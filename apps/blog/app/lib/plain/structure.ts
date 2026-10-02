// Reading view of operational plain text (ADR-05 amendment, ADR-12). The plain text stays the
// source of truth and the copied payload; this only decides how a reader sees it: label/value
// pairs become a definition list, numbered and bulleted lines become lists, column-aligned rows
// become a table and everything else stays a paragraph. Rules are conservative: a line that
// matches nothing is kept verbatim in a paragraph, never dropped or reworded.

export type PlainPair = { term: string; lead?: string; details: string[]; code: boolean };
export type PlainBlock =
  | { type: "heading"; text: string }
  | { type: "pairs"; items: PlainPair[] }
  | { type: "list"; ordered: boolean; intro?: string; items: string[] }
  | { type: "table"; head: string[] | null; rows: string[][] }
  | { type: "paragraph"; lines: string[] };

const COLUMNS = /\S(?: ?\S)*/g; // segments separated by 2+ spaces
const indentOf = (line: string) => line.length - line.trimStart().length;
const segments = (line: string) => line.trim().match(COLUMNS) ?? [];

/** Identifier-like terms (A0, STATUS, eventos_possíveis) are set in mono; words are not. */
const isCode = (term: string) => /^[A-Z0-9][A-Z0-9_-]*$/.test(term) || term.includes("_");

const BULLET = /^\s*[-•*]\s+(.+)$/;
const NUMBERED = /^\s*(\d{1,2})[.)]\s+(.+)$/;
const STEP = /^(\d{2})\s{2,}(.+)$/; // "01  abrir o briefing"
const HEADING = /^#{1,3}\s+(.+)$/;
// "Label: value" — short label (≤ 4 words), not a URL scheme, not a time.
const LABEL = /^([^\s:][^:]{0,40}?):(?:\s+(.*))?$/;
const isLabel = (line: string) => {
  const m = LABEL.exec(line.trim());
  if (!m) return null;
  const term = m[1].trim();
  if (term.split(/\s+/).length > 4 || /^(https?|mailto)$/i.test(term) || /^\d+$/.test(term)) return null;
  return { term, value: (m[2] ?? "").trim() };
};
// "KEY   value" — the first column ends at 2+ spaces.
const KEYED = /^(\S(?:\S| (?! ))*)\s{2,}(.+)$/;

function chunks(text: string): string[][] {
  const out: string[][] = [];
  let cur: string[] = [];
  for (const line of text.split("\n")) {
    if (!line.trim()) {
      if (cur.length) out.push(cur);
      cur = [];
    } else cur.push(line);
  }
  if (cur.length) out.push(cur);
  return out;
}

function tableFrom(lines: string[]): PlainBlock | null {
  const rows: string[][] = [];
  for (const line of lines) {
    const cols = segments(line);
    if (indentOf(line) >= 8 && rows.length) {
      // wrapped continuation of the last cell
      const last = rows[rows.length - 1];
      last[last.length - 1] = `${last[last.length - 1]} ${line.trim()}`;
      continue;
    }
    if (cols.length < 3) return null;
    rows.push(cols);
  }
  if (rows.length < 2) return null;
  const width = Math.max(...rows.map((r) => r.length));
  const pad = (r: string[]) => [...r, ...Array(width - r.length).fill("")];
  const headIsCaps = rows[0].every((c) => c === c.toUpperCase());
  return headIsCaps ? { type: "table", head: pad(rows[0]), rows: rows.slice(1).map(pad) } : { type: "table", head: null, rows: rows.map(pad) };
}

function pairsFrom(lines: string[]): PlainBlock | null {
  const items: PlainPair[] = [];
  for (const line of lines) {
    const indented = indentOf(line) >= 2;
    if (indented && items.length) {
      items[items.length - 1].details.push(line.trim());
      continue;
    }
    const keyed = KEYED.exec(line.trim());
    // a column gap before any colon means "KEY   value: …" (the colon belongs to the value)
    const label = keyed && !keyed[1].includes(":") ? null : isLabel(line);
    if (label) items.push({ term: label.term, lead: label.value || undefined, details: [], code: isCode(label.term) });
    else if (keyed) items.push({ term: keyed[1], lead: keyed[2].trim(), details: [], code: isCode(keyed[1]) });
    else return null;
  }
  // "01  passo" rows are an ordered list, not definitions
  if (!items.length || items.every((it) => /^\d{1,2}$/.test(it.term))) return null;
  return { type: "pairs", items };
}

function blocksFrom(lines: string[]): PlainBlock[] {
  const out: PlainBlock[] = [];
  let i = 0;
  let para: string[] = [];
  const flush = () => {
    if (para.length) out.push({ type: "paragraph", lines: para });
    para = [];
  };
  while (i < lines.length) {
    const line = lines[i];
    const heading = HEADING.exec(line.trim());
    if (heading) {
      flush();
      out.push({ type: "heading", text: heading[1] });
      i++;
      continue;
    }
    // "Intro:" followed by a list → list with intro
    const label = isLabel(line);
    const listAt = (j: number) => j < lines.length && (BULLET.test(lines[j]) || NUMBERED.test(lines[j]) || STEP.test(lines[j].trim()));
    if ((label && !label.value && listAt(i + 1)) || listAt(i)) {
      flush();
      const intro = label && !label.value && listAt(i + 1) ? line.trim() : undefined;
      if (intro) i++;
      const ordered = NUMBERED.test(lines[i]) || STEP.test(lines[i].trim());
      const items: string[] = [];
      while (i < lines.length && listAt(i)) {
        const l = lines[i];
        items.push((BULLET.exec(l)?.[1] ?? NUMBERED.exec(l)?.[2] ?? STEP.exec(l.trim())?.[2] ?? l).trim());
        i++;
      }
      out.push({ type: "list", ordered, intro, items });
      continue;
    }
    para.push(line.trim());
    i++;
  }
  flush();
  return out;
}

/** Splits normalized plain text into reading blocks (paragraph per blank-line chunk). */
export function structurePlain(text: string): PlainBlock[] {
  const out: PlainBlock[] = [];
  for (const chunk of chunks(text)) {
    const head = HEADING.exec(chunk[0].trim());
    const body = head ? chunk.slice(1) : chunk;
    if (head) out.push({ type: "heading", text: head[1] });
    if (!body.length) continue;
    const table = tableFrom(body);
    if (table) {
      out.push(table);
      continue;
    }
    const pairs = pairsFrom(body);
    // a chunk of pairs needs at least 2 entries (or 1 with details) to read as a definition list
    if (pairs && pairs.type === "pairs" && (pairs.items.length > 1 || pairs.items[0].details.length)) {
      out.push(pairs);
      continue;
    }
    out.push(...blocksFrom(body));
  }
  return out;
}
