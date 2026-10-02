from pathlib import Path
import argparse, json, os, sys
from .validation import validate_data, validate_canonical_html
from .generator import generate
from .tokens import sign_payload, verify_token

def main():
    p=argparse.ArgumentParser(prog='desk-os-sprint-qr'); sub=p.add_subparsers(dest='cmd',required=True)
    v=sub.add_parser('validate'); v.add_argument('input'); v.add_argument('--root',default='.')
    g=sub.add_parser('generate'); g.add_argument('input'); g.add_argument('output'); g.add_argument('--root',default='.')
    b=sub.add_parser('batch'); b.add_argument('input_dir'); b.add_argument('output_dir'); b.add_argument('--root',default='.')
    s=sub.add_parser('sign'); s.add_argument('payload'); s.add_argument('--ttl',type=int,default=1209600)
    x=sub.add_parser('verify'); x.add_argument('token')
    h=sub.add_parser('validate-generated'); h.add_argument('html')
    a=p.parse_args(); root=Path(getattr(a,'root','.')).resolve(); secret=os.environ.get('QR_SIGNING_SECRET','')
    if a.cmd=='validate':
        data=json.loads(Path(a.input).read_text(encoding='utf-8')); r=validate_data(data,root/'schemas/sprint-input.schema.json'); c=validate_canonical_html(root/'canonical/one-page-sprint.source.html',(root/'canonical/SHA256SUMS').read_text().split()[0]); print(json.dumps({'data':r.to_dict(),'canonical':c.to_dict()},ensure_ascii=False,indent=2)); sys.exit(0 if r.valid and c.valid else 1)
    if a.cmd=='generate':
        if not secret: raise SystemExit('Defina QR_SIGNING_SECRET (mínimo 32 caracteres).')
        print(json.dumps(generate(Path(a.input),root,Path(a.output),secret),ensure_ascii=False,indent=2))
    if a.cmd=='batch':
        if not secret: raise SystemExit('Defina QR_SIGNING_SECRET (mínimo 32 caracteres).')
        for f in sorted(Path(a.input_dir).glob('*.json')): generate(f,root,Path(a.output_dir)/f.stem,secret)
    if a.cmd=='sign':
        if not secret:
            raise SystemExit('Defina QR_SIGNING_SECRET.')
        print(sign_payload(json.loads(Path(a.payload).read_text(encoding='utf-8')),secret,a.ttl))
    if a.cmd=='verify':
        if not secret:
            raise SystemExit('Defina QR_SIGNING_SECRET.')
        print(json.dumps(verify_token(a.token,secret),ensure_ascii=False,indent=2))
    if a.cmd=='validate-generated':
        from .validation import validate_generated_html
        report=validate_generated_html(Path(a.html))
        print(json.dumps(report.to_dict(),ensure_ascii=False,indent=2))
        sys.exit(0 if report.valid else 1)
if __name__=='__main__': main()
