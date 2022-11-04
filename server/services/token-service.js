const jwt = require('jsonwebtoken');
const Token = require('../model/tokenModel');

class TokenService {

    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
        return {
            accessToken, refreshToken
        }
    }

    validateAccessToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return false;
        }
    }

    validateRefreshToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        } catch (error) {
            return false;
        }
    }

    async saveToken(refreshToken, userId) {
        const tokenObj = new Token({
            userId,
            token: refreshToken,
            expiresAt: Date.now() + 3600000
        });
        return await tokenObj.save();
    }

    async removeToken(refreshToken) {
        return await Token.deleteOne({token: refreshToken});
    }

    async findToken(refreshToken) {
        return await Token.findOne({token: refreshToken});
    }
}


module.exports = new TokenService();