# PRD — Prisma Risco Cognitivo PWA

ID: RC-PWA-PRISMA-PRD-001  
VERSION: 1.0.0  
AREA: Produto  
WORKFLOW: Descoberta → Entrada → Estrutura → Documento → Exportação  
OWNER: A DEFINIR  
STATUS: PREPARED  
AUTOMATION_LEVEL: A1  
ROUTE: /prisma  
DEPENDS_ON: RC-PWA-PRISMA-ADR-001, RC-PWA-PRISMA-FRD-001, RC-A4-PACK-001  
BLOCKS: UX/UI final, implementação, QA e release

## 1. Visão do produto

O Prisma Risco Cognitivo é um artefato web local-first que ajuda seguidores a transformar informações dispersas sobre uma situação de execução em uma representação estruturada e exportável.

O produto não pretende diagnosticar pessoas. Ele organiza informações fornecidas pelo próprio usuário em uma folha A4 que pode ser salva, impressa ou compartilhada.

## 2. Problema

O pack A4 atual funciona como template, mas exige edição manual. Para um seguidor comum isso transfere trabalho operacional demais:
- entender onde preencher;
- editar HTML ou placeholders;
- preservar o layout;
- saber imprimir corretamente;
- não quebrar tokens ou estrutura.

A rota `/prisma` elimina essa barreira por meio de uma experiência guiada.

## 3. Público-alvo

Primário:
- seguidores da marca Risco Cognitivo;
- pessoas que querem organizar contexto, demandas, atritos e ações;
- usuários mobile que precisam de uma ferramenta simples, sem configuração.

Secundário:
- profissionais que usam o resultado como suporte para planejamento, revisão ou conversa de trabalho.

## 4. JTBD

> Quando eu estiver com uma situação de execução difícil ou confusa, quero preencher um formulário simples e receber uma estrutura clara em uma página, para enxergar o que está acontecendo e decidir minha próxima ação sem precisar montar o documento manualmente.

## 5. Proposta de valor

**Entrada simples → estrutura visual → documento utilizável.**

O usuário não precisa:
- criar conta;
- aprender o template;
- editar código;
- instalar software de escritório;
- enviar seus dados para um servidor.

## 6. Experiência principal

```text
HOME / PRISMA
    ↓
COMO USAR — 3 PASSOS
    ↓
CRIAR MEU PRISMA
    ↓
FORMULÁRIO
    ↓
PREVIEW
    ↓
EDITAR  ←→  REVISAR
    ↓
EXPORTAR PDF
```

## 7. Conteúdo da tela inicial

### Hero
Título proposto:
**Organize o que está dificultando sua execução.**

Subtítulo:
**Preencha o formulário, revise seu Prisma e exporte uma página A4 para usar onde precisar.**

CTA:
**Criar meu Prisma**

### Como usar
01 — Preencha  
02 — Revise  
03 — Exporte

### Privacidade
**Seus dados permanecem no seu dispositivo nesta versão.**

## 8. Escopo V1

Incluído:
- rota `/prisma`;
- introdução;
- 3 passos;
- formulário;
- validação;
- preview;
- template A4;
- exportação por impressão;
- autosave opcional;
- limpar dados;
- responsividade;
- PWA instalável;
- offline app shell;
- tokens de Risco Cognitivo.

Não incluído:
- cadastro;
- backend;
- sincronização;
- PDF server-side;
- IA gerativa;
- histórico em nuvem;
- compartilhamento público por URL.

## 9. Requisitos de produto P0

1. O visitante deve entender o que fazer sem documentação externa.
2. O fluxo deve funcionar integralmente em mobile.
3. O usuário deve conseguir gerar um Prisma sem criar conta.
4. O resultado deve refletir somente os dados fornecidos.
5. O PDF deve sair como documento A4 limpo.
6. O conteúdo preenchido não deve ser transmitido para servidor.
7. A marca deve usar os tokens atuais.
8. O fluxo deve continuar utilizável mesmo se a instalação PWA não estiver disponível.

## 10. Requisitos P1

- instalação PWA;
- funcionamento offline após primeiro carregamento;
- salvar rascunho no dispositivo;
- botão de reinício/limpeza;
- data de geração;
- suporte a “Adicionar à Tela de Início” onde o navegador permitir.

## 11. Modelo conceitual do Prisma

O documento organiza o preenchimento nesta sequência:

```text
CONTEXTO
   ↓
DEMANDA
   ↓
ATRITO
   ↓
COMPENSAÇÃO
   ↓
AÇÃO
```

Elementos complementares:
- objetivo;
- horizonte;
- prioridades;
- bloqueios;
- próxima ação.

Esse modelo é uma estrutura de produto da rota V1 e deve ser tratado como framework próprio, não como diagnóstico.

## 12. Princípios de UX

- plain language;
- uma decisão principal por tela;
- progressão visível;
- formulário com agrupamento semântico;
- feedback imediato;
- sem bloqueio por conta;
- sem dark patterns;
- mobile-first;
- preview fiel ao PDF;
- nenhum dado inventado.

## 13. Design System

A rota herda o sistema atual:
- Canvas `#FFFFFF`;
- texto primário `#202124`;
- ação `#2563EB`;
- superfície neutra `#F5F5F4`;
- superfície de destaque `#EFF6FF`;
- bordas neutras;
- Inter para corpo/títulos;
- IBM Plex Mono para IDs, rótulos e metadados;
- cards sem sombra como padrão;
- sombra somente quando houver elevação real de interface.

## 14. Privacidade

V1 é privacy-by-default:
- dados processados no cliente;
- sem conta;
- sem banco de dados;
- sem envio do formulário;
- limpeza explícita do armazenamento local;
- analytics, se futuramente usados, não podem conter texto do formulário.

## 15. Acessibilidade

Gate de release:
- WCAG 2.2 AA;
- navegação por teclado;
- foco visível;
- labels;
- contraste;
- mensagens de erro;
- responsividade;
- redução de movimento;
- impressão legível.

## 16. Métricas de qualidade da V1

Como a V1 não precisa coletar dados pessoais, as métricas de aceite são técnicas:

- 100% dos fluxos P0 executáveis sem login;
- 0 requests contendo conteúdo do formulário;
- 0 dependências externas obrigatórias;
- preview e PDF consistentes;
- instalação PWA válida em ambiente compatível;
- abertura offline após cache inicial;
- sem overflow crítico no A4 com dados dentro dos limites especificados.

Métricas comportamentais futuras devem exigir decisão separada de privacidade e analytics.

## 17. Critérios de release

`RELEASED` somente quando:
- ADR implementado;
- requisitos P0 do FRD aprovados;
- manifest.webmanifest válido;
- service worker registrado;
- fluxo mobile testado;
- preview A4 verificado;
- exportação PDF testada;
- limpeza do armazenamento testada;
- teste offline aprovado;
- nenhum conteúdo preenchido aparecer em network requests;
- acessibilidade P0/P1 sem bloqueadores.

## 18. Roadmap

### V1 — Local-first
Formulário + Prisma + PDF + PWA offline.

### V1.1 — Refinamento
Melhorias de onboarding, limites de conteúdo, acessibilidade e instalação.

### V2 — Opcional, mediante nova decisão
Conta, histórico, compartilhamento por link ou sincronização. Requer novo ADR de dados, privacidade e backend.

## 19. Dependências

- pack A4 atual;
- tokens Risco Cognitivo;
- definição final do conteúdo textual do Prisma;
- ícones PWA;
- QA de impressão em navegadores-alvo.

## 20. Riscos

| Risco | Impacto | Mitigação |
|---|---|---|
| Texto longo quebra A4 | Alto | limites + preview + regras de overflow |
| Usuário confunde ferramenta com diagnóstico | Alto | disclaimer claro |
| PWA não instalável em algum navegador | Médio | web app funciona sem instalação |
| PDF varia entre navegadores | Médio | CSS de impressão + testes-alvo |
| Dados persistem sem intenção | Médio | opt-in + limpar dados |
| Fontes não disponíveis offline | Baixo | fallbacks locais / empacotamento futuro |

## 21. Definition of Done

A rota estará `VERIFIED` quando uma pessoa conseguir, sem instrução externa:
1. abrir `/prisma`;
2. entender os três passos;
3. preencher os dados;
4. gerar o preview;
5. editar se necessário;
6. exportar um PDF A4 limpo;
7. fechar/reabrir offline após cache;
8. apagar seus dados locais.

HANDOFF: UX/UI → Engenharia → QA → Release.
