import * as Yup from 'yup';
import Order from '../schemas/Order.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

/**
 * Controller responsible for handling order operations
 */
class OrderController {
    /**
     * Create a new order
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     */
    async store(req, res) {
        try {
            const schema = Yup.object().shape({
                products: Yup.array()
                    .of(
                        Yup.object().shape({
                            id: Yup.number().required(),
                            quantity: Yup.number().required().positive().integer(),
                        })
                    )
                    .required(),
            });

            // Validate request body
            await schema.validate(req.body, { abortEarly: false });

            // Extract data from request body
            const { products } = req.body;
            const productsId = products.map((product) => product.id);
            const userId = req.userId;
            const userName = req.userName;

            // Find all products in the database
            const findProducts = await Product.findAll({
                where: { id: productsId },
                include: [
                    {
                        model: Category,
                        as: 'category',
                        attributes: ['name'],
                    },
                ],
            });

            // Check if all products were found
            if (!findProducts.length) {
                return res.status(404).json({ error: 'No products found' });
            }

            // Check if all products are available
            const formattedProducts = findProducts.map((product) => {
                const productIndex = products.findIndex((item) => item.id === product.id);
                return {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    category: product.category.name,
                    url: product.url,
                    quantity: products[productIndex].quantity,
                };
            });

            // Create order
            const order = await Order.create({
                user: { id: userId, name: userName },
                products: formattedProducts,
                status: 'Pedido Realizado',
                timestamp: new Date()
            });

            return res.status(201).json(order);
        } catch (error) {
            console.error('Error creating order:', error);

            if (error instanceof Yup.ValidationError) {
                return res.status(400).json({
                    error: 'Validation failed',
                    messages: error.errors,
                });
            }

            return res.status(500).json({
                error: 'Internal server error',
                message: error.message,
            });
        }
    }

    // List orders
    async index(req, res) {
        try {
            // List orders for regular users
            if (!req.isAdmin) {
                const orders = await Order.find({ 
                    'user.id': req.userId 
                }).sort({ createdAt: 'desc' });
                return res.json(orders);
            }

            // List all orders for admin users
            const orders = await Order.find().sort({ createdAt: 'desc' });
            return res.json(orders);
        } catch (error) {
            console.error('Error listing orders:', error);
            return res.status(500).json({
                error: 'Internal server error',
                message: error.message,
            });
        }
    }

    // Update order status
    async updateStatus(req, res) {
        try {
            // Check if user is an admin
            if (!req.isAdmin) {
                return res.status(401).json({ 
                    error: 'Unauthorized - Admin access required' 
                });
            }
            // Validate request body
            const schema = Yup.object().shape({
                status: Yup.string()
                    .required('Status is required')
                    .oneOf(
                        ['Pedido Realizado', 'Em Preparação', 'Finalizado','Saiu para Entrega','Cancelado'])
            });

            const { id } = req.params;
            const { status } = req.body;

            // Validate request body
            await schema.validate({ status }, { abortEarly: false });

            // Update order status
            const order = await Order.findByIdAndUpdate(
                id,
                { status },
                { new: true }
            );

            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }

            return res.json(order);
        } catch (error) {
            console.error('Error updating order status:', error);
            // Check if error is a Yup validation error
            if (error instanceof Yup.ValidationError) {
                return res.status(400).json({
                    error: 'Validation failed',
                    messages: error.errors,
                });
            }

            return res.status(500).json({
                error: 'Internal server error',
                message: error.message,
            });
        }
    }
}

export default new OrderController();