import { Router } from "express";
import UserController from "./app/controllers/UserController.js";
import SessionController from "./app/controllers/SessionController.js";
import ProductController from "./app/controllers/ProductController.js";
import CategoryController from "./app/controllers/CategoryController.js";
import OrderController from "./app/controllers/OrderController.js";

// Multer
import multer from "multer";
import multerConfig from './config/multer.js';
const upload = multer(multerConfig);// conf multer

// validate token to login
import authCheck from "./middlewares/authCheck.js";

const router = Router();
// rota post create user
router.post('/users', UserController.store);
// session login user
router.post('/session', SessionController.store);

router.use(authCheck); // rotas abaixo seram autenticadas
// Product
router.post('/products', upload.single('file'), ProductController.store);
// listar os produtos
router.get('/products', authCheck , ProductController.index);

// Category
router.post('/categories', CategoryController.store);
//listar categorias
router.get('/categories', CategoryController.index);

//rota order
router.post('/orders', OrderController.store);

export default router;