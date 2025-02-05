import express from 'express';
import routes from './routes.js'; // Importe suas rotas aqui
import './database/index.js';
class App {
    constructor() {
        this.app = express(); // Cria a instância do Express
        this.middlewares(); // Configura os middlewares
        this.routes(); // Configura as rotas
    }

    middlewares() {
        this.app.use(express.json()); // Middleware para parsear JSON
    }

    routes() {
        this.app.use(routes); // Usa as rotas definidas em routes.js
    }
}

// Exporta a instância do Express configurada
export default new App().app;