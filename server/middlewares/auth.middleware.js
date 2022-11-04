const UserService = require('../services/user-service');

module.exports = async (req, res, next) => {

    if(req.method === 'OPTIONS') {
        return next();
    }

    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            status: false,
            error: 'No token provided'
        });
    }

    try {
        req.user = await UserService.verifyToken(token);
        next();
    } catch (error) {
        return res.status(401).json({
            status: false,
            error: error.message
        });
    }
}