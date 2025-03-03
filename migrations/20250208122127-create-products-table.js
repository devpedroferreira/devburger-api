'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {

  await queryInterface.createTable('products', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    price: {
        type: Sequelize.DECIMAL,
        allowNull: false,
    },
    category_id: {//added relation with category
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'category',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    // path da img do produto
    path: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    created_at: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
    }
  });

};
export async function down(queryInterface) {
await queryInterface.dropTable('products');

};