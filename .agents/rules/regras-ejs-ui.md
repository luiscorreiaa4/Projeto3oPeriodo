---
trigger: always_on
---

O projeto "Nexus Inc" utiliza Node.js com views em EJS e validações front-end em Vanilla JS. Ao refatorar a UI/UX, você DEVE seguir estas regras inquebráveis:

EJS Intacto: NENHUMA tag EJS (<% ... %>, <%= ... %>, <%- ... %>) pode ser apagada, movida de seu contexto lógico ou alterada. A renderização do servidor depende delas.

IDs Intactos: NUNCA altere, remova ou modifique atributos id de formulários, inputs, selects ou spans (ex: id="formCadastro", id="erro-empresa"). Os arquivos de script dependem exclusivamente deles.

Forms Intactos: Mantenha todos os atributos name, action e method originais intactos.

Estilo Base: Mantenha a paleta Dark Blue (#011E48, #02265a) e Cyan (#7DD3FC), modernizando com sombras suaves (glassmorphism), cantos arredondados (border-radius: 16px) e responsividade Mobile-First.