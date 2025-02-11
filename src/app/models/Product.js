import { Model, Sequelize } from "sequelize";

class Product extends Model {
    init(sequelize){
        super.init(
            {
                name: Sequelize.STRING,
                price: Sequelize.STRING,
                category: Sequelize.STRING,
                path: Sequelize.STRING
            },
            {
                sequelize,
            },
        );
    };
};

export default Product;