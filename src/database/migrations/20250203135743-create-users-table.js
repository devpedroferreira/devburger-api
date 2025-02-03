'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:*/
     await queryInterface.createTable('users', {
       id:{
          primaryKey: true,
          allowNull: false, // diz que o campo é obrigatorio
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          },

          name:{
            type: Sequelize.STRING,
            allowNull: false,
          },

          email:{
            type: Sequelize.STRING,
            allowNull: false,
          },
          

          password_hash:{
            type: Sequelize.STRING,
            allowNull: false, 
          },

          admin:{
            type: Sequelize.BOOLEAN,
            defaultValue: false,
          },

          created_at:{
            type: Sequelize.DATE,
            allowNull: false,
          }, 
          updated_at:{
            type: Sequelize.DATE,
            allowNull: false,
          }

       });
     
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
