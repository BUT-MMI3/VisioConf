// BarreDeMenu.jsx

import { useState } from "react";
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";
import ProfilOverlay from "../ProfilOverlay/ProfilOverlay"; // Importez le composant ProfilOverlay
import PropTypes from "prop-types";
import "./NoyauBarreDeMenu.css";

const BarreDeMenu = ({ logoImage, utilisateur }) => {
  const [overlayVisible, setOverlayVisible] = useState(false);

  const handleOverlayToggle = () => {
    setOverlayVisible(!overlayVisible);
  };

  return (
    <div className="barre-de-menu">
      <img src={logoImage} alt="Logo de l'entreprise" className="logo" />
      <div className="onglets">
        <Link to="/discussions">
          <FeatherIcon
            icon="message-circle"
            size="40"
            stroke-width="1"
            className="onglet"
          />
        </Link>
        <Link to="/utilisateurs">
          <FeatherIcon
            icon="users"
            size="40"
            stroke-width="1"
            className="onglet"
          />
        </Link>
        <Link to="/dossiers">
          <FeatherIcon
            icon="folder"
            size="40"
            stroke-width="1"
            className="onglet"
          />
        </Link>
        <Link to="/livres">
          <FeatherIcon
            icon="book"
            size="40"
            stroke-width="1"
            className="onglet"
          />
        </Link>
        {/* Condition pour afficher l'ic�ne seulement si l'utilisateur est un administrateur */}
        {utilisateur.isAdmin && (
          <Link to="/admin">
            <FeatherIcon
              icon="shield"
              size="40"
              stroke-width="1"
              className="onglet"
            />
          </Link>
        )}
      </div>
      <div className="profil-section" onClick={handleOverlayToggle}>
        <div
          className={`statut-indicateur ${
            utilisateur.connecte ? "connecte" : "deconnecte"
          }`}
        />
        <img
          src={utilisateur.logo}
          alt="Logo de l'utilisateur"
          className="logo-utilisateur"
        />
      </div>
      {overlayVisible && <ProfilOverlay utilisateur={utilisateur} />}
    </div>
  );
};

BarreDeMenu.propTypes = {
  logoImage: PropTypes.string.isRequired,
  utilisateur: PropTypes.shape({
    logo: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired,
    prenom: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    connecte: PropTypes.bool.isRequired,
  }).isRequired,
};

export default BarreDeMenu;
