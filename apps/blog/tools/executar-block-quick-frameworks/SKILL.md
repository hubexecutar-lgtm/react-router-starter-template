---
name: executar-block-quick-frameworks
description: Pesquisa e produz Quick Frameworks do EXECUTAR a partir de tópicos fornecidos pelo usuário. Use quando for necessário pesquisar um tema na web, identificar referência padrão-ouro, explicar problema, solução, processo e progresso, gerar 5W2H, visão Mermaid, próximos passos, fontes e briefing de infográfico 16:9 com validação determinística.
metadata:
  title: Executar Block Quick Frameworks
  version: 1.0.0
  language: pt-BR
  owner: A DEFINIR
  status: READY
  automation_level: A4
---

# Executar Block Quick Frameworks

## Função

Transforme cada tópico recebido em um Quick Framework pesquisado, verificável, claro e aplicável.

Use um tópico por vez. Mantenha WIP = 1.

Fluxo obrigatório:

`ENTENDER → PESQUISAR → VALIDAR → ESTRUTURAR → REDIGIR → VALIDAR → ENTREGAR`

Não invente fontes, citações, credenciais, consenso, resultados ou vínculos causais.

## Entrada mínima

Aceite:
- um tópico;
- uma lista de tópicos;
- opcionalmente público, problema, contexto, área e referências conhecidas.

Se algo essencial estiver ausente, pesquise quando puder ser inferido por evidência pública. Use `A DEFINIR` somente quando a lacuna não puder ser resolvida de forma confiável.

## Arquivos que devem ser lidos

Antes de pesquisar:
1. Leia `references/content-contract.yaml`.
2. Leia `references/research-contract.yaml`.
3. Leia `references/source-contract.yaml`.
4. Leia `references/safety-guardrails.yaml`.

Antes de redigir:
5. Leia `references/output-contract.yaml`.
6. Use `assets/quick-framework-template.md`.
7. Use `assets/infographic-brief.yaml`.

Antes de finalizar:
8. Execute ou aplique as regras de `scripts/validate_output.py`.
9. Consulte `references/validation-rules.yaml`.
10. Se necessário, consulte `evals/cases.yaml` para exemplos de comportamento esperado.

## Processo do agente

### 1. Entender
Defina:
- tema;
- dor principal;
- problema observável;
- público;
- resultado esperado;
- termos que precisam de confirmação.

Não pesquise sem uma pergunta de pesquisa clara.

### 2. Pesquisar
Busque evidências atuais e diretamente ligadas ao tópico.

Priorize:
1. fonte original;
2. instituição oficial;
3. universidade ou centro de pesquisa;
4. publicação científica;
5. obra ou publicação da referência escolhida;
6. fonte secundária confiável.

Para fatos atuais, confirme data e aplicabilidade.

### 3. Escolher a referência padrão-ouro
Selecione uma pessoa ou organização somente quando houver base inequívoca.

Justifique a escolha por:
- formação, função ou reconhecimento relevante;
- contribuição concreta para o tema;
- mudança documentada no entendimento ou prática do campo.

Se não houver referência inequívoca, não force uma escolha. Declare `A DEFINIR` ou use a principal instituição de referência com justificativa.

### 4. Montar mapa de evidências
Antes da redação, associe cada afirmação central a pelo menos uma fonte.

Separe:
- fato;
- interpretação;
- hipótese;
- recomendação prática.

### 5. Redigir
Produza exatamente nesta ordem:
1. Contexto
2. 5W2H
3. Referência padrão-ouro
4. Problema existente
5. Problema solucionado
6. Processo em três etapas
7. Visão do sistema em Mermaid
8. Progresso esperado
9. Aviso, se necessário
10. Next 01-02-03
11. Fontes e aprofundamento
12. Briefing do infográfico 16:9

### 6. Validar
A entrega falha se:
- houver fonte inventada;
- houver citação sem fonte;
- o 5W2H exceder 12 palavras por campo;
- a citação exceder 12 palavras;
- problema, solução e processo não estiverem ligados;
- o processo não tiver três etapas;
- o bloco principal exceder 300 palavras;
- progresso exceder 50 palavras;
- aviso exceder 30 palavras;
- Next 01-02-03 excederem 100 palavras no total;
- fontes descritivas excederem 70 palavras;
- Mermaid estiver ausente;
- o progresso não se conectar à dor inicial;
- faltar exemplo cotidiano.

### 7. Entregar
Entregue o conteúdo final e, quando solicitado em lote, repita o mesmo contrato para cada tópico sem misturar evidências entre temas.

## Regras de escrita

Use português claro e direto.
Prefira verbo de ação.
Evite inglês quando houver equivalente natural em português.
Explique termos técnicos indispensáveis em linguagem simples.
Não use autoridade como substituto de evidência.
Não trate correlação como causa.
Não apresente solução como garantia.
Não faça propaganda disfarçada de ferramenta.

## Ferramentas e soluções

Quando houver relação funcional demonstrável, inclua:
- ferramenta EXECUTAR;
- ferramenta afiliada;
- método;
- framework;
- recurso de aprofundamento.

Toda ferramenta deve declarar qual problema ajuda a reduzir, resolver, diagnosticar, prevenir, monitorar ou automatizar.

Recomendação comercial exige identificação clara da relação com o problema e, quando aplicável, divulgação de vínculo afiliado.

## Saída determinística

Use `assets/quick-framework-template.md`.

O conteúdo deve ser compreensível sem acesso ao processo interno de pesquisa.
