const User = require("../model/userModel");
const ApiError = require("../exceptions/ApiError");
const bcrypt = require("bcrypt");
const UserDto = require("../dtos/user-dto");
const TokenService = require("./token-service");
const saltRounds = 10;

class UserService {
    async signup(email, username, password) {
        const usernameCheck = await User.findOne({username}).lean();
        if (usernameCheck) {
            throw ApiError.BadRequest('Username already exists');
        }

        const emailCheck = await User.findOne({email}).lean();
        if (emailCheck) {
            throw ApiError.BadRequest('Email already exists');
        }


        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await User.create({username, email, password: hashedPassword});

        const userDto = {...new UserDto(user)};

        const {accessToken, refreshToken} = TokenService.generateTokens(userDto);
        await TokenService.saveToken(refreshToken, userDto.id);

        return {accessToken, refreshToken, user: userDto};
    }

    async login(username, password) {
        const user = await User.findOne({$or: [{username: username}, {email: username}]}).lean();
        if (!user) {
            throw ApiError.BadRequest('Login or password is incorrect');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw ApiError.BadRequest('Login or password is incorrect');
        }

        const userDto = {...new UserDto(user)};

        const {accessToken, refreshToken} = TokenService.generateTokens(userDto);
        await TokenService.saveToken(refreshToken, userDto.id);

        return {accessToken, refreshToken, user: userDto};
    }

    async verifyToken(token) {
        const verified = TokenService.validateAccessToken(token);

        if (!verified) {
            throw ApiError.UnauthorizedError('Invalid token');
        }

        const user = await User.findById(verified.id).lean();
        if (!user) {
            throw ApiError.BadRequest('User not found');
        }
        return {...new UserDto(user)};
    }

    async updateUserPhoto(userId, photo) {
        const user = await User.findById(userId);
        if (!user) {
            throw ApiError.BadRequest('User not found');
        }


        user.avatar = photo.filename;
        user.isAvatarSet = true;
        await user.save();

        return {avatarName: photo.filename};
    }

    async updateProfileInfo(userId, username, email) {
        const user = await User.findById(userId);
        if (!user) {
            throw ApiError.BadRequest('User not found');
        }

        const usernameCheck = await User.findOne({username, _id: {$ne: user._id}}).lean();
        if (usernameCheck) {
            throw ApiError.BadRequest('Username already exists');
        }
        user.username = username;

        const emailCheck = await User.findOne({email, _id: {$ne: user._id}}).lean();
        if (emailCheck) {
            throw ApiError.BadRequest('Email already exists');
        }
        user.email = email;

        await user.save();
        console.log(user)
        return {...new UserDto(user)};
    }

    async updatePassword(userId, oldPassword, newPassword) {
        const user = await User.findById(userId);
        if (!user) {
            throw ApiError.BadRequest('User not found');
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

        if(!isPasswordValid) {
            throw ApiError.BadRequest('Old password is incorrect');
        }

        user.password = await bcrypt.hash(newPassword, saltRounds);
        await user.save();
        return {...new UserDto(user)};
    }




    async setOnline(userId) {
        const user = await User.findById(userId);
        if (!user) {
            throw ApiError.BadRequest('User not found');
        }

        user.isOnline = true;
        user.save();
    }

    async setOffline(userId) {
        const user = await User.findById(userId);
        if (!user) {
            throw ApiError.BadRequest('User not found');
        }

        user.isOnline = false;
        user.lastOnline = new Date();
        user.save();
    }
}

module.exports = new UserService();