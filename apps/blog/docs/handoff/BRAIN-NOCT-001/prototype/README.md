# Mockups navegáveis (BRAIN-NOCT-001)

HTML estático, fora do app. `landing.html` e `mapa.html` consomem `tokens.css` e `ui.css` (Nocturne com a paleta Coliseu)
e `brain-stage.js`, que é o porte do `Brain Home v2.html` do Claude Design, com as mudanças marcadas `[BRAIN-NOCT]`.

```sh
# 1. Fontes do OpenNeuro (ver ../fonte-design/SYNC.md) em <dir>/source/, depois:
node apps/blog/docs/handoff/BRAIN-NOCT-001/fonte-design/build/run-node.mjs <dir>
# 2. Revisão manual: http://127.0.0.1:4410/prototype/landing.html
node apps/blog/docs/handoff/BRAIN-NOCT-001/prototype/capture.mjs <dir>/assets --serve
# 3. Capturas dos 6 estados × 1440/390 em ../mockups/
node apps/blog/docs/handoff/BRAIN-NOCT-001/prototype/capture.mjs <dir>/assets
# 4. Tabela de contraste do A11Y.md
node apps/blog/docs/handoff/BRAIN-NOCT-001/prototype/contrast.mjs
```

Rode tudo da raiz do repositório: o `capture.mjs` serve o three.js de `node_modules/three/build` e usa o Playwright
(WebGL por SwiftShader) e o `sharp`.

Parâmetros de captura:
- `?nowebgl=1` força o fallback;
- `?foco=COG-…` abre uma função no Mapa;
- `window.__brain` expõe o estado para as capturas.
