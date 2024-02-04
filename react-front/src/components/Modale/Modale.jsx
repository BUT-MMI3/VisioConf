/*
Author: @arthur-mdn
Date: Janvier 2024
*/

import FeatherIcon from "feather-icons-react";
import "./Modale.css";
import {useModal} from './ModaleContext.jsx';
import {AnimatePresence, motion} from "framer-motion";

const Modale = () => {

    const {modalProps, closeModal} = useModal();

    const getIcon = () => {
        switch (modalProps.type) {
            case "error":
                return <FeatherIcon icon="alert-octagon"/>;
            case "info":
                return <FeatherIcon icon="alert-circle"/>;
            case "warning":
                return <FeatherIcon icon="alert-triangle"/>;
            default:
                return "";
        }
    };

    const handleConfirm = () => {
        if (modalProps.onValidate) {
            modalProps.onValidate();
        }
        closeModal();
    };

    const modalVariants = {
        hidden: {
            scale: 0,
            opacity: 0,
        },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {duration: 0.3}
        },
        exit: {
            scale: 0.5,
            opacity: 0,
            transition: {duration: 0.2}
        }
    };

    return (
        <AnimatePresence>
            {modalProps.isOpen && (
                <motion.div
                    className="modale-background"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <motion.div
                        className={`modale-container ${modalProps.type}`}
                        variants={modalVariants}
                    >

                        <div className="modale-icon">
                          <span>
                            {getIcon()}
                          </span>
                        </div>
                        <div className="modale-header">
                            <h3>{modalProps.titre}</h3>
                        </div>
                        <div className="modale-body">
                            <p>{modalProps.texte}</p>
                        </div>
                        <div className="modale-footer">
                            <button onClick={closeModal} className="modale-close-button">
                                Annuler
                            </button>
                            {modalProps.onValidate && (
                                <button onClick={handleConfirm} className="modale-action-button">
                                    {modalProps.texteBoutonAction}
                                </button>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Modale;
