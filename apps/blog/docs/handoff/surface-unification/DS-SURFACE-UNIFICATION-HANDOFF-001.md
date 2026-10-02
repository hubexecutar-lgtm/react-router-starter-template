# DS-SURFACE-UNIFICATION-HANDOFF-001

> **Proveniência (monorepo).** Handoff recebido no repositório original do Blog (Astro) e implementado
> lá (branch `claude/trusting-gates-go053v`); portado para `apps/blog` com o ADR-09. Caminhos `src/…`
> correspondem a `app/…`.

VERSION: 1.0.0  
AREA: Design System / UI Foundations / Blog  
WORKFLOW: Audit → Normalize tokens → Component defaults → Migration → Visual regression  
OWNER: A DEFINIR  
STATUS: PREPARED_FOR_IMPLEMENTATION  
AUDIT_STATUS: VERIFIED  
AUTOMATION_LEVEL: Audit A4 / Implementation A1

## 1. Contexto

O blog possui mais de uma linguagem visual para superfícies, bordas, raios e sombras. A referência aprovada para o novo padrão é a aparência do bloco tabular exibido em `/admin/design-system/`: superfícies cinza muito claras, separação limpa, sem efeito de elevação aparente e com borda neutra discreta quando necessária.

A página atual do Design System já documenta o visual desejado no namespace local `--plain-*`:

- `--plain-surface: #F8F8F8`
- `--plain-border: #EBEBEB`
- `--plain-text: #000000`
- `--plain-radius-desktop / mobile: 28px / 22px`

Ao mesmo tempo, o sistema mantém tokens globais separados (`--card`, `--border`, `--muted`, `--background`) e cinco níveis de sombra (`shadow-xs` a `shadow-xl`). O problema principal é de governança: o padrão visual preferido está encapsulado em um subsistema local de Plain Text, e não definido como contrato global de superfície para cards e tabelas.

## 2. Escopo

### Incluído
- superfícies neutras;
- bordas e divisores;
- cards estáticos e interativos;
- tabelas Markdown e componente `Table`;
- painéis PlainText/Ascii;
- cards administrativos, catálogo, indicadores e blocos de conteúdo;
- regras de sombra/elevation;
- raios de borda;
- migração e testes visuais.

### Excluído
- mudança de paleta `brand`, `attention` e `critical`;
- redesign de tipografia;
- alteração funcional de rotas;
- mudança de conteúdo editorial;
- substituição dos Callouts semânticos, que devem manter suas famílias cromáticas próprias.

## 3. INPUT

- rota pública: `/admin/design-system/`;
- screenshots de referência enviados;
- pacote `Design-1.2.0-v1 2(1).zip` com workflows `design-system`, `design-handoff` e `design-critique`;
- documentação pública do Design System atual.

## 4. Resultado esperado

Um único contrato visual de superfícies para o blog inteiro, com:

1. card padrão cinza claro;
2. borda neutra discreta;
3. sombra desligada por padrão;
4. sombra reservada a overlays e elevação real;
5. tabelas segmentadas com células cinza separadas;
6. tokens semânticos globais consumidos por todos os componentes;
7. `--plain-*` transformados em aliases, não em um sistema visual paralelo.

## 5. Diagnóstico

### FINDING DS-001 — Fonte de verdade dividida
SEVERITY: P0

O visual desejado existe em `--plain-surface` e `--plain-border`, porém cards e outras superfícies usam tokens globais separados. Isso permite que cada família de componente derive um visual diferente.

DECISÃO: promover a superfície Plain para um token semântico global e fazer `--plain-*` apontar para ele.

### FINDING DS-002 — Elevação sem contrato semântico
SEVERITY: P0

O sistema expõe `shadow-xs`, `shadow-sm`, `shadow-md`, `shadow-lg` e `shadow-xl`, mas não define qual componente pode utilizar qual nível. Isso favorece sombra arbitrária em cards.

DECISÃO: cards normais usam `box-shadow: none`. Sombras ficam reservadas para popover, dialog, drawer, tooltip/hover-card e outras camadas elevadas.

### FINDING DS-003 — Card padrão não expressa a referência aprovada
SEVERITY: P0

O componente `card` existe, mas o contrato documentado não especifica de forma única superfície, borda, sombra e raio.

DECISÃO: `Card/default` passa a usar superfície cinza neutra, borda sutil e nenhuma sombra.

### FINDING DS-004 — Tabela está correta visualmente, mas especializada
SEVERITY: P1

A tabela de referência já possui o comportamento visual desejado: células cinza separadas. Contudo, esse padrão está documentado dentro de Plain Text.

DECISÃO: transformar o estilo em `Table/default` e em regra de tabela Markdown global.

### FINDING DS-005 — Raios locais concorrem com raios globais
SEVERITY: P1

O Plain Text declara 28px/22px, enquanto o Design System também possui `radius-sm`, `radius-lg`, `radius-xl` e raios de Callout.

DECISÃO: manter 28px/22px apenas para painéis Plain/Ascii de grande superfície; cards normais usam a escala global. Não usar o raio do painel Plain como raio universal.

## 6. Contrato visual aprovado

### 6.1 Tokens semânticos novos

```css
:root {
  --surface-canvas: var(--background);
  --surface-neutral: #F8F8F8;
  --surface-neutral-border: #EBEBEB;
  --surface-neutral-strong: var(--muted);

  --surface-shadow-flat: none;
  --surface-shadow-raised: var(--shadow-sm);
  --surface-shadow-overlay: var(--shadow-md);

  --surface-radius-card: var(--radius-xl);
  --surface-radius-cell: var(--radius-sm);

  /* compatibilidade: Plain deixa de ser um sistema paralelo */
  --plain-surface: var(--surface-neutral);
  --plain-border: var(--surface-neutral-border);
}
```

OBSERVAÇÃO: caso o projeto use outra sintaxe interna para tokens de cor, preservar a sintaxe existente e manter a semântica acima.

### 6.2 Card/default

```css
.ds-card {
  background: var(--surface-neutral);
  border: 1px solid var(--surface-neutral-border);
  border-radius: var(--surface-radius-card);
  box-shadow: var(--surface-shadow-flat);
}
```

REGRAS:
- nenhuma sombra no estado default;
- hover não deve introduzir `shadow-md/lg`;
- em card clicável, feedback preferencial por borda/contraste/foco;
- `focus-visible` deve usar o token de foco já existente;
- cards semânticos (warning/error/success) não usam esta superfície como substituto de seu significado.

### 6.3 Table/default

```css
.ds-table {
  border-collapse: separate;
  border-spacing: var(--space-1); /* 4px na escala documentada */
  background: var(--surface-canvas);
}

.ds-table th,
.ds-table td {
  background: var(--surface-neutral);
  border: 0;
  box-shadow: none;
}

.ds-table th {
  text-transform: uppercase;
}
```

REGRAS:
- células são os próprios blocos de superfície;
- separação é criada pelo canvas entre células, não por sombra;
- valores técnicos podem manter fonte mono;
- usar `--surface-radius-cell` apenas quando a implementação exigir cantos visíveis; não arredondar excessivamente cada célula.

### 6.4 PlainText / AsciiDiagram

Manter:
- `#F8F8F8` como superfície;
- `#EBEBEB` como borda;
- 28px desktop / 22px mobile para painéis grandes;
- sombra `none`.

Alterar apenas a origem dos tokens: `--plain-*` deve ser alias de `--surface-*`.

### 6.5 Overlays

| Família | Surface | Border | Shadow |
|---|---|---|---|
| Card / painel comum | `surface-neutral` | `surface-neutral-border` | `flat` |
| Table cell | `surface-neutral` | none | `flat` |
| Plain/Ascii | `surface-neutral` | `surface-neutral-border` | `flat` |
| Popover / HoverCard | `card/popover` | `border` | `raised` |
| Dialog / Drawer / Sheet | `card/popover` | `border` | `overlay` |
| Tooltip | token atual de tooltip | conforme DS | `raised` |

## 7. Componentes a migrar

| Ordem | Família | Ação |
|---|---|---|
| 1 | `Card` | trocar default para `surface-neutral + border + shadow-flat` |
| 2 | `Table` + Markdown table | aplicar células segmentadas globais |
| 3 | `PlainSurface` / `PlainTextPanel` / `AsciiDiagram` | substituir valores locais por aliases globais |
| 4 | Admin access cards | herdar `Card/default` |
| 5 | CategoryCard / SkillCard / VisualProductCard / FeaturedItem | remover superfície/sombra própria quando não semântica |
| 6 | KPI/Data cards | herdar superfície global; manter gráficos sem alteração |
| 7 | Empty/Skeleton/Error containers | alinhar superfície; preservar estado semântico |
| 8 | Popover/Dialog/Drawer/Sheet | confirmar uso exclusivo de elevação |

## 8. Regras de migração

Procurar e substituir apenas após inspeção do componente:

- fundos hardcoded equivalentes a branco/cinza em cards;
- `box-shadow` ou classes `shadow-*` em cards normais;
- `border-gray-*` / cores arbitrárias;
- `rounded-*` fora da escala do sistema;
- duplicações de `#F8F8F8` e `#EBEBEB` fora da camada primitiva/semântica;
- estilos locais de tabela que sobrescrevam `Table/default`.

Não substituir automaticamente:
- callouts semânticos;
- botões;
- badges;
- alertas críticos;
- superfícies brand/attention/critical;
- overlays que realmente precisam de elevação.

## 9. Mockflow de auditoria e implementação

```text
REFERENCE
  ↓
INVENTORY
  ↓
CLASSIFY SURFACES
  ├── FLAT
  ├── INTERACTIVE
  └── OVERLAY
  ↓
TOKEN NORMALIZATION
  ↓
BASE COMPONENTS
  ├── Card
  ├── Table
  └── PlainSurface
  ↓
DERIVED COMPONENTS
  ↓
ROUTE MIGRATION
  ↓
VISUAL REGRESSION
  ↓
ACCESSIBILITY
  ↓
RELEASE
```

WIP = 1. Migrar primeiro os primitivos; só depois componentes derivados e rotas.

## 10. Rotas mínimas para regressão

- `/admin/design-system/` — referência e inventário de componentes;
- `/admin/` — cards de acesso;
- `/blog/` — cards editoriais e territórios;
- `/blog/do-risco-cognitivo-a-execucao-assistida/` — conteúdo editorial;
- `/hub-editorial/` — ferramenta/painel;
- catálogo de Skills — cards e estados.

## 11. Critérios de aceite

PASS somente se todos forem verdadeiros:

1. `Card/default` usa `surface-neutral` e não possui sombra.
2. Tabelas globais reproduzem a linguagem de células cinza separadas.
3. `PlainSurface` não contém hex duplicado fora do token global.
4. Nenhum card comum possui `shadow-md`, `shadow-lg` ou `shadow-xl`.
5. Overlays continuam visualmente distinguíveis por elevação.
6. Não há regressão de contraste/foco/teclado.
7. Não há overflow horizontal de página em mobile; tabelas largas rolam no contêiner quando necessário.
8. As rotas mínimas possuem screenshots desktop + mobile após migração.
9. Busca no código não encontra novos valores hardcoded equivalentes a `#F8F8F8`/`#EBEBEB` fora da definição de tokens.
10. Build, lint e testes retornam exit code 0.

## 12. Evidência requerida para DONE

- diff dos tokens;
- diff de `Card`, `Table` e `PlainSurface`;
- relatório de busca por `shadow-*`, `#F8F8F8`, `#EBEBEB`, `rounded-*`;
- screenshots before/after das rotas mínimas;
- resultado de build/lint/test;
- checklist de acessibilidade;
- link/commit/PR da implementação.

## 13. Dependências

DEPENDS_ON:
- acesso ao repositório do blog;
- identificação dos arquivos reais de tokens/componentes;
- confirmação do stack de estilização em uso no repositório.

BLOCKS:
- padronização visual das novas rotas;
- migração confiável de cards e tabelas;
- regressão visual automatizada.

## 14. Handoff de engenharia

IMPLEMENTAÇÃO PREPARADA, NÃO EXECUTADA NO REPOSITÓRIO.

Sequência recomendada:

1. localizar SoT de tokens;
2. criar `surface-*`;
3. converter `--plain-*` em aliases;
4. alterar `Card/default`;
5. alterar `Table/default` e Markdown tables;
6. remover sombras locais em cards derivados;
7. migrar rotas em lotes pequenos;
8. executar regressão visual;
9. publicar somente após critérios de aceite PASS.

Próximo estado esperado: `IN_PROGRESS` assim que o repositório/branch alvo for fornecido ou conectado.
