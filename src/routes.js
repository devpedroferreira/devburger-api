import { Router } from "express";

const router = Router();

// Get teste
router.get('/', (req, res) => {
    res.send('Bem-vindo à DevBurger API!');

});

//exportando as rotas
export default router;