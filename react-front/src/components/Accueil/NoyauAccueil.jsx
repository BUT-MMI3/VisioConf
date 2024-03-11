import { useState, useEffect } from 'react';
import FeatherIcon from 'feather-icons-react';
import { Link } from 'react-router-dom';
import "./NoyauAccueil.css";

const NoyauAccueil = () => {
    const [notifications, setNotifications] = useState([]); // é remplir avec les notifications non-lues
    const [historiqueAppels, setHistoriqueAppels] = useState([]); // é remplir avec l'historique des appels
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
            { id: 1, message: 'Nouveau message reçu' },
            { id: 2, message: 'Vous avez un appel en absence' },
        ];

        setNotifications(notificationsData);
        
        const historiqueAppelsData = [
            { id: 1, date: '2024-02-01', duree: '10 min', participants: ['John', 'Alice'] },
            { id: 2, date: '2024-02-02', duree: '15 min', participants: ['Bob', 'Eva'] },
        ];

        setHistoriqueAppels(historiqueAppelsData);
    }, []);

    return (
        <div className="noyau-accueil layout-content--full">
            {/* Section d'informations du profil */}
            <div className="container">
                {/* Section 1 */}
                <div className="section">

                    <div className="profil-info">
                        <img src={utilisateur.logo} className='logo-band' alt="Photo de profil" />

                        {/* Informations du profil */}
                        <div className="profil-details">
                            <h2>{utilisateur.nom} {utilisateur.prenom}</h2>
                            <p>{utilisateur.job}</p>
                        </div>

                        {/* Lien vers la page de modification du profil */}
                        <Link to="/modification-profil">
                            <FeatherIcon icon="edit" size="20" strokeWidth="1" className="edit-icon" />
                            Modifier le profil
                        </Link>
                    </div>
                </div>

                <div className="section">
                    {/* Section des notifications */}
                    <div className="notifications">
                        <h3>Notifications</h3>
                        <ul>
                            {notifications.map((notification) => (
                                <li key={notification.id}>{notification.message}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="section">
                    {/* Section de l'historique des appels */}
                    <div className="historique-appels">
                        <h3>Historique des appels</h3>
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
    );
};

export default NoyauAccueil;
