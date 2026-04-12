const form = document.getElementById('formPerfil');
const campos = ['empresa', 'email', 'celular', 'senha', 'confirma_senha', 'desafio'];
const elementos = {};
const erros = {};

campos.forEach(campo => {
    elementos[campo] = document.getElementById(campo);
    erros[campo] = document.getElementById(`erro-${campo}`);
});

const toggleErro = (el, err, temErro) => {
    el.classList.toggle('input-erro', temErro);
    err.classList.toggle('ativo', temErro);
};

// Máscara de Celular (Mesma lógica)
elementos.celular.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 10) e.target.value = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
    else if (v.length > 6) e.target.value = `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`;
    else if (v.length > 2) e.target.value = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    else if (v.length > 0) e.target.value = `(${v}`;
    else e.target.value = '';
});

form.addEventListener('submit', (e) => {
    let temErroGeral = false;

    // Validações Básicas
    const checkEmpresa = elementos.empresa.value.trim() === '';
    const checkEmail = !elementos.email.checkValidity() || elementos.email.value === '';
    const checkCelular = elementos.celular.value.replace(/\D/g, '').length < 10;
    
    // Senha só valida se tiver algo escrito
    let checkSenha = false;
    let checkConfirma = false;
    if (elementos.senha.value.length > 0) {
        checkSenha = !elementos.senha.checkValidity();
        checkConfirma = elementos.senha.value !== elementos.confirma_senha.value;
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