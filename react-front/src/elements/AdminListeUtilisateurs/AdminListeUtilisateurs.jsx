import "./AdminListeUtilisateurs.scss";
import {useEffect, useRef, useState} from "react";
import {appInstance} from "../../controller/index.js";
import LinkTo from "../LinkTo/LinkTo.jsx";
import FeatherIcon from "feather-icons-react";

const listeMessagesEmis = ["admin_demande_liste_utilisateurs"];
const listeMessagesRecus = ["admin_liste_utilisateurs"];

const AdminListeUtilisateurs = () => {
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const controller = useRef(appInstance.getController()).current;

    const instanceRef = useRef({
        instanceName: "AdminListeUtilisateurs",
        traitementMessage: (msg) => {
            console.log("Received data:", msg);
            if (msg && msg.admin_liste_utilisateurs ) {
                setUtilisateurs(msg.admin_liste_utilisateurs.liste_utilisateurs || []);
            } else {
                console.error("Unexpected data format received:", msg);
                setUtilisateurs([]);
            }
        },
    });

    useEffect(() => {
        controller.subscribe(instanceRef.current, listeMessagesEmis, listeMessagesRecus);

        controller.send(instanceRef.current, { "admin_demande_liste_utilisateurs": {} });

        return () => {
            controller.unsubscribe(instanceRef.current, listeMessagesEmis, listeMessagesRecus);
        };
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredUtilisateurs = utilisateurs.filter(user => {
        return (
            user.user_firstname.toLowerCase().includes(searchTerm) ||
            user.user_lastname.toLowerCase().includes(searchTerm) ||
            user.user_email.toLowerCase().includes(searchTerm) ||
            (user._id ? user._id.toLowerCase().includes(searchTerm) : false)
        );
    });

    return (
        <div className="liste-utilisateurs layout-content--full">
            <div className="liste-utilisateurs--card">
                <h2>Liste des utilisateurs</h2>
            </div>

            <div className="liste-utilisateurs--tools">
                <div className={"liste-utilisateurs--tools--search"}>
                    <FeatherIcon icon="search" size={20}/>
                    <input type="search" placeholder={"Rechercher"} onChange={handleSearchChange}/>
                </div>
                <LinkTo to={`/admin/users/new`}
                        className="liste-utilisateurs--tools--button">
                    Créer un utilisateur
                </LinkTo>
            </div>

            {/* test with false data */}
            <div className="liste-utilisateurs--container">
                <div className="liste-utilisateurs--container">
                    <table className="liste-utilisateurs--table">
                        <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Prénom</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredUtilisateurs.map((user, index) => (
                            <tr key={index}>
                                <td>{user.user_lastname}</td>
                                <td>{user.user_firstname}</td>
                                <td>{user.user_email}</td>
                                <td className="liste-utilisateurs--actions">
                                    <LinkTo to={`/admin/users/edit/${user._id || user.id}`}
                                            className="liste-utilisateurs--actions--modif">
                                        <FeatherIcon icon="edit-2" size={20}/>
                                    </LinkTo>
                                    <LinkTo to={`/admin/users/delete/${user._id || user.id}`}
                                            className="liste-utilisateurs--actions--supp">
                                        <FeatherIcon icon="trash" size={20}/>
                                    </LinkTo>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminListeUtilisateurs;
