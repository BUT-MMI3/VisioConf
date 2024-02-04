/**
 * Author: @mathis-lambert
 * Date : Janvier 2024
 */
import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.scss";
import App from "./App.jsx";
import {BrowserRouter} from "react-router-dom";
import {ToastContextProvider} from "./components/Toasts/ToastContext.jsx";
import {ModaleProvider} from "./components/Modale/ModaleContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <ModaleProvider>
                <ToastContextProvider>
                    <App/>
                </ToastContextProvider>
            </ModaleProvider>
        </BrowserRouter>
    </React.StrictMode>
);
