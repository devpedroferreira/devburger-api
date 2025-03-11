import { Model, Sequelize } from 'sequelize';

class Category extends Model {
    static init(sequelize) {
        super.init(
            {
                name: {
                    type: Sequelize.STRING,
                    unique: true,
                    allowNull: false,
                },
                description: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                path: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                url: {
                    type: Sequelize.VIRTUAL,
                    get() {
                        return this.path
                            ? `http://localhost:5433/category-file/${this.path}`
                            : null;
                    },
                },
            },
            {
                sequelize,
                tableName: 'category', // specifies the table name
            }
        );

        return this;
    }

    static associate(models) {
        this.hasMany(models.Product, { foreignKey: 'category_id', as: 'products' });
    }
}

export default Category;