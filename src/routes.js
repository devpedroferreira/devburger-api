import { Router } from "express";
const router = Router();

import {v4} from 'uuid';
import User from './app/models/User.js';


router.get('/', async (req, res) => {
    try {
        const user = await User.create({
            id: v4(),
            name: 'Pedro',
            email: 'pedro@email.com',
            password_hash: '123123',
        });
        return res.status(201).json(user);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Email already exists' });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
});

//exportando as rotas
export default router;