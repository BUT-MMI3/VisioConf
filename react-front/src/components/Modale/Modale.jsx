import React from 'react';
import './Modale.css';

const Modale = ({ type, titre, texte, texteBoutonAction, lienBoutonAction, onClose }) => {
    const getModalTypeStyles = () => {
        switch (type) {
            case 'error': return 'modale-error';
            case 'infos': return 'modale-infos';
            case 'warning': return 'modale-warning';
            default: return '';
        }
    };

    return (
        <div className="modale-background">
            <div className={`modale-container ${getModalTypeStyles()}`}>
                <div className="modale-header">
                    {/* Icône basée sur le type */}
                    <h2>{titre}</h2>
                </div>
                <div className="modale-body">
                    <p>{texte}</p>
                </div>
                <div className="modale-footer">
                    <a href={lienBoutonAction} className="modale-action-button">{texteBoutonAction}</a>
                    <button onClick={onClose} className="modale-close-button">Annuler</button>
                </div>
            </div>
        </div>
    );
};

export default Modale;
