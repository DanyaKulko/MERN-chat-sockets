import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {Provider} from 'react-redux';
import {store} from './redux/store';
import {checkAuth} from "./redux/actions/userActions";
import {BrowserRouter} from "react-router-dom";

const token = localStorage.getItem("token");
if (token) {
    store.dispatch(checkAuth(token))
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>
);
