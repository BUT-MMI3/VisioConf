import React from 'react';
import feather from 'feather-icons';
import './Modale.css';

const Modale = ({ type, titre, texte, texteBoutonAction, lienBoutonAction, onClose }) => {
    const getIcon = () => {
        switch (type) {
            case 'error': return feather.icons['alert-octagon'].toSvg();
            case 'info': return feather.icons['alert-circle'].toSvg();
            case 'warning': return feather.icons['alert-triangle'].toSvg();
            default: return '';
        }
    };

    return (
        <div className="modale-background">
            <div className={`modale-container ${type}`}>
                <div className="modale-icon">
                    <span dangerouslySetInnerHTML={{ __html: getIcon() }}></span>
                </div>
                <div className="modale-header">
                    <h3>{titre}</h3>
                </div>
                <div className="modale-body">
                    <p>{texte}</p>
                </div>
                <div className="modale-footer">
                    <button onClick={onClose} className="modale-close-button">Annuler</button>
                    {lienBoutonAction && <a href={lienBoutonAction} className="modale-action-button">{texteBoutonAction}</a>}
                </div>
            </div>
        </div>
    );
};

export default Modale;
