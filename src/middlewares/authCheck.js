import jwt from 'jsonwebtoken';
import authConfig from '../config/authKey.js'

const authCheck = (req, res, next) => {
    
    //validando se o token esta vindo no header
    const authToken = req.headers.authorization;
    if(!authToken) { 
        return res.status(401).json({ error : 'Token not found'});
    };

    // pegando o token no header -> authorization
    const token = authToken.split(' ')[1];// Use [1] para pegar o token após "Bearer"


    //validando integridade do token
        jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        console.log(decoded)
        req.user = decoded;// Adiciona o usuário decodificado à requisição
        return next(); // continue flux to controller
     });
};
export default authCheck;