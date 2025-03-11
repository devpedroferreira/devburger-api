import jwt from 'jsonwebtoken';
import authConfig from '../config/authKey.js';
import User from '../app/models/User.js';

const authCheck = async (req, res, next) => {
    try {
        // Validate if token exists in header
        const authToken = req.headers.authorization;
        console.log('Received authorization header:', authToken);

        if (!authToken) {
            return res.status(401).json({ error: 'Token not found' });
        }

        // Split token from "Bearer" prefix
        const [bearer, token] = authToken.split(' ');

        if (!token || bearer !== 'Bearer') {
            return res.status(401).json({ error: 'Token format invalid' });
        }

        console.log('Processing token:', token);

        // Verify token and decode payload
        const decoded = jwt.verify(token, authConfig.secret);
        console.log('Decoded token:', decoded);

        // Find user in database to get admin status
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Set request properties
        req.userId = decoded.id;
        req.userName = decoded.name;
        req.isAdmin = user.admin;

        console.log('User details:', {
            id: req.userId,
            name: req.userName,
            isAdmin: req.isAdmin
        });

        return next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ 
            error: 'Token invalid', 
            details: error.message 
        });
    }
};

export default authCheck;