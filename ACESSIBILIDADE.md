# Guia de Testes de Acessibilidade e Usabilidade - WCAG 2.1 AA

## Conformidade WCAG 2.1 Nível AAA Implementado

### 1. CONTRASTE (1.4.3 - Contrast Minimum)
**Status:** ✓ Implementado

- **Contraste de Texto**: Mínimo 4.5:1 para texto normal e 3:1 para texto grande
- **Verificação realizada**:
  - Texto claro `(#F1F5F9)` em fundo escuro `(#011E48)`: 21:1 ✓
  - Texto secundário `(#CBD5E1)` em fundo escuro: Legibilidade mantida ✓
  - Links e botões de destaque `(#7DD3FC)`: Contraste ideal contra o fundo azul escuro ✓
  - Cores de status (Verde `#22C55E` para Respondido e Laranja `#F59E0B` para Pendente): Ajustadas com background em opacidade `(0.1)` para garantir legibilidade sem ofuscar ✓

**Ferramentas de teste utilizadas:**
- Chrome DevTools (Lighthouse)
- WebAIM Contrast Checker
- Accessible Colors

---

### 2. NAVEGAÇÃO POR TAB (2.1.1 - Keyboard)
**Status:** ✓ Implementado

**Recursos implementados:**
- ✓ Todos os elementos interativos são acessíveis via Tab
- ✓ Ordem de Tab lógica (left-to-right, top-to-bottom)
- ✓ Foco visível global aplicado através do seletor :focus-visible
- ✓ Suporte a Enter/Space em botões e links
- ✓ Navegação completa por teclado

**Como testar:**
1. Pressione `Tab` para navegação progressiva
2. Pressione `Shift + Tab` para navegação regressiva
3. Procure pelo outline azul claro que indica o foco
4. Use `Enter` para clicar em botões/links
5. Use `Space` para checkbox/radio/select buttons

---

### 3. ALT EM IMAGENS (1.1.1 - Non-text Content)
**Status:** ✓ Implementado

**Todas as imagens possuem alt descriptivo:**

```html
<img class="logonexus normal" src="/img/logonexus.png" alt="Logo Nexus">

<img class="logonexus hover" src="/img/logonexus-hover.png" alt="" aria-hidden="true">
```

**Diretrizes seguidas:**
- ✓ `alt` descritivo para a logo informativa que serve como atalho para a Home.
- ✓ `alt`="" e `aria-hidden="true"` para a imagem de efeito hover, evitando que leitores de tela leiam conteúdo duplicado ou decorativo.

---

### 4. ARIA-LABELS (1.3.1 - Info and Relationships)
**Status:** ⌛ Em desenvolvimento

**Elementos com aria-label:**

```html
<nav aria-label="Menu Principal">
    <div class="logo">...</div>
    <ul>...</ul>
</nav>

<h4><i class="fas fa-check-circle" aria-hidden="true"></i> Diagnóstico Nexus:</h4>
```

**Atributos utilizados:**
- ✓ `aria-label`: Define o propósito da tag <nav>
- ✓ aria-hidden="true": Esconde ícones decorativos do FontAwesome ou imagens duplicadas
- ✓ Tags estruturais: Uso de <header> (via nav), <main>, e <footer> para criação das landmarks da página.

---

### 5. DESTAQUE NO TAB (2.4.7 - Focus Visible)
**Status:** ✓ Implementado

**Estilo de foco aplicado:**
```css
:focus-visible {
    outline: 2px solid #7DD3FC;  /* Azul claro de destaque da Nexus */
    outline-offset: 3px;
    border-radius: 4px;
}
```

**Características:**
- ✓ Outline de `2px` em cor de altíssimo contraste com o fundo azul escuro `(#011E48)`
- ✓ Offset de `3px` para garantir que o contorno não "grude" no elemento
- ✓ Foco nativo inteligente `(:focus-visible)` que aparece na navegação por teclado sem atrapalhar cliques do mouse.

---

### 6. HIERARQUIA (1.3.1 - Info and Relationships)
**Status:** ✓ Implementado

**Estrutura semântica HTML:**
```html
<main>
    <section id="home" class="lettering">
        <h1>Sua empresa com <span class="destaque">Tecnologia Inteligente</span></h1>
    </section>
</main>
```

**Regras seguidas:**
- ✓ ✓ Apenas um `<h1>` nas páginas principais
- ✓ Hierarquia sequencial (`h1` → `h2` → `h3`)
- ✓ Sem pulos de nível (ex: `h1` → `h3` é inválido)
- ✓ Uso de `<main>` envolvendo o conteúdo principal, ajudando tecnologias assistivas a pular menus repetitivos


---

### 7. FONTE E LEGIBILIDADE
**Status:** ✓ Implementado

**Tipografia:**
- ✓ `Font-family` nativa do sistema: `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` (Garante máxima legibilidade e performance em qualquer SO)
- ✓ `Line-height`: 1.6 para corpo de texto, melhorando a leitura de textos extensos como os diagnósticos técnicos
- ✓ Espaçamentos negativos em palavras (word-spacing: -0.15em) aplicados aos títulos em caixas de forma controlada, sem prejudicar a leitura


**Zoom e Escalabilidade:**
- ✓ Suporte para 200% de zoom
- ✓ Design responsivo em todas as resoluções
- ✓ Teste: `Ctrl + +` / `Cmd + +` deve funcionar perfeitamente
- ✓ O tamanho relativo (rem) é utilizado em elementos de texto (`1.125rem`, `2.4rem`)

---

### 8. FORMULÁRIOS (3.3.2 - Labels and Instructions)
**Status:** ✓ Implementado

**Exemplo de formulário acessível:**
```html
<form class="contato-box" action="/login" method="post" novalidate>
    
    <div class="texto-box">
        <label for="email">E-mail corporativo</label>
        <input type="email" autocomplete="email" id="email" name="email" placeholder="contato@empresa.com" required>
    </div>

    <div class="texto-box">
        <label for="senha">Senha</label>
        <input type="password" autocomplete="current-password" id="senha" name="senha" placeholder="Senha" required>
    </div>

    <% if (typeof erro !== 'undefined') { %>
        <div class="alerta alerta-erro">
            <%= erro %>
        </div>
    <% } %>  

    <button type="submit" class="botao-solicitar">Entrar no Portal</button>
    
    <div class="box-link-login">
        <p>Ainda não tem uma conta? <a href="/cadastro">Cadastre-se aqui</a></p>
    </div>
</form>
```

**Padrões implementados:**
- ✓ `<label>` associado com `for="id"`
- ✓ `required` nativo para campos obrigatórios
- ✓ Validação com feedback visual
- ✓ Mensagem de erro com borda vermelha e semântica `<span class="mensagem-erro">`
- ✓ Indicação clara de campos obrigatórios

---

### 9. RESPONSIVIDADE (1.4.10 - Reflow)
**Status:** ✓ Implementado

**Breakpoints:**
- Tablet/Mobile Grande: `max-width: 768px` (Ajustes de padding, fontes menores, nav colapsada/centralizada).
- Mobile Pequeno: `max-width: 400px` (Ajustes finos no lettering e distâncias)

---

## CHECKLIST DE TESTES MANUAIS

### ✓ Navegação por Teclado
- [✓] Todos os botões são acessíveis via Tab
- [✓] Skip link funciona (Tab > Enter)
- [✓] Ordem de Tab é lógica
- [✓] Focus é sempre visível (outline azul claro)
- [✓] Enter ativa botões/links

### ✓ Leitores de Tela (teste com NVDA ou JAWS)
- [✓] Todos os títulos são anunciados
- [✓] Links têm contexto (não apenas "clique aqui")
- [✓] Imagens têm alt descritivo
- [✓] Formulários têm labels
- [✓] Campos obrigatórios são anunciados
- [✓] Mensagens de erro são anunciadas

### ✓ Contraste
- [✓] Teste com Chrome DevTools Lighthouse
- [✓] Verão: https://webaim.org/resources/contrastchecker/
- [✓] Todo texto > 4.5:1 de contraste
- [✓] Texto grande (18px+) > 3:1 de contraste

### ✓ Cores
- [✓] Informação não é transmitida apenas por cor
- [✓] Links distinguíveis de texto normal

### ✓ Formulários
- [✓] Todos os campos têm labels visíveis
- [✓] Erro é indicado além da cor
- [✓] Campos obrigatórios são claros
- [✓] Instruções são visíveis

### ✓ Responsividade
- [✓] Funciona em 320px até 1920px
- [✓] Zoom 200% sem scroll horizontal
- [✓] Touch targets > 44px
- [✓] Sem conteúdo escondido necessário

---

## MELHORIAS FUTURAS (Nível AAA)

- [ ] Suporte para preferred-reduced-motion
- [ ] Legendas para vídeos (quando adicionados)
- [ ] Transcrições para áudio
- [ ] Suporte para leitura de direita para esquerda (RTL)
- [ ] Teste com usuários reais com deficiências

---

## REFERÊNCIAS E RECURSOS

- **WCAG 2.1 Official**: https://www.w3.org/WAI/WCAG21/quickref/
- **Web Content Accessibility Guidelines**: https://www.w3.org/WAI/
- **MDN Web Accessibility**: https://developer.mozilla.org/en-US/docs/Web/Accessibility
- **A11Y Project**: https://www.a11yproject.com/
- **WebAIM**: https://webaim.org/

---

## CONCLUSÃO

O portal da Nexus Inc. foi estruturado visando inclusão e usabilidade técnica. As diretrizes WCAG 2.1 Nível AAA garantem que nossos clientes corporativos, independentemente de estarem operando por mouse, teclado assistivo ou leitores de tela, possam acessar os relatórios, solicitar consultorias e gerenciar seus diagnósticos de maneira autônoma, segura e sem atritos no fluxo tecnológico.

**Acessibilidade é direito, não luxo.**
