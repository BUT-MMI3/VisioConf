import {useEffect, useRef, useState} from "react";
import FeatherIcon from "feather-icons-react";
import {Link} from "react-router-dom";
import "./NoyauBarreDeMenu.css";
import "../ProfilOverlay/ProfilOverlay.css";
import NoyauDeconnexion from "../../elements/NoyauDeconnexion/NoyauDeconnexion";
import {useSelector} from "react-redux";

const NoyauBarreDeMenu = () => {
    const [overlayVisible, setOverlayVisible] = useState(false);

    const session = useSelector((state) => state.session);

    const checkRole = () => {
        return session.user_roles[0];
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
                src={"./others/mmi-toulon.png"}
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
                {checkRole() === "Administrateur" && (
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
                        session.isSignedIn ? "connecte" : "deconnecte"
                    }`}
                />
                <img
                    src={session.user_picture}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "./user-icons/user-base-icon.svg";
                    }}
                    alt="Logo de l'session"
                    className="logo-session"
                />
                {overlayVisible && (
                    <div className={`profil-overlay`} ref={overlayRef}>
                        <div className="card">
                            <div className="info-container">
                                <img
                                    src={session.user_picture}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "./user-icons/user-base-icon.svg";
                                    }}
                                    alt="Logo de l'session"
                                    className="overlay-logo"
                                />
                                <div className="text-container">
                                    <p
                                        style={{color: "#223A6A", fontWeight: 600}}
                                    >{`${session.user_lastname} ${session.user_firstname}`}</p>
                                    <small>{`${session.user_job}`}</small>
                                </div>
                            </div>
                            <div className="onglets-overlay">
                                <Link to="/changer-status" className={"fr g1 ai-c"}>
                                    <div
                                        className={`statut-connexion ${
                                            session.isSignedIn ? "connecte" : "deconnecte"
                                        }`}
                                    />
                                    <p>
                                        {session.isSignedIn ? "En ligne" : "déconnecté"}
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

                                <NoyauDeconnexion/>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NoyauBarreDeMenu;
