# LOGO + FAVICON PACKAGE

ID: BRAND-ASSET-LOGO-001
VERSION: 1.0.0
AREA: Brand / Web / PWA
WORKFLOW: Source → Background cleanup → Crop → Resize → Package → Verify
OWNER: A DEFINIR
STATUS: VERIFIED
AUTOMATION_LEVEL: A4

## Conteúdo

- `source/original.jpg` — referência recebida.
- `logo/logo-transparent-*.png` — versões PNG com fundo externo transparente.
- `logo/logo-white-*.png` — versões sobre fundo branco.
- `favicon/favicon.ico` — ICO multi-resolução: 16, 32, 48 e 64 px.
- `favicon/favicon-*x*.png` — favicons PNG.
- `apple/apple-touch-icon.png` — 180 × 180.
- `pwa/android-chrome-192x192.png` — PWA.
- `pwa/android-chrome-512x512.png` — PWA.
- `pwa/maskable-icon-512x512.png` — PWA com área segura ampliada.
- `social/logo-square-1200x1200.jpg` — avatar/preview quadrado.
- `site.webmanifest` — manifesto base.

## HTML recomendado

```html
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
```

## Verificação

- Proporção preservada.
- Fundo externo removido sem apagar as regiões brancas internas fechadas.
- Arquivos exportados nos tamanhos declarados.
- ICO gerado em múltiplas resoluções.
