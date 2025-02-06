import { Router } from "express";
import UserController from "./app/controllers/UserController.js";

const router = Router();
// rota post
router.post('/users', UserController.store);

//exportando as rotas
export default router;