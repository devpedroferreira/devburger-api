// validando dados do usuario para login/sessao na aplicacao
import * as Yup from "yup";

class SessionController {
    async store(req, res){
        const schema = Yup.object({
            email: Yup.string().email('Digite um email valido, exemplo@email.com ').required('Email é obrigatório'),
            password: Yup.string().min(6,"A senha deve conter no minímo 6 character.").required(),
        });

        const { email, password } = req.body;


    };
};

export default new SessionController();