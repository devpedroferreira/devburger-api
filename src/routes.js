import { Router } from "express";
import UserController from "./app/controllers/UserController.js";
import SessionController from "./app/controllers/SessionController.js";
import ProductController from "./app/controllers/ProductController.js";
import multer from "multer";
import multerConfig from './config/multer.js';

// conf multer
const upload = multer(multerConfig);

const router = Router();
// rota post
router.post('/users', UserController.store);
// session
router.post('/session', SessionController.store);
// Product
router.post('products', upload.single('file'), ProductController.store);
//
router.get('products', ProductController.index);

//exportando as rotas
export default router;