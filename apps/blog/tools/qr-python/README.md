# tools/qr-python — gerador DESK-OS Sprint (arquivo de referência)

Módulos Python recebidos em `PACOTE_QR_ROTAS_E_PYTHON.zip`. **Não fazem parte do build do site** e
**não geram o catálogo de rotas** — esse catálogo é `/admin/rotas/`, alimentado por `src/data/routes.ts`.

## O que é

Gerador de one-pagers "DESK-OS — Sprint" com QR Codes contextuais assinados:

| Módulo | Função |
|---|---|
| `cli.py` | CLI `desk-os-sprint-qr`: `validate`, `generate`, `batch`, `sign`, `verify`, `validate-generated` |
| `generator.py` | Valida entrada e HTML canônico, renderiza, valida a saída e grava `manifest.json` |
| `render.py` | Preenche o HTML canônico (BeautifulSoup) e injeta os QRs `context` e `recycle` |
| `qr.py` | QR em SVG/PNG (`qrcode`) |
| `validation.py` | Valida JSON de entrada (JSON Schema), HTML canônico (SHA-256) e HTML gerado |

## O que falta para rodar (não veio no pacote)

- `tokens.py` (`sign_payload`, `verify_token`), importado por `cli.py` e `render.py`;
- `schemas/sprint-input.schema.json`;
- `canonical/one-page-sprint.source.html` e `canonical/SHA256SUMS`.

Os módulos usam imports relativos (`from .validation import …`): instale-os como pacote
(ex.: `desk_os_sprint_qr/`) junto com os arquivos acima. Apenas `qr.py` roda isolado.

## Dependências

`qrcode`, `beautifulsoup4`, `jsonschema` (Python ≥ 3.11).

## Segredo

A assinatura usa a variável de ambiente `QR_SIGNING_SECRET` (mínimo 32 caracteres).
**Nunca** commite o valor.

## Regenerar o zip de download

```bash
cd tools && zip -r ../public/admin/tools/qr-python.zip qr-python -x '*.pyc' -x '*__pycache__*'
```
