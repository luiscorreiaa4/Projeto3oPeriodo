const { Client } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const setupDatabase = async () => {

    //Conexão ao banco
    const clientAdmin = new Client({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        database: 'postgres'
    });

    try {
        await clientAdmin.connect();
        
        //Derruba conexões ativas
        await clientAdmin.query(`
            SELECT pg_terminate_backend(pg_stat_activity.pid)
            FROM pg_stat_activity
            WHERE pg_stat_activity.datname = '${process.env.DB_NAME}'
            AND pid <> pg_backend_pid();
        `);

        await clientAdmin.query(`DROP DATABASE IF EXISTS "${process.env.DB_NAME}"`);
        await clientAdmin.query(`CREATE DATABASE "${process.env.DB_NAME}"`);

    } catch (err) {
        console.error('Erro no Reset:', err.message);
        return;
    } finally {
        await clientAdmin.end();
    }

    //Conexão ao nexus_db para criar as tabelas e usuários
    const clientNexus = new Client({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME
    });

    try {
        await clientNexus.connect();

        //Criação da Tabela com campos de atendimento
        await clientNexus.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id SERIAL PRIMARY KEY,
                empresa VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                celular VARCHAR(20) NOT NULL,
                senha VARCHAR(255) NOT NULL,
                desafio VARCHAR(100) NOT NULL,
                is_admin BOOLEAN DEFAULT FALSE,
                resposta_admin TEXT,
                status VARCHAR(20) DEFAULT 'Pendente',
                data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        //Criando usuários iniciais
        const saltRounds = 10;

        const hashAdmin = await bcrypt.hash('admin', saltRounds);
        await clientNexus.query(`
            INSERT INTO usuarios (empresa, email, celular, senha, desafio, is_admin, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7)`, 
            ['Nexus Admin', 'admin', '+55 (00) 00000-0000', hashAdmin, 'Admin System', true, 'Admin']
        );

        // Usuário Teste
        const hashTeste = await bcrypt.hash('1234', saltRounds);
        await clientNexus.query(`
            INSERT INTO usuarios (empresa, email, celular, senha, desafio, is_admin)
            VALUES ($1, $2, $3, $4, $5, $6)`, 
            ['Empresa de Teste S.A.', 'teste@teste.com', '+55 (11) 99999-8888', hashTeste, 'Reduzir custos operacionais', false]
        );

        console.log('Usuários criados:');
        console.log('   - Admin: admin / admin');
        console.log('   - Teste: teste@teste.com / 1234');
        console.log('Setup concluído!');

    } catch (err) {
        console.error('Erro na criação:', err.message);
    } finally {
        await clientNexus.end();
    }
};

setupDatabase();