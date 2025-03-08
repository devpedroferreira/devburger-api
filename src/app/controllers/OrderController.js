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
            // Define validation schema for order creation
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

            // Validate request body against schema
            await schema.validate(req.body, { abortEarly: false });

            // Extract product information from request
            const { products } = req.body;
            const productsId = products.map((product) => product.id);

            // Get authenticated user information
            const userId = req.userId;
            const userName = req.userName;

            // Fetch products with their categories from database
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

            // Validate if products were found
            if (!findProducts.length) {
                return res.status(404).json({ error: 'No products found' });
            }

            // Format products for order creation
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

            // Create new order in database
            const order = await Order.create({
                user: { id: userId, name: userName },
                products: formattedProducts,
                status: 'Pedido Realizado',
                timestamp: new Date()
            });

            // Return created order
            return res.status(201).json(order);
        } catch (error) {
            console.error('Error creating order:', error);

            // Handle validation errors
            if (error instanceof Yup.ValidationError) {
                return res.status(400).json({
                    error: 'Validation failed',
                    messages: error.errors,
                });
            }

            // Handle general errors
            return res.status(500).json({
                error: 'Internal server error',
                message: error.message,
            });
        }
    }

    async index(req, res) {
        try {
            // Fetch all orders sorted by creation date
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

    async updateStatus(req, res) {
        try {
            // Define validation schema for status update
            const schema = Yup.object().shape({
                status: Yup.string()
                    .required()
                    .oneOf(['Pedido Realizado', 'Em Preparação', 'Finalizado']),
            });

            const { id } = req.params;
            const { status } = req.body;

            // validate if user is admin
            if (!req.isAdmin) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            // Validate status value
            try {
                await schema.validate({ status });
            } catch (err) {
                return res.status(400).json({ error: err.message });
            }

            // Find and update order status
            const order = await Order.findByIdAndUpdate(
                id,
                { status },
                { new: true } // Returns the updated document
            );

            // Check if order exists
            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }

            // Return updated order
            return res.json(order);
        } catch (error) {
            console.error('Error updating order status:', error);
            return res.status(500).json({
                error: 'Internal server error',
                message: error.message,
            });
        }
    }
}

export default new OrderController();