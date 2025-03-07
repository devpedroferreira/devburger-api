import * as Yup from 'yup';
import Order from '../schemas/Order.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

class OrderController {
    async store(req, res) {
        const schema = Yup.object().shape({
            products: Yup.array().required()
            .of(
                Yup.object().shape({
                id: Yup.number().required(),
                quantity: Yup.number().required().positive().integer(),
                }),
                ),
            }).required();
       
            // validate schema
            try {
                schema.validateSync(req.body), { abortEarly: false };
            } catch (error) {
                return res.status(400).json({ error: 'Validation fails', messages: error.inner });
            }
            
            // get user id and name
            const { products } = req.body;
            const productsId = products.map((product) => product.id);
            const { id, name } = req.user;
           
            // find products
            const findProducts = await Product.findAll({ 
             where: { id: productsId },
             include: { 
                model: Category, 
                as: 'category', 
                attributes: ['name'] },
            });
            
            // products from db
            const formattedProducts = findProducts.map((product) => { 
                const productIndex = products.findIndex((item) => item.id === product.id); // find product
                
                const newProduct ={
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    category: product.category.name,
                    url: product.url,
                    quantity: products[productIndex].quantity, // quantity from request                   
                }
                return newProduct;
            });

            // create order
            const order = await Order.create({
                user: {
                    id,
                    name,
                },
                products: productsId,
                status: 'PENDING',
                timestamp: new Date(),
            });
            // return order
            return res.status(201).json(order);

        }
    
    }

export default new OrderController();