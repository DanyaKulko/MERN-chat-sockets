const User = require('../model/userModel');
const TokenService = require('../services/token-service');
const UserDto = require('../dtos/user-dto');
const UserService = require('../services/user-service');
const {validationResult} = require("express-validator");
const ApiError = require("../exceptions/ApiError");

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorsArr = errors.array().map(error => ({[error.param]: error.msg}));
        res.status(400).json({validationErrors: errorsArr});
        return;
    }

    const {username, email, password} = req.body;

    try {
        const {user, accessToken, refreshToken} = await UserService.signup(email, username, password);

        res.cookie('refreshToken', refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: true});

        return res.status(200).json({
            status: true,
            user: user,
            token: accessToken
        });
    } catch (error) {
        return res.status(400).json({status: false, error: error.message});
    }
}

const login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorsArr = errors.array().map(error => ({[error.param]: error.msg}));
        res.status(400).json({validationErrors: errorsArr});
        return;
    }

    const {username, password} = req.body;

    try {
        const {user, accessToken, refreshToken} = await UserService.login(username, password);

        res.cookie('refreshToken', refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: true});

        return res.status(200).json({
            status: true,
            token: accessToken,
            user: user
        });
    } catch (error) {
        return res.status(400).json({status: false, error: error.message});
    }
}

const updateUserPhoto = async (req, res, next) => {

    try {
        if (req.fileExtensionUploadError) {
            throw ApiError.BadRequest(req.fileExtensionUploadError);
        }

        const user = await UserService.updateUserPhoto(req.user.id, req.file);

        return res.status(200).json({
            status: true,
            fileName: user.avatarName
        });
    } catch (error) {
        return res.status(400).json({status: false, error: error.message});
    }
}

const refreshToken = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(400).json({
            status: false,
            message: 'No refresh token'
        });
    }

    const validated = TokenService.validateRefreshToken(refreshToken);
    const foundToken = await TokenService.findToken(refreshToken);

    if (!validated || !foundToken) {
        return res.status(401).json({
            status: false,
            message: 'Invalid refresh token'
        });
    }

    const user = await User.findById(foundToken.userId);
    if (!user) {
        return res.status(400).json({
            status: false,
            message: 'Invalid refresh token'
        });
    }

    const userDto = new UserDto(user);

    const {accessToken} = TokenService.generateTokens({...userDto});
    await TokenService.saveToken(refreshToken, user._id);

    return res.status(200).json({
        status: true,
        token: accessToken,
        user: userDto
    });
}

const checkAuth = async (req, res, next) => {
    return res.status(200).json({
        status: true,
        user: req.user
    });
}

const usersSearchAutocomplete = async (req, res, next) => {
    const {username} = req.query;

    const users = await User.find({
        username: {$regex: username, $options: 'i'},
        _id: {$ne: req.user.id}
    }, 'username email avatar isAvatarSet isOnline lastOnline', {limit: 5});
    return res.status(200).json({
        status: true,
        users
    });
}

const updateProfileInfo = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorsArr = errors.array().map(error => ({[error.param]: error.msg}));
        res.status(400).json({validationErrors: errorsArr});
        return;
    }

    const {username, email} = req.body;

    try {
        const user = await UserService.updateProfileInfo(req.user.id, username, email);

        return res.status(200).json({
            status: true,
            user
        });
    } catch (error) {
        return res.status(400).json({status: false, error: error.message});
    }

}

const updateProfilePassword = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorsArr = errors.array().map(error => ({[error.param]: error.msg}));
        res.status(400).json({validationErrors: errorsArr});
        return;
    }

    const {oldPassword, password} = req.body;

    try {
        await UserService.updatePassword(req.user.id, oldPassword, password);
        return res.status(200).json({
            status: true
        });
    } catch (error) {
        return res.status(400).json({status: false, error: error.message});
    }
}

module.exports = {signup, login, refreshToken, checkAuth, usersSearchAutocomplete, updateUserPhoto, updateProfileInfo,updateProfilePassword}