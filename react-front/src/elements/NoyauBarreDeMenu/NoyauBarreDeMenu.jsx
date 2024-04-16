import {useEffect, useRef, useState} from "react";
import FeatherIcon from "feather-icons-react";
import LinkTo from "../../elements/LinkTo/LinkTo";
import "./NoyauBarreDeMenu.css";
import "../ProfilOverlay/ProfilOverlay.scss";
import NoyauDeconnexion from "../../elements/NoyauDeconnexion/NoyauDeconnexion";
import {useSelector} from "react-redux";

const NoyauBarreDeMenu = () => {
    const [overlayVisible, setOverlayVisible] = useState(false);

    const session = useSelector((state) => state.session);

    const checkRole = () => {
        console.log(`INFO: (NoyauBarreDeMenu) - checkRole - session.user_roles[0]`, session.user_roles[0]);
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
    }, [handleContainerClick, overlayVisible]);

    const handleOverlayToggle = () => {
        setOverlayVisible(!overlayVisible);
    };

    return (
        <div className="barre-de-menu">
            <div className="top">
                <LinkTo to="/">
                    <img
                        src={"./others/mmi-toulon.png"}
                        alt="Logo de l'entreprise"
                        className="logo-band"
                    />
                </LinkTo>
                <div className="onglets">
                    <LinkTo to="/discussions">
                        <FeatherIcon
                            icon="message-circle"
                            size="40"
                            strokeWidth="1"
                            className="onglet"
                        />
                    </LinkTo>
                    <LinkTo to="/utilisateurs">
                        <FeatherIcon
                            icon="users"
                            size="40"
                            strokeWidth="1"
                            className="onglet"
                        />
                    </LinkTo>
                    <LinkTo to="/dossiers">
                        <FeatherIcon
                            icon="folder"
                            size="40"
                            strokeWidth="1"
                            className="onglet"
                        />
                    </LinkTo>
                    <LinkTo to="/livres">
                        <FeatherIcon
                            icon="book"
                            size="40"
                            strokeWidth="1"
                            className="onglet"
                        />
                    </LinkTo>
                    {checkRole() === "admin" && (
                        <LinkTo to="/admin">
                            <FeatherIcon
                                icon="settings"
                                size="40"
                                strokeWidth="1"
                                className="onglet"
                            />
                        </LinkTo>
                    )}
                </div>
            </div>
            <div className="bottom">

                <div className="profil-section" onClick={handleOverlayToggle}>
                    <div
                        className={`statut-indicateur ${
                            session.isSignedIn ? "connecte" : "deconnecte"
                        }`}
                    />
                    <img
                        src={session.user_picture}
                        // onError={(e) => {
                        //     e.target.onerror = null;
                        //     e.target.src = "./user-icons/user-base-icon.svg";
                        // }}
                        alt="Logo de l'session"
                        className="logo-session"
                    />
                    {overlayVisible && (
                        <div className={`profil-overlay`} ref={overlayRef}>
                            <div className="card">
                                <div className="info-container">
                                    <img
                                        src={session.user_picture}
                                        // onError={(e) => {
                                        //     e.target.onerror = null;
                                        //     e.target.src = "./user-icons/user-base-icon.svg";
                                        // }}
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
                                    <LinkTo to="/changer-status" className={"fr g1 ai-c"}>
                                        <div
                                            className={`statut-connexion ${
                                                session.isSignedIn ? "connecte" : "deconnecte"
                                            }`}
                                        />
                                        <p>
                                            {session.isSignedIn ? "En ligne" : "déconnecté"}
                                        </p>
                                    </LinkTo>

                                    <LinkTo to="parametres" className={"fr g1 ai-c"}>
                                        <FeatherIcon
                                            icon="settings"
                                            size="20"
                                            strokeWidth="1"
                                            className="settings"
                                        />
                                        <p>Paramètres</p>
                                    </LinkTo>

                                    <NoyauDeconnexion/>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NoyauBarreDeMenu;
