import * as Yup from 'yup';
import Category from '../models/Category.js';

class CategoryController {
    async store(req, res) {
        try {
            // Validate admin access first
            if (!req.isAdmin) {
                return res.status(401).json({ error: 'Unauthorized - Admin access required' });
            }

            // Validation schema
            const schema = Yup.object().shape({
                name: Yup.string()
                    .required('Name is required')
                    .min(3, 'Name must be at least 3 characters'),
                description: Yup.string()
                    .required('Description is required')
                    .min(5, 'Description must be at least 5 characters'),
            });

            // Validate request data
            await schema.validate(req.body, { abortEarly: false });

            const { name, description } = req.body;

            // Check if category already exists
            const categoryExists = await Category.findOne({ 
                where: { name: name.toLowerCase() } 
            });

            if (categoryExists) {
                return res.status(400).json({ error: 'Category already exists' });
            }

            // Create category
            const category = await Category.create({
                name: name.toLowerCase(),
                description
            });

            return res.status(201).json({
                id: category.id,
                name: category.name,
                description: category.description
            });

        } catch (error) {
            console.error('Error creating category:', error);
            // Check if error is from validation
            if (error instanceof Yup.ValidationError) {
                return res.status(400).json({
                    error: 'Validation failed',
                    messages: error.errors,
                });
            }

            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ error: 'Category name already exists' });
            }

            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    // List all categories
    async index(req, res) {
        try {
            const categories = await Category.findAll({
                attributes: ['id', 'name', 'description'],
                order: [['name', 'ASC']]
            });
            // Return categories
            return res.json({ categories });
        } catch (error) {
            console.error('Error listing categories:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

export default new CategoryController();