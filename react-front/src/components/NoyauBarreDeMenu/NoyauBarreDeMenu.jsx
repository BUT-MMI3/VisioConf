import { useState } from 'react';
import FeatherIcon from 'feather-icons-react';
import { Link } from 'react-router-dom';
import "./NoyauBarreDeMenu.css"
import '../ProfilOverlay/ProfilOverlay.css';
import Modale from '../Modale/Modale';
import { useModal } from '../../components/Modale/ModaleContext';

const BarreDeMenu = () => {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { newModal } = useModal();
  const logoImage = "https://jeremiahhaulin.fr/img/Logo%20MMI%20Toulon.png";
  const utilisateur = {
    id: 123,
    nom: "Doe",
    prenom: "John",
    email: "john.doe@example.com",
    motDePasse: "azerty",
    job: "Etudiant MMI3",
    isConnected: true,
    isAdmin: true,
    logo: "https://imgv3.fotor.com/images/gallery/a-girl-cartoon-character-with-pink-background-generated-by-cartoon-character-maker-in-Fotor.jpg",
  };

  const checkRole = () => {
    return utilisateur.isAdmin ? 'Administrateur' : 'Utilisateur';
  };

  const handleOverlayToggle = () => {
    setOverlayVisible(!overlayVisible);
  };

  return (
    <div className="barre-de-menu">
      <img src={logoImage} alt="Logo de l'entreprise" className="logo" />
      <div className="onglets">
        <Link to="/messages">
          <FeatherIcon icon="message-circle" size="40" strokeWidth="1" className="onglet" />
        </Link>
        <Link to="/utilisateurs">
          <FeatherIcon icon="users" size="40" strokeWidth="1" className="onglet" />
        </Link>
        <Link to="/dossiers">
          <FeatherIcon icon="folder" size="40" strokeWidth="1" className="onglet" />
        </Link>
        <Link to="/livres">
          <FeatherIcon icon="book" size="40" strokeWidth="1" className="onglet" />
        </Link>
        {checkRole() == "Administrateur" && (
          <Link to="/admin">
            <FeatherIcon icon="shield" size="40" strokeWidth="1" className="onglet" />
          </Link>
        )}
      </div>
      <div className="profil-section" onClick={handleOverlayToggle}>
        <div className={`statut-indicateur ${utilisateur.isConnected ? 'connecte' : 'deconnecte'}`} />
        <img src={utilisateur.logo} alt="Logo de l'utilisateur" className="logo-utilisateur" />
        {overlayVisible && (
          <div className={`profil-overlay`}>
            <div className="card">
              <div className="info-container">
                <img src={utilisateur.logo} alt="Logo de l'utilisateur" className="overlay-logo" />
                <div className="text-container">
                  <p style={{ color: '#223A6A', fontWeight: 600 }}>{`${utilisateur.nom} ${utilisateur.prenom}`}</p>
                  <small>{`${utilisateur.job}`}</small>
                </div>
              </div>
              <div className="onglets-overlay">
                <Link to="/changer-status">
                  <div className={`statut-connexion ${utilisateur.isConnected ? 'connecte' : 'deconnecte'}`} />
                  {utilisateur.isConnected ? 'en ligne' : 'déconnecté'}
                </Link>
                <Link to="/parametres">
                  <FeatherIcon icon="settings" size="20" strokeWidth="1" className="settings" />
                  Paramètres
                </Link>
                <button style={{ background: 'none', color:'red', cursor: 'pointer' }} onClick={() => newModal({
                        type: 'error',
                        boutonClose: true,
                        titre: 'Vous êtes sur le point de supprimer un élément.',
                        texte: 'Vous êtes sur le point de vous déconnecter',
                        texteBoutonAction: "Supprimer l'utilisateur",
                        onValidate: () => {
                            console.log('Utilisateur supprimé');
                        },
                    })}>
                  <FeatherIcon icon="log-out" size="20" strokeWidth="1" className="log-out" />
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BarreDeMenu;
