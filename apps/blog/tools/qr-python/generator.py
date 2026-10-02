from __future__ import annotations
from pathlib import Path
import hashlib, json
from datetime import datetime, timezone
from .validation import validate_data, validate_canonical_html, validate_generated_html
from .render import render

def generate(input_path: Path, package_root: Path, output_dir: Path, secret: str) -> dict:
    data=json.loads(input_path.read_text(encoding='utf-8'))
    data_report=validate_data(data,package_root/'schemas/sprint-input.schema.json')
    expected=(package_root/'canonical/SHA256SUMS').read_text().split()[0]
    html_report=validate_canonical_html(package_root/'canonical/one-page-sprint.source.html',expected)
    if not data_report.valid or not html_report.valid:
        report={'valid':False,'data':data_report.to_dict(),'canonical':html_report.to_dict()}; output_dir.mkdir(parents=True,exist_ok=True); (output_dir/'validation-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8'); raise ValueError('Validação falhou; consulte validation-report.json')
    rendered=render(data,package_root/'canonical/one-page-sprint.source.html',output_dir,secret)
    normalized=output_dir/'sprint.normalized.json'; normalized.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
    generated_report=validate_generated_html(Path(rendered['html']))
    report={'valid':generated_report.valid,'data':data_report.to_dict(),'canonical':html_report.to_dict(),'generated':generated_report.to_dict()}; (output_dir/'validation-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
    if not generated_report.valid: raise ValueError('HTML gerado inválido; consulte validation-report.json')
    manifest={'generator_version':'2.0.0','generated_at':datetime.now(timezone.utc).isoformat(),'input_sha256':hashlib.sha256(input_path.read_bytes()).hexdigest(),'canonical_sha256':expected,'files':rendered,'warnings':data_report.to_dict()['warnings']}
    (output_dir/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
    return manifest
