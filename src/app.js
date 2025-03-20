import express from 'express';
import routes from './routes.js'; // Importe suas rotas aqui
import './database/index.js'; // connect with databases
import cors from 'cors';
import {resolve} from 'node:path';

class App {
    constructor() {
        this.app = express(); // Cria a instância do Express
        this.app.use(cors({
            origin: 'http://localhost:5173', // URL do seu frontend
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));
        this.middlewares(); // Configura os middlewares
        this.routes(); // Configura as rotas
    };

    middlewares() {
        this.app.use(express.json()); // Middleware para parsear JSON
        this.app.use('/product-file', express.static(resolve('uploads')));
    };

    routes() {
        this.app.use(routes); // Usa as rotas definidas em routes.js
    };
};

// Exporta a instância do Express configurada
export default new App().app;