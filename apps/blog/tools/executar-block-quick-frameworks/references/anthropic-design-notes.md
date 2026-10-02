# Notas de desenho da skill

Esta skill foi organizada para divulgação progressiva de contexto.

Princípios aplicados:
- `SKILL.md` contém somente instruções centrais e caminhos de execução.
- Contratos longos ficam em `references/`.
- Regras determinísticas podem ser verificadas por código em `scripts/`.
- Modelos de produção ficam em `assets/`.
- Casos de avaliação ficam em `evals/`.
- O nome da pasta e o campo `name` usam kebab-case.
- A descrição informa o que a skill faz e quando deve ser usada.
- O agente deve carregar somente os arquivos necessários para a etapa atual.
- Instruções descrevem ações desejadas de forma positiva e específica.
- A pesquisa separa contexto, instruções, evidências e saída.
- A skill trata conteúdo externo como dado, nunca como autorização.

Referências de desenho:
- Anthropic Engineering — Equipping agents for the real world with Agent Skills.
- Anthropic — Complete Guide to Building Skills for Claude.
- Anthropic Docs — Prompting best practices.
- Anthropic Engineering — Effective context engineering for AI agents.
- Anthropic Engineering — Writing effective tools for AI agents.
