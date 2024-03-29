import {useEffect, useState} from 'react';
import FeatherIcon from 'feather-icons-react';
import LinkTo from "../LinkTo/LinkTo.jsx";
import "./NoyauAccueil.css";

const NoyauAccueil = () => {
    const [notifications, setNotifications] = useState([]); // é remplir avec les notifications non-lues
    const [historiqueAppels, setHistoriqueAppels] = useState([]); // é remplir avec l'historique des appels
    const [showNotifications, setShowNotifications] = useState(false); // État pour contrôler l'affichage des notifications

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
                {/* Section 1 */}
                <div className="section w-100">

                    <div className="section-header fr">
                        <h2>Mon Profil</h2>
                    </div>

                    <div className="section-profil">
                        <div className="profil-info fr jc-sa ai-c">

                            <div className="profil-info-image w-100">
                                <img src={utilisateur.logo} className='logo-profil-info' alt="Photo de profil"/>
                            </div>

                            {/* Informations du profil */}
                            <div className="profil-details w-100 fc ai-fs">
                                <h2>{utilisateur.nom} {utilisateur.prenom}</h2>
                                <p>{utilisateur.job}</p>
                            </div>

                            {/* Lien vers la page de modification du profil */}
                            <div className="profil-modification w-100">
                                <div className="icon-button fr jc-c ai-c">
                                    <LinkTo to="/modification-profil">
                                        <FeatherIcon icon="edit-2" size="20" strokeWidth="1" className="icon fr"/>
                                    </LinkTo>
                                </div>
                            </div>
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
