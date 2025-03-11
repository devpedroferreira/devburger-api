import { v4 } from 'uuid';
import User from '../models/User.js';  // Fixed import path
import * as Yup from 'yup';
import bcrypt from 'bcryptjs';

class UserController {
    async store(req, res) {
        try {
            const schema = Yup.object().shape({
                name: Yup.string()
                    .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, 'O nome deve conter somente letras.')
                    .required('Digite o nome valido, somente letras.'),
                email: Yup.string()
                    .email('Digite um email valido, exemplo@email.com ')
                    .required('Email é obrigatório'),
                password_hash: Yup.string()
                    .min(6, 'A senha deve ter no minímo 6 character.')
                    .required('Senha é obrigatório.'),
                admin: Yup.boolean()
            });

            await schema.validate(req.body, { abortEarly: false });

            const { name, email, password_hash, admin } = req.body;
            
            const hashedPassword = await bcrypt.hash(password_hash, 8); // Increased rounds for better security

            const user = await User.create({
                id: v4(),
                name,
                email,
                password_hash: hashedPassword,
                admin
            });

            return res.status(201).json({
                id: user.id,
                name,
                email,
                admin
            });
        } catch (error) {
            console.error('Error creating user:', error);

            if (error instanceof Yup.ValidationError) {
                return res.status(400).json({ error: error.errors });
            }

            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ error: 'Email already exists' });
            }

            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

// Fixed export - add parentheses
export default new UserController();