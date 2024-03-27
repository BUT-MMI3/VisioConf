/* 
Author: @mathis-lambert
Date: Janvier 2024
*/

import {createContext, useCallback, useContext, useRef} from "react";
import {Toasts} from "./Toasts";

// eslint-disable-next-line no-unused-vars
const defaultPush = (toast) => {
}; // Méthode de base que l'on mettra dans le contexte par défaut

const ToastContext = createContext({
    pushToastRef: {current: defaultPush},
});

// On entourera notre application de ce provider pour rendre le toasts fonctionnel
export function ToastContextProvider({children}) {
    const pushToastRef = useRef(defaultPush);
    return (
        <ToastContext.Provider value={{pushToastRef}}>
            <Toasts context={ToastContext}/>
            {children}
        </ToastContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToasts() {
    const {pushToastRef} = useContext(ToastContext);
    return {
        pushToast: useCallback(
            (toast) => {
                pushToastRef.current(toast);
            },
            [pushToastRef]
        ),
    };
}
