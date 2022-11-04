import {CLOSE_NOTIFICATION, SHOW_ERROR_NOTIFICATION, SHOW_SUCCESS_NOTIFICATION} from "../types/notificationTypes";

const initialState = {
    message: '',
    type: '',
    isOpen: false
}

export const notificationReducer = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_ERROR_NOTIFICATION:
            return {
                ...state,
                message: action.payload.message,
                type: action.payload.type,
                isOpen: true
            }
        case SHOW_SUCCESS_NOTIFICATION:
            return {
                ...state,
                message: action.payload.message,
                type: action.payload.type,
                isOpen: true
            }
        case CLOSE_NOTIFICATION:
            return {
                ...state,
                isOpen: false
            }
        default:
            return state;
    }
}