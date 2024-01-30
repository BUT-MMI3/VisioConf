// ProfilOverlay.jsx

import { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import FeatherIcon from 'feather-icons-react';
import Modale from '../Modale/Modale';
import './ProfilOverlay.css';

const ProfilOverlay = ({ utilisateur }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const handleDeconnexionClick = () => {
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const handleValiderDeconnexion = () => {
        console.log('Détruire la session');
        handleCloseModal();
    };

    return (
        <>
            <div className={`profil-overlay ${modalVisible ? 'visible' : ''}`}>
                <div className="card">
                    <div className="info-container">
                        <img src={utilisateur.logo} alt="Logo de l'utilisateur" className="overlay-logo" />
                        <div className="text-container">
                            <p style={{ color: '#223A6A', fontWeight:600,}}>{`${utilisateur.nom} ${utilisateur.prenom}`}</p>
                            <small>{`${utilisateur.job}`}</small>
                        </div>
                    </div>
                    <div className="onglets-overlay">
                        <Link to="/changer-status"><div className={`statut-connexion ${utilisateur.connecte ? 'connecte' : 'deconnecte'}`} />En lignes</Link>
                        <Link to="/parametres">
                            <FeatherIcon icon="settings" size="20" stroke-width="1" className="settings" />
                            Paramètres
                        </Link>
                        {/* Utilisez la fonction handleDeconnexionClick pour ouvrir la modale au clic */}
                        <a style={{ color: 'red', cursor: 'pointer' }} onClick={handleDeconnexionClick}>
                            <FeatherIcon icon="log-out" size="20" stroke-width="1" className="log-out" />
                            Déconnexion
                        </a>
                        {/* Rendre la modale visible ou non en fonction de l'état local modalVisible */}

                    </div>
                </div>
            </div>
            {modalVisible && (
                <Modale
                    type="error"
                    titre="Vous êtes sur le point de vous déconnecter"
                    texte="Souhaitez-vous vraiment vous déconnecter"
                    texteBoutonAction="déconnexion"
                    onClose={handleCloseModal}
                    onValidate={handleValiderDeconnexion}
                />
            )}
        </>
    );
};

ProfilOverlay.propTypes = {
    utilisateur: PropTypes.shape({
        logo: PropTypes.string.isRequired,
        nom: PropTypes.string.isRequired,
        prenom: PropTypes.string.isRequired,
    }).isRequired,
};

export default ProfilOverlay;
