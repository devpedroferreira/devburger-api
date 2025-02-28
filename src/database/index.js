import Sequelize from 'sequelize';
// conf do banco
import configDatabase from '../config/database.js';

import User from '../app/models/User.js';
import Product from '../app/models/Product.js';
import Category from '../app/models/Category.js';
const models = [User, Product, Category];

class Database {
    constructor(){
    this.init();

    };

    // reutiliza a mesma conexao com o banco, optimiza o fluxo.
    init(){
        this.connection = new Sequelize(configDatabase);
        models.forEach((model) => model.init(this.connection));
    };
};

export default new Database();
