import {userReducer} from "./reducers/userReducer";
import thunk from "redux-thunk";
import {notificationReducer} from "./reducers/notificationReducer";
import {chatReducer} from "./reducers/chatReducer";
import {configureStore} from '@reduxjs/toolkit'
import {socketMiddleware} from "./middlewares/socketMiddleware";



export const store = configureStore({
    reducer: {
        user: userReducer,
        notification: notificationReducer,
        chat: chatReducer
    },
    middleware: [].concat(thunk, socketMiddleware)
});


