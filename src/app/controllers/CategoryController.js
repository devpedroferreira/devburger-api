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

            const { name, description } = req.body;

            // Verificar se a categoria já existe
            const categoryExists = await Category.findOne({ where: { name } });
            if (categoryExists) {
                return res.status(400).json({ error: 'Nome da Categoria já existe' });
            };

            // Criação da categoria no banco de dados
            const category = await Category.create({
                name,
                description
            });

            const { id } = category;
            return res.status(201).json({ id, name, description });

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
    };

    // get all categories in database
    async index(req, res) {
        const categories = await Category.findAll();
        return res.json({ categories: categories.map(({ id, name, description }) => ({ id, name, description })) });
    };
};

export default new CategoryController(); // Exporte uma instância do controller