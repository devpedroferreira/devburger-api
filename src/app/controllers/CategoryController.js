import * as Yup from 'yup';
import Category from '../models/Category.js'; // Importe o modelo Category

class CategoryController {
    async store(req, res) {
        try {
        // Schema de validação
        const schema = Yup.object().shape({
            name: Yup.string().required('Nome é obrigatório'),
            description: Yup.string().required('Descrição é obrigatória'),
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
            return res.status(400).json({ error: 'Nome da Categoria já existe' }); // Ajuste conforme necessidade
        };
    
        console.error('Erro no servidor:', error); // Log para debug
        return res.status(500).json({ error: 'Erro interno do servidor' });
        };
    
        // Criação da categoria no banco de dados
        const { name, description } = req.body;
    
        const category = await Category.create({
        name,
        description
        });
    
        return res.status(201).json(category);
    
    };
    
    // get all categories in database
    async index(req, res) {
        const categories = await Category.findAll();
        return res.json(categories);
    };        
};

export default new CategoryController(); // Exporte uma instância do controller 