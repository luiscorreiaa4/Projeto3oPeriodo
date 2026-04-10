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
        celular: "(11) 99999-9999",
        isAdmin: false
    };
    res.render('./dashboard', { usuarioLogado });
});

app.get('/admin', (req, res) => {
    
    const clientesFicticios = [
        { id: 1, empresa: "Alphabet Inc.", email: "contato@alphabet.com", celular: "(11) 98888-7777", desafio: "Reduzir custos", data: "10/04/2026" },
        { id: 2, empresa: "TechCorp S.A.", email: "admin@techcorp.br", celular: "(21) 97777-6666", desafio: "Segurança de dados", data: "09/04/2026" },
        { id: 3, empresa: "Logística Express", email: "ti@logexpress.com", celular: "(31) 96666-5555", desafio: "Automatizar processos", data: "08/04/2026" }
    ];

    const usuarioLogado = {
        isAdmin: true
    };
    res.render('admin', { clientes: clientesFicticios, usuarioLogado: usuarioLogado });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em: http://localhost:${PORT}`);
});