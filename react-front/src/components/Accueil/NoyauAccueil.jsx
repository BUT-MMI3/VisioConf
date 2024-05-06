import {useEffect, useRef, useState} from 'react';
import FeatherIcon from 'feather-icons-react';
import {appInstance} from "../../controller/index.js";
import LinkTo from "../../elements/LinkTo/LinkTo.jsx";
import "./NoyauAccueil.css";
import {useSelector} from "react-redux";

const listeMessageEmis = ["update_notifications"];
const listeMessageRecus = ["distribue_notification"];

const NoyauAccueil = () => {
    const instanceName = "NoyauAccueil";
    const verbose = true;
    const [controller] = useState(appInstance.getController());

    const session = useSelector((state) => state.session);
    const [notifications, setNotifications] = useState([]);
    const [historiqueAppels, setHistoriqueAppels] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showHistorique, setShowHistorique] = useState(false);

    const {current} = useRef({
        instanceName,
        traitementMessage: (msg) => {
            if (verbose || controller.verboseall) console.log(`INFO: (${instanceName}) - traitementMessage - `, msg);

            if (typeof msg.distribue_notification !== "undefined") {
                if (msg.distribue_notification.content.message_status !== 'read') {
                    setNotifications(prevNotifications => [...prevNotifications, msg.distribue_notification]);
                }
            } else {
                console.log("Erreur lors du traitement du message :", msg);
            }
        }
    });

    const markAllAsRead = async () => {
        const unreadNotifications = notifications.filter(notification => notification.content.message_status !== 'read');

        try {
            await controller.send(current, {update_notifications: unreadNotifications});
            setNotifications([]);
        } catch (error) {
            console.error('Erreur lors de la mise à jour des notifications:', error);
        }
    }


    useEffect(() => {
        controller.subscribe(current, listeMessageEmis, listeMessageRecus);

        return () => {
            controller.unsubscribe(current, listeMessageEmis, listeMessageRecus);
        };
    }, [current, controller, controller.verboseall, verbose]);

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    const toggleHistorique = () => {
        setShowHistorique(!showHistorique);
    };

    return (
        <div className="noyau-accueil layout-content--full">
            <div className="container fr jc-sa g1">
                <div className="section w-100">
                    <div className="section-header fr">
                        <h2>Mon Profil</h2>
                    </div>
                    <div className="section-profil fc jc-c">
                        <div className="profil-info fr jc-sa ai-c">
                            {session && (
                                <>
                                    <div className="profil-info-image w-100">
                                        <img src={session.user_picture} className='logo-profil-info fr ma'
                                             alt="Photo de profil"/>
                                    </div>
                                    <div className="profil-details w-100 fc ai-fs">
                                        <h2>{session.user_lastname} {session.user_firstname}</h2>
                                        <p>{session.user_job}</p>
                                    </div>
                                    <div className="profil-modification w-100">
                                        <div className="icon-button3 fr jc-c ai-c">
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
                    <div className="section-header fr">
                        <h2>Boite de réception</h2>
                    </div>

                    <div className="section-notification fc jc-c">
                        <div className="notification-info w-100 fr jc-sa">
                            <div className="notification-info w-100 fr">
                                <div className="icon-button2 fr jc-c ai-c" onClick={toggleNotifications}>
                                    <FeatherIcon icon="bell" size="30" strokeWidth="1" className="icon fr"/>
                                </div>
                            </div>

                            <div className="notifications w-100 fr jc-c ai-c">
                                {notifications.length === 0 ? (
                                    <h2 style={{fontSize: '15px'}}>Aucune nouvelle notification</h2>
                                ) : (
                                    <h2 style={{fontSize: '15px'}}>{notifications.length} Nouvelle(s) notification(s)
                                        non lue(s).</h2>
                                )}
                            </div>

                            <div className="notification-affiche w-100 fr jc-c ai-c" onClick={toggleNotifications}>
                                <FeatherIcon
                                    icon={showNotifications && notifications.length !== 0 ? 'chevron-down' : 'chevron-right'}
                                    size="30"
                                    strokeWidth="1" className="icon"/>
                            </div>
                        </div>
                    </div>

                    {showNotifications && notifications.length !== 0 && (
                        <div className="section-notification-hidden">
                            <div className="notification-info fr jc-sa">
                                <div className="notifications w-100 fr ai-c">
                                    <ul style={{maxHeight:"40vh"}}>
                                        {notifications.map((notification, index) => (
                                            <LinkTo key={index} to={"/discussion/"+notification.data.discussionId}>
                                                <li  className="notification-item if ai-c">
                                                    <img src={notification.data.lastMessage.message_sender.user_picture}
                                                         className='logo-profil-reception' alt="Photo de profil"/>
                                                    <p>
                                                        <span
                                                            className="sender-name">{notification.data.lastMessage.message_sender.user_firstname} {notification.data.lastMessage.message_sender.user_lastname},
                                                        </span>
                                                        vous a envoyé un nouveau message dans : &quot;{notification.data?.discussionName}&quot;
                                                    </p>
                                                </li>
                                            </LinkTo>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            {notifications.length > 0 && (
                                <div className="fr jc-fe" style={{padding: '1rem'}}>
                                    <button onClick={markAllAsRead}>vider</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="section w-100">
                    <div className="section-header fr">
                        <h2>Historique des appels</h2>
                    </div>

                    <div className="section-historique fc jc-c" style={{height: 'auto'}}>
                        <div className="historique-appels fr jc-c">
                            <div className="historique-info w-100 fr jc-sa">
                                <div className="icon-button2 fr jc-c ai-c" onClick={toggleHistorique}>
                                    <FeatherIcon icon="clock" size="30" strokeWidth="2"
                                                 className="icon fr feather-clock"/>
                                </div>
                            </div>

                            <div className="historique w-100 fr jc-c ai-c">
                                <h2 style={{fontSize: '15px'}}>votre historique d&apos;appels</h2>
                            </div>
                            <div className="historique-affiche w-100 fr jc-c ai-c ma" onClick={toggleHistorique}>
                                <FeatherIcon icon={showHistorique ? 'chevron-down' : 'chevron-right'} size="30"
                                             strokeWidth="1" fill="white" className="icon"/>
                            </div>
                        </div>
                    </div>
                    {showHistorique && (
                        <div className="section-historique-hidden">
                            <div className="historique-info fr jc-sa">
                                <div className="historiques w-100 fr ai-c">
                                    <ul>
                                        {historiqueAppels.map((appel, index) => (
                                            <li key={index}>
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
                    )}
                </div>
            </div>
        </div>
    );
};

export default NoyauAccueil;
