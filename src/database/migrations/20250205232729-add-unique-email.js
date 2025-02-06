'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addConstraint('users', {
            fields: ['email'],
            type: 'unique',
            name: 'unique_email_constraint'
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeConstraint('users', 'unique_email_constraint');
    }
};
