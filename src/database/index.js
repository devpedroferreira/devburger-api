import Sequelize from 'sequelize';

import User from './models/User';

class Database {
    constructor(){
        this.init();

    };

    init(){
        this.connection = new Sequelize();
    };
};


export default Database();