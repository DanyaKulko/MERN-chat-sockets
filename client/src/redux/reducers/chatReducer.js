import {
    GET_ALL_CHATS_DATA,
    GET_CHAT_DATA,
    NEW_MESSAGE, SEND_MESSAGE,
    SET_USER_TYPING,
    USER_WENT_OFFLINE,
    USER_WENT_ONLINE,
    DELETE_MESSAGE, EDIT_MESSAGE, RECEIVE_EDIT_MESSAGE
} from "../types/chatTypes";
import message from "../../components/ChatComponents/Message/Message";

const initialState = {
    isLoading: false,
    chats: [],
    current_chat: null,
    chat_messages: []
};

export const chatReducer = (state = initialState, action) => {
    switch (action.type) {

        case GET_ALL_CHATS_DATA:
            const chats = action.payload.sort((a, b) => {
                return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
            });
            return {
                ...state,
                chats
            };

        case GET_CHAT_DATA:
            return {
                ...state,
                current_chat: action.payload.current_chat,
                chat_messages: action.payload.chat_messages,
            };

        case SEND_MESSAGE:
            return {
                ...state,
                chat_messages: [...state.chat_messages, {
                    message: action.payload.message,
                    user: {_id: action.payload.sender},
                    _id: 'temporary_id',
                    temporary: true
                }]
            };

        case NEW_MESSAGE:
            const newState = {...state};

            const allChatsIds = newState.chats.map(chat => chat._id);
            const ifChatExist = allChatsIds.includes(action.payload.chat._id);
            const temporaryMessageIndex = newState.chat_messages.findLastIndex(message => message.temporary && message.message === action.payload.newMessage.message);

            // if chat doesn't exist in state then add it
            if (!ifChatExist) {
                newState.current_chat = action.payload.chat;
                newState.chats.push(action.payload.chat);
            }


             // if this is the current chat add the message to the chat_messages array
            if (!ifChatExist || action.payload.chat._id === newState.current_chat?._id) {
                //if temporary message is found then replace it with the new message
                if(temporaryMessageIndex !== -1) {
                    newState.chat_messages[temporaryMessageIndex] = action.payload.newMessage;
                } else {
                    newState.chat_messages.push(action.payload.newMessage)
                }
            }
            // add message to lastMessage prop of chat
            const chatIndex = newState.chats.findIndex(chat => chat._id === action.payload.chat._id);

            if (chatIndex !== -1) {
                newState.chats[chatIndex].lastMessage = action.payload.newMessage;
            }

            // sort chats by lastMessage create time
            newState.chats = newState.chats.sort((a, b) => {
                return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
            });

            newState.current_chat.users[0].isTyping = false;

            return newState;

        case EDIT_MESSAGE:
            const editState = {...state};
            const messageIndex1 = editState.chat_messages.findIndex(message => message._id === action.payload.messageId);
            if(messageIndex1 !== -1) {
                editState.chat_messages[messageIndex1].message = action.payload.message;
                editState.chat_messages[messageIndex1].updatedAt = new Date().toJSON();
            }
            return editState;

        case RECEIVE_EDIT_MESSAGE:
            const editedState = {...state};
            const messageIndex2 = editedState.chat_messages.findIndex(message => message._id === action.payload.message._id);
            if (messageIndex2 !== -1) {
                editedState.chat_messages[messageIndex2] = action.payload.message;
            }
            return editedState;

        case USER_WENT_ONLINE:
            const stateCopyOnline = {...state};
            const chatOnlineIndex = stateCopyOnline.chats.findIndex(chat => chat.isPrivate && chat.users[0]._id === action.payload);

            if (chatOnlineIndex !== -1) {
                stateCopyOnline.chats[chatOnlineIndex].users[0].isOnline = true;

                // if user went offline from the current chat then set current chat to null
                if (stateCopyOnline.current_chat?._id === stateCopyOnline.chats[chatOnlineIndex]._id) {
                    stateCopyOnline.current_chat.users[0].isOnline = true;
                }
            }
            return stateCopyOnline;


        case USER_WENT_OFFLINE:
            const stateCopyOffline = {...state};
            const chatOfflineIndex = stateCopyOffline.chats.findIndex(chat => chat.isPrivate && chat.users[0]._id === action.payload);

            if (chatOfflineIndex !== -1) {
                stateCopyOffline.chats[chatOfflineIndex].users[0].isOnline = false;

                // if user went offline from the current chat then set current chat to null
                if (stateCopyOffline.current_chat?._id === stateCopyOffline.chats[chatOfflineIndex]._id) {
                    stateCopyOffline.current_chat.users[0].isOnline = false;
                }
            }
            return stateCopyOffline;


        case SET_USER_TYPING:
            const stateCopyTyping = {...state};
            const chatTypingIndex = stateCopyTyping.chats.findIndex(chat => chat.isPrivate && chat.users[0]._id === action.payload.userId);

            if (chatTypingIndex !== -1) {
                stateCopyTyping.chats[chatTypingIndex].users[0].isTyping = action.payload.isTyping;

                // if user is typing in current chat then set isTyping to true
                if (state.current_chat?._id === stateCopyTyping.chats[chatTypingIndex]._id) {
                    stateCopyTyping.current_chat.users[0].isTyping = action.payload.isTyping;
                }
            }

            return stateCopyTyping;

        case DELETE_MESSAGE:
        //    delete message from chat_messages array and from lastMessage prop of chat

            return {...state,
                chat_messages: state.chat_messages.filter(message => message._id !== action.payload.message_id)
            };




        default:
            return state;
    }
}