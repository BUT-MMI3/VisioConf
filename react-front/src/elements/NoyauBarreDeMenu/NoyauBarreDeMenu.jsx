import {useEffect, useRef, useState} from "react";
import FeatherIcon from "feather-icons-react";
import LinkTo from "../../elements/LinkTo/LinkTo";
import "./NoyauBarreDeMenu.css";
import "../ProfilOverlay/ProfilOverlay.scss";
import NoyauDeconnexion from "../../elements/NoyauDeconnexion/NoyauDeconnexion";
import {useSelector} from "react-redux";
import {appInstance} from "../../controller/index.js";

const listeMessageEmis = ["demande_changement_status"];
const listeMessageRecus = ["status_answer"];

const NoyauBarreDeMenu = () => {
    const [overlayVisible, setOverlayVisible] = useState(false);

    const session = useSelector((state) => state.session);


    const instanceName = "NoyauBarreDeMenu";
    const verbose = true;
    const [controller] = useState(appInstance.getController());

    const [status, setStatus] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [showStatus, setShowStatus] = useState(null);

    const {current} = useRef({
        instanceName,
        traitementMessage: (msg) => {
            if (verbose || controller.verboseall) console.log(`INFO: (${instanceName}) - traitementMessage - `, msg);

            if (typeof msg.status_answer !== "undefined") {
                console.log("Informations utilisateur obtenues");
                setStatus(msg.status_answer);
            } else {
                console.log("Erreur lors du traitement du message :", msg);
            }
        }
    });

    const logIn = async () => {
        if (verbose || controller.verboseall) console.log(`INFO: (${instanceName})`);

        return new Promise((resolve, reject) => {
            try {
                controller.send(current, {"demande_changement_status": "status utilisateur"});
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    };
    useEffect(() => {
        controller.subscribe(current, listeMessageEmis, listeMessageRecus);

        return () => {
            controller.unsubscribe(current, listeMessageEmis, listeMessageRecus);
        };
    }, [current, controller]);
    useEffect(() => {
        logIn();
    }, []);

    const toggleStatus = () => {
        setShowStatus(!showStatus);
    };
    const checkRole = () => {
        console.log(`INFO: (NoyauBarreDeMenu) - checkRole - session.user_roles[0]`, session.user_roles[0]);
        return session.user_roles[0];
    };
    const handleChangeStatus = async (newStatus) => {
        try {
            await controller.send(current, { demande_changement_status: newStatus });
            // Mettre à jour l'état du statut avec le nouveau statut sélectionné
            setSelectedStatus(newStatus);

            controller.send(current, { demande_changement_status: selectedStatus });

        } catch (error) {
            console.error("Erreur lors de la demande de changement de statut :", error);
        }
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
                    <LinkTo to="/annuaire">
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
                                    <div className={"fr g1 ai-c"}>
                                        <div
                                            className={`statut-connexion ${
                                                session.isSignedIn ? "connecte" : "deconnecte"
                                            }`}
                                        />
                                        <p style={{width: "100%",}}>
                                            {session.isSignedIn ? "En ligne" : "déconnecté"}
                                        </p>

                                        <div className="status-affiche w-100 fr jc-c ai-c"
                                             onClick={toggleStatus}>
                                            <FeatherIcon
                                                icon={showStatus ? 'chevron-down' : 'chevron-right'}
                                                size="20"
                                                strokeWidth="1" className="icon"
                                                style={{fill: "black"}}
                                            />
                                        </div>

                                        {showStatus && (
                                            <div className="section-status-hidden">
                                                <ul>
                                                    {["available", "offline", "dnd"].map((statusOption) => (
                                                        <li key={statusOption} onClick={() => handleChangeStatus(statusOption)}>
                                                            {statusOption}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>

                                    <div className={"fr g1 ai-c"}>
                                        <FeatherIcon
                                            icon="settings"
                                            size="20"
                                            strokeWidth="1"
                                            className="settings"
                                            style={{stroke: "black"}}
                                        />
                                        <p>Paramètres</p>
                                    </div>

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
