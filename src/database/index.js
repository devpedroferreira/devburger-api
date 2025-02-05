import Sequelize from 'sequelize';
// conf do banco
import configDatabase from '../config/database.js';

import User from '../app/models/User.js';
const models = [User];

class Database {
    constructor(){
    this.init();

    };

    // reutiliza a mesma conexao com o banco, optimiza o fluxo.
    init(){
        this.connection = new Sequelize(configDatabase);
        models.forE((model) => model.init(this.connection));
    };
};

export default new Database();
