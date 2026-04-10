const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ROTAS

app.get('/', (req, res) => {
    res.render('./index');
});

app.get('/cadastro', (req, res) => {
    res.render('./cadastro');
});

app.get('/login', (req, res) => {
    res.render('./login');
});

app.get('/dashboard', (req, res) => {
    const usuarioLogado = {
        empresa: "Alphabet Inc.",
        desafio: "Automatizar processos manuais.",
        celular: "(11) 99999-9999"
    };
    res.render('./dashboard', { usuarioLogado });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em: http://localhost:${PORT}`);
});