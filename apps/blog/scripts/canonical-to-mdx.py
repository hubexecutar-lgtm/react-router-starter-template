# Uso: python3 scripts/canonical-to-mdx.py (LANC-001 RQ-041). Converte os textos canônicos do intake em MDX
# sem reescrita: cabeçalho → frontmatter, linhas em caixa alta → títulos, 1º parágrafo → description (lead).
import re, sys, pathlib
APP = pathlib.Path(__file__).resolve().parent.parent
CANON = APP / "../../docs/lancamento/LANC-001/intake/DOCS-002/RC_EDITORIAL_PLAIN_TXT_v1.0.0/01_CANONICO"
OUT = APP / "content/artigos"
FILES = {
    "02_RC_ARTIGO_P1_RISCOS_COGNITIVOS.txt": "riscos-cognitivos",
    "03_RC_ARTIGO_P2_PROCESSOS_NEUROADAPTATIVOS.txt": "processos-neuroadaptativos",
    "04_RC_ARTIGO_P3_FERRAMENTAS_SOLUCOES.txt": "compensacao-cognitiva",
    "05_RC_ARTIGO_MASTER_3_PILARES_1500.txt": "tres-pilares-riscos-cognitivos",
}
def is_caps(line):
    letters = [c for c in line if c.isalpha()]
    return len(letters) >= 3 and all(c.isupper() for c in letters)
def esc(t):
    return t.replace("{", "\\{").replace("}", "\\}").replace("<", "&lt;")
for fname, slug in FILES.items():
    text = (CANON / fname).read_text(encoding="utf-8").replace("\r\n", "\n")
    head, _, body = text.partition("\n\n")
    meta = dict(l.split(": ", 1) for l in head.splitlines() if ": " in l)
    blocks = [b.strip("\n") for b in body.split("\n\n") if b.strip()]
    if is_caps(blocks[0]) and blocks[0].replace(" ", "").upper() == meta["TITLE"].replace(" ", "").upper():
        blocks = blocks[1:]  # título em caixa alta repetido: o h1 já está no hero
    cta = None
    out = []
    desc = None
    for b in blocks:
        lines = b.split("\n")
        if len(lines) == 1 and lines[0].startswith("CTA: "):
            cta = lines[0][5:]
            continue
        if len(lines) == 1 and is_caps(lines[0]):
            out.append(f"## {esc(lines[0])}")
            continue
        if is_caps(lines[0]) and len(lines) > 1:
            out.append(f"### {esc(lines[0])}")
            lines = lines[1:]
        if all(re.match(r"^\d+\. ", l) for l in lines) and len(lines) > 1:
            out.append("\n".join(esc(l) for l in lines))
            continue
        for l in lines:
            if re.match(r"^\d+\. ", l):  # número solto vira parágrafo (não lista de um item)
                l = l.replace(". ", "\\. ", 1)
            if desc is None and not l.endswith(":"):
                desc = l  # o 1º parágrafo vira o lead do hero (frontmatter description), sem repetir no corpo
                continue
            out.append(esc(l))
    fm = [
        "---",
        f'title: "{meta["TITLE"]}"',
        f'description: "{desc}"',
        f'slug: "{slug}"',
        'status: "ready"',
        'contentType: "article"',
        "---",
        "",
        f"{{/* {meta['ID']} v{meta['VERSION']} — texto canônico de docs/lancamento/LANC-001/intake/DOCS-002 (sem reescrita; o 1º parágrafo é a description, mostrada no hero). */}}",
        "",
        "",
    ]
    (OUT / f"{slug}.mdx").write_text("\n".join(fm) + "\n\n".join(out) + "\n", encoding="utf-8")
    print(slug, meta["ID"], "| CTA:", cta)
