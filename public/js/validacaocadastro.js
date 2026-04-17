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


const toggleErro = (inputElement, spanElement, temErro) => {
    if (temErro) {
        inputElement.classList.add('input-erro');
        spanElement.classList.add('ativo');
    } else {
        inputElement.classList.remove('input-erro');
        spanElement.classList.remove('ativo');
    }
};

empresa.addEventListener('focus', () => toggleErro(empresa, erroEmpresa, false));

email.addEventListener('blur', () => {
    const isInvalid = email.value !== '' && !email.checkValidity();
    toggleErro(email, erroEmail, isInvalid);
});

desafio.addEventListener('change', () => toggleErro(desafio, erroDesafio, desafio.value === ''));


celular.addEventListener('focus', (e) => {
    if (!e.target.value) {
        e.target.value = '+55 ';
    }
});

celular.addEventListener('keydown', (e) => {
    if (e.target.value.length <= 4 && e.keyCode === 8) {
        e.preventDefault();
    }
});

celular.addEventListener('input', (e) => {
    let rawValue = e.target.value;
    
    let v = rawValue.replace(/\D/g, '');

    if (!v.startsWith('55')) {
        v = '55' + v;
    }

    v = v.slice(0, 13);

    if (v.length <= 2) {
        e.target.value = `+${v} `;
    } else if (v.length <= 4) {
        e.target.value = `+${v.slice(0, 2)} (${v.slice(2)}`;
    } else if (v.length <= 9) {
        e.target.value = `+${v.slice(0, 2)} (${v.slice(2, 4)}) ${v.slice(4)}`;
    } else {
        e.target.value = `+${v.slice(0, 2)} (${v.slice(2, 4)}) ${v.slice(4, 9)}-${v.slice(9)}`;
    }
});

//VALIDAÇÃO
celular.addEventListener('blur', () => {
    let v = celular.value.replace(/\D/g, ''); 
    
    toggleErro(celular, erroCelular, v.length > 0 && v.length < 10);
});

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

form.addEventListener('submit', (event) => {
  
    const checkEmpresa = empresa.value.trim() === '';
    const checkEmail = !email.checkValidity() || email.value === '';
    const checkCelular = celular.value.replace(/\D/g, '').length < 10;
    const checkSenha = !senha.checkValidity() || senha.value === '';
    const checkConfirma = senha.value !== confirmaSenha.value || confirmaSenha.value === '';
    const checkDesafio = desafio.value === '';

    toggleErro(empresa, erroEmpresa, checkEmpresa);
    toggleErro(email, erroEmail, checkEmail);
    toggleErro(celular, erroCelular, checkCelular);
    toggleErro(senha, erroPadraoSenha, checkSenha);
    toggleErro(confirmaSenha, erroConfirmaSenha, checkConfirma);
    toggleErro(desafio, erroDesafio, checkDesafio);

    if (checkEmpresa || checkEmail || checkCelular || checkSenha || checkConfirma || checkDesafio) {
        event.preventDefault(); 
    }
});