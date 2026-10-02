#!/usr/bin/env python3
from pathlib import Path
import re
import sys

root = Path(__file__).resolve().parents[1]
errors = []

required = [
    "SKILL.md",
    "references/content-contract.yaml",
    "references/research-contract.yaml",
    "references/source-contract.yaml",
    "references/safety-guardrails.yaml",
    "references/output-contract.yaml",
    "references/validation-rules.yaml",
    "assets/quick-framework-template.md",
    "assets/infographic-brief.yaml",
    "evals/cases.yaml",
    "scripts/validate_output.py",
]

for rel in required:
    if not (root / rel).exists():
        errors.append(f"Arquivo ausente: {rel}")

skill = (root / "SKILL.md").read_text(encoding="utf-8")
if not skill.startswith("---\n"):
    errors.append("SKILL.md deve começar com YAML frontmatter.")

m = re.search(r"(?ms)^---\n(.*?)\n---", skill)
if not m:
    errors.append("Frontmatter não encontrado.")
else:
    front = m.group(1)
    if "name: executar-block-quick-frameworks" not in front:
        errors.append("Campo name inválido ou ausente.")
    if "description:" not in front:
        errors.append("Campo description ausente.")

if root.name != "executar-block-quick-frameworks":
    errors.append("Nome da pasta deve ser executar-block-quick-frameworks.")

if (root / "README.md").exists():
    errors.append("Não incluir README.md dentro da skill.")

print("STATUS:", "VERIFIED" if not errors else "BLOCKED")
for e in errors:
    print("-", e)

raise SystemExit(1 if errors else 0)
