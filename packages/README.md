# packages/

Código compartilhado entre os produtos de `apps/*` (ADR-M01 no `CLAUDE.md` da raiz).

Vazio por decisão: um módulo só sai de um app para cá quando um segundo app precisar dele.
Candidatos já identificados no Blog: os componentes `apps/blog/app/components/ui` (shadcn),
os tokens de `apps/blog/app/styles/global.css` e o sistema plain text
(`apps/blog/app/components/plain`, `apps/blog/app/lib/plain`).
