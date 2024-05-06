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
    const verbose = false;
    const [controller] = useState(appInstance.getController());

    const [status, setStatus] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [showStatus, setShowStatus] = useState(null);

    const {current} = useRef({
        instanceName,
        traitementMessage: (msg) => {
            if (verbose || controller.verboseall) console.log(`INFO: (${instanceName}) - traitementMessage - `, msg);

            if (typeof msg.status_answer !== "undefined") {
                console.log("Informations utilisateur obtenues", msg.status_answer);
                setStatus(msg.status_answer);
            } else {
                console.log("Erreur lors du traitement du message :", msg);
            }
        }
    });

    useEffect(() => {
        controller.subscribe(current, listeMessageEmis, listeMessageRecus);

        return () => {
            controller.unsubscribe(current, listeMessageEmis, listeMessageRecus);
        };
    }, [current, controller]);
    const toggleStatus = () => {
        setShowStatus(!showStatus);
    };
    const checkRole = () => {
        console.log(`INFO: (NoyauBarreDeMenu) - checkRole - session.user_roles[0]`, session.user_roles[0]);
        return session.user_roles[0];
    };
    const handleChangeStatus = async (newStatus) => {
        try {
            setSelectedStatus(newStatus);
            await controller.send(current, {demande_changement_status: newStatus});
            console.log("Demande de changement de statut envoyée", newStatus)
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
                            !status && (
                                session.user_disturb_status === "available" ? "connecte" :
                                    session.user_disturb_status === "offline" ? "offline" :
                                        session.user_disturb_status === "dnd" ? "dnd" : ""
                            )
                        } ${status === "available" ? "connecte" : ""} ${status === "offline" ? "offline" : ""} ${status === "dnd" ? "dnd" : ""}`}
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
                                        <div className={`statut-connexion`}>
                                            {!status && (session.user_disturb_status === "available" || session.user_disturb_status === "offline" || session.user_disturb_status === "dnd") && (
                                                <>
                                                    {session.user_disturb_status === "available" && (
                                                        <>
                                                             <span style={{
                                                                 fontSize: "2rem",
                                                                 color: "green"
                                                             }}>●</span>
                                                        </>
                                                    )}
                                                    {session.user_disturb_status === "offline" && (
                                                        <>
                                                            <span style={{
                                                                fontSize: "2rem",
                                                                color: "gray"
                                                            }}>●</span>
                                                        </>
                                                    )}
                                                    {session.user_disturb_status === "dnd" && (
                                                        <>
                                                             <span style={{
                                                                 fontSize: "2rem",
                                                                 color: "#CB0000"
                                                             }}>●</span>
                                                        </>
                                                    )}
                                                </>
                                            )}

                                            {status === "available" && (
                                                <>
                                                    <span style={{
                                                        fontSize: "2rem",
                                                        color: "green"
                                                    }}>●</span>
                                                </>
                                            )}
                                            {status === "offline" && (
                                                <>
                                                    <span style={{
                                                        fontSize: "2rem",
                                                        color: "gray"
                                                    }}>●</span>
                                                </>
                                            )}
                                            {status === "dnd" && (
                                                <>
                                                    <span style={{
                                                        fontSize: "2rem",
                                                        color: "#CB0000"
                                                    }}>●</span>
                                                </>
                                            )}
                                        </div>

                                        <p className={"w-100"}>
                                            {!status && (session.user_disturb_status === "available" || session.user_disturb_status === "offline" || session.user_disturb_status === "dnd") && (
                                                <>
                                                    {session.user_disturb_status === "available" && (
                                                        <>
                                                            <span style={{marginLeft: "-1.5rem"}}>En ligne</span>
                                                        </>
                                                    )}
                                                    {session.user_disturb_status === "offline" && (
                                                        <>
                                                            <span>Hors ligne</span>
                                                        </>
                                                    )}
                                                    {session.user_disturb_status === "dnd" && (
                                                        <>
                                                            <span style={{marginLeft: "0.5rem", whiteSpace: "nowrap",}}>Ne pas déranger</span>
                                                        </>
                                                    )}
                                                </>
                                            )}
                                            {status === "available" && (
                                                <>
                                                    <span style={{marginLeft: "-1.5rem"}}> En ligne</span>
                                                </>
                                            )}
                                            {status === "offline" && (
                                                <>
                                                    <span> Hors ligne</span>
                                                </>
                                            )}
                                            {status === "dnd" && (
                                                <>
                                                    <span style={{marginLeft: "0.5rem", whiteSpace: "nowrap",}}> Ne pas déranger</span>
                                                </>
                                            )}
                                        </p>

                                        <div className="status-affiche w-100 fr jc-c ai-c"
                                             style={{marginRight: "-1rem",}}
                                             onMouseOver={toggleStatus}>
                                            <FeatherIcon
                                                icon={showStatus ? 'chevron-down' : 'chevron-right'}
                                                size="20"
                                                strokeWidth="1" className="icon"
                                                style={{fill: "black"}}
                                            />
                                        </div>

                                        {showStatus && (
                                            <div className="section-status-hidden w-100">
                                                <ul>
                                                    {["available", "offline", "dnd"].map((statusOption) => (
                                                        <li key={statusOption} className={"fr"}
                                                            onClick={() => handleChangeStatus(statusOption)}>
                                                            {statusOption === "available" && (
                                                                <>
                                                                    <span style={{
                                                                        marginLeft: "0.5rem",
                                                                        color: "green"
                                                                    }}>●</span>
                                                                    <span
                                                                        style={{marginLeft: "0.5rem"}}> En ligne</span>
                                                                </>
                                                            )}
                                                            {statusOption === "offline" && (
                                                                <>
                                                                    <span style={{
                                                                        marginLeft: "0.5rem",
                                                                        color: "grey"
                                                                    }}>●</span>
                                                                    <span
                                                                        style={{marginLeft: "0.5rem"}}> Hors ligne</span>
                                                                </>
                                                            )}
                                                            {statusOption === "dnd" && (
                                                                <>
                                                                    <span style={{
                                                                        marginLeft: "0.5rem",
                                                                        color: "#CB0000"
                                                                    }}>●</span>
                                                                    <span style={{
                                                                        marginLeft: "0.5rem",
                                                                        whiteSpace: "nowrap",
                                                                    }}> Ne pas déranger</span>
                                                                </>
                                                            )}
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
