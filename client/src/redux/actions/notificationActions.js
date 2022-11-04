import {CLOSE_NOTIFICATION, SHOW_ERROR_NOTIFICATION, SHOW_SUCCESS_NOTIFICATION} from "../types/notificationTypes";

export const setErrorMessage = (message) => ({
    type: SHOW_ERROR_NOTIFICATION,
    payload: {message, type: 'error'},
})

export const setSuccessMessage = (message) => ({
    type: SHOW_SUCCESS_NOTIFICATION,
    payload: {message, type: 'success'}
})

export const closeMessage = () => ({
    type: CLOSE_NOTIFICATION
})