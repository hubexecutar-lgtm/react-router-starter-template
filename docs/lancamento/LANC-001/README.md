# LANC-001 — Pacote de lançamento

- **Status:** INTAKE ABERTO · requisitos v0.2.0 (Q1–Q8 respondidas) · pronto para a onda 0
- **Próxima sessão:** [`KICKOFF-PROXIMA-SESSAO.md`](./KICKOFF-PROXIMA-SESSAO.md) · **Saídas esperadas:** [`ENTREGAVEIS-POR-ONDA.md`](./ENTREGAVEIS-POR-ONDA.md)
- **Workflow de engenharia:** [`WORKFLOW.md`](./WORKFLOW.md) · **Requisitos:** [`requirements/`](./requirements/README.md)

Esta pasta guarda os arquivos **como recebidos** (`intake/`) e os requisitos derivados deles (`requirements/`).
Nada aqui é lido pelo build dos apps. A implementação acontece em PRs separados (ADR-M02), que citam os IDs RQ-xxx
e o caminho/hash do intake.

## Recebimentos

| # | Upload | sha256 do zip | Data |
|---|---|---|---|
| 1 | `lancamento_.zip` | `f1cbfcb2ab326909366b3c180ff5d30da0095f3480758b02a1756b87db59a7e6` | 2026-10-04 |
| 2 | `Docs__2.zip` → `intake/DOCS-002/` | `437f52fd4973298cf5b8cc5c236b682d572081df4390c87c85cabe031de21a19` | 2026-10-04 |

## Conteúdo do intake

| Pacote | Caminho | ID / status declarado | Uso |
|---|---|---|---|
| Logo + favicon | `intake/LOGO_FAVICON_PACKAGE_v1.0.0/` | BRAND-ASSET-LOGO-001 1.0.0 · VERIFIED | EP-01 |
| Mockups v4, v6, v7 | `intake/*.html` | v7 = Brand Local + motion | EP-02, EP-03 (DEC-U1/U2) |
| Tokens do v6 | `intake/tokens-hybrid.{css,json}`, `intake/README.md` | v6 · paleta descartada (DEC-U2) | estrutura de layout apenas |
| Teia Única de Correlação | `intake/EXECUTAR-TEIA-UNICA-CORRELACAO-v0.1.0/` | ARCH-EXEC-CORRELATION-GRAPH-001 · **Aceita** (OWNER Leonardo, DEC-U10) | EP-07, EP-12 |
| Brand styling (gráfico e vetor) | `intake/DOCS-002/notas/RC-BRAND-STYLING-001.*` | RC-BRAND-STYLING-001 1.0.0 · PREPARED | EP-02 (camada `--illu-*`) |
| Spec do mapa causal mobile | `intake/DOCS-002/notas/RC-MOBILE-CAUSAL-MAP-UI-001.md` | 1.0.0 · PREPARED | EP-07, EP-08, EP-09 |
| Notas de mapa causal (CKG, CLD) | `intake/DOCS-002/notas/causal-*.md` | sem ID | EP-08 |
| Índice de rotas / web de conversão | `intake/DOCS-002/notas/indice-rotas-web-conversion.md` | WEB-CONVERSION-001 · PREPARED | EP-06, EP-10, EP-11 |
| Pacote editorial (5 textos + fontes) | `intake/DOCS-002/RC_EDITORIAL_PLAIN_TXT_v1.0.0/` | RC-EDITORIAL-PACK-001 1.0.0 · VERIFIED/CANÔNICO | EP-05 |
| Imagens | `intake/DOCS-002/RC_IMAGENS_RENOMEADAS_v1.0.0/` | 6 publicáveis (RC_*), 3 só referência (REF_*) | EP-04 |

Integridade: `intake/MANIFEST.sha256` (`cd intake && sha256sum -c MANIFEST.sha256`). Os manifestos próprios da
Teia Única, do pacote editorial e do índice de imagens conferem. Nomes normalizados do DOCS-002 em
`intake/DOCS-002/ORIGEM.md`.

## Como acrescentar arquivos

1. Copiar para `intake/` (ou `intake/DOCS-00N/`) sem `__MACOSX`, `._*` e `.obsidian/`; nomes com espaço final ou
   acento são normalizados e registrados num `ORIGEM.md`.
2. Regenerar o manifesto: `cd intake && find . -type f ! -name MANIFEST.sha256 | LC_ALL=C sort | xargs -d '\n' sha256sum > MANIFEST.sha256`.
3. Registrar o recebimento acima; se mudar escopo, atualizar `requirements/requisitos.json` e rodar `python3 render.py`.
