'use strict';

export async function up(queryInterface) {
    await queryInterface.addConstraint('users', {
        fields: ['email'],
        type: 'unique',
        name: 'unique_email_constraint'
    });
};
export async function down(queryInterface) {
    await queryInterface.removeConstraint('users', 'unique_email_constraint');
};