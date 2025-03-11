import { Router } from "express";
import UserController from "./app/controllers/UserController.js";
import SessionController from "./app/controllers/SessionController.js";
import ProductController from "./app/controllers/ProductController.js";
import CategoryController from "./app/controllers/CategoryController.js";
import OrderController from "./app/controllers/OrderController.js";

// Multer
import multer from "multer";
import multerConfig from './config/multer.js';
const upload = multer(multerConfig);

// validate token to login
import authCheck from "./middlewares/authCheck.js";

const router = Router();

// Public routes
router.post('/users', UserController.store);
router.post('/session', SessionController.store);

// Authentication middleware
router.use(authCheck); // All routes below require authentication

// Products routes
router.post('/products', upload.single('file'), ProductController.store);
router.put('/products/:id', upload.single('file'), ProductController.update);// update
router.get('/products', ProductController.index); // list all
router.patch('/products/:id/offer', ProductController.updateOffer); // update offer
router.get('/products/:category_id', ProductController.show); // list to category

// Categories routes
router.get('/categories', CategoryController.index);
router.get('/categories/:id', CategoryController.show);
router.post('/categories', upload.single('file'), CategoryController.store);
router.put('/categories/:id', upload.single('file'), CategoryController.update);
router.delete('/categories/:id', CategoryController.delete);

// Orders routes
router.post('/orders', OrderController.store);
router.get('/orders', OrderController.index);
router.put('/orders/:id', OrderController.updateStatus);

export default router;