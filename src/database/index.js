import Sequelize from 'sequelize';
import mongoose from 'mongoose';
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

    async init() {
        try {
            // Create connection
            this.connection = new Sequelize(configDatabase);
            
            // Test connection
            await this.connection.authenticate();
            console.log('PostgreSQL connection established successfully');
            
            // Initialize models
            models.forEach((model) => model.init(this.connection));
            
            // Execute model associations
            models.forEach((model) => {
                if (model.associate) {
                    model.associate(this.connection.models);
                }
            });

        } catch (error) {
            console.error('Sem conexão com PostgreSQL:', error.message);
            process.exit(1); // Exit if database connection fails
        }
    }

    async mongo() {
        try {
            this.mongoConnection = await mongoose.connect('mongodb://localhost:27017/devburger', {
                serverSelectionTimeoutMS: 5000 // 5 second timeout
            });
            console.log('MongoDB connection established successfully');
        } catch (error) {
            console.error('Sem conexão com MongoDB:', error.message);
            // Don't exit process as MongoDB is optional
        }
    }
}

export default new Database();