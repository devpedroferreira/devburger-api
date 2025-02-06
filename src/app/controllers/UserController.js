/*
metodos que vamos usa:

store => cadastrar/add
index => Listar varios
show => mostrar um
update => atualizar
delete => delete
*/

import {v4} from 'uuid';
import User from '../../app/models/User.js';

class UserController {
    async store(req, res) {
        // try catach to handle error
        try {
            const {name, email, password_hash, admin} = request.body;
            const user = await User.create({
                id: v4(),
                name,
                email,
                password_hash,
                admin
            });
            return res.status(201).json(user);
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ error: 'Email already exists' });
            }
            return res.status(500).json({ error: 'Internal server error' });
        };  
    };
};

export default new UserController;
