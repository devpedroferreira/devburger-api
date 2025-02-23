const authCheck = (req, res, next) => {
    console.log(req.headers);

    return next();
};

export default authCheck;