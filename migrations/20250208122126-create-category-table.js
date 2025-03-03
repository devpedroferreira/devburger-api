'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('category', {
       id: {
          type:Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
       }, 
       name:{
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
       },
       description:{
            type: Sequelize.STRING,
            allowNull: false
       },
       created_at: {
          type: Sequelize.DATE,
          allowNull: false
      },
       updated_at: {
          type: Sequelize.DATE,
          allowNull: false 
      }    
    });

  };

export async function down(queryInterface) {
    await queryInterface.dropTable('category');
};
