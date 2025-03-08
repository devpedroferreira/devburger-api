import * as Yup from 'yup';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

class ProductController {
  async store(req, res) {
    try {
      // Validate admin access first
      if (!req.isAdmin) {
        return res.status(401).json({ error: 'Unauthorized - Admin access required' });
      }

      // Validation schema
      const schema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        price: Yup.number()
          .positive('Price must be a positive value')
          .required('Price is required'),
        category_id: Yup.number().required('Category is required'),
      });

      // Validate request data
      await schema.validate(req.body, { abortEarly: false });

      // Check if image file was uploaded
      if (!req.file) {
        return res.status(400).json({ error: 'Product image is required' });
      }

      // Extract request data
      const { name, price, category_id } = req.body;

      // Check if category exists
      const category = await Category.findByPk(Number(category_id));
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      // Get uploaded file path
      const { filename: path } = req.file;

      // Create product
      const product = await Product.create({
        name,
        price: Number(price),
        category_id: Number(category_id),
        path,
      });

      // Return created product with category information
      const productWithCategory = await Product.findByPk(product.id, {
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name'],
          },
        ],
      });

      return res.status(201).json(productWithCategory);
    } catch (error) {
      console.error('Error creating product:', error);

      if (error instanceof Yup.ValidationError) {
        return res.status(400).json({
          error: 'Validation failed',
          messages: error.errors,
        });
      }

      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ error: 'Product name already exists' });
      }

      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async index(req, res) {
    try {
      const products = await Product.findAll({
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name'],
          },
        ],
        order: [['created_at', 'DESC']],
      });

      return res.json(products);
    } catch (error) {
      console.error('Error listing products:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new ProductController();