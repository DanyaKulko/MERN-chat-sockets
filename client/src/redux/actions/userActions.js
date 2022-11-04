import $api from "../../http";
import {LOGOUT, SET_LOADING, SET_USER, SET_VALIDATION_ERRORS, UPLOAD_AVATAR} from "../types/userTypes";
import {closeMessage, setErrorMessage, setSuccessMessage} from "./notificationActions";

export const login = (username, password) => async (dispatch) => {
    await dispatch(setLoading(true));

    try {
        await $api.post('/user/login', {username, password}).then(res => {
            localStorage.setItem("token", res.data.token);
            dispatch({type: SET_USER, payload: res.data.user});
        }).catch((err) => {
            if (err.response.data.validationErrors) {
                dispatch(setValidationErrors(Object.assign(...err.response.data.validationErrors)));
                dispatch(closeMessage())
            } else {
                dispatch(setValidationErrors(null));
                dispatch(setErrorMessage(err.response.data.error));
            }

        })
    } catch (error) {
        console.log(error);
        alert("Something went wrong");
    }
    await dispatch(setLoading(false));
}

export const signup = (username, email, password) => async (dispatch) => {
    await dispatch(setLoading(true));
    try {
        await $api.post('/user/signup', {username, email, password}).then(res => {
            localStorage.setItem("token", res.data.token);
            dispatch({type: SET_USER, payload: res.data.user});
        }).catch(err => {
            if (err.response.data.validationErrors) {
                dispatch(setValidationErrors(Object.assign(...err.response.data.validationErrors)));
                dispatch(closeMessage())
            } else {
                dispatch(setValidationErrors(null));
                dispatch(setErrorMessage(err.response.data.error));
            }
        })
    } catch (error) {
        console.log(error);
        alert("Something went wrong");
    }
    await dispatch(setLoading(false));
}

export const uploadAvatar = (file) => async (dispatch) => {
    await dispatch(setLoading(true));
    try {
        await $api.post('/user/uploadAvatar', file).then(res => {
            dispatch(setSuccessMessage("Avatar updated successfully"));
            dispatch({type: UPLOAD_AVATAR, payload: res.data.fileName});
        }).catch(err => {
            dispatch(setErrorMessage(err.response.data.error));
        })
    } catch (error) {
        console.log(error);
        alert("Something went wrong");
    }
    await dispatch(setLoading(false));
}

export const updateProfileInfo = (data) => async (dispatch) => {
    await dispatch(setLoading(true));
    try {
        await $api.post('/user/updateProfileInfo', data).then(res => {
            dispatch({type: SET_USER, payload: res.data.user});
            console.log(res.data.user)
            dispatch(setSuccessMessage("Profile updated successfully"));
        }).catch(err => {
            dispatch(setErrorMessage(err.response.data.error));
        })
    } catch (error) {
        console.log(error);
        alert("Something went wrong");
    }
    await dispatch(setLoading(false));
}


export const updatePassword = (data) => async (dispatch) => {
    await dispatch(setLoading(true));
    try {
        await $api.post('/user/updatePassword', data).then(res => {
            dispatch(setSuccessMessage("Password updated successfully"));
        }).catch(err => {
            dispatch(setErrorMessage(err.response.data.error));
        })
    } catch (error) {
        console.log(error);
        alert("Something went wrong");
    }
    await dispatch(setLoading(false));

}

export const logout = () => ({type: LOGOUT})

export const checkAuth = () => async (dispatch) => {
    await dispatch(setLoading(true));
    try {
        await $api.post('/user/checkAuth').then(res => {
            dispatch({type: SET_USER, payload: res.data.user});
        }).catch(err => {
            dispatch(setErrorMessage(err.response.data.message));
        })
    } catch (error) {
        localStorage.removeItem("token");
        alert(error);
    }
    await dispatch(setLoading(false));
}

const setLoading = (isLoading) => ({
    type: SET_LOADING,
    payload: isLoading
})

const setValidationErrors = (errors) => ({
    type: SET_VALIDATION_ERRORS,
    payload: errors
})