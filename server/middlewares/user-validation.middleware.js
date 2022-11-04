const {body} = require('express-validator')

const validateSignup = () => {
    return [
        body('username')
            .exists()
            .withMessage('Name is required')
            .isLength({min: 6})
            .withMessage('Name must be at least 6 characters long'),
        body('email')
            .exists()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Email is invalid'),
        body('password')
            .exists()
            .withMessage('Password is required')
            .isLength({min: 6})
            .withMessage('Password must be at least 6 characters long')
    ]
}

const validateLogin = () => {
    return [
        body('username')
            .exists()
            .withMessage('This field is required')
            .isLength({min: 6})
            .withMessage('Username must be at least 6 characters long')
            .isLength({max: 20})
            .withMessage('Username must be less than 20 characters long'),
        body('password')
            .exists()
            .withMessage('Password is required')
            .isLength({min: 6})
            .withMessage('Password must be at least 6 characters long'),
    ]

}

const updateProfile = () => {
    return [
        body('username')
            .exists()
            .withMessage('Username is required')
            .isLength({min: 6})
            .withMessage('Username must be at least 6 characters long'),
        body('email')
            .exists()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Email is invalid')
    ]
}

const updatePassword = () => {
    return [
        body('oldPassword')
            .exists()
            .withMessage('Old password is required')
            .isLength({min: 6})
            .withMessage('Old password must be at least 6 characters long'),
        body('password')
            .exists()
            .withMessage('New password is required')
            .isLength({min: 6})
            .withMessage('New password must be at least 6 characters long')
    ]
}

module.exports = {validateLogin, validateSignup, updateProfile, updatePassword}