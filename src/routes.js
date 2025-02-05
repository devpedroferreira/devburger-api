import { Router } from "express";
const router = Router();

import {v4} from 'uuid';
import User from './app/models/User.js';


// Get teste
router.get('/', async (req, res) => {
    const user = await User.create({
        id:v4 (),
        name:'Pedro',
        email:'pedro@email.com',
        password_hash: '123123',
    });

    return res.status(201).json;
});

//exportando as rotas
export default router;