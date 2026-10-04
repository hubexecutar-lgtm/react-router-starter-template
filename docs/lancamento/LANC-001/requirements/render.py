"""Gera requisitos.csv e 03-FRD.md a partir de requisitos.json (fonte única).

Uso: python3 render.py   (dentro desta pasta; só biblioteca padrão)
"""
import csv, json
from collections import Counter
from pathlib import Path

here = Path(__file__).parent
data = json.loads((here / "requisitos.json").read_text())
epics = {e["id"]: e for e in data["epicos"]}
items = data["requisitos"]

ids = {i["id"] for i in items}
for i in items:
    assert i["epico"] in epics, (i["id"], i["epico"])
    for dep in i["depende_de"]:
        assert dep in ids, (i["id"], dep)
    i["epico_nome"], i["pr"] = epics[i["epico"]]["nome"], epics[i["epico"]]["pr"]
    i["labels"] = ["LANC-001", i["epico"], i["prioridade"], i["tipo"]]

with open(here / "requisitos.csv", "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["id", "titulo", "descricao", "tipo", "prioridade", "status", "epico", "epico_nome", "pr",
                "depende_de", "fonte", "criterio_aceite", "labels", "entregue_em"])
    for i in items:
        w.writerow([i["id"], i["titulo"], i["descricao"], i["tipo"], i["prioridade"], i["status"], i["epico"],
                    i["epico_nome"], i["pr"], ";".join(i["depende_de"]), i["fonte"], i["criterio_aceite"],
                    ",".join(i["labels"]), i.get("entregue_em", "")])

esc = lambda s: s.replace("|", "\\|")
L = ["# LANC-001 — FRD (requisitos funcionais e não funcionais)", "",
     f"- **ID:** RC-FRD-001 · **Versão:** {data['versao']} · **Gerado de:** `requisitos.json` por `render.py` "
     "(não editar à mão: editar o JSON e rodar `python3 render.py`)",
     "- **Tipos:** FR funcional · NFR não funcional · RULE regra · CONTENT conteúdo · DATA dados",
     "- **Status:** " + " · ".join(f"{k} ({v})" for k, v in data["legenda"]["status"].items()), "",
     "| Prioridade | " + " | ".join(data["legenda"]["status"]) + " |",
     "|---" * (len(data["legenda"]["status"]) + 1) + "|"]
c = Counter((i["prioridade"], i["status"]) for i in items)
for p in ["P0", "P1", "P2", "P3"]:
    L.append(f"| {p} | " + " | ".join(str(c[(p, s)]) for s in data["legenda"]["status"]) + " |")
L.append(f"\nTotal: {len(items)} requisitos em {len(epics)} épicos.\n")
for k, e in epics.items():
    L += [f"## {k} — {e['nome']} ({e['pr']})", "",
          "| ID | Tipo | Prio | Status | Requisito | Critério de aceite | Depende | Fonte |",
          "|---|---|---|---|---|---|---|---|"]
    for i in items:
        if i["epico"] == k:
            L.append(f"| {i['id']} | {i['tipo']} | {i['prioridade']} | {i['status']} | **{esc(i['titulo'])}.** "
                     f"{esc(i['descricao'])} | {esc(i['criterio_aceite'])} | {', '.join(i['depende_de']) or '—'} "
                     f"| {esc(i['fonte'])} |")
    L.append("")
(here / "03-FRD.md").write_text("\n".join(L))
print(f"{len(items)} requisitos → requisitos.csv, 03-FRD.md")
