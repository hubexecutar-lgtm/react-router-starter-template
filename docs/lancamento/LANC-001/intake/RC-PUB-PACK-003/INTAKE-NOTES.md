# RC-PUB-PACK-003 — notas de intake (2026-10-05)

- **Origem:** `RC_PUBLICATION_PACK_v3.0.0.zip` enviado pelo usuário. Os textos estão aqui sem alteração; o blog lê deles.
- **Fontes (RC-SRC-002):** os 13 PMIDs/URLs do `04-evidence/EVIDENCE-REGISTRY.md` foram conferidos no PubMed (esummary) e no
  IBGE em 2026-10-05: todos existem e os títulos batem. A lacuna do registro (`lgo2026`, autor "A DEFINIR") foi resolvida
  com o PubMed: Lidström Holmqvist K et al., *Disabil Rehabil*, 2026. O canônico gerado é
  `RC_SRC_002_FONTES_CIENTIFICAS.txt`; o grafo tem um nó EVIDENCE por fonte (`EVD-*-AAAA`).
- **Rotas (decisões do usuário):** o fundador vai para `/artigos/riscos-cognitivos-guia/` (o P1 canônico continua em
  `/artigos/riscos-cognitivos/`); os outros 4 artigos mantêm o slug do pack; as 6 soluções vão para
  `/ferramentas/solucoes/<slug>/` (slug do pack sem o prefixo `solucoes/`).
- **Ajustes de rota nos MDX (sem reescrita de texto):** `slug` do frontmatter; comentário de proveniência no topo; no
  artigo 04, cada `![Infográfico — …](…png)` virou `<SolutionLink slug="…" />`; nas soluções, a linha do infográfico saiu.
- **Infográficos não publicados (decisão do usuário):** os 6 PNG são da v2.0 e divergem do texto v3.0. Nos de 01, 02 e
  04, o texto amarelo de 12 palavras difere; as citações de dor também; e o 04 cita o PMID 33393806 (Jones et al. 2021,
  *Neuropsychology*), que não está no registro. As páginas mostram o card 2×2 em HTML com o texto v3. Os PNG não entram no
  repositório: os hashes estão abaixo para quando forem regerados.
- **07-source-artifacts:** são origem, não publicação; ficam fora do repositório. Hashes abaixo.

## Hashes dos arquivos não versionados

```text
6e08683e318ae52601217953e143204b83f5d5afcfad3b08928b4128bde324d4  01-status-report.png
84dda892d3d9cf5e473992e02bbfd2f331b512d2a119a74ec10d4b61d725e4c9  02-plano-dos-7-dias.png
f57d1d5c717ca3e3f144c8a7d420595fed498802cd12fbed95f5fddfe6e21e0a  03-meu-processo-de-trabalho.png
c6bc63b29641bf5a69ccdcfacce0fa41dd32ec75cd984b32caa6a58fff522ca1  04-formulario-padrao-do-ciclo.png
741a69df5c39ab7fe506833cecf43324895baddd0f9363e1870b984bcbc263d6  05-plano-operacional-rastreavel.png
6f3b8be3eb7e89cc3a82e27357e08dc01c48004a12c2a9256cdae41e9892849c  06-scroll-task.png
d169b149f4dd60aa209107ab962368c5c5c09b4869d57610be0a016f3c90e8aa  ID03-processo-trabalho-formulario-semana.html
028bbfed56fc9ef71954f3fe58a9d870d8f604e18d8508215884ac2cb150f16c  RC_WIREFRAMES_4_SOLUCOES_v1.0.0.html
415d8f43cc5fc323b25c03f1961eab1913c4ffcbc5486bc2315df172b380da5b  executar_scroll_task_html_prototype.zip
61831788f0ff5ee5a9e8f5e96c8748f624a7cf61642aa48160cc5dc780b382eb  plano-operacional-rastreavel.zip
7662d1731fc997fb8f3af5d6a8b3e8c58540c0205d6c401b6da100e1e2c62aeb  risco-cognitivo-a4-pack-unificado.html
4cc2a4a876714ac7fa6ed1d2c1405c6a7e30ce32737e70aad2d4ed86eac76b38  workbook_operacional_v2_7_dias_offline.html
```
