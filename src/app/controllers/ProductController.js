import * as Yup from 'yup';
import Product from '../models/Product.js'; // Importe o modelo Product

class ProductController {
  async store(req, res) {
    try {
      // Schema de validação
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome é obrigatório'),
        price: Yup.number() // Altere para DECIMAL se sua migration usar DECIMAL
          .positive('O preço deve ser um valor positivo')
          .required('Preço é obrigatório'),
        category: Yup.string().required('Categoria é obrigatória'),
        //path: Yup.string().required('Caminho da imagem é obrigatório') // Adicione se necessário
      });

       // Validação dos dados
       await schema.validate(req.body, { abortEarly: false });

      } catch (error) {

        // Tratamento de erros
        if (error instanceof Yup.ValidationError) {
          return res.status(400).json({ errors: error.errors });
        };
  
        // Erros do Sequelize (ex: unique constraint)
        if (error.name === 'SequelizeUniqueConstraintError') {
          return res.status(400).json({ error: 'Nome do Produto já existe' }); // Ajuste conforme necessidade
        };
  
        console.error('Erro no servidor:', error); // Log para debug
        return res.status(500).json({ error: 'Erro interno do servidor' });
      };



      // pegando o filename da imagem, mudando para variavel filePath
       const { filename: path } = req.file;
      // Criação do produto no banco de dados
      const { name, price, category } = req.body;
      
      const product = await Product.create({
        name,
        price, 
        category,
        path
      });

      return res.status(201).json(product);

  };

  // get all products in database
  async index(req,res) {
    const products = await Product.findAll();
    return res.json(products);
  };
};

export default new ProductController();