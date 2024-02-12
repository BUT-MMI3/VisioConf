import { useState, useRef, useEffect } from "react";
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";
import "./NoyauBarreDeMenu.css";
import "../ProfilOverlay/ProfilOverlay.css";
import NoyauDeconnexion from "../../components/NoyauDeconnexion/NoyauDeconnexion";

const NoyauBarreDeMenu = () => {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const logoImage =
    "https://jeremiahhaulin.fr/img/Logo%20MMI%20Toulon.png";
  const utilisateur = {
    id: 123,
    nom: "Doe",
    prenom: "John",
    email: "john.doe@example.com",
    motDePasse: "azerty",
    job: "Etudiant MMI3",
    isConnected: true,
    isAdmin: true,
    logo:
      "https://imgv3.fotor.com/images/gallery/a-girl-cartoon-character-with-pink-background-generated-by-cartoon-character-maker-in-Fotor.jpg",
  };

  const checkRole = () => {
    return utilisateur.isAdmin ? "Administrateur" : "Utilisateur";
  };

  const overlayRef = useRef(null);

  const handleContainerClick = (event) => {
    if (
      overlayVisible &&
      overlayRef.current &&
      !overlayRef.current.contains(event.target)
    ) {
      setOverlayVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleContainerClick);
    return () => {
      document.removeEventListener("mousedown", handleContainerClick);
    };
  }, [overlayVisible]);

  const handleOverlayToggle = () => {
    setOverlayVisible(!overlayVisible);
  };

  return (
    <div className="barre-de-menu">
      <img
        src={logoImage}
        alt="Logo de l'entreprise"
        className="logo-band"
      />
      <div className="onglets">
        <Link to="/discussions">
          <FeatherIcon
            icon="message-circle"
            size="40"
            strokeWidth="1"
            className="onglet"
          />
        </Link>
        <Link to="/utilisateurs">
          <FeatherIcon
            icon="users"
            size="40"
            strokeWidth="1"
            className="onglet"
          />
        </Link>
        <Link to="/dossiers">
          <FeatherIcon
            icon="folder"
            size="40"
            strokeWidth="1"
            className="onglet"
          />
        </Link>
        <Link to="/livres">
          <FeatherIcon
            icon="book"
            size="40"
            strokeWidth="1"
            className="onglet"
          />
        </Link>
        {checkRole() == "Administrateur" && (
          <Link to="/admin">
            <FeatherIcon
              icon="settings"
              size="40"
              strokeWidth="1"
              className="onglet"
            />
          </Link>
        )}
      </div>
      <div className="profil-section" onClick={handleOverlayToggle}>
        <div
          className={`statut-indicateur ${
            utilisateur.isConnected ? "connecte" : "deconnecte"
          }`}
        />
        <img
          src={utilisateur.logo}
          alt="Logo de l'utilisateur"
          className="logo-utilisateur"
        />
        {overlayVisible && (
          <div className={`profil-overlay`} ref={overlayRef}>
            <div className="card">
              <div className="info-container">
                <img
                  src={utilisateur.logo}
                  alt="Logo de l'utilisateur"
                  className="overlay-logo"
                />
                <div className="text-container">
                  <p
                    style={{ color: "#223A6A", fontWeight: 600 }}
                  >{`${utilisateur.nom} ${utilisateur.prenom}`}</p>
                  <small>{`${utilisateur.job}`}</small>
                </div>
              </div>
              <div className="onglets-overlay">
                <Link to="/changer-status" className={"fr g1 ai-c"}>
                  <div
                    className={`statut-connexion ${
                      utilisateur.isConnected ? "connecte" : "deconnecte"
                    }`}
                  />
                  <p>
                    {utilisateur.isConnected ? "En ligne" : "déconnecté"}
                  </p>
                </Link>

                <Link to="parametres" className={"fr g1 ai-c"}>
                  <FeatherIcon
                    icon="settings"
                    size="20"
                    strokeWidth="1"
                    className="settings"
                  />
                  <p>Paramètres</p>
                </Link>

                <NoyauDeconnexion />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoyauBarreDeMenu;
