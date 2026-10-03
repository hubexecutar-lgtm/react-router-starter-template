// GENERATED FILE — scripts/generate-ai-registry.mjs. Do not edit by hand.
export type GeneratedAIEntity = {
  id: string; name: string; type: 'agent' | 'skill'; area: string; status: string; version: string;
  headline: string; summary: string; capabilities: string[]; dependsOn: string[]; blocks: string[];
  workflows: string[]; tags: string[]; sourcePath: string; sourceKind: string; plugin: string | null;
};
export const AI_REGISTRY_GENERATED_AT = "2026-10-03T10:41:42.295Z";
export const GENERATED_AI_REGISTRY: GeneratedAIEntity[] = [
  {
    "id": "agent-analytics-agent",
    "name": "analytics-agent",
    "type": "agent",
    "area": "Core Agents",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "Analytics Agent do Programa EXECUTAR. Executa a casa N19 (Coletar analytics, executor agent:analytics) e entrega D14 · Analytics dataset relacionando métricas aos IDs da campanha. Métricas sem fonte acessível viram GAP, nunca valores estimados. Use via /executar-flow com o taskId.",
    "summary": "Você é o Analytics Agent do Programa EXECUTAR. Sua entrega é o D14 · Analytics dataset.",
    "capabilities": [
      "WIP = 1: uma tarefa por vez. Nunca conclua tarefa de outra casa.",
      "Não invente dados. O que não existir vira TBD no artefato e --gap na conclusão. \"A DEFINIR\" permanece \"A DEFINIR\".",
      "Nunca exponha, imprima ou peça o EXECUTARAGENTTOKEN.",
      "Se o prompt estiver contraditório ou faltar entrada essencial, não conclua: relate o bloqueio à sessão principal. Uma tarefa concluída sem base aceitável é pior que uma tarefa para",
      "Idioma dos artefatos: pt-BR.",
      "Relacione cada métrica aos IDs do D6/D12 (campaignid, contentid, assetid, platform)."
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "agent",
      "analytics-agent-md"
    ],
    "sourcePath": ".claude/agents/analytics-agent.md",
    "sourceKind": "claude-agent",
    "plugin": null
  },
  {
    "id": "agent-blog-publisher",
    "name": "blog-publisher",
    "type": "agent",
    "area": "Core Agents",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "Publica conteúdo do CMS (Hub Editorial) no blog Risco Cognitivo. Executa tarefas despachadas com executor agent:blog-publisher (botão \"Publicar no blog\" no /admin) — escreve src/content/blog/<slug.mdx no repositório executar-23/Risco-cognitivo-blog a partir do conteúdo, brief, argumentos, evidências e produção, abre um PR pronto para revisão (nunca draft) e conclui a tarefa com --pr-url e --slug. Use via /executar-flow com o taskId.",
    "summary": "Você é o Blog Publisher do Programa EXECUTAR. Você transforma um conteúdo aprovado no CMS em um post do blog Risco Cognitivo e entrega um PR pronto para revisão. Quem publica de fato é o merge humano, que dispara o deploy do blog.",
    "capabilities": [
      "Se /home/user/risco-cognitivo-blog existir e git -C … remote get-url origin for executar-23/risco-cognitivo-blog, use-o: git fetch origin main && git checkout -B cms/<slug origin/m",
      "Senão, clone https://github.com/executar-23/risco-cognitivo-blog e crie o branch a partir da main.",
      "frontmatter: title, description e pubDate (data de hoje, YYYY-MM-DD); image, authorName e authorImage só se vierem nos dados;",
      "corpo: a produção de texto como base, com argumentos e evidências citados com fonte; destaques com <Callout (ADR-02), importando como os outros MDX do blog;",
      "dado ausente vira TBD e entra em GAP. Não invente números, citações nem fontes.",
      "Nunca faça merge, push na main nem PR em draft."
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "agent",
      "blog-publisher-md"
    ],
    "sourcePath": ".claude/agents/blog-publisher.md",
    "sourceKind": "claude-agent",
    "plugin": null
  },
  {
    "id": "agent-cadeia-valor-unica",
    "name": "cadeia-valor-unica",
    "type": "agent",
    "area": "Core Agents",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "Agente upstream da Cadeia de Valor Única (CV-CADEIA-001) do Programa EXECUTAR. Recebe um process doc (docx/md, ex. AIKB-0001 PD-CLB) e, numa cadeia só (Estratégia 07 + agent-handoff, WIP = 1), unifica dependency architecture, process optimization, árvore roadmap, árvore visual e runbook. Entrega 5 artefatos (árvore roadmap, árvore visual, working process publicado e validado no Worker Cloudflare, relatório único com dependências + otimização + PDF do workflow, runbook MD tabular). Use quando pedirem cadeia única, /cadeia-unica, transformar um process doc em workflow ou unificar dependências/otimização/árvores/runbook.",
    "summary": "Você é o agente da Cadeia de Valor Única do Programa EXECUTAR. O método é a skill local .claude/skills/cadeia-valor-unica/ (SKILL.md, references/contratos.md, references/estrategia-07.md, references/nucleo-dependencias.md). Siga as 7 etapas na ordem, WIP = 1, e use um único arquivo de estado em out/cadeia/<slug/ESTADO.md.",
    "capabilities": [
      "Process doc (.docx ou .md). O slug é o código do documento em minúsculas, por exemplo",
      "Opcional: data de início do ciclo, restrições e aprovações já concedidas. Se a data faltar, use",
      "Valide no servidor: node .claude/skills/executar-flow/scripts/flow.mjs def-validate out/cadeia/<slug/workflow-<slug.json --edges out/cadeia/<slug/mapa-dependencias.json.",
      "Só com aprovação explícita registrada no ESTADO, publique com flow.mjs def-upload ….",
      "Gere o PDF com node scripts/print-pdf.mjs <slug.",
      "Nada inventado. Lacuna vira A DEFINIR/GAP. Divergência vira CONFLICT, com as duas fontes."
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "agent",
      "cadeia-valor-unica-md"
    ],
    "sourcePath": ".claude/agents/cadeia-valor-unica.md",
    "sourceKind": "claude-agent",
    "plugin": null
  },
  {
    "id": "agent-clp-orchestrator",
    "name": "clp-orchestrator",
    "type": "agent",
    "area": "Core Agents",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "CLP — Creator Lead Platform, o orquestrador do Programa EXECUTAR. Executa as tarefas despachadas com executor agent:clp — N3 orquestrar pesquisa, N9 coletar pacote autoral, N12 registrar asset aprovado, N13 preparar produção de vídeo, N16 preparar distribuição (D11), PG05 pacote de agendamento por plataforma, N17 agendar/distribuir (D12), N18 formulário de acompanhamento (D13), N20 learning record (D15). Use via /executar-flow com o taskId.",
    "summary": "Você é o CLP (Creator Lead Platform), orquestrador da linha de produção editorial do Programa EXECUTAR. Você recebe uma tarefa (taskId) de casa agent:clp e a entrega de verdade.",
    "capabilities": [
      "WIP = 1: uma tarefa por vez. Nunca conclua tarefa de outra casa.",
      "Não invente dados. O que não existir vira TBD no artefato e --gap na conclusão. \"A DEFINIR\" permanece \"A DEFINIR\".",
      "Nunca exponha, imprima ou peça o EXECUTARAGENTTOKEN.",
      "Se o prompt estiver contraditório ou faltar entrada essencial, não conclua: relate o bloqueio à sessão principal. Uma tarefa concluída sem base aceitável é pior que uma tarefa para",
      "Idioma dos artefatos: pt-BR.",
      "N9 · Coletar pacote autoral: baixar D2–D5, montar pacote-autoral.md (índice com as chaves R2, resumo de cada peça e pendências). Não reescreva as peças do Leonardo."
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "agent",
      "clp-orchestrator-md"
    ],
    "sourcePath": ".claude/agents/clp-orchestrator.md",
    "sourceKind": "claude-agent",
    "plugin": null
  },
  {
    "id": "agent-plano-ops-agent",
    "name": "plano-ops-agent",
    "type": "agent",
    "area": "Core Agents",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "Agente de planejamento operacional do Programa EXECUTAR. (1) Modo upstream — transforma o intake do mês no pacote da skill plano-operacional-rastreavel (documento interno + roadmap + CSV de importação + calendário), roda o juiz validarplano.py e envia com flow.mjs plan-upload, marcando tags no-<nó. (2) Casa N10 (executor agent:plano-ops) — gera D6 · CSV operacional (DLV-0090) com as 17 colunas do contrato a partir de D2–D5 e do plano do mês.",
    "summary": "Você é o agente de Plano Operacional Rastreável do Programa EXECUTAR. Use a skill local .claude/skills/plano-operacional-rastreavel/ (SKILL.md e as referências dela) como método. Trocando /mnt/user-data/outputs/ por out/plans/<campanha/, o resto da skill vale como está.",
    "capabilities": [
      "WIP = 1: uma tarefa por vez. Nunca conclua tarefa de outra casa.",
      "Não invente dados. O que não existir vira TBD no artefato e --gap na conclusão. \"A DEFINIR\" permanece \"A DEFINIR\".",
      "Nunca exponha, imprima ou peça o EXECUTARAGENTTOKEN.",
      "Se o prompt estiver contraditório ou faltar entrada essencial, não conclua: relate o bloqueio à sessão principal. Uma tarefa concluída sem base aceitável é pior que uma tarefa para",
      "Idioma dos artefatos: pt-BR.",
      "Cabeçalho exatamente com as 17 colunas: campaignid,runid,taskid,assetid,contentid,ctaid,frameid,videoid,platform,format,route,promptreference,visualidentityreference,dependson,stat"
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "agent",
      "plano-ops-agent-md"
    ],
    "sourcePath": ".claude/agents/plano-ops-agent.md",
    "sourceKind": "claude-agent",
    "plugin": null
  },
  {
    "id": "agent-research-agent",
    "name": "research-agent",
    "type": "agent",
    "area": "Core Agents",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "Research Agent do Programa EXECUTAR. Executa a casa N4 (Executar Wide Search, executor agent:research) e entrega D1 — Mapa de tópicos, argumentos e dados (DLV-0020, MD) — com fontes verificáveis. Use via /executar-flow com o taskId.",
    "summary": "Você é o Research Agent do Programa EXECUTAR. Sua entrega é o D1 · Mapa de tópicos, argumentos e dados (DLV-0020, formato MD), com base no brief do N3 e no pilar do N1.",
    "capabilities": [
      "WIP = 1: uma tarefa por vez. Nunca conclua tarefa de outra casa.",
      "Não invente dados. O que não existir vira TBD no artefato e --gap na conclusão. \"A DEFINIR\" permanece \"A DEFINIR\".",
      "Nunca exponha, imprima ou peça o EXECUTARAGENTTOKEN.",
      "Se o prompt estiver contraditório ou faltar entrada essencial, não conclua: relate o bloqueio à sessão principal. Uma tarefa concluída sem base aceitável é pior que uma tarefa para",
      "Idioma dos artefatos: pt-BR.",
      "Faça uma pesquisa ampla (Wide Search) com WebSearch e WebFetch. Prefira fontes primárias (estudos, dados oficiais, documentação) e registre título, publicador, data e URL de cada f"
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "agent",
      "research-agent-md"
    ],
    "sourcePath": ".claude/agents/research-agent.md",
    "sourceKind": "claude-agent",
    "plugin": null
  },
  {
    "id": "skill-cadeia-valor-unica",
    "name": "cadeia-valor-unica",
    "type": "skill",
    "area": "Core Skills",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "Cadeia de Valor Única do Programa EXECUTAR: recebe um process doc (docx/md, ex.: AIKB-0001 PD-CLB) e, numa só cadeia de análise com a Estratégia 07 + agent-handoff, unifica dependency architecture, process optimization, árvore roadmap, árvore visual e runbook. Entrega 5 artefatos: (1) árvore roadmap, (2) árvore visual, (3) working process publicado e executável no Worker Cloudflare (schema workflow.json), (4) relatório único (dependências + otimização + PDF do workflow), (5) runbook MD tabular. Use quando o usuário pedir cadeia única, /cadeia-unica, CV-CADEIA-001, transformar process doc em workflow, ou unificar dependências/otimização/árvores/runbook.",
    "summary": "Uma passada única, WIP = 1, de um process doc até um working process executável. Toda saída deriva da etapa anterior. Não existe artefato solto.",
    "capabilities": [
      "DIRECT: cita a fonte;",
      "DERIVED: justificativa rastreável;",
      "PROPOSED: precisa de validação humana;",
      "CONFLICT;",
      "GAP.",
      "python3 .claude/skills/cadeia-valor-unica/scripts/<script.py;"
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "skill",
      "cadeia-valor-unica"
    ],
    "sourcePath": ".claude/skills/cadeia-valor-unica/SKILL.md",
    "sourceKind": "claude-skill",
    "plugin": null
  },
  {
    "id": "skill-executar-flow",
    "name": "executar-flow",
    "type": "skill",
    "area": "Core Skills",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "Processa a fila de tarefas reais do workflow EXECUTAR (Cloudflare) com WIP = 1. Pega a próxima tarefa despachada, delega ao subagente do executor (clp-orchestrator, research-agent, plano-ops-agent, analytics-agent), sobe os artefatos no R2 e conclui com evidência. Use quando o usuário pedir /executar-flow, \"rodar a fila\", \"processar tarefas do EXECUTAR\", \"executar a casa do agente\", ou para enviar o plano do mês (modo upstream com a skill plano-operacional-rastreavel).",
    "summary": "O workflow (Cloudflare Workflows) publica uma tarefa por casa com um prompt self-contained. Em casa de agente, a tarefa só é despachada depois do OK humano. Esta skill leva cada tarefa despachada até a entrega real: artefato no R2 + evidência. O Worker confere o R2 antes de acender a casa.",
    "capabilities": [
      "503 = o secret do Worker não foi configurado (rodar npm run agent:token);",
      "401 = o token do ambiente difere do secret.",
      "DEC-EXF-02. Não inventar: dado ausente vira TBD no artefato e GAP na conclusão (--gap). Executor, função ou fonte \"A DEFINIR\" nunca são substituídos por uma suposição.",
      "DEC-EXF-03. Evidência: toda conclusão descreve o que foi feito, com base em quê (fontes/URLs, artefatos de entrada) e onde está o resultado (chaves R2).",
      "DEC-EXF-04. Local de trabalho: os arquivos intermediários ficam em out/<runId/<nó/, pasta ignorada pelo git.",
      "Sessão aberta: /loop 10m /executar-flow."
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "skill",
      "executar-flow"
    ],
    "sourcePath": ".claude/skills/executar-flow/SKILL.md",
    "sourceKind": "claude-skill",
    "plugin": null
  },
  {
    "id": "skill-execute",
    "name": "execute",
    "type": "skill",
    "area": "Core Skills",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "Use after /plan to apply the planned changes. Reads .handoff/plan.md and writes/updates code exactly as specified, runs sync commands listed in the plan, and runs the read-only compile check (config's typecheck) as a safety net. Does NOT run tests or lint — those belong to /verify. Honors per-item risk tags from plan to decide check granularity. Pair with /plan and /verify. Part of the agent-handoff bundle (4 skills) — install /setup-handoff, /plan, /execute, /verify together.",
    "summary": "Apply the changes that plan.md describes. Stay strictly inside the plan; never improvise.",
    "capabilities": [
      "low / untagged: apply edits, update task.md after each. No per-item compile check.",
      "medium: apply edits → run compile check (config's typecheck, if set) → update task.md. On failure, see step 6.",
      "high: apply edits → run compile check → update task.md immediately (so progress is durable across blockers) → only then proceed. On failure, see step 6.",
      "Pass → continue to step 7.",
      "Fail → make at most ONE fix attempt, restricted to files/lines listed in the current change list. Re-run.",
      "Still fail (or fix would require touching out-of-plan files) → blocker. STOP and report per Boundaries."
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "skill",
      "execute"
    ],
    "sourcePath": ".claude/skills/execute/SKILL.md",
    "sourceKind": "claude-skill",
    "plugin": null
  },
  {
    "id": "skill-plan",
    "name": "plan",
    "type": "skill",
    "area": "Core Skills",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "Use when starting a new feature, fix, or refactor that needs explicit planning before code changes. Reads .handoff/config.md (and backlog if present) and writes a structured plan.md to .handoff/. Supports multi-phase plans for large work, and risk tags on change list items. Does NOT modify code or run build commands. Pair with /execute and /verify. Part of the agent-handoff bundle (4 skills) — install /setup-handoff, /plan, /execute, /verify together.",
    "summary": "Investigate the codebase, design the change, and write .handoff/plan.md. No code modification, no command execution.",
    "capabilities": [
      "Fresh plan: resolve task description from /plan \"<arg\" if provided; otherwise the user typed /plan alone and we may need to surface the backlog (see backlog-handling.md).",
      "Phase advance: task is \"design the [🔄] phase's change list\". Inherit Background and Phases from the previous plan.md as-is. Skip step 3 (scope assessment — phases are already decl",
      "Unusual: stop and ask user (per Gate's instruction).",
      "Allowed: read any file, web search, write .handoff/plan.md, mark items in .handoff/backlog.md.",
      "Forbidden: modify code, run build/test/lint commands, create or delete project files."
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "skill",
      "plan"
    ],
    "sourcePath": ".claude/skills/plan/SKILL.md",
    "sourceKind": "claude-skill",
    "plugin": null
  },
  {
    "id": "skill-plano-operacional-rastreavel",
    "name": "plano-operacional-rastreavel",
    "type": "skill",
    "area": "Core Skills",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "Gera o pacote completo de planejamento operacional mensal rastreável da metodologia proprietária da empresa (motor de evidência com IDs estáveis, hierarquia de fontes, classificação FACT/DECISION/ASSUMPTION/GAP/CONFLICT, e limite normativo ISO 9001/10005/10006/21502/31000/10075-2). Use esta skill sempre que o usuário pedir para gerar, montar, produzir ou reproduzir um \"plano operacional\", \"plano mensal\", \"plano de julho/agosto/etc para [cliente]\", quando mencionar rodar o \"formulário mensal\" para um cliente, quando pedir para aplicar \"a metodologia\" ou \"o processo da Opus/motor de evidência\" a um novo caso, ou quando pedir o pacote de entregáveis (documento interno + roadmap do cliente + schema Linear + calendário one-page). Dispare também quando o usuário mencionar reproduzir o mesmo resultado/schema para outro cliente ou projeto, mesmo sem usar essas palavras exatas.",
    "summary": "Esta skill reproduz, para qualquer cliente/projeto, o mesmo motor de planejamento usado para produzir o entregável de referência (documento com Resumo Executivo, Inventário de Fontes, tabelas FACT/DECISION/ASSUMPTION/GAP/CONFLICT, Estrutura Harmonizada, Objetivos, Capacidade, Workstreams, Plano Semanal, Registro de Tarefas, Visão Diária, Stakeholders, Métricas, Riscos, Itens Adiados, Gates de Decisão e Próxima Ação Única).",
    "capabilities": [
      "Todo elemento relevante recebe um ID estável com prefixo (SRC, FACT, DECISION/DEC, REQ, OBJ, KR, TSK, DEP, STK, RSK, ASM, GAP, MET, GATE, CONF, NRM).",
      "Toda afirmação relevante é classificada como FACT, DECISION, REQUIREMENT, CONSTRAINT, ASSUMPTION, HYPOTHESIS, RECOMMENDATION, GAP, CONFLICT ou NORMATIVE REQUIREMENT — nunca deixe u",
      "Conflitos entre fontes nunca são fundidos silenciosamente: registre ambas as versões, diga qual prevaleceu e por quê, na tabela de conflitos (CONF-XX).",
      "Nunca use \"deve\"/\"obrigatório\" a menos que derive de: instrução explícita do usuário, decisão aprovada do cliente, requisito de projeto aprovado, ou cláusula normativa aplicável. U",
      "A Estrutura Harmonizada (Annex SL) só organiza evidência sob 7 cabeçalhos (Contexto, Liderança, Planejamento, Suporte, Operação, Avaliação de Desempenho, Melhoria) — nunca é, por s",
      "O documento sempre declara explicitamente que não é auditoria, certificação, opinião legal, aprovação regulatória nem declaração formal de conformidade."
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "skill",
      "plano-operacional-rastreavel"
    ],
    "sourcePath": ".claude/skills/plano-operacional-rastreavel/SKILL.md",
    "sourceKind": "claude-skill",
    "plugin": null
  },
  {
    "id": "skill-setup-handoff",
    "name": "setup-handoff",
    "type": "skill",
    "area": "Core Skills",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "Use once per project before /plan, /execute, /verify. Auto-scans the repo (manifests, agent guidance, doc tree, toolchain) and runs a short interview to write .handoff/config.md. Pass --auto to skip the interview and accept all auto-detected values, falling back to interview only for items that auto-detection cannot resolve. Part of the agent-handoff bundle (4 skills) — install /setup-handoff, /plan, /execute, /verify together.",
    "summary": "Bootstrap the .handoff/ directory by scanning the project and writing config.md — the source of truth that /plan, /execute, /verify read on every invocation.",
    "capabilities": [
      "Default mode: ask all 4 items, presenting auto-detected values as defaults → see interview.md.",
      "--auto mode: use auto-detected values silently. For items where detection failed, fall back to asking just that one (announce the fallback).",
      "Allowed: read project files, write/update .handoff/config.md, create .handoff/ directory.",
      "Forbidden: modify any file outside .handoff/. Run no build/test/lint commands."
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "skill",
      "setup-handoff"
    ],
    "sourcePath": ".claude/skills/setup-handoff/SKILL.md",
    "sourceKind": "claude-skill",
    "plugin": null
  },
  {
    "id": "skill-verify",
    "name": "verify",
    "type": "skill",
    "area": "Core Skills",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "Use after /execute to verify the changes are correct. Reads .handoff/{config,plan,task}.md, runs the verification commands from plan (typically test + lint; typecheck is execute's job), compares plan-vs-code, writes review.md, and on success cleans up handoff state. For multi-phase plans, advances phase markers instead of full cleanup until the last phase. STRONGLY recommended to run in a fresh chat — fresh context is the entire point of this stage. Part of the agent-handoff bundle (4 skills) — install /setup-handoff, /plan, /execute, /verify together.",
    "summary": "Independent validation of execute's output. Strict separation of context is the value: a fresh chat reading only the plan and code can spot what an in-context verify would miss.",
    "capabilities": [
      "config.md missing:",
      "plan.md missing:",
      "task.md missing:",
      "Allowed: run verification commands, read any file, write .handoff/review.md, edit .handoff/backlog.md (resolve 🔄 items, append non-blocking), delete .handoff/{plan,task,review}.md",
      "Forbidden: modify any code, modify plan.md or task.md mid-cycle, delete .handoff/config.md, delete the user's source files."
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "skill",
      "verify"
    ],
    "sourcePath": ".claude/skills/verify/SKILL.md",
    "sourceKind": "claude-skill",
    "plugin": null
  },
  {
    "id": "skill-agent-handoff-execute",
    "name": "execute",
    "type": "skill",
    "area": "Plugin · agent-handoff",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "Use after /plan to apply the planned changes. Reads .handoff/plan.md and writes/updates code exactly as specified, runs sync commands listed in the plan, and runs the read-only compile check (config's typecheck) as a safety net. Does NOT run tests or lint — those belong to /verify. Honors per-item risk tags from plan to decide check granularity. Pair with /plan and /verify. Part of the agent-handoff bundle (4 skills) — install /setup-handoff, /plan, /execute, /verify together.",
    "summary": "Apply the changes that plan.md describes. Stay strictly inside the plan; never improvise.",
    "capabilities": [
      "low / untagged: apply edits, update task.md after each. No per-item compile check.",
      "medium: apply edits → run compile check (config's typecheck, if set) → update task.md. On failure, see step 6.",
      "high: apply edits → run compile check → update task.md immediately (so progress is durable across blockers) → only then proceed. On failure, see step 6.",
      "Pass → continue to step 7.",
      "Fail → make at most ONE fix attempt, restricted to files/lines listed in the current change list. Re-run.",
      "Still fail (or fix would require touching out-of-plan files) → blocker. STOP and report per Boundaries."
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "skill",
      "agent-handoff",
      "plugins",
      "execute"
    ],
    "sourcePath": "plugins/agent-handoff/skills/execute/SKILL.md",
    "sourceKind": "plugin-skill",
    "plugin": "agent-handoff"
  },
  {
    "id": "skill-agent-handoff-plan",
    "name": "plan",
    "type": "skill",
    "area": "Plugin · agent-handoff",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "Use when starting a new feature, fix, or refactor that needs explicit planning before code changes. Reads .handoff/config.md (and backlog if present) and writes a structured plan.md to .handoff/. Supports multi-phase plans for large work, and risk tags on change list items. Does NOT modify code or run build commands. Pair with /execute and /verify. Part of the agent-handoff bundle (4 skills) — install /setup-handoff, /plan, /execute, /verify together.",
    "summary": "Investigate the codebase, design the change, and write .handoff/plan.md. No code modification, no command execution.",
    "capabilities": [
      "Fresh plan: resolve task description from /plan \"<arg\" if provided; otherwise the user typed /plan alone and we may need to surface the backlog (see backlog-handling.md).",
      "Phase advance: task is \"design the [🔄] phase's change list\". Inherit Background and Phases from the previous plan.md as-is. Skip step 3 (scope assessment — phases are already decl",
      "Unusual: stop and ask user (per Gate's instruction).",
      "Allowed: read any file, web search, write .handoff/plan.md, mark items in .handoff/backlog.md.",
      "Forbidden: modify code, run build/test/lint commands, create or delete project files."
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "skill",
      "agent-handoff",
      "plugins",
      "plan"
    ],
    "sourcePath": "plugins/agent-handoff/skills/plan/SKILL.md",
    "sourceKind": "plugin-skill",
    "plugin": "agent-handoff"
  },
  {
    "id": "skill-agent-handoff-setup-handoff",
    "name": "setup-handoff",
    "type": "skill",
    "area": "Plugin · agent-handoff",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "Use once per project before /plan, /execute, /verify. Auto-scans the repo (manifests, agent guidance, doc tree, toolchain) and runs a short interview to write .handoff/config.md. Pass --auto to skip the interview and accept all auto-detected values, falling back to interview only for items that auto-detection cannot resolve. Part of the agent-handoff bundle (4 skills) — install /setup-handoff, /plan, /execute, /verify together.",
    "summary": "Bootstrap the .handoff/ directory by scanning the project and writing config.md — the source of truth that /plan, /execute, /verify read on every invocation.",
    "capabilities": [
      "Default mode: ask all 4 items, presenting auto-detected values as defaults → see interview.md.",
      "--auto mode: use auto-detected values silently. For items where detection failed, fall back to asking just that one (announce the fallback).",
      "Allowed: read project files, write/update .handoff/config.md, create .handoff/ directory.",
      "Forbidden: modify any file outside .handoff/. Run no build/test/lint commands."
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "skill",
      "agent-handoff",
      "plugins",
      "setup-handoff"
    ],
    "sourcePath": "plugins/agent-handoff/skills/setup-handoff/SKILL.md",
    "sourceKind": "plugin-skill",
    "plugin": "agent-handoff"
  },
  {
    "id": "skill-agent-handoff-verify",
    "name": "verify",
    "type": "skill",
    "area": "Plugin · agent-handoff",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "Use after /execute to verify the changes are correct. Reads .handoff/{config,plan,task}.md, runs the verification commands from plan (typically test + lint; typecheck is execute's job), compares plan-vs-code, writes review.md, and on success cleans up handoff state. For multi-phase plans, advances phase markers instead of full cleanup until the last phase. STRONGLY recommended to run in a fresh chat — fresh context is the entire point of this stage. Part of the agent-handoff bundle (4 skills) — install /setup-handoff, /plan, /execute, /verify together.",
    "summary": "Independent validation of execute's output. Strict separation of context is the value: a fresh chat reading only the plan and code can spot what an in-context verify would miss.",
    "capabilities": [
      "config.md missing:",
      "plan.md missing:",
      "task.md missing:",
      "Allowed: run verification commands, read any file, write .handoff/review.md, edit .handoff/backlog.md (resolve 🔄 items, append non-blocking), delete .handoff/{plan,task,review}.md",
      "Forbidden: modify any code, modify plan.md or task.md mid-cycle, delete .handoff/config.md, delete the user's source files."
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "skill",
      "agent-handoff",
      "plugins",
      "verify"
    ],
    "sourcePath": "plugins/agent-handoff/skills/verify/SKILL.md",
    "sourceKind": "plugin-skill",
    "plugin": "agent-handoff"
  },
  {
    "id": "skill-executar-cop-cadeia-valor-unica",
    "name": "cadeia-valor-unica",
    "type": "skill",
    "area": "Plugin · executar-cop",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "Cadeia de Valor Única do Programa EXECUTAR: recebe um process doc (docx/md, ex.: AIKB-0001 PD-CLB) e, numa só cadeia de análise com a Estratégia 07 + agent-handoff, unifica dependency architecture, process optimization, árvore roadmap, árvore visual e runbook. Entrega 5 artefatos: (1) árvore roadmap, (2) árvore visual, (3) working process publicado e executável no Worker Cloudflare (schema workflow.json), (4) relatório único (dependências + otimização + PDF do workflow), (5) runbook MD tabular. Use quando o usuário pedir cadeia única, /cadeia-unica, CV-CADEIA-001, transformar process doc em workflow, ou unificar dependências/otimização/árvores/runbook.",
    "summary": "Uma passada única, WIP = 1, de um process doc até um working process executável. Toda saída deriva da etapa anterior. Não existe artefato solto.",
    "capabilities": [
      "Token visual obrigatório: ../../assets/design-tokens/calendario-light-mode.md (árvore visual e PDF; vermelho só para o nó atual, estados com rótulo além da cor).",
      "Busca web: obrigatória quando dependência, prazo ou impacto depender de fato externo; citar a fonte. Nunca para adivinhar decisão do usuário.",
      "Toda resposta em português do Brasil.",
      "DIRECT: cita a fonte;",
      "DERIVED: justificativa rastreável;",
      "PROPOSED: precisa de validação humana;"
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "skill",
      "executar-cop",
      "plugins",
      "cadeia-valor-unica"
    ],
    "sourcePath": "plugins/executar-cop/skills/cadeia-valor-unica/SKILL.md",
    "sourceKind": "plugin-skill",
    "plugin": "executar-cop"
  },
  {
    "id": "skill-executar-cop-capacity-plan",
    "name": "capacity-plan",
    "type": "skill",
    "area": "Plugin · executar-cop",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "Plan resource capacity — workload analysis and utilization forecasting. Use when heading into quarterly planning, the team feels overallocated and you need the numbers, deciding whether to hire or deprioritize, or stress-testing whether upcoming projects fit the people you have.",
    "summary": "If you see unfamiliar placeholders or need to check which tools are connected, see CONNECTORS.md.",
    "capabilities": [
      "Team size and roles: Who do you have?",
      "Current workload: What are they working on? (Upload from project tracker or describe)",
      "Upcoming work: What's coming next quarter?",
      "Constraints: Budget, hiring timeline, skill requirements",
      "Available headcount and skills",
      "Current allocation and utilization"
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "skill",
      "executar-cop",
      "plugins",
      "capacity-plan"
    ],
    "sourcePath": "plugins/executar-cop/skills/capacity-plan/SKILL.md",
    "sourceKind": "plugin-skill",
    "plugin": "executar-cop"
  },
  {
    "id": "skill-executar-cop-change-request",
    "name": "change-request",
    "type": "skill",
    "area": "Plugin · executar-cop",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "Create a change management request with impact analysis and rollback plan. Use when proposing a system or process change that needs approval, preparing a change record for CAB review, documenting risk and rollback steps before a deployment, or planning stakeholder communications for a rollout.",
    "summary": "If you see unfamiliar placeholders or need to check which tools are connected, see CONNECTORS.md.",
    "capabilities": [
      "What is changing?",
      "Who is affected?",
      "How significant is the change? (Low / Medium / High)",
      "What resistance should we expect?",
      "Communication plan (who, what, when, how)",
      "Training plan (what skills are needed, how to deliver)"
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "skill",
      "executar-cop",
      "plugins",
      "change-request"
    ],
    "sourcePath": "plugins/executar-cop/skills/change-request/SKILL.md",
    "sourceKind": "plugin-skill",
    "plugin": "executar-cop"
  },
  {
    "id": "skill-executar-cop-competitive-brief",
    "name": "competitive-brief",
    "type": "skill",
    "area": "Plugin · executar-cop",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "Create a competitive analysis brief for one or more competitors or a feature area. Use when informing product strategy or feature prioritization, building sales battle cards, prepping board or investor materials, or deciding where to differentiate vs. achieve parity.",
    "summary": "If you see unfamiliar placeholders or need to check which tools are connected, see CONNECTORS.md.",
    "capabilities": [
      "Competitor(s): Which specific competitor(s) to analyze? Or a feature area to compare across competitors?",
      "Focus: Full product comparison, specific feature area, pricing/packaging, go-to-market, or positioning?",
      "Context: What decision will this inform? (product strategy, sales enablement, investor/board materials, feature prioritization)",
      "Product pages and feature lists",
      "Pricing pages and packaging",
      "Recent product launches, blog posts, and changelogs"
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "skill",
      "executar-cop",
      "plugins",
      "competitive-brief"
    ],
    "sourcePath": "plugins/executar-cop/skills/competitive-brief/SKILL.md",
    "sourceKind": "plugin-skill",
    "plugin": "executar-cop"
  },
  {
    "id": "skill-executar-cop-compliance-tracking",
    "name": "compliance-tracking",
    "type": "skill",
    "area": "Plugin · executar-cop",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "Track compliance requirements and audit readiness. Trigger with \"compliance\", \"audit prep\", \"SOC 2\", \"ISO 27001\", \"GDPR\", \"regulatory requirement\", or when the user needs help tracking, preparing for, or documenting compliance activities.",
    "summary": "Help track compliance requirements, prepare for audits, and maintain regulatory readiness.",
    "capabilities": [
      "Map controls to framework requirements",
      "Document control owners and evidence",
      "Track control effectiveness",
      "Upcoming audit dates and deadlines",
      "Evidence collection timelines",
      "Remediation deadlines"
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "skill",
      "executar-cop",
      "plugins",
      "compliance-tracking"
    ],
    "sourcePath": "plugins/executar-cop/skills/compliance-tracking/SKILL.md",
    "sourceKind": "plugin-skill",
    "plugin": "executar-cop"
  },
  {
    "id": "skill-executar-cop-cowork-plugin-customizer",
    "name": "cowork-plugin-customizer",
    "type": "skill",
    "area": "Plugin · executar-cop",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "Customize a plugin for a specific organization — either by setting up a generic plugin template for the first time, or by tweaking and refining an already-configured plugin.",
    "summary": "Customize a plugin for a specific organization — either by setting up a generic plugin template for the first time, or by tweaking and refining an already-configured plugin.",
    "capabilities": [
      "If the user provided context: Record it and use it to pre-fill answers in Phase 3 — skip asking questions that the user already answered here.",
      "Tool names and services the organization uses",
      "Organizational processes and workflows",
      "Team conventions (naming, statuses, estimation scales)",
      "Configuration values (workspace IDs, project names, team identifiers)",
      "For scoped customization: Only include items related to the specific section the user asked about."
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "skill",
      "executar-cop",
      "plugins",
      "cowork-plugin-customizer"
    ],
    "sourcePath": "plugins/executar-cop/skills/cowork-plugin-customizer/SKILL.md",
    "sourceKind": "plugin-skill",
    "plugin": "executar-cop"
  },
  {
    "id": "skill-executar-cop-create-cowork-plugin",
    "name": "create-cowork-plugin",
    "type": "skill",
    "area": "Plugin · executar-cop",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "Build a new plugin from scratch through guided conversation. Walk the user through discovery, planning, design, implementation, and packaging — delivering a ready-to-install .plugi",
    "summary": "Build a new plugin from scratch through guided conversation. Walk the user through discovery, planning, design, implementation, and packaging — delivering a ready-to-install .plugin file at the end.",
    "capabilities": [
      ".claude-plugin/plugin.json is always required",
      "Component directories (skills/, agents/) go at the plugin root, not inside .claude-plugin/",
      "Only create directories for components the plugin actually uses",
      "Use kebab-case for all directory and file names",
      "What should this plugin do? What problem does it solve?",
      "Who will use it and in what context?"
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "skill",
      "executar-cop",
      "plugins",
      "create-cowork-plugin"
    ],
    "sourcePath": "plugins/executar-cop/skills/create-cowork-plugin/SKILL.md",
    "sourceKind": "plugin-skill",
    "plugin": "executar-cop"
  },
  {
    "id": "skill-executar-cop-executar-arvore-roadmap",
    "name": "executar-arvore-roadmap",
    "type": "skill",
    "area": "Plugin · executar-cop",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "Converte planejamentos, roadmaps, sprints e cronogramas longos e desestruturados (planilhas, PDFs, documentos de metodologia, ou até uma simples descrição de projeto) em uma árvore de navegação hierárquica — mês → semana → dia → ciclo → tarefa → dependência → porta → evidência. Use sempre que o usuário pedir para transformar um plano em \"árvore\", \"diretório navegável\", \"roadmap em texto\", \"cronograma em árvore\", quando mencionar IDs desta skill (ARVORE-TXT-01, ARVORE-ZIP-02, ARVORE-OBSIDIAN-03, ARVORE-CSV-04, ARVOREKIT), quando pedir um vault Obsidian de mergulho progressivo para um plano operacional, ou quando pedir para converter um plano inteiro em CSV estruturado. Também dispare quando o usuário descrever um projeto do zero (sem plano pronto) e pedir para gerar o kit completo de planejamento em formato de árvore. Acionada também pelo ID verbal CV-ARVORE-001 (/arvore) do plugin executar-cop.",
    "summary": "Esta skill converte qualquer plano — por mais longo, bagunçado ou espalhado por múltiplos formatos que esteja — em uma única lógica de navegação: cada nível da árvore responde a uma pergunta diferente (mês → \"em qual período?\", dia → \"o que precisa avançar hoje?\", ciclo M0–M4 → \"que tipo de energia/processo é esse?\", tarefa → \"qual objeto concreto?\", dependência → \"o que precisa existir antes?\", porta → \"que condição maior isso ajuda a atravessar?\", peso → \"quanto do plano inteiro isso represent",
    "capabilities": [
      "ID verbal: CV-ARVORE-001 (/arvore). Os IDs de modo desta skill (ARVORE-TXT-01…ARVOREKIT) são aliases resolvidos pelo Orquestrador. Nó ARVORE-ROADMAP em ../../references/grafo-depen",
      "Pré-voo de dependências: aplicar ../../references/nucleo-dependencias.md antes de extrair.",
      "Com outra entrada (planilha avulsa, PDF, descrição), prossiga e registre a origem.",
      "Saída: estrutura.json validado. Ele desbloqueia ARVORE-VISUAL (CV-VISUAL-001).",
      "Busca web: obrigatória quando o plano citar benchmark, prazo regulatório, referência de mercado ou outro dado externo desatualizável. Cite a fonte e nunca a use para inventar taref",
      "Saída visual: os entregáveis são texto, zip, CSV e vault. Se gerar HTML, SVG ou CSS de vault, aplicar ../../assets/design-tokens/calendario-light-mode.md."
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "skill",
      "executar-cop",
      "plugins",
      "executar-arvore-roadmap"
    ],
    "sourcePath": "plugins/executar-cop/skills/executar-arvore-roadmap/SKILL.md",
    "sourceKind": "plugin-skill",
    "plugin": "executar-cop"
  },
  {
    "id": "skill-executar-cop-executar-dependency-architect",
    "name": "executar-dependency-architect",
    "type": "skill",
    "area": "Plugin · executar-cop",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "A fonte literal deste especialista é references/prompt-mestre.yaml (EXECUTAR-DEPENDENCY-ARCHITECT-001). Leia esse arquivo na primeira execução. Ele define a missão, o princípio de ",
    "summary": "A fonte literal deste especialista é references/prompt-mestre.yaml (EXECUTAR-DEPENDENCY-ARCHITECT-001). Leia esse arquivo na primeira execução. Ele define a missão, o princípio de agrupamento, o modelo epistêmico, o schema exato do registro, as regras, a entrega obrigatória e os critérios de fase e de saída. Este SKILL.md diz como cumprir o contrato; o que ele exige continua sendo o que está no YAML.",
    "capabilities": [
      "Pré-voo de dependências: aplicar ../../references/nucleo-dependencias.md. Esta skill é a forma completa do núcleo: o que ali vale para qualquer ação, aqui vale com a planilha intei",
      "Saída visual: esta skill entrega tabelas. Se o usuário pedir o mapa em HTML ou SVG, aplicar ../../assets/design-tokens/calendario-light-mode.md.",
      "Toda resposta sai em português do Brasil.",
      "DIRECT: a relação está escrita em alguma fonte (16REG, documento, decisão, Leia-me). Cite a aba e a linha.",
      "DERIVED: a relação é necessária e demonstrável por campo ou artefato. A justificativa diz qual campo consome qual.",
      "PROPOSED: recomendação sua. Registre a justificativa e marque que exige validação humana."
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "skill",
      "executar-cop",
      "plugins",
      "executar-dependency-architect"
    ],
    "sourcePath": "plugins/executar-cop/skills/executar-dependency-architect/SKILL.md",
    "sourceKind": "plugin-skill",
    "plugin": "executar-cop"
  },
  {
    "id": "skill-executar-cop-executar-mergulhe",
    "name": "executar-mergulhe",
    "type": "skill",
    "area": "Plugin · executar-cop",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "Organiza conteúdo, projetos, operações e documentação em uma hierarquia navegável da família Executar, combinando árvore visual, mergulho progressivo, Obsidian, relações entre nós, dependências, portas e evidências. Use quando o usuário pedir para estruturar em ramos, pastas, mergulho, nós, fila única, cadeia de dependências, mapa hierárquico, Obsidian ou uma visualização compatível com Executar · Árvore Visual. Acionada também pelo ID verbal CV-VISUAL-001 (/arvore-visual) do plugin executar-cop.",
    "summary": "Transformar complexidade em navegação progressiva.",
    "capabilities": [
      "árvore visual;",
      "diretório de arquivos;",
      "cofre Obsidian;",
      "estrutura de projeto;",
      "mapa de dependências;",
      "fonte para o componente Executar · Árvore Visual."
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "skill",
      "executar-cop",
      "plugins",
      "executar-mergulhe"
    ],
    "sourcePath": "plugins/executar-cop/skills/executar-mergulhe/SKILL.md",
    "sourceKind": "plugin-skill",
    "plugin": "executar-cop"
  },
  {
    "id": "skill-executar-cop-executar-plan-mode",
    "name": "executar-plan-mode",
    "type": "skill",
    "area": "Plugin · executar-cop",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "Converter uma intenção bruta em um plano operacional executável sem antecipar a execução.",
    "summary": "Converter uma intenção bruta em um plano operacional executável sem antecipar a execução.",
    "capabilities": [
      "operar em leitura sempre que possível;",
      "analisar contexto, arquivos, normas, contratos e dependências;",
      "não modificar artefatos do projeto;",
      "não publicar;",
      "não fazer merge;",
      "não fazer deploy;"
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "skill",
      "executar-cop",
      "plugins",
      "executar-plan-mode"
    ],
    "sourcePath": "plugins/executar-cop/skills/executar-plan-mode/SKILL.md",
    "sourceKind": "plugin-skill",
    "plugin": "executar-cop"
  },
  {
    "id": "skill-executar-cop-execution-toolkit",
    "name": "execution-toolkit",
    "type": "skill",
    "area": "Plugin · executar-cop",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "Esta skill reúne três capacidades complementares:",
    "summary": "Esta skill reúne três capacidades complementares:",
    "capabilities": [
      "Prefira o caminho mais simples que preserve a qualidade do resultado.",
      "Não carregue referências sem necessidade.",
      "Não duplique instruções detalhadas no contexto principal.",
      "Preserve arquivos originais, salvo solicitação explícita em contrário.",
      "Use resultados estruturados quando houver comparação entre múltiplos itens.",
      "ID verbal: CV-TOOLKIT-001 (/execucao). Nó EXEC-TOOLKIT em ../../references/grafo-dependencias.json (camada 1)."
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "skill",
      "executar-cop",
      "plugins",
      "execution-toolkit"
    ],
    "sourcePath": "plugins/executar-cop/skills/execution-toolkit/SKILL.md",
    "sourceKind": "plugin-skill",
    "plugin": "executar-cop"
  },
  {
    "id": "skill-executar-cop-memory-management",
    "name": "memory-management",
    "type": "skill",
    "area": "Plugin · executar-cop",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "Two-tier memory system that makes Claude a true workplace collaborator. Decodes shorthand, acronyms, nicknames, and internal language so Claude understands requests like a colleague would. CLAUDE.md for working memory, memory/ directory for the full knowledge base.",
    "summary": "Memory makes Claude your workplace collaborator - someone who speaks your internal language.",
    "capabilities": [
      "todd → Todd Martinez, Finance lead, prefers Slack",
      "PSR → Pipeline Status Report (weekly sales doc)",
      "oracle → Oracle Systems deal, not the company",
      "Top ~30 people you interact with most",
      "~30 most common acronyms/terms",
      "Active projects (5-15)"
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "skill",
      "executar-cop",
      "plugins",
      "memory-management"
    ],
    "sourcePath": "plugins/executar-cop/skills/memory-management/SKILL.md",
    "sourceKind": "plugin-skill",
    "plugin": "executar-cop"
  },
  {
    "id": "skill-executar-cop-metrics-review",
    "name": "metrics-review",
    "type": "skill",
    "area": "Plugin · executar-cop",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "Review and analyze product metrics with trend analysis and actionable insights. Use when running a weekly, monthly, or quarterly metrics review, investigating a sudden spike or drop, comparing performance against targets, or turning raw numbers into a scorecard with recommended actions.",
    "summary": "If you see unfamiliar placeholders or need to check which tools are connected, see CONNECTORS.md.",
    "capabilities": [
      "Pull key product metrics for the relevant time period",
      "Get comparison data (previous period, same period last year, targets)",
      "Pull segment breakdowns if available",
      "The metrics and their values (paste a table, screenshot, or describe)",
      "Comparison data (previous period, targets)",
      "Any context on recent changes (launches, incidents, seasonality)"
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "skill",
      "executar-cop",
      "plugins",
      "metrics-review"
    ],
    "sourcePath": "plugins/executar-cop/skills/metrics-review/SKILL.md",
    "sourceKind": "plugin-skill",
    "plugin": "executar-cop"
  },
  {
    "id": "skill-executar-cop-obsidian-editorial-pipeline",
    "name": "obsidian-editorial-pipeline",
    "type": "skill",
    "area": "Plugin · executar-cop",
    "status": "REGISTERED",
    "version": "2.2.0",
    "headline": "Opera a produção editorial faseada no Obsidian a partir de formulário/briefing editorial, Process Doc e estado existente do job. Use para criar, continuar, revisar, organizar ou empacotar ciclos editoriais; compõe dinamicamente artigo, evidências, vídeo, carrosséis, imagens, stories, newsletters, ebooks, CTAs e handoff sem exigir um perfil único. Acionada também pelo ID verbal CV-EDITORIAL-001 (/editorial) do plugin executar-cop.",
    "summary": "Transformar um formulário editorial em um job operacional rastreável no Obsidian, avançar o job por dependências com WIP=1, validar evidências/gates e gerar o ZIP de produção/handoff quando o pacote atingir 99% PRODUCED.",
    "capabilities": [
      "ID verbal: CV-EDITORIAL-001 (/editorial). Nó EDITORIAL-OBSIDIAN em ../../references/grafo-dependencias.json.",
      "Pré-voo de dependências: aplicar ../../references/nucleo-dependencias.md.",
      "No fluxo PEM-PIPELINE-PROPRIETARIO, depende da Árvore Visual (DEP-COP-003, bloqueante). Um ciclo editorial avulso, com formulário próprio, não exige a árvore.",
      "O DAG de etapas (config/process-v02.json) é o grafo de dependências interno do job. Etapa elegível, WIP=1 e bloqueios seguem o núcleo.",
      "Busca web: obrigatória nas etapas de evidências, claims, fontes e dados de mercado. Cite a fonte, marque a data de acesso e nunca invente evidência.",
      "Saída: job, vault e ZIP de handoff. É o último nó da cadeia proprietária."
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "skill",
      "executar-cop",
      "plugins",
      "obsidian-editorial-pipeline"
    ],
    "sourcePath": "plugins/executar-cop/skills/obsidian-editorial-pipeline/SKILL.md",
    "sourceKind": "plugin-skill",
    "plugin": "executar-cop"
  },
  {
    "id": "skill-executar-cop-process-doc",
    "name": "process-doc",
    "type": "skill",
    "area": "Plugin · executar-cop",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "Document a business process — flowcharts, RACI, and SOPs. Use when formalizing a process that lives in someone's head, building a RACI to clarify who owns what, writing an SOP for a handoff or audit, or capturing the exceptions and edge cases of how work actually gets done.",
    "summary": "If you see unfamiliar placeholders or need to check which tools are connected, see CONNECTORS.md.",
    "capabilities": [
      "Who: [Role]",
      "When: [Trigger or timing]",
      "How: [Detailed instructions]",
      "Output: [What this step produces]",
      "[Link to related process or policy]",
      "Search for existing process documentation to update rather than duplicate"
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "skill",
      "executar-cop",
      "plugins",
      "process-doc"
    ],
    "sourcePath": "plugins/executar-cop/skills/process-doc/SKILL.md",
    "sourceKind": "plugin-skill",
    "plugin": "executar-cop"
  },
  {
    "id": "skill-executar-cop-process-optimization",
    "name": "process-optimization",
    "type": "skill",
    "area": "Plugin · executar-cop",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "Analyze and improve business processes. Trigger with \"this process is slow\", \"how can we improve\", \"streamline this workflow\", \"too many steps\", \"bottleneck\", or when the user describes an inefficient process they want to fix.",
    "summary": "Analyze existing processes and recommend improvements.",
    "capabilities": [
      "Document every step, decision point, and handoff",
      "Identify who does what and how long each step takes",
      "Note manual steps, approvals, and waiting times",
      "Waiting: Time spent in queues or waiting for approvals",
      "Rework: Steps that fail and need to be redone",
      "Handoffs: Each handoff is a potential point of failure or delay"
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "skill",
      "executar-cop",
      "plugins",
      "process-optimization"
    ],
    "sourcePath": "plugins/executar-cop/skills/process-optimization/SKILL.md",
    "sourceKind": "plugin-skill",
    "plugin": "executar-cop"
  },
  {
    "id": "skill-executar-cop-product-brainstorming",
    "name": "product-brainstorming",
    "type": "skill",
    "area": "Plugin · executar-cop",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "Brainstorm product ideas, explore problem spaces, and challenge assumptions as a thinking partner. Use when exploring a new opportunity, generating solutions to a product problem, stress-testing an idea, or when a PM needs to think out loud with a sharp sparring partner before converging on a direction.",
    "summary": "You are a sharp product thinking partner — the kind of experienced PM or design lead who challenges assumptions, asks the hard questions, and pushes ideas further before anyone converges too early. You help product managers explore problem spaces, generate ideas, and stress-test thinking before it becomes a spec.",
    "capabilities": [
      "Ask \"who has this problem?\" and \"what are they doing about it today?\" before anything else",
      "Map the problem ecosystem: who is involved, what triggers the problem, what are the consequences of not solving it",
      "Distinguish symptoms from root causes. PMs often describe symptoms. Keep asking \"why\" until you hit something structural.",
      "Surface adjacent problems the PM might not have considered",
      "Ask how the problem varies across user segments — it rarely affects everyone the same way",
      "\"What happens if we do nothing? Who suffers and how?\""
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "skill",
      "executar-cop",
      "plugins",
      "product-brainstorming"
    ],
    "sourcePath": "plugins/executar-cop/skills/product-brainstorming/SKILL.md",
    "sourceKind": "plugin-skill",
    "plugin": "executar-cop"
  },
  {
    "id": "skill-executar-cop-product-code-development",
    "name": "product-code-development",
    "type": "skill",
    "area": "Plugin · executar-cop",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "Especialista integrado de Product Management + Software Engineering para transformar objetivos, pesquisa, requisitos e blueprints em arquitetura, planos de implementação de código, vertical slices, revisão, testes, deploy, operação e evolução. Em Plan Mode produz CODE IMPLEMENTATION PLAN; em Execution Mode implementa, testa e verifica.",
    "summary": "Esta skill orquestra Product Management + Engineering em um único ciclo de entrega, sem confundir planejamento de produto com planejamento de código.",
    "capabilities": [
      "não altere código;",
      "produza um CODE IMPLEMENTATION PLAN para futura alteração de código;",
      "cada milestone principal deve resultar em código, schema, migration, integration, test, runtime config, CI/CD ou infraestrutura;",
      "documentação é suporte de rastreabilidade, nunca substituto do desenvolvimento.",
      "preserve suas dimensões;",
      "aceite defaults sem conflito com o SOT;"
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "skill",
      "executar-cop",
      "plugins",
      "product-code-development"
    ],
    "sourcePath": "plugins/executar-cop/skills/product-code-development/SKILL.md",
    "sourceKind": "plugin-skill",
    "plugin": "executar-cop"
  },
  {
    "id": "skill-executar-cop-risk-assessment",
    "name": "risk-assessment",
    "type": "skill",
    "area": "Plugin · executar-cop",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "Identify, assess, and mitigate operational risks. Trigger with \"what are the risks\", \"risk assessment\", \"risk register\", \"what could go wrong\", or when the user is evaluating risks associated with a project, vendor, process, or decision.",
    "summary": "Systematically identify, assess, and plan mitigations for operational risks.",
    "capabilities": [
      "Operational: Process failures, staffing gaps, system outages",
      "Financial: Budget overruns, vendor cost increases, revenue impact",
      "Compliance: Regulatory violations, audit findings, policy breaches",
      "Strategic: Market changes, competitive threats, technology shifts",
      "Reputational: Customer impact, public perception, partner relationships",
      "Security: Data breaches, access control failures, third-party vulnerabilities"
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "skill",
      "executar-cop",
      "plugins",
      "risk-assessment"
    ],
    "sourcePath": "plugins/executar-cop/skills/risk-assessment/SKILL.md",
    "sourceKind": "plugin-skill",
    "plugin": "executar-cop"
  },
  {
    "id": "skill-executar-cop-roadmap-update",
    "name": "roadmap-update",
    "type": "skill",
    "area": "Plugin · executar-cop",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "Update, create, or reprioritize your product roadmap. Use when adding a new initiative and deciding what moves to make room, shifting priorities after new information comes in, moving timelines due to a dependency slip, or building a Now/Next/Later view from scratch.",
    "summary": "If you see unfamiliar placeholders or need to check which tools are connected, see CONNECTORS.md.",
    "capabilities": [
      "Pull current roadmap items with their statuses, assignees, and dates",
      "Identify items that are overdue, at risk, or recently completed",
      "Surface any items without clear owners or dates",
      "Ask the user to describe their current roadmap or paste/upload it",
      "Accept any format: list, table, spreadsheet, screenshot, or prose description",
      "Gather: name, description, priority, estimated effort, target timeframe, owner, dependencies"
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "skill",
      "executar-cop",
      "plugins",
      "roadmap-update"
    ],
    "sourcePath": "plugins/executar-cop/skills/roadmap-update/SKILL.md",
    "sourceKind": "plugin-skill",
    "plugin": "executar-cop"
  },
  {
    "id": "skill-executar-cop-runbook",
    "name": "runbook",
    "type": "skill",
    "area": "Plugin · executar-cop",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "Create or update an operational runbook for a recurring task or procedure. Use when documenting a task that on-call or ops needs to run repeatably, turning tribal knowledge into exact step-by-step commands, adding troubleshooting and rollback steps to an existing procedure, or writing escalation paths for when things go wrong.",
    "summary": "If you see unfamiliar placeholders or need to check which tools are connected, see CONNECTORS.md.",
    "capabilities": [
      "[ ] [Access or permission needed]",
      "[ ] [Tool or system required]",
      "[ ] [Data or input needed]",
      "[ ] [How to confirm the task completed successfully]",
      "[ ] [What to check]",
      "Search for existing runbooks to update rather than create from scratch"
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "skill",
      "executar-cop",
      "plugins",
      "runbook"
    ],
    "sourcePath": "plugins/executar-cop/skills/runbook/SKILL.md",
    "sourceKind": "plugin-skill",
    "plugin": "executar-cop"
  },
  {
    "id": "skill-executar-cop-sprint-planning",
    "name": "sprint-planning",
    "type": "skill",
    "area": "Plugin · executar-cop",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "Plan a sprint — scope work, estimate capacity, set goals, and draft a sprint plan. Use when kicking off a new sprint, sizing a backlog against team availability (accounting for PTO and meetings), deciding what's P0 vs. stretch, or handling carryover from the last sprint.",
    "summary": "If you see unfamiliar placeholders or need to check which tools are connected, see CONNECTORS.md.",
    "capabilities": [
      "Team: Who's on the team and their availability this sprint?",
      "Sprint length: How many days/weeks?",
      "Backlog: What's prioritized? (Pull from tracker, paste, or describe)",
      "Carryover: Anything unfinished from last sprint?",
      "Dependencies: Anything blocked on other teams?",
      "[ ] Code reviewed and merged"
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "skill",
      "executar-cop",
      "plugins",
      "sprint-planning"
    ],
    "sourcePath": "plugins/executar-cop/skills/sprint-planning/SKILL.md",
    "sourceKind": "plugin-skill",
    "plugin": "executar-cop"
  },
  {
    "id": "skill-executar-cop-stakeholder-update",
    "name": "stakeholder-update",
    "type": "skill",
    "area": "Plugin · executar-cop",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "Generate a stakeholder update tailored to audience and cadence. Use when writing a weekly or monthly status for leadership, announcing a launch, escalating a risk or blocker, or translating the same progress into exec-brief, engineering-detail, or customer-facing versions.",
    "summary": "If you see unfamiliar placeholders or need to check which tools are connected, see CONNECTORS.md.",
    "capabilities": [
      "Weekly: Regular cadence update on progress, blockers, and next steps",
      "Monthly: Higher-level summary with trends, milestones, and strategic alignment",
      "Launch: Announcement of a feature or product launch with details and impact",
      "Ad-hoc: One-off update for a specific situation (escalation, pivot, major decision)",
      "Executives / leadership: High-level, outcome-focused, strategic framing, brief",
      "Engineering team: Technical detail, implementation context, blockers, decisions needed"
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "skill",
      "executar-cop",
      "plugins",
      "stakeholder-update"
    ],
    "sourcePath": "plugins/executar-cop/skills/stakeholder-update/SKILL.md",
    "sourceKind": "plugin-skill",
    "plugin": "executar-cop"
  },
  {
    "id": "skill-executar-cop-start",
    "name": "start",
    "type": "skill",
    "area": "Plugin · executar-cop",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "Initialize the productivity system and open the dashboard. Use when setting up the plugin for the first time, bootstrapping working memory from your existing task list, or decoding the shorthand (nicknames, acronyms, project codenames) you use in your todos.",
    "summary": "If you see unfamiliar placeholders or need to check which tools are connected, see CONNECTORS.md.",
    "capabilities": [
      "TASKS.md — task list",
      "CLAUDE.md — working memory",
      "memory/ — deep memory directory",
      "dashboard.html — the visual UI",
      "/productivity:update to sync tasks and check memory",
      "/productivity:update --comprehensive for a deep scan of all activity"
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "skill",
      "executar-cop",
      "plugins",
      "start"
    ],
    "sourcePath": "plugins/executar-cop/skills/start/SKILL.md",
    "sourceKind": "plugin-skill",
    "plugin": "executar-cop"
  },
  {
    "id": "skill-executar-cop-status-report",
    "name": "status-report",
    "type": "skill",
    "area": "Plugin · executar-cop",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "Generate a status report with KPIs, risks, and action items. Use when writing a weekly or monthly update for leadership, summarizing project health with green/yellow/red status, surfacing risks and decisions that need stakeholder attention, or turning a pile of project tracker activity into a readable narrative.",
    "summary": "If you see unfamiliar placeholders or need to check which tools are connected, see CONNECTORS.md.",
    "capabilities": [
      "[Win 1]",
      "[Win 2]",
      "Pull project status, completed items, and upcoming milestones automatically",
      "Identify at-risk items and overdue tasks",
      "Scan recent team discussions for decisions and blockers to include",
      "Offer to post the finished report to a channel"
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "skill",
      "executar-cop",
      "plugins",
      "status-report"
    ],
    "sourcePath": "plugins/executar-cop/skills/status-report/SKILL.md",
    "sourceKind": "plugin-skill",
    "plugin": "executar-cop"
  },
  {
    "id": "skill-executar-cop-synthesize-research",
    "name": "synthesize-research",
    "type": "skill",
    "area": "Plugin · executar-cop",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "Synthesize user research from interviews, surveys, and feedback into structured insights. Use when you have a pile of interview notes, survey responses, or support tickets to make sense of, need to extract themes and rank findings by frequency and impact, or want to turn raw feedback into roadmap recommendations.",
    "summary": "If you see unfamiliar placeholders or need to check which tools are connected, see CONNECTORS.md.",
    "capabilities": [
      "Pasted text: Interview notes, transcripts, survey responses, feedback",
      "Uploaded files: Research documents, spreadsheets, recordings summaries",
      "~~knowledge base (if connected): Search for research documents, interview notes, survey results",
      "~~user feedback (if connected): Pull recent support tickets, feature requests, bug reports",
      "~~product analytics (if connected): Pull usage data, funnel metrics, behavioral data",
      "~~meeting transcription (if connected): Pull interview recordings, meeting summaries, and discussion notes"
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "skill",
      "executar-cop",
      "plugins",
      "synthesize-research"
    ],
    "sourcePath": "plugins/executar-cop/skills/synthesize-research/SKILL.md",
    "sourceKind": "plugin-skill",
    "plugin": "executar-cop"
  },
  {
    "id": "skill-executar-cop-task-management",
    "name": "task-management",
    "type": "skill",
    "area": "Plugin · executar-cop",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "Simple task management using a shared TASKS.md file. Reference this when the user asks about their tasks, wants to add/complete tasks, or needs help tracking commitments.",
    "summary": "Tasks are tracked in a simple TASKS.md file that both you and the user can edit.",
    "capabilities": [
      "If it exists, read/write to it",
      "If it doesn't exist, create it with the template below",
      "Reads and writes to the same TASKS.md file",
      "Auto-saves changes",
      "Watches for external changes (syncs when you edit via CLI)",
      "Supports drag-and-drop reordering of tasks and sections"
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "skill",
      "executar-cop",
      "plugins",
      "task-management"
    ],
    "sourcePath": "plugins/executar-cop/skills/task-management/SKILL.md",
    "sourceKind": "plugin-skill",
    "plugin": "executar-cop"
  },
  {
    "id": "skill-executar-cop-update",
    "name": "update",
    "type": "skill",
    "area": "Plugin · executar-cop",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "Sync tasks and refresh memory from your current activity. Use when pulling new assignments from your project tracker into TASKS.md, triaging stale or overdue tasks, filling memory gaps for unknown people or projects, or running a comprehensive scan to catch todos buried in chat and email.",
    "summary": "If you see unfamiliar placeholders or need to check which tools are connected, see CONNECTORS.md.",
    "capabilities": [
      "Default: Sync tasks from external tools, triage stale items, check memory for gaps",
      "--comprehensive: Deep scan chat, email, calendar, docs — flag missed todos and suggest new memories",
      "Project tracker (e.g. Asana, Linear, Jira) (if MCP available)",
      "GitHub Issues (if in a repo): gh issue list --assignee=@me",
      "Tasks with due dates in the past",
      "Tasks in Active for 30+ days"
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "skill",
      "executar-cop",
      "plugins",
      "update"
    ],
    "sourcePath": "plugins/executar-cop/skills/update/SKILL.md",
    "sourceKind": "plugin-skill",
    "plugin": "executar-cop"
  },
  {
    "id": "skill-executar-cop-vendor-review",
    "name": "vendor-review",
    "type": "skill",
    "area": "Plugin · executar-cop",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "Evaluate a vendor — cost analysis, risk assessment, and recommendation. Use when reviewing a new vendor proposal, deciding whether to renew or replace a contract, comparing two vendors side-by-side, or building a TCO breakdown and negotiation points before procurement sign-off.",
    "summary": "If you see unfamiliar placeholders or need to check which tools are connected, see CONNECTORS.md.",
    "capabilities": [
      "Vendor name: Who are you evaluating?",
      "Context: New vendor evaluation, renewal decision, or comparison?",
      "Details: Contract terms, pricing, proposal document, or current performance data",
      "Total cost of ownership (not just license fees)",
      "Implementation and migration costs",
      "Training and onboarding costs"
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "skill",
      "executar-cop",
      "plugins",
      "vendor-review"
    ],
    "sourcePath": "plugins/executar-cop/skills/vendor-review/SKILL.md",
    "sourceKind": "plugin-skill",
    "plugin": "executar-cop"
  },
  {
    "id": "skill-executar-cop-write-spec",
    "name": "write-spec",
    "type": "skill",
    "area": "Plugin · executar-cop",
    "status": "REGISTERED",
    "version": "A DEFINIR",
    "headline": "Write a feature spec or PRD from a problem statement or feature idea. Use when turning a vague idea or user request into a structured document, scoping a feature with goals and non-goals, defining success metrics and acceptance criteria, or breaking a big ask into a phased spec.",
    "summary": "If you see unfamiliar placeholders or need to check which tools are connected, see CONNECTORS.md.",
    "capabilities": [
      "A feature name (\"SSO support\")",
      "A problem statement (\"Enterprise customers keep asking for centralized auth\")",
      "A user request (\"Users want to export their data as CSV\")",
      "A vague idea (\"We should do something about onboarding drop-off\")",
      "User problem: What problem does this solve? Who experiences it?",
      "Target users: Which user segment(s) does this serve?"
    ],
    "dependsOn": [],
    "blocks": [],
    "workflows": [],
    "tags": [
      "skill",
      "executar-cop",
      "plugins",
      "write-spec"
    ],
    "sourcePath": "plugins/executar-cop/skills/write-spec/SKILL.md",
    "sourceKind": "plugin-skill",
    "plugin": "executar-cop"
  }
];
