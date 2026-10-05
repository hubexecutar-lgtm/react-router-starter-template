# Risco Cognitivo — Publication Pack v3.0.0

ID: `RC-PUB-PACK-003`  
VERSION: `3.0.0`  
AREA: Gestão e Controle de Riscos Cognitivos / Editorial  
WORKFLOW: Conversa → Síntese → Evidência → Schema → Artigos → Soluções → Validação → Handoff  
OWNER: A DEFINIR  
STATUS: `VERIFIED_STATIC / READY_FOR_PUBLICATION`  
AUTOMATION_LEVEL: A4 para organização, geração e validação estática; publicação/deploy não executados.

## Objetivo

Consolidar o trabalho desenvolvido na conversa em um pacote editorial limpo, rastreável e pronto para integrar ao blog. O pack preserva a distinção entre:

- **conceito operacional próprio**: Gestão e Controle de Riscos Cognitivos;
- **evidência científica**: estudos que sustentam funções, mecanismos e intervenções específicas;
- **hipótese operacional/de design**: combinações próprias como WIP 1:1, Scroll Task e o Plano Operacional Rastreável completo.

## Conteúdo

```text
RC_PUBLICATION_PACK_v3.0.0/
├── 00-governance/
│   ├── SCHEMA-CANONICO.md
│   ├── EDITORIAL-ARCHITECTURE.md
│   └── ROUTES-HANDOFF.md
├── 01-articles/
│   ├── 00-riscos-cognitivos-guia-fundador.mdx
│   ├── 01-o-que-sao-riscos-cognitivos.mdx
│   ├── 02-funcoes-executivas-demandas-e-risco.mdx
│   ├── 03-riscos-cognitivos-rotina-estudos-trabalho.mdx
│   └── 04-seis-estrategias-para-reduzir-riscos-cognitivos.mdx
├── 02-solutions/
│   └── 6 artigos MDX, um por solução
├── 03-data/
│   ├── RC_SCHEMA_6_SOLUCOES_v3.0.0.yaml
│   └── assets-manifest.json
├── 04-evidence/
│   ├── EVIDENCE-REGISTRY.md
│   └── SOURCE-NOTES.md
├── 05-assets/solutions/
│   └── 6 infográficos 16:9
├── 06-wireframes/
│   └── wireframe HTML das seis soluções
├── 07-source-artifacts/
│   └── artefatos operacionais produzidos/fornecidos na conversa
└── 08-validation/
    ├── publication-checklist.md
    └── validation.json
```

## Regra editorial central

O framework usa a cadeia:

`DOR → CONTEXTO → DEMANDA → FUNÇÃO → VULNERABILIDADE → RISCO → TÉCNICA → APLICAÇÃO → INDICADOR → PROGRESSO`

O quadrante amarelo de cada solução foi normalizado para **exatamente 12 palavras**, conforme o schema definido na conversa.

## Handoff

Os arquivos `.mdx` usam import explícito de `PlainTextPanel` e `AsciiDiagram` pelo caminho padrão da skill: `@/components/plain`. O caminho precisa coincidir com o projeto real no momento da integração. Não foi executado build, commit, publicação, CMS ou deploy.
