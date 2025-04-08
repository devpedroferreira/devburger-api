import { Model, Sequelize } from 'sequelize';

class Product extends Model {
    static init(sequelize){
        super.init(
            {
                name: {
                    type: Sequelize.STRING,
                    unique: true,
                    allowNull: false,
                    set(value) {
                        // Capitalize each word
                        const formattedName = value
                            .split(' ')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ');
                        this.setDataValue('name', formattedName);
                    }
                },
                description: {
                    type: Sequelize.TEXT,
                    allowNull: true,
                },
                price: {
                    type: Sequelize.DECIMAL(6, 2),
                    allowNull: false,
                },
                category_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                offer: {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                },
                path: {
                    type: Sequelize.STRING,
                    allowNull: false,
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
                            ? `http://localhost:5433/products-file/${this.path}`
                            : null;
                    },
                },
                fullPath: {
                    type: Sequelize.VIRTUAL,
                    get() {
                        return this.path
                            ? `uploads/products/${this.path}`
                            : null;
                    },
                }
            },
            {
                sequelize,
                tableName: 'products'
            }
        );
        return this;
    }

    static associate(models){
        this.belongsTo(models.Category, { foreignKey: 'category_id', as: 'category' });
    }
}

export default Product;