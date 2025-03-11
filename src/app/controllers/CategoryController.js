import * as Yup from 'yup';
import Category from '../models/Category.js';

/**
 * Controller responsible for handling category operations
 */
class CategoryController {
    /**
     * Create a new category
     * Admin only endpoint
     */
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

            // Check if category exists
            const categoryExists = await Category.findOne({
                where: { name: name.toLowerCase() }
            });

            if (categoryExists) {
                return res.status(400).json({ error: 'Category already exists' });
            }

            // Get uploaded file path if exists
            const path = req.file ? req.file.filename : null;

            // Create category
            const category = await Category.create({
                name: name.toLowerCase(),
                description,
                path
            });

            return res.status(201).json({
                id: category.id,
                name: category.name,
                description: category.description,
                url: category.url
            });

        } catch (error) {
            console.error('Error creating category:', error);

            if (error instanceof Yup.ValidationError) {
                return res.status(400).json({
                    error: 'Validation failed',
                    messages: error.errors,
                });
            }

            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * List all categories
     */
    async index(req, res) {
        try {
            const categories = await Category.findAll({
                attributes: ['id', 'name', 'description', 'path', 'url'],
                order: [['name', 'ASC']]
            });

            return res.json(categories);
        } catch (error) {
            console.error('Error listing categories:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * Get a single category by ID
     */
    async show(req, res) {
        try {
            const { id } = req.params;

            const category = await Category.findByPk(id, {
                attributes: ['id', 'name', 'description', 'path', 'url']
            });

            if (!category) {
                return res.status(404).json({ error: 'Category not found' });
            }

            return res.json(category);
        } catch (error) {
            console.error('Error fetching category:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * Update category details
     * Admin only endpoint
     */
    async update(req, res) {
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

            const { id } = req.params;
            const { name, description } = req.body;

            // Find category by ID
            const category = await Category.findByPk(id);
            if (!category) {
                return res.status(404).json({ error: 'Category not found' });
            }

            // Get uploaded file path if exists
            const path = req.file ? req.file.filename : category.path;

            // Update category with new values
            await category.update({
                name: name.toLowerCase(),
                description,
                path
            });

            return res.json({
                id: category.id,
                name: category.name,
                description: category.description,
                url: category.url
            });

        } catch (error) {
            console.error('Error updating category:', error);

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

    /**
     * Delete a category
     * Admin only endpoint
     */
    async delete(req, res) {
        try {
            // Validate admin access first
            if (!req.isAdmin) {
                return res.status(401).json({ error: 'Unauthorized - Admin access required' });
            }

            const { id } = req.params;

            const category = await Category.findByPk(id);

            if (!category) {
                return res.status(404).json({ error: 'Category not found' });
            }

            await category.destroy();

            return res.status(204).send();
        } catch (error) {
            console.error('Error deleting category:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

export default new CategoryController();