import { useEffect, useRef, useState } from 'react';
import FeatherIcon from 'feather-icons-react';
import { initConnection } from "../../controller/index.js";
import LinkTo from "../../elements/LinkTo/LinkTo.jsx";
import "./NoyauAccueil.css";

const listeMessageEmis = ["demande_user_info"];

const listeMessageRecus = ["information_user"];

const NoyauAccueil = () => {

    const instanceName = "NoyauAccueil";
    const verbose = true;
    const [controller] = useState(initConnection.getController());

    const [notifications, setNotifications] = useState([]);
    const [historiqueAppels, setHistoriqueAppels] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [utilisateur, setUtilisateur] = useState(null);

    const {current} = useRef({
        instanceName,
        traitementMessage: (msg) => {
            if (verbose || controller.verboseall) console.log(`INFO: (${instanceName}) - traitementMessage - `, msg);

            if (typeof msg.information_user !== "undefined") {
                console.log("Informations utilisateur obtenues");
                setUtilisateur(msg.information_user);
            } else {
                console.log("Erreur lors du traitement de la demande d'information de l'utilisateur");
            }
        }
    });

    const logIn = async () => {
        if (verbose || controller.verboseall) console.log(`INFO: (${instanceName})`);

        return new Promise((resolve, reject) => {
            try {
                controller.send(current, {
                    "demande_user_info": "information utilisateur"
                });
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

    // Simuler la récupération des notifications depuis une source de données
    useEffect(() => {
        // Exemple de données simulées
        const notificationsData = [
            {id: 1, message: 'Nouveau message reçu'},
            {id: 2, message: 'Vous avez un appel en absence'},
        ];

        setNotifications(notificationsData);

        const historiqueAppelsData = [
            {id: 1, date: '2024-02-01', duree: '10 min', participants: ['John', 'Alice']},
            {id: 2, date: '2024-02-02', duree: '15 min', participants: ['Bob', 'Eva']},
        ];

        setHistoriqueAppels(historiqueAppelsData);
    }, []);

    // Fonction pour basculer l'affichage des notifications et changer l'icône
    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    return (
        <div className="noyau-accueil layout-content--full">
            {/* Section d'informations du profil */}
            <div className="container fr jc-sa g1">

                <div className="section w-100">

                    <div className="section-header fr">
                        <h2>Mon Profil</h2>
                    </div>

                    <div className="section-profil">
                        <div className="profil-info fr jc-sa ai-c">

                            {utilisateur && (
                                <>
                                    <div className="profil-info-image w-100">
                                        <img src={utilisateur.user_picture} className='logo-profil-info fr ma'
                                             alt="Photo de profil"/>
                                    </div>
                                    <div className="profil-details w-100 fc ai-fs">
                                        <h2>{utilisateur.user_lastname} {utilisateur.user_firstname}</h2>
                                        <p>{utilisateur.user_job}</p>
                                    </div>
                                    <div className="profil-modification w-100">
                                        <div className="icon-button fr jc-c ai-c">
                                            <LinkTo to="/profil">
                                                <FeatherIcon icon="edit-2" size="20" strokeWidth="1"
                                                             className="icon fr"/>
                                            </LinkTo>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="section w-100">
                    {/* Section des notifications */}
                    <div className="section-header fr">
                        <h2>Boite de réception</h2>
                    </div>

                    <div className="section-notification">

                        <div className="notification-info w-100 fr jc-sa">

                            <div className="notification-info w-100 fr">
                                <div className="icon-button2 fr jc-c ai-c" onClick={toggleNotifications}>
                                    <FeatherIcon icon="bell" size="20" strokeWidth="1" className="icon fr"/>
                                </div>
                            </div>

                            <div className="notifications w-100 fr jc-c ai-c">
                                <h2 style={{fontSize: '15px', whiteSpace: 'nowrap'}}>Nouvelles notifications non
                                    lues.</h2>
                            </div>

                            <div className="notification-affiche w-100 fr jc-c ai-c" onClick={toggleNotifications}>
                                <FeatherIcon icon={showNotifications ? 'chevron-down' : 'chevron-right'} size="20"
                                             strokeWidth="1" className="icon"/>
                            </div>
                        </div>
                    </div>

                    {showNotifications && (
                        <div className="section-notification-hidden">
                            <div className="notification-info fr jc-sa">
                                <div className="notifications w-100 fr jc-c ai-c">
                                    <ul>
                                        {notifications.map((notification) => (
                                            <li key={notification.id}>{notification.message}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="notification-affiche w-100 fr jc-c ai-c" onClick={toggleNotifications}>
                                    <FeatherIcon icon="chevron-right" size="20" strokeWidth="1" className="icon"/>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="section w-100">
                    {/* Section de l'historique des appels */}
                    <div className="section-header fr">
                        <h2>Historique des appels</h2>
                    </div>

                    <div className="section-historique" style={{height: 'auto'}}>
                        <div className="historique-appels">
                            <ul>
                                {historiqueAppels.map((appel) => (
                                    <li key={appel.id}>
                                        <p>Date: {appel.date}</p>
                                        <p>Durée: {appel.duree}</p>
                                        <p>Participants: {appel.participants.join(', ')}</p>
                                        <hr/>
                                    </li>

                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoyauAccueil;
