import express from 'express';
import routes from './routes.js'; // Importe suas rotas aqui
import './database/index.js'; // connect with databases
import cors from 'cors';
import {resolve} from 'node:path';

class App {
    constructor() {
        this.app = express(); // Cria a instância do Express
        this.app.use(cors({
            origin: '*', // Configura o CORS para permitir requisições de qualquer origem
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));
        this.middlewares(); // Configura os middlewares
        this.routes(); // Configura as rotas
    };

    middlewares() {
        this.app.use(express.json()); // Middleware para parsear JSON
        
        // Debug middleware para logging de requisições de arquivos
        this.app.use('/category-file', (req, res, next) => {
            console.log('Accessing category file:', req.url);
            console.log('Full path:', resolve('uploads', req.url));
            next();
        });

        // Configuração para servir arquivos estáticos
        this.app.use('/category-file', express.static(resolve('uploads')));
        this.app.use('/product-file', express.static(resolve('uploads')));

        // Middleware de erro para arquivos não encontrados
        this.app.use((err, req, res, next) => {
            if (err.code === 'ENOENT') {
                console.error('File not found:', req.url);
                return res.status(404).json({ error: 'File not found' });
            }
            next(err);
        });
    };

    routes() {
        this.app.use(routes); // Usa as rotas definidas em routes.js
    };
};

// Exporta a instância do Express configurada
export default new App().app;