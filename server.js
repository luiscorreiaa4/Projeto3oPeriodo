const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const db = require('./db'); // Importa a nossa ponte com o banco
require('dotenv').config();

const app = express();
const PORT = 3000;

// Configurações do EJS e Pastas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// CONFIGURAÇÃO DE SESSÃO (O "RG" do usuário no navegador)
app.use(session({
    secret: 'chave-secreta-nexus', // Em produção, mude isso para algo complexo
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // O login dura 24 horas
}));

// Middleware para disponibilizar o usuário em todas as telas (para o nav.ejs)
app.use((req, res, next) => {
    res.locals.usuarioLogado = req.session.usuario;
    next();
});

// --- ROTAS DE NAVEGAÇÃO ---

app.get('/', (req, res) => res.render('index'));
app.get('/cadastro', (req, res) => res.render('cadastro'));
app.get('/login', (req, res) => res.render('login'));

// ROTA DO DASHBOARD (CLIENTE)
app.get('/dashboard', (req, res) => {
    if (!req.session.usuario) return res.redirect('/login');
    res.render('dashboard', { usuarioLogado: req.session.usuario });
});

// ROTA DO ADMIN (BUSCA REAL NO BANCO)
app.get('/admin', async (req, res) => {
    // Segurança: Só entra se for admin
    if (!req.session.usuario || !req.session.usuario.is_admin) {
        return res.redirect('/login');
    }

    try {
        // A CORREÇÃO: Agora estamos pedindo o 'id' e o 'status' para o banco de dados!
        const query = `
            SELECT id, empresa, email, celular, desafio, status, 
            TO_CHAR(data_cadastro, 'DD/MM/YYYY') as data 
            FROM usuarios 
            WHERE is_admin = false 
            ORDER BY data_cadastro DESC
        `;
        const resultado = await db.query(query);
        res.render('admin', { clientes: resultado.rows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar dados no banco.');
    }
});

// Rota para abrir a tela de resposta (Admin)
app.get('/admin/responder/:id', async (req, res) => {
    if (!req.session.usuario || !req.session.usuario.is_admin) return res.redirect('/login');
    
    const { id } = req.params;
    const resultado = await db.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    res.render('responder', { cliente: resultado.rows[0] });
});

// Rota para salvar a resposta (Admin)
app.post('/admin/responder/:id', async (req, res) => {
    if (!req.session.usuario || !req.session.usuario.is_admin) return res.redirect('/login');

    const { id } = req.params;
    const { resposta } = req.body;

    try {
        await db.query(
            'UPDATE usuarios SET resposta_admin = $1, status = $2 WHERE id = $3',
            [resposta, 'Respondido', id]
        );
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.send("Erro ao enviar resposta.");
    }
});

// --- ROTAS DE AÇÃO (POST) ---

// CADASTRO REAL
// CADASTRO REAL (Com Auto-Login)
app.post('/cadastro', async (req, res) => {
    const { empresa, email, celular, senha, desafio } = req.body;

    try {
        const senhaHasheada = await bcrypt.hash(senha, 10);
        
        // Adicionamos o RETURNING * no final da query
        const query = `
            INSERT INTO usuarios (empresa, email, celular, senha, desafio) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *
        `;
        
        const resultado = await db.query(query, [empresa, email, celular, senhaHasheada, desafio]);
        
        // 1. Pega o usuário recém-criado do banco
        const novoUsuario = resultado.rows[0];
        
        // 2. Deleta a senha do objeto por segurança
        delete novoUsuario.senha;
        
        // 3. Cria a sessão automaticamente (Faz o Login Invisível)
        req.session.usuario = novoUsuario;
        
        // 4. Manda direto para o Dashboard!
        res.redirect('/dashboard');
        
    } catch (err) {
        console.error(err);
        res.render('cadastro', { erro: 'Erro ao cadastrar. Talvez este e-mail já esteja em uso.' });
    }
});

// LOGIN REAL
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const resultado = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        
        if (resultado.rows.length > 0) {
            const usuario = resultado.rows[0];
            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            
            if (senhaValida) {
                delete usuario.senha;
                req.session.usuario = usuario;
                return usuario.is_admin ? res.redirect('/admin') : res.redirect('/dashboard');
            }
        }
        
        // A CORREÇÃO ESTÁ AQUI: Renderiza o login de novo com uma mensagem de erro!
        res.render('login', { erro: 'E-mail ou senha incorretos. Tente novamente.' });
        
    } catch (err) {
        console.error(err);
        res.render('login', { erro: 'Erro interno no servidor. Tente mais tarde.' });
    }
});

// EXIBIR PERFIL
app.get('/perfil', (req, res) => {
    if (!req.session.usuario) return res.redirect('/login');
    res.render('perfil'); // res.locals já provê o usuarioLogado
});

// SALVAR ALTERAÇÕES DO PERFIL
app.post('/perfil', async (req, res) => {
    if (!req.session.usuario) return res.redirect('/login');

    const { empresa, email, celular, desafio, senha } = req.body;
    const userId = req.session.usuario.id;

    try {
        let query;
        let params;

        if (senha && senha.trim() !== "") {
            // Se informou senha, atualizamos com hash
            const senhaHasheada = await bcrypt.hash(senha, 10);
            query = `UPDATE usuarios SET empresa=$1, email=$2, celular=$3, desafio=$4, senha=$5 WHERE id=$6 RETURNING *`;
            params = [empresa, email, celular, desafio, senhaHasheada, userId];
        } else {
            // Se não informou, mantemos a senha atual
            query = `UPDATE usuarios SET empresa=$1, email=$2, celular=$3, desafio=$4 WHERE id=$5 RETURNING *`;
            params = [empresa, email, celular, desafio, userId];
        }

        const resultado = await db.query(query, params);
        const usuarioAtualizado = resultado.rows[0];
        delete usuarioAtualizado.senha;
        req.session.usuario = usuarioAtualizado;

        res.render('perfil', { mensagem: 'Perfil atualizado com sucesso!', usuarioLogado: usuarioAtualizado });
    } catch (err) {
        console.error(err);
        res.render('perfil', { mensagem: 'Erro: Este e-mail já pertence a outra conta.' });
    }
});

// LOGOUT
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.listen(PORT, () => console.log(`Servidor rodando em: http://localhost:${PORT}`));