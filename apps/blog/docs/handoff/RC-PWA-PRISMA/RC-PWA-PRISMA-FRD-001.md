# FRD — Rota PWA Prisma Risco Cognitivo

ID: RC-PWA-PRISMA-FRD-001  
VERSION: 1.0.0  
AREA: Produto / Requisitos Funcionais  
WORKFLOW: Descobrir → Preencher → Revisar → Exportar  
OWNER: A DEFINIR  
STATUS: PREPARED  
AUTOMATION_LEVEL: A1  
ROUTE: /prisma  
DEPENDS_ON: RC-PWA-PRISMA-ADR-001, RC-A4-PACK-001  
BLOCKS: SPEC de componentes, implementação e testes de aceite

## 1. Objetivo funcional

Disponibilizar uma rota pública/local que permita a qualquer seguidor:
1. entender o funcionamento do artefato;
2. preencher seus próprios dados;
3. visualizar um Prisma estruturado;
4. exportar o resultado como PDF A4.

## 2. Estados da experiência

```text
INTRO → FORM → PREVIEW → EXPORT
             ↖ EDITAR ↙
```

O usuário pode voltar do Preview para o Form sem perder os dados da sessão.

## 3. Requisitos funcionais

| ID | Requisito | Prioridade | Aceite |
|---|---|---:|---|
| FR-001 | Exibir landing da rota `/prisma` | P0 | Abre sem autenticação |
| FR-002 | Exibir instruções “Como usar em 3 passos” | P0 | Três passos visíveis antes do formulário |
| FR-003 | Iniciar formulário por CTA | P0 | CTA leva ao primeiro campo |
| FR-004 | Coletar campos do Prisma | P0 | Todos os campos V1 podem ser editados |
| FR-005 | Validar campos obrigatórios | P0 | Erro textual e foco no campo inválido |
| FR-006 | Atualizar preview a partir do formulário | P0 | Dados aparecem no template correto |
| FR-007 | Permitir voltar e editar | P0 | Estado é preservado |
| FR-008 | Exportar usando diálogo de impressão | P0 | `window.print()` é acionado |
| FR-009 | Imprimir somente o Prisma | P0 | UI não aparece no PDF |
| FR-010 | Formatar saída como A4 | P0 | `@page size:A4` |
| FR-011 | Permitir salvar dados localmente | P1 | Opt-in grava no `localStorage` |
| FR-012 | Permitir limpar dados | P0 | Estado e armazenamento local são removidos |
| FR-013 | Funcionar offline após primeiro acesso | P1 | App shell abre sem rede |
| FR-014 | Ser instalável como PWA | P1 | Web App Manifest + SW válidos |
| FR-015 | Exibir aviso de privacidade local | P0 | Informa que dados ficam no dispositivo |
| FR-016 | Exibir aviso de escopo | P0 | Artefato não é diagnóstico clínico |
| FR-017 | Preservar identidade visual da marca | P0 | Usa tokens do pack atual |
| FR-018 | Ser responsivo | P0 | Fluxo utilizável em mobile |
| FR-019 | Preservar texto digitado como texto | P0 | Nenhum HTML do usuário é executado |
| FR-020 | Exibir data de geração no Prisma | P1 | Data local aparece na saída |

## 4. Tela 1 — Introdução

Conteúdo obrigatório:
- wordmark “RISCO COGNITIVO”;
- título do artefato;
- descrição em linguagem simples;
- bloco “Como usar em 3 passos”;
- CTA primário “Criar meu Prisma”;
- nota “Seus dados ficam neste dispositivo”.

### Os 3 passos

1. **Preencha** — descreva seu contexto, objetivo e principais atritos.
2. **Revise** — veja as informações organizadas no Prisma.
3. **Exporte** — salve a folha A4 como PDF.

## 5. Tela 2 — Formulário

### Schema V1 proposto

| Campo | Tipo | Obrigatório |
|---|---|---:|
| Nome | text | não |
| Contexto | textarea | sim |
| Objetivo | textarea | sim |
| Horizonte | text/select | sim |
| Tempo disponível | text | não |
| Demanda principal | textarea | sim |
| Atrito principal | textarea | sim |
| Estratégia de apoio/compensação | textarea | não |
| Prioridade 1 | text | sim |
| Prioridade 2 | text | não |
| Prioridade 3 | text | não |
| Bloqueios | textarea | não |
| Próxima ação | textarea | sim |

### Regras
- não inferir conteúdo ausente;
- preservar quebras de linha de forma segura;
- aplicar limites de tamanho para evitar overflow do A4;
- indicar quantidade máxima quando necessário;
- salvar somente localmente mediante ação do usuário.

## 6. Tela 3 — Preview

O preview deve representar o resultado final de impressão.

Estrutura proposta:

```text
RISCO COGNITIVO
PRISMA DE EXECUÇÃO

Contexto
Objetivo / Horizonte

CONTEXTO
↓
DEMANDA
↓
ATRITO
↓
COMPENSAÇÃO
↓
AÇÃO

Prioridades
1.
2.
3.

Bloqueios
Próxima ação

Data de geração
```

A estrutura visual deve reutilizar os tokens e padrões A4 existentes.

## 7. Tela 4 — Exportação

Ações:
- `Editar`;
- `Salvar neste dispositivo`;
- `Limpar`;
- `Exportar PDF`.

`Exportar PDF` deve:
1. preparar o estado `PRINT`;
2. ocultar controles;
3. chamar `window.print()`;
4. retornar ao estado anterior ao fechar o diálogo.

## 8. Regras de impressão

- formato A4;
- margem alvo: 10 mm, salvo ajuste técnico comprovado;
- sem sombra no documento impresso;
- sem toolbar;
- sem formulário;
- sem conteúdo explicativo da landing;
- cores de marca preservadas;
- blocos críticos com `break-inside: avoid`.

## 9. Persistência local

Chave sugerida:

```text
rc.prisma.v1
```

Estrutura:
```json
{
  "version": "1.0.0",
  "updatedAt": "ISO-8601",
  "data": {}
}
```

A opção “Limpar” deve remover essa chave.

## 10. PWA

### manifest.webmanifest
Requisitos mínimos:
- `name`;
- `short_name`;
- `start_url`;
- `scope`;
- `display: standalone`;
- `background_color: #FFFFFF`;
- `theme_color: #2563EB`;
- ícones 192 e 512;
- ícone maskable.

### Service Worker
Cachear:
- HTML/app shell;
- CSS;
- JS;
- ícones;
- fontes locais, se empacotadas.

Não cachear conteúdo pessoal em requests de rede porque não deve haver requests com esse conteúdo.

## 11. Estados de erro

- campo obrigatório vazio;
- armazenamento local indisponível;
- service worker não suportado;
- impressão cancelada;
- conteúdo excedendo limite do template.

Nenhum desses erros deve impedir o usuário de continuar usando o formulário, exceto a ausência dos campos obrigatórios para gerar o preview.

## 12. Acessibilidade

- foco visível;
- ordem de tabulação lógica;
- labels explícitos;
- mensagens com `aria-describedby`;
- botões com nomes claros;
- não depender apenas de cor;
- tamanho de toque adequado em mobile;
- zoom do navegador não bloqueado.

## 13. Critérios de aceite E2E

Cenário principal:

```text
DADO que o visitante abre /prisma
QUANDO lê os 3 passos
E inicia o formulário
E preenche os campos obrigatórios
E abre o preview
ENTÃO seus dados aparecem corretamente no Prisma
E ao selecionar Exportar PDF
SOMENTE a folha A4 é enviada para impressão
E nenhum dado é enviado a um servidor.
```

## 14. Fora de escopo — V1

- login;
- conta;
- banco de dados;
- compartilhamento por link;
- geração server-side de PDF;
- e-mail do PDF;
- analytics do conteúdo preenchido;
- diagnóstico automático;
- IA gerando conteúdo no lugar do usuário.

HANDOFF: SPEC UI + Engenharia Front-end.
