import * as Yup from 'yup';
import Order from '../schemas/Order.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

class OrderController {
    async store(req, res) {
        try {
            // Validation schema
            const schema = Yup.object().shape({
                products: Yup.array()
                    .of(
                        Yup.object().shape({
                            id: Yup.number().required(),
                            quantity: Yup.number().required().positive().integer(),
                        })
                    )
                    
            });

            // Validate request body
            await schema.validate(req.body, { abortEarly: false });

            // Get products from request body
            const { products } = req.body;
            const productsId = products.map((product) => product.id);

            // Get user from request (set by auth middleware)
            const userId = req.userId;
            const userName = req.userName;

            // Find products in database
            const findProducts = await Product.findAll({
                where: { id: productsId },
                include:[ 
                    {
                    model: Category,
                    as: 'category',
                    attributes: ['name'],
                    },
                ],    
            });

            // Format products for order
            const formattedProducts = findProducts.map((product) => {
                const productIndex = products.findIndex((item) => item.id === product.id);

                const newProduct = {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    category: product.category.name,
                    url: product.url,
                    quantity: products[productIndex].quantity,//quantity from request
                };
                console.log('Formatted product:', newProduct); // Add this debug log
                return newProduct;
            });
            console.log('All formatted products:', formattedProducts); // Add this debug log
            
            // Create order
            const order = await Order.create({
                user: {
                    id: userId,
                    name: userName,
                },
                products: formattedProducts,
                //status: 'PENDING',
                //timestamp: new Date(),
            });
            console.log('Created order:', order); // Add this debug log
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
}

export default new OrderController();