/**
 * Este arquivo app.js configura e inicializa a aplicação Express.
 * Ele define a classe App que configura middlewares e rotas.
 * A instância da aplicação é exportada para ser usada em outras partes do projeto.
 */
import express from 'express';

class App {
    constructor() {
        this.app = express(); // Inicializa a aplicação Express

        this.middlewares(); // Configura os middlewares da aplicação.
        
        this.routes(); // 
    }

    
    /**
     * Configura os middlewares da aplicação.
     * Atualmente, está configurado para usar o middleware express.json(),
     * que permite a aplicação processar requisições com payload JSON.
     */
    middlewares(){
        this.app.use(express.json());
    }

    routes (){

    }
}

module.exports = new App().app; // exporta a instância do app