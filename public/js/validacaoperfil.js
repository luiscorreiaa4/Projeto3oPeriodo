const form = document.getElementById('formPerfil');
const campos = ['empresa', 'email', 'celular', 'senha', 'confirma_senha', 'desafio'];
const celular = document.getElementById('celular');
const elementos = {};
const erros = {};

campos.forEach(campo => {
    elementos[campo] = document.getElementById(campo);
    if (campo === 'senha') {
        erros[campo] = document.getElementById('erro-padrao-senha');
    } else if (campo === 'confirma_senha') {
        erros[campo] = document.getElementById('erro-confirma-senha');
    } else {
        erros[campo] = document.getElementById(`erro-${campo}`);
    }
});

const toggleErro = (el, err, temErro) => {
    el.classList.toggle('input-erro', temErro);
    err.classList.toggle('ativo', temErro);
};

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

// VALIDAÇÃO DE SENHA EM TEMPO REAL
const checarSenhasIguais = () => {
    if (elementos.confirma_senha.value !== '' || elementos.senha.value !== '') {
        const saoDiferentes = elementos.senha.value !== elementos.confirma_senha.value;
        toggleErro(elementos.confirma_senha, erros.confirma_senha, saoDiferentes);
    } else {
        toggleErro(elementos.confirma_senha, erros.confirma_senha, false);
    }
};

elementos.senha.addEventListener('blur', () => {
    const isInvalid = elementos.senha.value !== '' && !elementos.senha.checkValidity();
    toggleErro(elementos.senha, erros.senha, isInvalid);
    checarSenhasIguais();
});

elementos.confirma_senha.addEventListener('input', checarSenhasIguais);

form.addEventListener('submit', (e) => {
    let temErroGeral = false;

    const checkEmpresa = elementos.empresa.value.trim() === '';
    const checkEmail = !elementos.email.checkValidity() || elementos.email.value === '';
    const checkCelular = elementos.celular.value.replace(/\D/g, '').length < 10;
    
    let checkSenha = false;
    let checkConfirma = false;
    
    const senhaVal = elementos.senha.value;
    const confirmaVal = elementos.confirma_senha.value;

    if (senhaVal !== '' || confirmaVal !== '') {
        checkSenha = !elementos.senha.checkValidity() || senhaVal === '';
        checkConfirma = senhaVal !== confirmaVal;
    }

    toggleErro(elementos.empresa, erros.empresa, checkEmpresa);
    toggleErro(elementos.email, erros.email, checkEmail);
    toggleErro(elementos.celular, erros.celular, checkCelular);
    toggleErro(elementos.senha, erros.senha, checkSenha);
    toggleErro(elementos.confirma_senha, erros.confirma_senha, checkConfirma);

    if (checkEmpresa || checkEmail || checkCelular || checkSenha || checkConfirma) {
        e.preventDefault();
    }
});