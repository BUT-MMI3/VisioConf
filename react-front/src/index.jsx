/**
 * Author: @mathis-lambert
 * Date : Janvier 2024
 */
// import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.scss";
import App from "./App.jsx";
import {BrowserRouter} from "react-router-dom";
import {ModaleProvider} from "./elements/Modale/ModaleContext.jsx";
import {Provider} from "react-redux";
import {store} from "./app/store.js";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById("root")).render(
    // <React.StrictMode>
    <Provider store={store}>
        <BrowserRouter>
            <ModaleProvider>
                <App/>
                <ToastContainer stacked position={'bottom-right'} theme={'colored'}/>
            </ModaleProvider>
        </BrowserRouter>
    </Provider>
    // </React.StrictMode>
);
