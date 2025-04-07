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
                    get() {
                        // Return only the filename if path exists
                        return this.getDataValue('path');
                    },
                    set(value) {
                        // Store only the filename, not the full path
                        this.setDataValue('path', value);
                    }
                },
                url: {
                    type: Sequelize.VIRTUAL,
                    get() {
                        return this.path
                            ? `http://localhost:5433/categories-file/${this.path}`
                            : null;
                    },
                },
                fullPath: {
                    type: Sequelize.VIRTUAL,
                    get() {
                        return this.path
                            ? `uploads/categories/${this.path}`
                            : null;
                    },
                }
            },
            {
                sequelize,
                tableName: 'category',
            }
        );

        return this;
    }

    static associate(models) {
        this.hasMany(models.Product, { foreignKey: 'category_id', as: 'products' });
    }
}

export default Category;