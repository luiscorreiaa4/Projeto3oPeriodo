const { Pool } = require('pg');
require('dotenv').config();

// Configura a conexão usando as variáveis do seu .env
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});

// Exporta o pool para ser usado no server.js
module.exports = {
    query: (text, params) => pool.query(text, params),
};