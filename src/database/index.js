import Sequelize from 'sequelize';
import mongoose from 'mongoose';

// conf do banco
import configDatabase from '../config/database.js';

import User from '../app/models/User.js';
import Product from '../app/models/Product.js';
import Category from '../app/models/Category.js';

const models = [User, Product, Category];

class Database {
    constructor() {
        this.init();
        this.mongo();
    }

    // reutiliza a mesma conexao com o banco, optimiza o fluxo.
    init() {
        try {
            this.connection = new Sequelize(configDatabase);
            
            // Inicializa os modelos
            models
                .forEach((model) => model.init(this.connection));
            
            // Executa as associações dos modelos
            models
                .forEach((model) => {
                    if (model.associate) {
                        model.associate(this.connection.models);
                    }
                });

            console.log('PostgreSQL connection established successfully');
        } catch (error) {
            console.error('Unable to connect to PostgreSQL:', error);
        }
    }

    async mongo() {
        try {
            this.mongoConnection = await mongoose.connect('mongodb://localhost:27017/devburger');
            console.log('MongoDB connection established successfully');
        } catch (error) {
            console.error('Unable to connect to MongoDB:', error);
        };
    };
};

export default new Database();