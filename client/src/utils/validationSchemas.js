export const signupRules = {
    username: {
        required: true,
        minLength: 6,
        maxLength: 20
    },
    email: {
        required: true,
        isEmail: true
    },
    password: {
        required: true,
        minLength: 6,
        maxLength: 50
    },
    confirmPassword: {
        required: true,
        isPasswordMatch: true
    }
}

export const loginRules = {
    username: {
        minLength: 6,
        required: true,
    },
    password: {
        required: true,
        minLength: 6,
        maxLength: 50
    }
}

export const updateProfileInfoRules = {
    username: {
        minLength: 6,
        required: true,
    },
    email: {
        required: true,
        isEmail: true
    }
}

export const updatePasswordRules = {
    oldPassword: {
        required: true,
        minLength: 6,
        maxLength: 50
    },
    password: {
        required: true,
        minLength: 6,
        maxLength: 50
    },
    confirmPassword: {
        required: true,
        isPasswordMatch: true
    }
}