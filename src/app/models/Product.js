import { Model, Sequelize } from 'sequelize';

class Product extends Model {
    static init(sequelize){
        super.init(
            {
                name: {
                    type: Sequelize.STRING,
                    unique: true
                },
                price: {
                    type: Sequelize.DECIMAL(6, 2),
                    allowNull:false,
                },
                path: {
                    type:Sequelize.STRING,
                    allowNull:false,
                },
                url: {
                    type: Sequelize.VIRTUAL,
                    get(){
                        return `http://localhost:5433/product-file/${this.path}`
                    },
                },
            },
            {
                sequelize,
            },
        );
    };

    return(){
        return this.url;
    };
    static associate(models){
        this.belongsTo(models.Category, { foreignKey: 'category_id', as: 'category' });
    };
};

export default Product;