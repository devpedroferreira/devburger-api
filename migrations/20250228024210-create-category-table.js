'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('category', {
       id: {
          type:Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
       }, 
       name:{
          type: Sequelize.INTEGER,
          allowNull: false,
          unique: true
       }, 
    });

  },

  async down (queryInterface) {
     await queryInterface.dropTable('category'); 
  },
};
