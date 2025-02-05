import Sequelize from 'sequelize';

class User extends Model {
    static init(sequelize) {
        super.init(
            {
                name: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: true,
                    },
                },
                email: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    unique: true,
                    validate: {
                        isEmail: true,
                    },
                },
                password_hash: {
                    type: Sequelize.STRING,
                },
                admin: {
                    type: Sequelize.BOOLEAN,
                },
            },
            {
                sequelize,
            }
        );
    }
};

export default User;