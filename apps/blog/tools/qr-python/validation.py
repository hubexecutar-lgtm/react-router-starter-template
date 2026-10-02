from __future__ import annotations
from dataclasses import dataclass, asdict
from datetime import date, timedelta
from pathlib import Path
from typing import Any
import json, hashlib, re
from jsonschema import Draft202012Validator, FormatChecker
from bs4 import BeautifulSoup

@dataclass
class Finding:
    level: str
    code: str
    message: str
    path: str = ''

@dataclass
class ValidationReport:
    valid: bool
    errors: list[Finding]
    warnings: list[Finding]
    facts: dict[str, Any]
    def to_dict(self): return {'valid':self.valid,'errors':[asdict(x) for x in self.errors],'warnings':[asdict(x) for x in self.warnings],'facts':self.facts}

def validate_data(data: dict[str, Any], schema_path: Path) -> ValidationReport:
    schema = json.loads(schema_path.read_text(encoding='utf-8'))
    errors=[]; warnings=[]
    validator=Draft202012Validator(schema, format_checker=FormatChecker())
    for e in sorted(validator.iter_errors(data), key=lambda x:list(x.path)):
        errors.append(Finding('error','SCHEMA',e.message,'/'.join(str(x) for x in e.path)))
    days=data.get('days',[])
    parsed=[]
    for i,d in enumerate(days):
        try: parsed.append(date.fromisoformat(d['date']))
        except Exception: continue
        if len(d.get('steps',[])) != 3: errors.append(Finding('error','THREE_STEPS','Cada dia deve possuir exatamente três passos.',f'days/{i}/steps'))
        expected_weekend=parsed[-1].weekday()>=5
        if d.get('weekend') is not expected_weekend: errors.append(Finding('error','WEEKEND_MISMATCH','O campo weekend não corresponde à data.',f'days/{i}/weekend'))
        if d.get('linear_issue_id') == 'LACUNA': warnings.append(Finding('warning','LINEAR_LACUNA','Issue real do Linear ainda não vinculada.',f'days/{i}/linear_issue_id'))
        if d.get('evidence') == 'LACUNA': warnings.append(Finding('warning','EVIDENCE_LACUNA','Evidência ainda não registrada.',f'days/{i}/evidence'))
    if parsed:
        for i in range(1,len(parsed)):
            if parsed[i] != parsed[i-1]+timedelta(days=1): errors.append(Finding('error','DATE_CHAIN','As datas precisam ser consecutivas.',f'days/{i}/date'))
        cycle=data.get('cycle',{})
        if cycle.get('start_date') and parsed[0].isoformat()!=cycle['start_date']: errors.append(Finding('error','START_DATE','Primeiro dia difere do início do ciclo.','cycle/start_date'))
        if cycle.get('end_date') and parsed[-1].isoformat()!=cycle['end_date']: errors.append(Finding('error','END_DATE','Último dia difere do fim do ciclo.','cycle/end_date'))
    business=sum(1 for d in days if not d.get('weekend'))
    if data.get('metrics',{}).get('business_deliveries') != business: errors.append(Finding('error','BUSINESS_METRIC','Métrica de entregas úteis não corresponde aos dias úteis.','metrics/business_deliveries'))
    gateway=data.get('qr',{}).get('gateway_base_url','')
    if gateway and any(x in gateway for x in ['linear.app','github.com']): errors.append(Finding('error','DIRECT_VENDOR_QR','O gateway do QR não pode apontar diretamente para fornecedor.','qr/gateway_base_url'))
    state_map=data.get('linear',{}).get('state_map',{})
    for k,v in state_map.items():
        if v=='LACUNA': warnings.append(Finding('warning','STATE_UUID_LACUNA',f'UUID do estado “{k}” não configurado.',f'linear/state_map/{k}'))
    return ValidationReport(not errors,errors,warnings,{'day_count':len(days),'business_days':business,'warning_count':len(warnings)})

def validate_canonical_html(path: Path, expected_sha256: str | None = None) -> ValidationReport:
    raw=path.read_text(encoding='utf-8'); soup=BeautifulSoup(raw,'html.parser'); errors=[]; warnings=[]
    if expected_sha256 and hashlib.sha256(raw.encode()).hexdigest()!=expected_sha256: errors.append(Finding('error','CANONICAL_HASH','O template canônico foi alterado.'))
    checks=[('PAGE','.page',1),('FLOW','.flow',1),('SUMMARY','.summary',1),('DAYS','.days',1),('DAY_COUNT','.day',14),('QR_BOX','.qr-box',2)]
    for code,selector,count in checks:
        actual=len(soup.select(selector))
        if actual!=count: errors.append(Finding('error',code,f'Esperado {count} elemento(s) {selector}; encontrado {actual}.'))
    css=soup.style.get_text() if soup.style else ''
    for token in ['width:210mm','min-height:297mm','padding:9mm','grid-template-columns:1fr 1fr','@page{size:A4 portrait']:
        if token.replace(' ','') not in css.replace(' ',''): errors.append(Finding('error','CANONICAL_CSS',f'Regra canônica ausente: {token}'))
    return ValidationReport(not errors,errors,warnings,{'sha256':hashlib.sha256(raw.encode()).hexdigest(),'day_nodes':len(soup.select('.day'))})


def validate_generated_html(path: Path) -> ValidationReport:
    raw=path.read_text(encoding='utf-8'); soup=BeautifulSoup(raw,'html.parser'); errors=[]; warnings=[]
    if len(soup.select('.days .day')) != 14:
        errors.append(Finding('error','GENERATED_DAY_COUNT','O HTML gerado precisa conter 14 dias.'))
    images=soup.select('.qr-box img')
    if len(images) != 2:
        errors.append(Finding('error','GENERATED_QR_COUNT','O HTML gerado precisa conter dois QRs incorporados.'))
    for i,img in enumerate(images):
        src=img.get('src','')
        if not (src.startswith('data:image/svg+xml;base64,') or src.lower().endswith(('.svg','.png'))):
            errors.append(Finding('error','GENERATED_QR_SOURCE','Fonte de QR inválida.',f'qr/{i}'))
    if 'https://linear.app/' in raw and '/q/' not in raw:
        warnings.append(Finding('warning','DIRECT_LINEAR_REFERENCE','Há referência ao Linear sem evidência visível do gateway QR.'))
    return ValidationReport(not errors,errors,warnings,{'sha256':hashlib.sha256(raw.encode()).hexdigest(),'embedded_qr_count':len(images),'size_bytes':len(raw.encode())})
