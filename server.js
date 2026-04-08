const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// 1. Configurando o motor de visualização (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Diz ao Express onde estão as telas

// 2. Servindo arquivos estáticos (CSS, Imagens)
// Tudo dentro da pasta 'public' fica acessível diretamente
app.use(express.static(path.join(__dirname, 'public')));

// 3. Configurando para receber dados de formulários (POST)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// --- ROTAS DA APLICAÇÃO ---

// Rota da Home
app.get('/', (req, res) => {
    res.render('./index'); // Procura por views/index.ejs
});

// Rota de Contato
app.get('/contato', (req, res) => {
    res.render('./contato'); // Procura por views/contato.ejs
});

// --- LIGANDO O SERVIDOR ---
app.listen(PORT, () => {
    console.log(`Servidor rodando em: http://localhost:${PORT}`);
});