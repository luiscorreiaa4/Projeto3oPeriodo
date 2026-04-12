// Usando Arrow Functions para selecionar os elementos
const form = document.getElementById('formCadastro');
const empresa = document.getElementById('empresa');
const email = document.getElementById('email');
const celular = document.getElementById('celular');
const senha = document.getElementById('senha');
const confirmaSenha = document.getElementById('confirma_senha');
const desafio = document.getElementById('desafio');

const erroEmpresa = document.getElementById('erro-empresa');
const erroEmail = document.getElementById('erro-email');
const erroCelular = document.getElementById('erro-celular');
const erroPadraoSenha = document.getElementById('erro-padrao-senha');
const erroConfirmaSenha = document.getElementById('erro-confirma-senha');
const erroDesafio = document.getElementById('erro-desafio');

/**
 * FUNÇÃO MESTRE: toggleErro (Arrow Function)
 * Adiciona ou remove as classes de erro
 */
const toggleErro = (inputElement, spanElement, temErro) => {
    if (temErro) {
        inputElement.classList.add('input-erro');
        spanElement.classList.add('ativo');
    } else {
        inputElement.classList.remove('input-erro');
        spanElement.classList.remove('ativo');
    }
};

// Listeners de Evento (Utilizando Arrow Functions)
empresa.addEventListener('focus', () => toggleErro(empresa, erroEmpresa, false));

email.addEventListener('blur', () => {
    const isInvalid = email.value !== '' && !email.checkValidity();
    toggleErro(email, erroEmail, isInvalid);
});

desafio.addEventListener('change', () => toggleErro(desafio, erroDesafio, desafio.value === ''));

// 1. A MÁSCARA (Acontece enquanto o usuário digita)
celular.addEventListener('input', (e) => {
    // Tira tudo que não é número instantaneamente
    let v = e.target.value.replace(/\D/g, '');
    
    // Trava o limite máximo em 11 números (DDD + 9 dígitos)
    if (v.length > 11) v = v.slice(0, 11);

    // Constrói a máscara pedaço por pedaço
    if (v.length > 10) {
        // Formato: (11) 98888-7777
        e.target.value = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
    } else if (v.length > 6) {
        // Formato: (11) 8888-7777
        e.target.value = `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`;
    } else if (v.length > 2) {
        // Formato: (11) 9888
        e.target.value = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    } else if (v.length > 0) {
        // Formato: (1
        e.target.value = `(${v}`;
    } else {
        // Se apagou tudo, limpa o campo para não sobrar um "(" solto
        e.target.value = '';
    }
});

// 2. A VALIDAÇÃO (Acontece quando ele sai do campo)
celular.addEventListener('blur', () => {
    let v = celular.value.replace(/\D/g, ''); 
    
    // Dá erro se ele começou a digitar, mas parou na metade (ex: tem menos de 10 números)
    toggleErro(celular, erroCelular, v.length > 0 && v.length < 10);
});

// Função interna para checar senhas (também como Arrow Function)
const checarSenhasIguais = () => {
    if (confirmaSenha.value !== '') {
        const saoDiferentes = senha.value !== confirmaSenha.value;
        toggleErro(confirmaSenha, erroConfirmaSenha, saoDiferentes);
    }
};

senha.addEventListener('blur', () => {
    toggleErro(senha, erroPadraoSenha, senha.value !== '' && !senha.checkValidity());
    checarSenhasIguais();
});

confirmaSenha.addEventListener('input', checarSenhasIguais);

// Barreira Final: Submit do Formulário
form.addEventListener('submit', (event) => {
    // Validações rápidas
    const checkEmpresa = empresa.value.trim() === '';
    const checkEmail = !email.checkValidity() || email.value === '';
    const checkCelular = celular.value.replace(/\D/g, '').length < 10;
    const checkSenha = !senha.checkValidity() || senha.value === '';
    const checkConfirma = senha.value !== confirmaSenha.value || confirmaSenha.value === '';
    const checkDesafio = desafio.value === '';

    // Aplica o visual de erro
    toggleErro(empresa, erroEmpresa, checkEmpresa);
    toggleErro(email, erroEmail, checkEmail);
    toggleErro(celular, erroCelular, checkCelular);
    toggleErro(senha, erroPadraoSenha, checkSenha);
    toggleErro(confirmaSenha, erroConfirmaSenha, checkConfirma);
    toggleErro(desafio, erroDesafio, checkDesafio);

    // Se houver qualquer erro, impede o envio
    if (checkEmpresa || checkEmail || checkCelular || checkSenha || checkConfirma || checkDesafio) {
        event.preventDefault(); 
    }
});