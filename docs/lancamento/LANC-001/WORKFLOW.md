# LANC-001 — Workflow de engenharia

- **Status:** PREPARADO — aguardando o fim do intake e as especificações finais
- **Fluxo:** agent-handoff (`/plan` → `/execute` → `/verify`), um PR por trilha (ADR-M02)
- **Gates:** `npm run typecheck`, `npm run build`, `npm run test` (inclui `tests/hig.spec.ts`, ADR-M03)

## Etapas

| Etapa | O que acontece | Entrada | Saída | Gate para avançar |
|---|---|---|---|---|
| E0 Intake | Arquivos chegam em `intake/` com hash | uploads do usuário | `intake/`, `MANIFEST.sha256` | usuário declara intake fechado |
| E1 Especificação | Usuário passa as especificações finais; decisões D1–D4 respondidas | specs + decisões | seção "Decisões" preenchida | nenhuma decisão aberta na trilha |
| E2 ADR | Decisão que muda regra vigente vira ADR (app ou monorepo) | E1 | ADR em `CLAUDE.md` | ADR com status Aceita |
| E3 `/plan` | Plano por trilha, com fases e risk tags | ADR + intake | `.handoff/plan.md` | plano revisado pelo usuário |
| E4 `/execute` | Implementa o plano; typecheck como rede | plano | código | typecheck limpo |
| E5 `/verify` | Testes, lint, gate HIG; compara plano × código (de preferência em sessão nova) | código | `.handoff/review.md` | sem P0/P1, testes verdes |
| E6 PR | PR pronto (nunca draft), checklist do template, auto-merge (merge commit) | branch verde | PR | CI verde → merge → deploy de produção |

`main` é a produção: o merge dispara o deploy pelo Workers Builds. Não existe branch de produção
separada; cada trilha nasce de `main` atualizada.

## Trilhas (cada uma é um PR)

| Trilha | Escopo | Depende de | Risco | Fases previstas |
|---|---|---|---|---|
| T1 Favicon e logo | Substituir `apps/blog/public/favicon/*`, links em `root.tsx`, `site.webmanifest`, imagem social | D4 | Baixo | 1 |
| T2 Editorial Hybrid | Tokens, tipografia, navegação (desktop visível, drawer + barra inferior no mobile, chrome que esconde no scroll), bloco de imagem de artigo | D1, D2, D3, ADR-13 do blog | Alto | 3: tokens → navegação → layout de artigo |
| T3 Teia Única | Registries canônicos, `correlation_refs` no Quick Framework e na Loja, IDs nos eventos | aprovação do ADR-TEIA-UNICA-001, D5 | Médio/alto | por N1–N8 do `MIGRATION_PLAN.md`, agrupadas |

Ordem sugerida: T1 → T2 → T3. T1 pode sair antes das demais decisões se D4 for respondida.

## Decisões abertas

| ID | Pergunta | Por que importa |
|---|---|---|
| D1 | Qual mockup é canônico: v6 (amarelo/preto, "nunca azul", fontes de sistema, cantos retos) ou v7 (paleta atual, azul `#2563EB`)? | v6 revoga o ADR-11 e quebra `tests/tokens.spec.ts` de propósito |
| D2 | Amarelo `#ffcc00` só como fundo com texto preto? | Como texto sobre branco dá ~1,6:1 e reprova WCAG AA (ADR-M03) |
| D3 | Imagem vertical de 100vh em todo artigo (v6) ou só artigos com ilustração (ADR-12)? | As duas regras se contradizem; artigos sem imagem do banco |
| D4 | O logo do pacote substitui o favicon atual em todo o site (blog e `/admin`)? | Define o escopo de T1 |
| D5 | Quem é o OWNER da Teia Única e ela está aprovada? | Pacote declara `OWNER: A DEFINIR` e `PROPOSED_FOR_APPROVAL` |

## Registro

| Data | Evento |
|---|---|
| 2026-10-04 | Intake aberto com `lancamento_.zip` (41 arquivos); workflow preparado |
