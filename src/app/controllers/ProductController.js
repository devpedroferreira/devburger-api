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
        offer: Yup.boolean().default(false)
      });

      // Validate request data
      await schema.validate(req.body, { abortEarly: false });

      // Check if image file was uploaded
      if (!req.file) {
        return res.status(400).json({ error: 'Product image is required' });
      }

      // Extract request data
      const { name, price, category_id, offer } = req.body;

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
        offer: offer||false
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
      // Check if product name already exists
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ error: 'Product name already exists' });
      }

      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  // List all products
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
  };

  // List products by category
  async show(req, res) {
    try {
      const { category_id } = req.params;
      const products = await Product.findAll({
        where: { category_id },
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name'],
          },
        ],
        order: [['created_at', 'DESC']],
      });
      return res.json(products); // return products
    }
    catch (error) {
      console.error('Error listing products by category:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  // update de produto

  //update offer
  async updateOffer(req, res) {
    try {
      // Validate admin access
      if (!req.isAdmin) {
        return res.status(401).json({ error: 'Unauthorized - Admin access required' });
      }

      const schema = Yup.object().shape({
        offer: Yup.boolean().required('Offer status is required')
      });

      await schema.validate(req.body, { abortEarly: false });

      const { id } = req.params;
      const { offer } = req.body;

      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      await product.update({ offer });

      return res.json(product);
    } catch (error) {
      console.error('Error updating product offer:', error);

      if (error instanceof Yup.ValidationError) {
        return res.status(400).json({
          error: 'Validation failed',
          messages: error.errors,
        });
      }

      return res.status(500).json({ error: 'Internal server error' });
    }
  };

}// end
export default new ProductController();