import {io} from "socket.io-client";
import {
    NEW_MESSAGE,
    SEND_MESSAGE,
    SET_TYPING,
    USER_WENT_OFFLINE,
    USER_WENT_ONLINE,
    SET_USER_TYPING, DELETE_MESSAGE, EDIT_MESSAGE, RECEIVE_EDIT_MESSAGE
} from "../types/chatTypes";
import {LOGOUT, SET_USER} from "../types/userTypes";

export const socketMiddleware = (store) => {
    let isConnected = false;
    let socket;

    return (next) => (action) => {

        if (!isConnected && action.type === SET_USER) {
            isConnected = true;
            const token = localStorage.getItem('token');

            socket = io.connect('ws://localhost:5000', {
                query: {
                    token: token
                }
            });

            socket.on('new message', (message) => {
                console.log('NEW MESSAGE', message)
                store.dispatch({
                    type: NEW_MESSAGE,
                    payload: message
                })
            });

            socket.on('went online', (message) => {
                store.dispatch({
                    type: USER_WENT_ONLINE,
                    payload: message
                })
            });

            socket.on('went offline', (message) => {
                store.dispatch({
                    type: USER_WENT_OFFLINE,
                    payload: message
                })
            });

            socket.on('set typing', (message) => {
                store.dispatch({
                    type: SET_USER_TYPING,
                    payload: message
                })
            });

            socket.on('edit message', (message) => {
                console.log('EDIT MESSAGE', message)
                store.dispatch({
                    type: RECEIVE_EDIT_MESSAGE,
                    payload: message
                })
            });

            socket.on('delete message', (message) => {
                store.dispatch({
                    type: DELETE_MESSAGE,
                    payload: message
                })
            })
        }

        if (action.type === LOGOUT) {
            socket.disconnect();
            isConnected = false;
        }

        if (action.type === SEND_MESSAGE) {
            socket.emit('send message', action.payload);
        }

        if (action.type === SET_TYPING && store.getState().chat.current_chat) {
            socket.emit('set typing', {chatId: store.getState().chat.current_chat._id, isTyping: action.payload.isTyping});
            return;
        }

        if(action.type === DELETE_MESSAGE){
            socket.emit('delete message', action.payload);
        }

        if(action.type === EDIT_MESSAGE){
            console.log('EDIT MESSAGE', action.payload)
            socket.emit('edit message', action.payload);
        }

        return next(action);
    }
}