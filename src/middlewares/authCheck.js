import jwt from 'jsonwebtoken';
import authConfig from '../config/authKey.js'

const authCheck = async (req, res, next) => {
    
    //validando se o token esta vindo no header
    const authToken = req.headers.authorization;
    if(!authToken) { 
        return res.status(401).json({ error : 'Token not found'});
    };

    // pegando o token no header -> authorization
    // criando um array com 2 posições, separando o token do "Bearer"
    const [, token] = authToken.split(' ')[1];// Use [1] para pegar o token após "Bearer"
    if (!token) {
        return res.status(401).json({ error: 'Token format invalid' });
    };

    try{
        //verificando se o token é valido
        const decoded = jwt.verify(token, authConfig.secret);
        
        req.userId = decoded.id; //passando o id do usuario para o req
        req.userName = decoded.name; //passando o nome do usuario para o req

        return next();
    }catch(error){
        return res.status(401).json({ error: 'Token invalid', details: error });
    };
};

export default authCheck;