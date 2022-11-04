import {LOGOUT, SET_LOADING, SET_USER, SET_VALIDATION_ERRORS, UPLOAD_AVATAR} from "../types/userTypes";

const initialState = {
    user: {},
    isLoggedIn: false,
    isLoading: false,
    errors: null,
}

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                user: action.payload,
                isLoggedIn: true,
                errors: null
            }

        case UPLOAD_AVATAR:
            return {
                ...state,
                user: {
                    ...state.user,
                    avatar: action.payload,
                    isAvatarSet: true
                }
            }

        case LOGOUT:
            localStorage.removeItem('token');
            return {
                ...state,
                user: {},
                isLoggedIn: false
            }

        case SET_LOADING:
            return {
                ...state,
                isLoading: action.payload
            }

        case SET_VALIDATION_ERRORS:
            return {
                ...state,
                errors: action.payload
            }

        default:
            return state;
    }
}