/*
# metodos que vamos usa:

store => cadastrar/add
index => Listar varios
show => mostrar um
update => atualizar
delete => delete
*/
import {v4} from 'uuid';
import User from '../../app/models/User.js';
import * as Yup from 'yup';
import bcrypt from 'bcryptjs';

class UserController {
    async store(req, res) { // recuperando o date
        // try catach to handle error
        try {
            // vilid data with yup lib            
            const schema = Yup.object().shape({
                name: Yup.string().matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, 'O nome deve conter somente letras.').required('Digite o nome valido, somente letras.'),
                email: Yup.string().email('Digite um email valido, exemplo@email.com ').required('Email é obrigatório'),
                password_hash: Yup.string().min(6, 'A senha deve ter no minímo 6 character.').required('Senha é obrigatório.'),
                admin: Yup.boolean()
            });

            // validar todos os campos e retornar todos os erros encontrados.
            await schema.validate(req.body, {abortEarly: false});

            // criando usuario
            const {name, email, password_hash, admin} = req.body;
            
            // criptografando a senha do usuario
            const hashedPassword = await bcrypt.hash(password_hash, 3);

            const user = await User.create({
                id: v4(),
                name,
                email,
                password_hash: hashedPassword,
                admin
            });
            // retorno do usuario criado
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
            };
            // erro email
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ error: 'Email already exists' });
            };
            return res.status(500).json({ error: 'Internal server error' });
        };  
    };
};

export default new UserController;
