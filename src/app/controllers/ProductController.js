import * as Yup from 'yup';
import Product from '../models/Product.js'; // Importe o modelo Product
import Category from '../models/Category.js'; // Importe o modelo Category
class ProductController {
  async store(req, res) {
    try {
      // Schema de validação
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome é obrigatório'),
        price: Yup.number() 
          .positive('O preço deve ser um valor positivo')
          .required('Preço é obrigatório'),
          category_id: Yup.number().required('Categoria é obrigatória'), 
      });

      // Validação dos dados
       await schema.validate(req.body, { abortEarly: false });

      // Adicione um console.log para verificar os dados da requisição
      //console.log('Requisição recebida:', req.body);
      //console.log('Arquivo recebido:', req.file); 
      
      // Desestruturação dos dados da requisição
      let {name, price, category_id} = req.body;

      // Converta category_id para número
      category_id = Number(category_id);

      // Verifica se a categoria existe
      const category = await Category.findByPk(category_id);
      if (!category) {
        return res.status(400).json({ error: 'Categoria não encontrada' });
      };

      // get the filename of the image, changing to filePath variable
      const { filename: path } = req.file;
      // Create product in database
      const product = await Product.create({
        name,
        price,
        category_id,
        path,
      });

        return res.status(201).json(product);

      } catch (error) {
        // Tratamento de erros
        if (error instanceof Yup.ValidationError) {
          return res.status(400).json({ errors: error.errors });
        };
  
        // Erros do Sequelize (ex: unique constraint)
        if (error.name === 'SequelizeUniqueConstraintError') {
          return res.status(400).json({ error: 'Nome do Produto já existe' });
        };
  
        console.error('Erro no servidor:', error); // Log para debug
        return res.status(500).json({ error: 'Erro interno do servidor' });
      };
  };

  // get all products in database
  async index(req,res) {
    const products = await Product.findAll({
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }]
    });
    return res.json(products);
  };
};

export default new ProductController();