#!/usr/bin/env python3
"""
Validador leve para saídas do Executar Block Quick Frameworks.

Uso:
  python scripts/validate_output.py caminho/saida.md

Ele verifica estrutura e limites simples. A validação factual das fontes
continua sendo responsabilidade do agente pesquisador.
"""

from pathlib import Path
import re
import sys

REQUIRED_HEADINGS = [
    "Contexto",
    "5W2H",
    "Referência padrão-ouro",
    "Problema existente",
    "Problema solucionado",
    "Processo",
    "Visão do sistema",
    "Progresso esperado",
    "Next 01-02-03",
    "Fontes e aprofundamento",
    "Infográfico 16:9",
]

def words(text: str) -> int:
    return len(re.findall(r"\b[\wÀ-ÿ'-]+\b", text, flags=re.UNICODE))

def section(text: str, heading: str) -> str:
    pattern = rf"(?ms)^##\s+\d*\.?\s*{re.escape(heading)}\s*$\n(.*?)(?=^##\s+|\Z)"
    m = re.search(pattern, text, flags=re.IGNORECASE)
    return m.group(1).strip() if m else ""

def fail(msg, errors):
    errors.append(msg)

def validate(path: Path):
    text = path.read_text(encoding="utf-8")
    errors = []

    for h in REQUIRED_HEADINGS:
        if not re.search(rf"(?mi)^##\s+\d*\.?\s*{re.escape(h)}\s*$", text):
            fail(f"Seção ausente: {h}", errors)

    # Mermaid: visão + próximos passos
    if len(re.findall(r"```mermaid", text, flags=re.IGNORECASE)) < 2:
        fail("São necessários dois blocos Mermaid.", errors)

    # 5W2H
    five = section(text, "5W2H")
    rows = re.findall(r"^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|$", five, flags=re.MULTILINE)
    labels = {"O que?", "Por quê?", "Onde?", "Quando?", "Quem?", "Como?", "Quanto?"}
    seen = set()
    for label, value in rows:
        label = label.strip()
        if label in labels:
            seen.add(label)
            if words(value) > 12:
                fail(f"5W2H '{label}' excede 12 palavras: {words(value)}", errors)
    missing = labels - seen
    if missing:
        fail("5W2H incompleto: " + ", ".join(sorted(missing)), errors)

    # Bloco principal
    main = "\n".join([
        section(text, "Problema existente"),
        section(text, "Problema solucionado"),
        section(text, "Processo"),
        section(text, "Visão do sistema"),
    ])
    if words(main) > 300:
        fail(f"Bloco principal excede 300 palavras: {words(main)}", errors)

    prog = section(text, "Progresso esperado")
    if words(prog) > 50:
        fail(f"Progresso esperado excede 50 palavras: {words(prog)}", errors)

    aviso = section(text, "Aviso")
    if aviso and words(aviso) > 30:
        fail(f"Aviso excede 30 palavras: {words(aviso)}", errors)

    nxt = section(text, "Next 01-02-03")
    # Não contar Mermaid no limite textual do Next
    nxt_clean = re.sub(r"```mermaid.*?```", "", nxt, flags=re.DOTALL | re.IGNORECASE)
    if words(nxt_clean) > 100:
        fail(f"Next 01-02-03 excede 100 palavras: {words(nxt_clean)}", errors)

    # Citações em bloco: máximo 12 palavras no conteúdo antes do travessão
    for q in re.findall(r"(?m)^>\s*[“\"](.+?)[”\"]", text):
        if words(q) > 12:
            fail(f"Citação excede 12 palavras: {words(q)}", errors)

    # Processo
    process = section(text, "Processo")
    for required in ("Entender", "Estruturar", "Executar"):
        if required.lower() not in process.lower():
            fail(f"Processo não contém etapa obrigatória: {required}", errors)

    status = "VERIFIED" if not errors else "BLOCKED"
    return status, errors

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Uso: python validate_output.py caminho/saida.md")
        raise SystemExit(2)

    p = Path(sys.argv[1])
    status, errors = validate(p)
    print(f"STATUS: {status}")
    if errors:
        for e in errors:
            print(f"- {e}")
        raise SystemExit(1)
