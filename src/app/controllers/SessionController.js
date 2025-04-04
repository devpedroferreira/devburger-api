// validando dados do usuario para login/sessao na aplicacao
import * as Yup from "yup";
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authConfig from '../../config/authKey.js'


class SessionController {
    async store(req, res){
        const schema = Yup.object().shape({
            email: Yup.string().email('exemplo@email.com').required('Email é obrigatório'),
            password: Yup.string().min(4,'Minímo 4 character.').required('Senha é obrigatório'),
        });

        // validated if email and pass are in the correct format.
        try {
            await schema.validate(req.body, {abortEarly: false});
        } catch (err) {
            return res.status(401).send('Email or password incorrect!');
        }
        
        // date user
        const { email, password } = req.body;

        try{
        // Busca usuario pelo email
        const user = await User.findOne({where: {email} });

        if (!user){
            return res.status(401).json({error: 'Email or password incorrect!'});
        };

        // verificando se a senha coincide com o hash
        if(!(await bcrypt.compare(password, user.password_hash))){
            return res.status(401).json({error: 'Email or password incorrect!'});
        };

        //Se tudo estiver correto, retorna os dados do usuaro
        return res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            admin: user.admin,
            token: jwt.sign({id : user.id, name: user.name }, authConfig.secret, {
                expiresIn: authConfig.expiresIn
            })
        });

        } catch (error) {
            return res.status(500).json({ error: 'Erro interno no servidor' });
        };
    };
};

export default new SessionController();