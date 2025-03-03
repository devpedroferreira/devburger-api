import {Model, Sequelize} from 'sequelize';

class Category extends Model {
    static init(sequelize){
        super.init(
            {
            name: {
            type: Sequelize.STRING,
            unique: true
            },

            description: Sequelize.STRING,   
            },
            {
                sequelize,
                tableName:'category', // especifica o nome da tabela
            },
        );
    };
};

export default Category;