# ADR — Rota PWA Prisma Risco Cognitivo

ID: RC-PWA-PRISMA-ADR-001  
VERSION: 1.0.0  
AREA: Produto / Arquitetura Web  
WORKFLOW: Entrada → Formulário → Renderização → Preview A4 → Exportação PDF  
OWNER: A DEFINIR  
STATUS: PREPARED  
AUTOMATION_LEVEL: A1  
ROUTE: /prisma  
DEPENDS_ON: RC-A4-PACK-001  
BLOCKS: Implementação da rota /prisma, manifest.webmanifest, service-worker.js, formulário dinâmico e exportação final

## 1. Contexto

O pack atual de Risco Cognitivo já possui templates A4, tokens próprios, impressão via CSS e operação sem dependências externas. O próximo passo é transformar esse pack em uma experiência compartilhável com seguidores: uma rota web que explica o uso em três passos, coleta os dados do visitante, monta um Prisma personalizado e permite exportar o resultado em PDF.

A rota deve funcionar como artefato web local e, quando publicada, como PWA instalável. O uso básico não deve depender de conta, backend ou envio de dados para servidor.

## 2. Problema arquitetural

É necessário decidir onde ficam o estado, a geração do documento e a persistência do preenchimento.

A decisão precisa preservar:
- privacidade por padrão;
- funcionamento offline;
- exportação A4;
- tokens de Risco Cognitivo;
- ausência de dependências externas obrigatórias;
- compatibilidade com mobile;
- possibilidade futura de hospedagem pública.

## 3. Decisão

Adotar uma arquitetura **local-first PWA, client-side, sem backend na V1**.

A rota `/prisma` será uma aplicação de página única com quatro estados de interface:

1. `INTRO` — explica o artefato e mostra “Como usar em 3 passos”.
2. `FORM` — coleta os dados necessários.
3. `PREVIEW` — transforma os dados no template Prisma A4.
4. `PRINT` — aciona a impressão nativa do navegador para “Salvar como PDF”.

### Componentes

```text
/prisma
├── App Shell
│   ├── Header / identidade
│   ├── Intro / 3 passos
│   └── Navegação de estado
├── PrismaForm
│   ├── validação
│   ├── autosave local
│   └── ações limpar / continuar
├── PrismaRenderer
│   ├── normalização dos dados
│   └── binding formulário → template
├── PrismaA4
│   ├── tokens Risco Cognitivo
│   ├── @page A4
│   └── print-only output
└── PWA Shell
    ├── manifest.webmanifest
    ├── service-worker.js
    └── icons/
```

## 4. Fluxo de dados

```text
INPUT DO USUÁRIO
      ↓
VALIDAÇÃO LOCAL
      ↓
ESTADO DA SESSÃO
      ↓
LOCALSTORAGE OPCIONAL
      ↓
NORMALIZAÇÃO
      ↓
PRISMA A4
      ↓
WINDOW.PRINT()
      ↓
PDF LOCAL
```

Nenhum dado pessoal ou conteúdo do formulário é transmitido por rede na V1.

## 5. Modelo de dados proposto — V1

```yaml
prisma:
  nome: string | optional
  contexto: string
  objetivo: string
  horizonte: string
  tempo_disponivel: string
  demanda_principal: string
  atrito_principal: string
  compensacao: string
  prioridade_1: string
  prioridade_2: string
  prioridade_3: string
  bloqueios: string
  proxima_acao: string
  data_geracao: datetime-local
```

Campos vazios não devem ser inventados pelo sistema. No documento final, podem ser omitidos ou exibidos como “A DEFINIR”, conforme regra do template.

## 6. Persistência

V1:
- estado em memória durante a sessão;
- `localStorage` apenas para “Salvar neste dispositivo”;
- botão “Limpar dados” remove o estado salvo;
- sem login;
- sem banco de dados.

## 7. PDF

A V1 não gera binário PDF por biblioteca JavaScript. A exportação utiliza a capacidade nativa do navegador:

```js
window.print()
```

O CSS de impressão deve:
- usar `@page { size: A4; }`;
- ocultar formulário, botões, navegação e instruções;
- exibir somente o Prisma;
- preservar cores de impressão;
- evitar quebras internas em blocos críticos.

## 8. PWA

A publicação instalável exige:
- `manifest.webmanifest`;
- `service-worker.js`;
- ícones 192×192, 512×512 e maskable;
- `start_url: /prisma`;
- `display: standalone`;
- cache do app shell e assets próprios;
- fallback offline da própria rota.

O `manifest.yaml` do pack continua sendo um documento de governança e **não substitui** o Web App Manifest.

## 9. Segurança e privacidade

Regras:
- nenhum dado do formulário sai do dispositivo na V1;
- nenhuma chamada de analytics que contenha o conteúdo preenchido;
- nenhum recurso externo obrigatório;
- HTML inserido pelo usuário deve ser tratado como texto;
- não executar conteúdo fornecido pelo usuário;
- permitir apagar todos os dados locais.

## 10. Acessibilidade

A rota deve atender:
- HTML semântico;
- labels associados aos campos;
- navegação por teclado;
- foco visível;
- contraste WCAG 2.2 AA;
- mensagens de validação textuais;
- `prefers-reduced-motion`;
- impressão legível em escala de cinza.

## 11. Alternativas consideradas

### A. HTML estático sem PWA
Rejeitada como arquitetura final. É simples e já atende ao uso local, mas não oferece instalação, offline gerenciado nem app shell.

### B. Backend para salvar dados e gerar PDF
Adiada. Aumenta custo, superfície de privacidade, autenticação e dependências sem ser necessária para a primeira entrega.

### C. Biblioteca JavaScript para gerar PDF
Adiada. A impressão nativa já atende ao requisito e preserva melhor o HTML/CSS A4 atual.

## 12. Consequências

Positivas:
- baixa complexidade;
- alta privacidade;
- offline-first;
- reaproveitamento direto do pack atual;
- fácil hospedagem estática;
- baixo custo operacional.

Limitações:
- o nome/arquivo final do PDF depende do navegador;
- não há sincronização entre dispositivos;
- não há link compartilhável do Prisma preenchido;
- não há histórico em nuvem.

## 13. Critérios de aceite

A decisão será considerada implementada quando:
- `/prisma` abrir online e offline após primeiro carregamento;
- a tela inicial apresentar exatamente três passos;
- o formulário funcionar em mobile e desktop;
- o preview atualizar com os dados preenchidos;
- o usuário conseguir exportar uma folha A4 sem elementos de interface;
- nenhum conteúdo do formulário for enviado à rede;
- o PWA puder ser instalado em navegadores compatíveis;
- os tokens de Risco Cognitivo forem preservados.

## 14. Evidência

Fonte técnica atual:
- RC-A4-PACK-001;
- risco-cognitivo-a4-pack-unificado.html;
- risco-cognitivo-tokens.css;
- manifest.yaml;
- verification.json.

HANDOFF: Engenharia / Front-end PWA.
