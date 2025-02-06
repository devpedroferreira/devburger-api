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
import * as Yup from 'yup';

class UserController {
    async store(req, res) {
        // try catach to handle error
        try {
            // vilid data with yup lib            
            const schema = Yup.object().shape({
                name: Yup.string().required('Digite o nome corretamente.'),
                email: Yup.string().email('Digite um email valido exemplo@email.com').required('email obrigatório'),
                password_hash: Yup.string().min(6, 'senha 6 caractere minimo').required('senha obrigatório'),
                admin: Yup.boolean()
            });

            // validar todos os campos e retornar todos os erros encontrados.
            await schema.validate(req.body, {abortEarly: false});

            const {name, email, password_hash, admin} = req.body;
            const user = await User.create({
                id: v4(),
                name,
                email,
                password_hash,
                admin
            });
            return res.status(201).json({
                id: user.id,
                name,
                email,
                admin
            });
        } catch (error) {
            // retorna os erros : await schema.validate(res.body, {abortEarly: false});
            if (error.name === 'ValidationError') {
                return res.status(400).json({error: error.errors});
            }
            // erro email
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ error: 'Email already exists' });
            }
            return res.status(500).json({ error: 'Internal server error' });
        };  
    };
};

export default new UserController;
