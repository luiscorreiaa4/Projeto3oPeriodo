---
trigger: manual
---

É ESTRITAMENTE PROIBIDO alterar qualquer classe CSS ou design das páginas. O UI/UX já está finalizado.

Ao alterar rotas no server.js, certifique-se de não quebrar as conexões com o banco de dados (db.query).

Lógica padrão de redirecionamento: Se o usuário estiver logado e for is_admin, envie para /admin. Se estiver logado e for cliente, envie para /dashboard."