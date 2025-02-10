import * as Yup from 'yup';

class ProductController {
    async store (req, res){
        try{

        const schema = Yup.object({
            name: Yup.string().matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, 'O nome deve conter somente letras.').required('Digite o nome valido, somente letras.'),
            price: Yup.number().required(),
            category: Yup.string().required() 
        });

        // validar todos os campos e retornar todos os erros encontrados.
        await schema.validate(req.body, {abortEarly: false});
        
        } catch (error){
            
                // retorna os erros : await schema.validate(res.body, {abortEarly: false});
                if (error.name === 'ValidationError') {
                    return res.status(400).json({error: error.errors});
                }
                // erro email
                if (error.name === 'SequelizeUniqueConstraintError') {
                    return res.status(400).json({ error: 'Email already exists' });
                }
                return res.status(500).json({ error: 'Internal server error' });

        };

        return res.status(201).json({message:'ok'});
    };
};

export default new ProductController();