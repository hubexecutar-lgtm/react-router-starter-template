from __future__ import annotations
from pathlib import Path
from datetime import date
from bs4 import BeautifulSoup, NavigableString
from .tokens import sign_payload
from .qr import svg_data_uri, write_qr

MONTHS={1:'janeiro',2:'fevereiro',3:'março',4:'abril',5:'maio',6:'junho',7:'julho',8:'agosto',9:'setembro',10:'outubro',11:'novembro',12:'dezembro'}

def _replace_meta(meta, strong_text: str, line1: str, line2: str):
    meta.clear(); strong=meta.new_tag('strong') if hasattr(meta,'new_tag') else None

def render(data: dict, canonical_path: Path, output_dir: Path, secret: str) -> dict:
    output_dir.mkdir(parents=True,exist_ok=True)
    soup=BeautifulSoup(canonical_path.read_text(encoding='utf-8'),'html.parser')
    start=date.fromisoformat(data['cycle']['start_date']); end=date.fromisoformat(data['cycle']['end_date'])
    soup.title.string=f"DESK-OS — Sprint {start.day:02d} a {end.day:02d} de {MONTHS[start.month].title()}"
    soup.select_one('h1').string=f"Encadeamento diário — {start.day:02d} a {end.day:02d} de {MONTHS[start.month]} de {start.year}"
    meta=soup.select_one('.meta'); meta.clear()
    strong=soup.new_tag('strong'); strong.string=data['cycle']['name']; meta.append(strong); meta.append(NavigableString('\n    Linear como registro oficial')); meta.append(soup.new_tag('br')); meta.append(NavigableString('\n    QR contextual + QR Recycle\n  '))
    soup.select_one('.goal').string=data['outcome']
    metrics=soup.select('.metric')
    vals=[(data['metrics']['days'],'encadeados'),(data['metrics']['business_deliveries'],'dias úteis'),(data['metrics']['recycle_closures'],'reciclagens semanais')]
    for node,(value,label) in zip(metrics,vals): node.clear(); node.append(str(value)); sm=soup.new_tag('small'); sm.string=label; node.append(sm)
    day_nodes=soup.select('.days .day')
    for node,item in zip(day_nodes,data['days']):
        node['class']=['day']+(['weekend'] if item['weekend'] else [])
        date_node=node.select_one('.date'); date_node.clear(); date_node.append(f"{date.fromisoformat(item['date']).day:02d}"); sm=soup.new_tag('small'); sm.string=item['weekday_label']; date_node.append(sm)
        node.select_one('h2').string=item['deliverable']; node.select_one('p').string=item['description']
        tags=node.select('.tag'); tags[0].string=item['primary_tag']; tags[1].string=item['secondary_tag']; tags[0]['class']=['tag','primary']; tags[1]['class']=['tag']+(['recycle'] if 'Recycle' in item['secondary_tag'] or 'Reconciliação' in item['primary_tag'] else [])
    now=int(__import__('time').time()); ttl=data['qr']['token_ttl_seconds']
    base=data['qr']['gateway_base_url'].rstrip('/')
    common={'workspace':data['workspace'],'project':data['project']['slug'],'cycle':f"{data['cycle']['start_date']}_{data['cycle']['end_date']}"}
    context_payload={'v':2,'kind':'context',**common,'issue':data['linear']['taxonomy_issue_id'],'action':'open_issue'}
    recycle_payload={'v':2,'kind':'recycle',**common,'action':'capture_and_reconcile'}
    context_token=sign_payload(context_payload,secret,ttl); recycle_token=sign_payload(recycle_payload,secret,ttl)
    context_url=base+data['qr']['context_route'].replace('{token}',context_token)
    recycle_url=base+data['qr']['recycle_route'].replace('{token}',recycle_token)
    boxes=soup.select('.qr-box')
    qr_css="\n.qr-box{display:grid;grid-template-columns:20mm 1fr;gap:2mm;align-items:center}.qr-box img{width:20mm;height:20mm}.qr-box span{display:block;font-size:6.2pt;line-height:1.25;color:var(--muted);word-break:break-word}@media(max-width:800px){.qr-box{grid-template-columns:18mm 1fr}.qr-box img{width:18mm;height:18mm}}"
    soup.style.append(qr_css)
    for box,label,url in [(boxes[0],'QR contextual',context_url),(boxes[1],'QR Recycle',recycle_url)]:
        description=box.get_text(' ',strip=True).replace(label,'').strip(); box.clear(); img=soup.new_tag('img',src=svg_data_uri(url),alt=label); box.append(img); wrap=soup.new_tag('div'); st=soup.new_tag('strong'); st.string=label; sp=soup.new_tag('span'); sp.string=description; wrap.append(st); wrap.append(sp); box.append(wrap)
    html_path=output_dir/'sprint.html'; html_path.write_text(str(soup),encoding='utf-8')
    write_qr(context_url,output_dir/'qr-contextual.svg',output_dir/'qr-contextual.png'); write_qr(recycle_url,output_dir/'qr-recycle.svg',output_dir/'qr-recycle.png')
    return {'html':str(html_path),'context_url':context_url,'recycle_url':recycle_url,'context_payload':context_payload,'recycle_payload':recycle_payload}
