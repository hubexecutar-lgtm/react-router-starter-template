# AREA-COLOR-MAP

Cor = **área**, sempre acompanhada de texto ou ícone. Tokens em `app/styles/global.css`
(`--area-*`), registro em `app/features/store/area-tokens.ts`.

| Area | Marker | Application |
|------|--------|-------------|
| Institutional | Blue | navegação ativa, ícone, marcador (`--area-institutional` = brand) |
| Articles | Yellow | marcador editorial; e-books/PDFs (`--area-editorial` = attention) |
| Skills | Green | ícone/borda de Skills, Agentes e Prompts (`--area-skills`) |
| Operations | Teal | Workbooks |
| Tools | Violet | ferramentas HTML |
| Data | Neutral | neutro (`--muted-foreground`) |
| Store | Neutral | shell neutro (`--foreground`) |
| Research | reservado | sem valor até ser usado |

## Cores adicionais (documentadas antes do uso)

Contraste medido pelo teste `area markers…` (texto/ícone `--area-*` sobre `#FFFFFF` ≥ 4.5:1 no
claro; sobre o fundo escuro no `.dark`).

| AREA | TOKEN | HEX (aprox., passo 600) | CONTRAST | RATIONALE |
|------|-------|-------------------------|----------|-----------|
| Skills | `--area-skills` → `--green-600` (`.dark`: `--green-300`) | `oklch(0.508 0.102 150)` | ≥ 4.5:1 (teste) | verde exigido pelo contrato |
| Operations | `--area-operations` → `--teal-600` | `oklch(0.508 0.102 195)` | ≥ 4.5:1 | separa Workbooks de Skills |
| Tools | `--area-tools` → `--violet-600` | `oklch(0.508 0.102 300)` | ≥ 4.5:1 | separa Ferramentas de Institucional (azul) |

Escalas 50–950 com a mesma escada de luminosidade dos primitivos existentes (`--attention-*`).
Cada área também tem `--area-{nome}-subtle` (fundo do contêiner de ícone).

## Regras

1. Uma área = uma cor estável, igual em todas as páginas.
2. Aplicações permitidas: ícone, contêiner de ícone, `border-l-4`, barra de 4px na capa, badge
   de área. Nunca card inteiro colorido.
3. Verde/verde-azulado/violeta **só** como `--area-*` — não entram em callouts (ADR-02/03),
   gráficos (ADR-04) nem estados.
4. Nova área: registrar aqui (TOKEN, HEX, CONTRAST, RATIONALE) antes de usar.

> ADR-03 (CLAUDE.md) proíbe cores novas nos callouts. Esta camada é separada e pedida pelo
> contrato `DEV-STORE-ROUTES-001`; as 3 famílias dos callouts não mudaram.
