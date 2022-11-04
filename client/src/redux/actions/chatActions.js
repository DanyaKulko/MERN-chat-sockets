import $api from "../../http";
import {
    GET_ALL_CHATS_DATA,
    GET_CHAT_DATA,
    SEND_MESSAGE,
    SET_TYPING,
    DELETE_MESSAGE,
    EDIT_MESSAGE
} from "../types/chatTypes";

export const getAllChats = () => async (dispatch) => {
    const response = await $api.get('/chat/getChats');
    dispatch({
        type: GET_ALL_CHATS_DATA,
        payload: response.data.chats
    });
}

export const getChatData = (id) => async (dispatch) => {
    const response = await $api.get(`/chat/getChat?id=${id}`);
    console.log(response.data)
    dispatch({
        type: GET_CHAT_DATA,
        payload: {
            current_chat: response.data.chat,
            chat_messages: response.data.messages
        }
    });
}


export const sendMessage = (chatId, message, sender) => ({
    type: SEND_MESSAGE,
    payload: {
        message,
        chatId,
        sender
    }
})

export const messageEdit = (chatId, messageId, newMessage) => ({
    type: EDIT_MESSAGE,
    payload: {
        messageId,
        chatId,
        message: newMessage
    }
})


export const setIsTyping = (isTyping) => ({
    type: SET_TYPING,
    payload: {
        isTyping
    }
})

export const delete_message = (chat_id, message_id) => ({
    type: DELETE_MESSAGE,
    payload: {
        chat_id,
        message_id
    }
})
