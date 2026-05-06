---
trigger: always_on
---

O foco atual do projeto é ESTRITAMENTE o comportamento do Front-end (Vanilla JS) e a estrutura do DOM (arquivos .ejs). Ao modificar scripts ou views, você DEVE obedecer a estas regras:

Design Intocável (CSS Lock): O design de UI/UX já foi aprovado e finalizado. É PROIBIDO alterar arquivos .css, adicionar/remover classes de estilização (como Tailwind ou utilitárias) ou modificar layouts.

Isolamento de Back-end (No Routes): É PROIBIDO modificar o arquivo server.js, lógicas de banco de dados (db.js) ou regras de sessão do Express.

Preservação EJS: NENHUMA tag de renderização do servidor (<% ... %>, <%= ... %>) pode ser alterada.

Sincronia DOM-JS: Ao refatorar arquivos .js (como validações), garanta que os seletores (getElementById) correspondam exatamente aos atributos id presentes nos arquivos .ejs.