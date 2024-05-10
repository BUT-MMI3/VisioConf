import "./AdminListeUtilisateurs.scss";
import {useEffect, useRef, useState} from "react";
import {appInstance} from "../../controller/index.js";
import LinkTo from "../LinkTo/LinkTo.jsx";
import FeatherIcon from "feather-icons-react";
import {useModal} from "../Modale/ModaleContext.jsx";
import {toast} from "react-toastify";

const listeMessagesEmis = ["admin_demande_liste_utilisateurs", "admin_supprimer_utilisateur"];
const listeMessagesRecus = ["admin_liste_utilisateurs", "admin_utilisateur_supprime"];

const AdminListeUtilisateurs = () => {
    const {newModal} = useModal();

    const [utilisateurs, setUtilisateurs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const controller = useRef(appInstance.getController()).current;

    const instanceRef = useRef({
        instanceName: "AdminListeUtilisateurs",
        traitementMessage: (msg) => {
            console.log("Received data:", msg);
            if (msg && msg.admin_liste_utilisateurs) {
                if (msg.admin_liste_utilisateurs.success) {
                    setUtilisateurs(msg.admin_liste_utilisateurs.liste_utilisateurs || []);
                } else {
                    toast.error("Erreur lors de la récupération de la liste des utilisateurs", {theme: "colored", icon: "🚫"})
                }
            } else if (msg && msg.admin_utilisateur_supprime) {
                if (msg.admin_utilisateur_supprime.success) {
                    toast.success("Utilisateur supprimé avec succès", {theme: "colored", icon: "🗑️"})
                } else {
                    toast("Erreur lors de la suppression de l'utilisateur", {theme: "colored", icon: "🚫"})
                }
            }
        },
    });

    useEffect(() => {
        controller.subscribe(instanceRef.current, listeMessagesEmis, listeMessagesRecus);

        controller.send(instanceRef.current, {"admin_demande_liste_utilisateurs": {}});

        return () => {
            controller.unsubscribe(instanceRef.current, listeMessagesEmis, listeMessagesRecus);
        };
    }, [controller]);

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
                                    <LinkTo to={`/admin/users/${user._id || user.id}/view`}
                                            className="liste-utilisateurs--actions--voir">
                                        <FeatherIcon icon="eye" size={20}/>
                                    </LinkTo>
                                    <LinkTo to={`/admin/users/${user._id || user.id}/edit`}
                                            className="liste-utilisateurs--actions--modif">
                                        <FeatherIcon icon="edit-2" size={20}/>
                                    </LinkTo>
                                    <button onClick={() => newModal({
                                        type: 'error',
                                        boutonClose: true,
                                        titre: 'Vous allez supprimer un utilisateur.',
                                        texte: "Toutes les données personnelles de l'utilisateur serront supprimées, mais l'ensemble des contenus associés au compte resteront visibles (messages, posts, etc...). Le profil de l'utilisateur apparaîtra comme \"Utilisateur supprimé\". Êtes-vous sûr de vouloir continuer ?",
                                        texteBoutonAction: "Supprimer l'utilisateur",
                                        onValidate: () => {
                                            controller.send(instanceRef.current, {admin_supprimer_utilisateur: user._id})
                                        },
                                    })}
                                            className="liste-utilisateurs--actions--supp">
                                        <FeatherIcon icon="trash" size={20}/>
                                    </button>
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
