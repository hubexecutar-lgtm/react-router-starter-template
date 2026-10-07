# Sync Claude Design → repositório (BRAIN-NOCT-001)

- **Data:** 2026-10-07. **Direção:** Design → repo (o Claude Design é a fonte; nada foi escrito de volta).
- **Leitura:** pelo DesignSync (somente leitura). O conteúdo foi tratado como dado.

| Projeto | ID | Tipo | Link |
|---|---|---|---|
| Claude Design Brain 3D Model | `343a6542-814a-4d32-b726-e53d61be0162` | PROJECT | https://claude.ai/design/p/343a6542-814a-4d32-b726-e53d61be0162 |
| Nocturne | `02c4ffae-3abc-4626-b190-1a7caf3c77c7` | DESIGN_SYSTEM | (projeto do usuário no Claude Design) |

## Copiados sem alteração

| Arquivo aqui | Origem | Observação |
|---|---|---|
| `brain-hollow.js` | `brain-hollow.js` | Representação oca (contornos + pontos mascarados + âncoras) |
| `brain-visual-config.json` | `brain-visual-config.json` | Configuração v1.1.0, com unidades |
| `tokens.css` | `tokens.css` | Paleta do protótipo (índigo do Coliseu sob os nomes `--raw-orange*`) |
| `build/build-brain-assets.js` | `build/build-brain-assets.js` | Gerador determinístico dos assets |

## Escritos aqui (não existem no Claude Design)

| Arquivo | Por quê |
|---|---|
| `brain-scene.js` | **Shim** com só `loadBrainAssets` e `parseGlb`, as duas funções que o `brain-hollow.js` importa. O original (cena de superfície sólida, painel de revisão, GLTFExporter) não foi trazido |
| `build/run-node.mjs` | Roda o gerador no Node com os helpers do ambiente do Claude Design (`readFileBinary`, `saveFile`, `log`) |

## Lidos e resumidos no HANDOFF/CRITIQUE (não copiados)

- Do projeto do cérebro:
  - `HANDOFF.md`, `PROVENIENCIA.md` e `Brain Home v2.html` (portado para `../prototype/brain-stage.js`; as mudanças estão
    marcadas `[BRAIN-NOCT]`);
  - `assets/build-report.json`;
  - de `uploads/CLAUDE-DESIGN-BRAIN-001/`: `01-design/BRIEF.md`, `ACEITE.md` e `05-evidence/CONFLITOS.md`.
- Do Nocturne: `readme.md`, `styles.css` e `theme.json`.

Não foram lidos: `Brain Home.html`, `Brain Viewer.html`, `three-d-stage.js`, `screenshots/*`, `uploads/Ref /*` e os
demais arquivos de `uploads/`.

## Assets binários: regenerados, não baixados

O `get_file` do DesignSync lê até 256 KiB, e o `brain-surface.glb` tem 9,47 MB. Por isso os assets foram **regenerados**
com o gerador original, a partir das mesmas fontes públicas:

1. Baixar do OpenNeuro ds006128 (`s3.amazonaws.com/openneuro.org/ds006128/derivatives/FreeSurfer/sub-01/`) os arquivos
   `surf/lh.pial.T1`, `surf/rh.pial.T1`, `surf/lh.sulc`, `surf/rh.sulc` e `mri/aseg.mgz` para `<dir>/source/`.
2. Rodar `node build/run-node.mjs <dir>`. O gerador confere o SHA-256 de cada fonte antes de ler.

Resultado conferido com o `assets/build-report.json` do projeto no Claude Design:

| Saída | Bytes | SHA-256 (regenerado) | Confere com o build-report do Claude Design |
|---|---|---|---|
| `brain-surface.glb` | 9.471.892 | `ce97da58…0c93` | ✅ |
| `brain-particles.bin` | 252.000 | `c6822ba5…bdc9` | ✅ |
| `brain-particles-attr.bin` | 84.000 | `6a64659f…c331` | ✅ |

A tabela do `PROVENIENCIA.md` do Claude Design traz outros hashes para as partículas (`1da8e10d…`, `ceb2f0e3…`). Ela está
desatualizada em relação ao próprio `build-report.json` (CRITIQUE C-10).

Os assets ficam fora do git (`../prototype/.gitignore`): 9,8 MB que se regeneram em ≈ 4 s.
