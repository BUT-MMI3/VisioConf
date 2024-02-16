/**
 * Author: @mathis-lambert
 * Date : Janvier 2024
 */
import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.scss";
import App from "./App.jsx";
import './index.css'
import {BrowserRouter} from "react-router-dom";
import {ToastContextProvider} from "./elements/Toasts/ToastContext.jsx";
import {ModaleProvider} from "./elements/Modale/ModaleContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    // <React.StrictMode>
        <BrowserRouter>
            <ModaleProvider>
                <ToastContextProvider>
                    <App/>
                </ToastContextProvider>
            </ModaleProvider>
        </BrowserRouter>
    // </React.StrictMode>
);
