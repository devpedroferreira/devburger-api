'use strict';

export async function up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('users', {
        fields: ['email'],
        type: 'unique',
        name: 'unique_email_constraint'
    });
}
export async function down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('users', 'unique_email_constraint');
}
