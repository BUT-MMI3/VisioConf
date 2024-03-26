/* 
Author: @mathis-lambert
Date: Janvier 2024
*/

import {AnimatePresence, motion} from "framer-motion";
import {useContext, useState} from "react";
import Toast from "./Toast";
import "./toasts.scss";

export function Toasts({context}) {
    const [toasts, setToasts] = useState([]);
    // On modifie la méthode du contexte
    const {pushToastRef} = useContext(context);
    pushToastRef.current = ({duration, ...props}) => {
        // On génère un id pour différencier les messages
        const id = Date.now();
        // On sauvegarde le timer pour pouvoir l'annuler si le message est fermé
        if (duration) {
            const timer = setTimeout(() => {
                setToasts((v) => v.filter((t) => t.id !== id));
            }, duration * 1000);
            const toast = {...props, id, timer};
            setToasts((v) => [...v, toast]);
        } else {
            const toast = {...props, id};
            setToasts((v) => [...v, toast]);
        }
    };

    const onRemove = (toast) => {
        if (toast.timer) clearTimeout(toast.timer);
        setToasts((v) => v.filter((t) => t !== toast));
    };

    return (
        <div className="toast-container">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        onClick={() => onRemove(toast)}
                        key={toast.id}
                        initial={{opacity: 0, x: -50}}
                        animate={{opacity: 1, x: 0}}
                        exit={{opacity: 0, x: 50}}
                    >
                        <Toast {...toast} />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
