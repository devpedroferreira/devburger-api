import { Model, Sequelize } from "sequelize";

class Product extends Model {
    static init(sequelize){
        super.init(
            {
            name: Sequelize.STRING,
            price: Sequelize.NUMBER,
            category: Sequelize.STRING,
            path: Sequelize.STRING,
            url: {
                type: Sequelize.VIRTUAL,
                get(){
                    return `http://localhost:5433/product-file/${this.path}`
                }
            }
            },
            {
            sequelize,
            },
        );
    };
};

export default Product;