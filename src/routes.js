import { Router } from "express";
import UserController from "./app/controllers/UserController.js";
import SessionController from "./app/controllers/SessionController.js";
import ProductController from "./app/controllers/ProductController.js";

const router = Router();
// rota post
router.post('/users', UserController.store);
// session
router.post('/session', SessionController.store);
// Product
router.post('products', ProductController.store);

//exportando as rotas
export default router;