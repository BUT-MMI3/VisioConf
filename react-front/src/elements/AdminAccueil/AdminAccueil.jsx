import "./AdminAccueil.scss";
import FeatherIcon from "feather-icons-react";
import {useEffect, useRef, useState} from "react";
import {initConnection} from "../../controller/index.js";
import LinkTo from "../LinkTo/LinkTo.jsx";

const listeMessagesEmis = ["fetch-utilisateurs"];
const listeMessagesRecus = ["get-utilisateurs"];

const AdminAccueil = () => {
    const instanceName = "AdminAccueil";
    const [utilisateurs, setUtilisateurs] = useState([]);

    const [controller] = useState(initConnection.getController());


    const {current} = useRef({
        instanceName, traitementMessage: (msg) => {
            console.log("Traitement message NoyauAccueil:", msg);
        },
    });

    useEffect(() => {
        controller.subscribe(current, listeMessagesEmis, listeMessagesRecus);

        return () => {
            controller.unsubscribe(current, listeMessagesEmis, listeMessagesRecus);
        };
    });

    return (<div className="admin-accueil layout-content--full">
            <div className="admin-accueil--card">
                <h2>Administration</h2>
            </div>

            <div className="admin-accueil--container">
                <div className="admin-accueil--cards">

                    <div className="admin-accueil--cards--card admin-accueil--cards--card--connected-users">
                        <div className={"admin-accueil--cards--card--connected-users--icon"}>
                            <FeatherIcon
                                icon="user"
                                size="40"
                                strokeWidth="2"
                            />
                        </div>

                        <h2>0</h2>
                        <p>Utilisateurs connectés</p>
                    </div>

                    <div className="admin-accueil--cards--card admin-accueil--cards--card--connected-users">
                        <div className={"admin-accueil--cards--card--connected-users--icon"}>
                            <FeatherIcon
                                icon="user"
                                size="40"
                                strokeWidth="2"
                            />
                        </div>

                        <h2>0</h2>
                        <p>Utilisateurs inscrits</p>
                    </div>

                    <div className="admin-accueil--cards--card admin-accueil--cards--card--calls">
                        <div className={"admin-accueil--cards--card--calls--icon"}>
                            <FeatherIcon
                                icon="phone"
                                size="40"
                                strokeWidth="2"
                            />
                        </div>

                        <h2>0</h2>
                        <p>Appels en cours</p>
                    </div>
                </div>
            </div>
            {/*Links to other admin pages*/}
            <div className="admin-accueil--container">
                <div className="admin-accueil--links">
                    <div className="admin-accueil--links--card admin-accueil--links--card--users">
                        <h2>Utilisateurs</h2>
                        <div className="admin-accueil--links--card--links">
                            <LinkTo to="/admin/users" className="admin-accueil--links--link">
                                <p>Liste des utilisateurs</p>
                            </LinkTo>
                            <LinkTo to="/admin/users/new" className="admin-accueil--links--link">
                                <p>Créer un utilisateur</p>
                            </LinkTo>
                        </div>

                    </div>

                    <div className="admin-accueil--links--card admin-accueil--links--card--groups">
                        <h2>Groupes</h2>
                        <div className="admin-accueil--links--card--links">
                            <LinkTo to="/admin/groups" className="admin-accueil--links--link">
                                <p>Liste des groupes</p>
                            </LinkTo>
                            <LinkTo to="/admin/groups/new" className="admin-accueil--links--link">
                                <p>Créer un groupe</p>
                            </LinkTo>
                        </div>
                    </div>

                    <div className="admin-accueil--links--card admin-accueil--links--card--roles">
                        <h2>Rôles</h2>
                        <div className="admin-accueil--links--card--links">
                            <LinkTo to="/admin/roles" className="admin-accueil--links--link">
                                <p>Liste des rôles</p>
                            </LinkTo>
                            <LinkTo to="/admin/roles/new" className="admin-accueil--links--link">
                                <p>Créer un Rôle</p>
                            </LinkTo>
                        </div>
                    </div>

                    <div className="admin-accueil--links--card admin-accueil--links--card--permissions">
                        <h2>Permissions</h2>
                        <div className="admin-accueil--links--card--links">
                            <LinkTo to="/admin/permissions" className="admin-accueil--links--link">
                                <p>Liste des permissions</p>
                            </LinkTo>
                            <LinkTo to="/admin/permissions/attribute" className="admin-accueil--links--link">
                                <p>Attribuer une permission</p>
                            </LinkTo>
                        </div>
                    </div>


                </div>
            </div>
        </div>);
};

export default AdminAccueil;
