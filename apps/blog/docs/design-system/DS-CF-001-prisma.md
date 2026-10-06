# DS-CF-001 · extensão `prisma`: Prisma, Fontes, 404 e peças do shell

- **ID:** DS-CF-001-prisma · **Versão:** 1.0.0 · **Data:** 2026-10-06
- **Base:** `DS-CF-001.md` (tokens `--cf-*` e componentes `ds-*`) e ADR-26 (`apps/blog/CLAUDE.md`).
- **Escopo:**
  - `/prisma/`: introdução, formulário, barra de ações, diálogo "Limpar dados" e próxima ação;
  - `/fontes/` e a página 404;
  - peças do shell: drawer, barra inferior, botão de tema e skip link.
- **CSS:** `app/styles/ds-prisma.css`, só com `var(--cf-*)` e, para erro, a família `critical` (exceção 3 do ADR-26).
- **Fora do escopo:** a folha A4 (`PrismaSheet.tsx`, `prisma-sheet*`, `--ps-*`) é a exceção 1 do ADR-26 e não muda.

Cada componente abaixo foi especificado antes do uso, no formato *extend* da skill de design.

---

## 1. Componentes do DS reutilizados sem mudança

| Peça | Componente | Onde |
|---|---|---|
| Cabeçalho da introdução, do índice de fontes e do 404 | `PageHead` | `/prisma/` (intro), `/fontes/`, 404 |
| Cabeçalhos de seção | `SectionHead align="left"` | todas |
| Botões e "Saiba mais ›" | `Button`, `MoreLink` | todas |
| Cards da introdução, da próxima ação e do 404 | `CardGrid` + `Card` | `/prisma/`, 404 |
| Campos | `Input`, `Textarea`, `Select`, `Check` e a anatomia `ds-field*` | formulário do Prisma |
| Diálogo "Limpar dados" | `ConfirmDialog` ("Apagar dados" / "Manter dados") | formulário e revisão |
| Listas de fontes | `ds-list` | `/fontes/` |

### 1.1 Por que o formulário usa a anatomia `ds-field` em vez do componente `Field`
- **Motivo:** `Field` gera o `id` com `useId()` e não aceita um `id` externo. O Prisma precisa de IDs estáveis:
  - `prisma-<campo>` recebe o foco no primeiro campo inválido (FR-005);
  - os links do resumo de erros apontam para `#prisma-<campo>`;
  - `prisma-<campo>-error` é o contrato dos testes.
- **Decisão:** o `PrismaField` local tem a mesma marcação e as mesmas classes de `Field`:
  - `ds-field`, `ds-field-label`, `ds-field-help`, `ds-field-error`;
  - controles `Input`, `Textarea` e `Select` do DS.
- **Sugestão ao dono do DS:** aceitar `id?` em `Field`. Com isso, o `PrismaField` passa a ser só um invólucro.

---

## 2. Componentes novos (extend)

### 2.1 `ds-steps`: lista numerada de passos
- **Problema:** a introdução do Prisma mostra três passos (Preencha, Revise, Exporte) e os cinco blocos da folha, em ordem.
  A ordem é o conteúdo, então a marcação precisa ser `ol > li`.
- **Padrões existentes e por que não bastam:**
  - `ds-cols`/`ds-col` têm hover de link e só três colunas;
  - um passo não é clicável, e o hover sugeriria que é;
  - `CardGrid` gera `div > article`, não uma lista ordenada.
- **Marcação:** `ol.ds-steps` dentro de `Frame`; cada `li` tem:
  - `span.ds-steps-n` (número em `--cf-mono`, `aria-hidden`, porque a ordem já vem do `ol`);
  - `h3`;
  - `p`.
- **Props (CSS):** `--ds-steps-cols` (padrão 3; 5 para os blocos da folha).
- **Variantes:** 3 ou 5 colunas no desktop, uma coluna abaixo de 900 px.
- **Estados:** só estático, sem hover nem foco.
- **Tokens:** `--cf-border`, `--cf-pad`, `--cf-mono`, `--cf-accent-text` (número), `--cf-fg-muted` (texto).
- **A11y:** lista ordenada nativa; `h3` em cada passo; sem rolagem horizontal em 320 px.

### 2.2 `ds-tool`: moldura de ferramenta interativa (entrada, resultado, próxima ação)
- **Problema:** as visões de formulário e de revisão trocam o `h1` dentro da mesma rota.
  - O `h1` precisa de `id="prisma-view-title"` e `tabIndex=-1`, porque o foco vai para ele ao trocar de visão (WCAG 2.4.3).
  - O `PageHead` não expõe `id` nem `ref` no `h1`.
- **Padrões existentes e por que não bastam:**
  - `ds-pagehead` tem a tipografia certa, mas a largura de 1200 px;
  - o formulário pede a medida de leitura (720 px);
  - `ds-reading` não tem o ritmo vertical de página.
- **Marcação:** `section.ds-tool` (+ `data-width="wide"` na revisão, que leva a folha de 794 px) com:
  - `header.ds-pagehead` (mesmas classes do DS);
  - `p.ds-eyebrow` com o passo ("Passo 1 de 3 · Preencha");
  - `h1`;
  - `p.ds-pagehead-lead`.
- **Variantes:** `reading` (padrão, 720 px) e `wide` (1200 px).
- **Tokens:** `--cf-reading`, `--cf-container`, `--cf-px`, `--cf-section-gap`.
- **A11y:**
  - um único `h1` por visão;
  - o foco vai ao `h1` na troca de visão;
  - o anel de foco não aparece no `h1` (`outline: none`), porque ele não é interativo.

### 2.3 `ds-fieldset`: grupo de campos
- **Problema:** o formulário tem três grupos (`fieldset` + `legend`) com uma frase de apoio.
- **Padrões existentes e por que não bastam:** `SectionHead` gera `h2`, mas o grupo precisa de `legend` para o leitor de
  tela anunciar o nome do grupo em cada campo.
- **Marcação:** `fieldset.ds-fieldset` > `legend` + `p.ds-fieldset-lead` + `div.ds-fieldset-body`.
- **Tokens:** `--cf-h3` (legend 22 px/500), `--cf-fg-muted`, `--cf-border` (linha no topo).
- **A11y:** `legend` nativo; o grupo não tem `aria-describedby`, porque a frase de apoio é curta e vem logo depois.

### 2.4 `ds-alert`: resumo de erros do formulário
- **Problema:** ao enviar com campos faltando, a pessoa precisa saber o que aconteceu, por quê e como resolver, com um link
  para cada campo.
- **Padrões existentes e por que não bastam:**
  - `ds-field-error` cobre o erro de um campo só;
  - `ds-notice` é o aviso de layout demonstrativo e não indica erro.
- **Marcação:** `div.ds-alert[role=alert]` com:
  - `p.ds-alert-title` (o quê): "Falta preencher alguns campos.";
  - `p` (por quê e como): "A folha precisa deles. Use os links para ir a cada campo.";
  - `ul` de links para `#prisma-<campo>`.
- **Tokens:**
  - borda esquerda de 4 px em `--color-critical-default` (camada semântica, exceção 3 do ADR-26);
  - fundo `--cf-bg-200`;
  - texto `--cf-fg`;
  - links em `--cf-accent-text`.
- **Estados:** visível só com erro. O link leva o foco ao campo.
- **A11y:**
  - `role="alert"`;
  - a cor nunca é o único sinal, porque o título diz o erro;
  - os links têm alvo de 44 px.

### 2.5 `ds-field-foot`: rodapé do campo (erro + contador)
- **Problema:** os campos de texto têm limite (o texto precisa caber na folha A4) e mostram a contagem ao lado do erro.
- **Marcação:** `div.ds-field-foot` com `p.ds-field-error` e `span.ds-field-count`. O contador é `aria-hidden`, porque o
  `maxlength` já é anunciado.
- **Tokens:** `--cf-fg-muted`, números tabulares.

### 2.6 `ds-toolbar`: barra de ações da ferramenta
- **Problema:** a revisão tem Exportar PDF, Editar, Salvar neste dispositivo e Limpar dados. Elas formam um grupo que
  quebra linha no celular.
- **Padrões existentes e por que não bastam:** `ds-pagehead-actions` só existe dentro do `PageHead`.
- **Marcação:** `div.ds-toolbar` (flex, quebra, gap de 12 px), com `data-split` para separar o grupo secundário.
- **A11y:** ordem do DOM = ordem visual; cada alvo tem 44 px ou mais.

### 2.7 `ds-iconbtn`: botão só de ícone (shell)
- **Problema:** o menu, o fechar do drawer e o tema são botões só de ícone. Hoje usam o anel do shadcn
  (`ring-ring/50`), que não é o anel de 3 px em `--cf-focus`.
- **Padrões existentes e por que não bastam:** `ds-btn` é uma pílula com texto, com padding horizontal de 20 px.
- **Marcação:** `button.ds-iconbtn` com ícone `aria-hidden` e texto em `sr-only`.
- **Estados:** hover (`--cf-bg-300`); foco (anel `--cf-focus` de 3 px); pressionado (`aria-pressed`, no tema).
- **Tokens:** `--cf-btn-sm` (44 px), `--cf-radius-md`, `--cf-fg`, `--cf-bg-300`, `--cf-focus`.
- **A11y:** nome acessível em texto; alvo de 44 × 44 px.

### 2.8 Pele do shell móvel: drawer, barra inferior e skip link
- **Drawer:** continua com `rc-drawer*`, exceção do ADR-26 para animação e movimento reduzido.
  - Fundo `--cf-bg`, borda `--cf-border`.
  - Rótulo "Menu" em `ds-eyebrow`.
  - Item atual em `--cf-accent-text` com `aria-current="page"`.
  - Cada item tem 48 px ou mais.
- **Barra inferior:**
  - fundo `--cf-bg` translúcido e borda `--cf-border`;
  - item atual em `--cf-accent-text`;
  - foco com o anel `--cf-focus` de 3 px, por dentro.
- **Skip link:**
  - classe `ds-skip`, visível no foco;
  - fundo `--cf-fg` e texto `--cf-bg` (contraste ≥ 7:1 nos dois temas), sem texto pequeno sobre o acento.

---

## 3. Composição por rota (ADR-BLOG-JORNADA-ROTAS-001 §2.2)

### `/prisma/`: entrada, resultado e próxima ação
1. **Introdução (HTML pré-renderizado):** `PageHead` e quatro seções.
   - `PageHead`: eyebrow "Solução · Externalização cognitiva", `h1`, lead, CTA "Criar meu Prisma" → `#formulario`.
   - Seção 1: "Como usar em 3 passos" (`ds-steps`, 3).
   - Seção 2: "O que o Prisma organiza" (`ds-steps`, 5) e "Ver a externalização no Mapa ›".
   - Seção 3: "Por que tirar da cabeça ajuda" (`CardGrid`, 3) e "Ver as fontes ›".
   - Seção 4: "Privacidade e limites" (`CardGrid`, 2) e "Criar meu Prisma ›".
2. **Entrada (`#formulario`):** `ds-tool`, com:
   - `ds-alert`;
   - três `ds-fieldset`;
   - `ds-toolbar` com "Ver meu Prisma" e "Voltar ao início";
   - `Check` "Salvar neste dispositivo" e `ConfirmDialog` "Limpar dados".
3. **Resultado (`#prisma`):** `ds-tool` largo, com:
   - `ds-toolbar` com "Exportar PDF" e "Editar", e os controles de salvamento;
   - a folha A4, que não muda.
4. **Próxima ação (só depois do resultado):** `SectionHead` "Próxima ação" e um `CardGrid` de links reais, todos lidos
   do repositório. Nenhum texto clínico é criado.
   - As soluções publicadas que compartilham a mesma compensação do Prisma na Teia (`TOOL_CORRELATIONS`, ADR-M04).
   - O nó da compensação no Mapa (`/mapas/explorar/cmp-externalizacao/`).
   - O guia público (`/artigos/riscos-cognitivos-guia/`).
5. **Impressão:** a barra, os controles e a próxima ação ficam em `.prisma-noprint`; só a folha vai ao papel.

### `/fontes/`: índice de fontes verificáveis
- `PageHead` com a primeira frase da nota de governança como lead e "Ler os artigos" como ação.
- Três seções com `SectionHead align="left"` e `ds-list`. Cada item tem o tema ou os autores em `ds-card-eyebrow` e o
  link em `ds-link`:
  - RC-SRC-001: `data-sources`;
  - RC-SRC-002: `#fontes-cientificas`, `data-scientific-sources`;
  - dados da página inicial: `data-home-sources`.
- Cada `li` tem `id` igual ao ID da fonte. `SolutionCard` linka `/fontes/#<id>`.
- A seção "Conceitos do projeto" traz a nota de governança literal (`data-governance-note`) e "Sobre o projeto ›".

### 404
- `PageHead` sem aviso de demonstração. A página é estado de erro, não layout em reconstrução.
- Copy no formato o quê, por quê e como resolver:
  - eyebrow "Erro 404";
  - `h1` "Página não encontrada";
  - lead "O endereço não existe ou mudou de lugar.";
  - ação "Ir para a página inicial".
- Um `CardGrid` com Início, Blog, Mapa e Ferramentas. Não há ilustração nem `HeroArt`.

---

## 4. Do / Don't desta família

| ✅ Fazer | ❌ Não fazer |
|---|---|
| Manter a folha A4 com `--ps-*`, sempre clara | Pintar a folha com `--cf-*` ou com o tema escuro |
| Rotular os botões pela ação ("Apagar dados", "Manter dados") | Usar "OK", "Cancelar" ou "Confirmar" |
| Ligar a próxima ação a rotas que existem e estão na Teia | Recomendar conteúdo clínico ou item mock |
| Usar a família `critical` só para erro | Usar vermelho como identidade |
