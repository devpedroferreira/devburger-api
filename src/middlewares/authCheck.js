const authCheck = (req, res, next) => {
    
    //validando se o token esta vindo
    const authToken = req.headers.authorization;
    if(!authToken) { 
        return res.status(401).json({ error : 'Error token not found'});
    }

    // pegando o token no authorization
    const token = authToken.split(' ').at(1);


    //validando integridade
    try{
        jwt.verify(token, authConfig.secret, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Invalid token' });
            }
            req.user = decoded;
            return next();
        });
    }

    return next();// continue flux to controller
};
export default authCheck;