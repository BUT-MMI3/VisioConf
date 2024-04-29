import "./AdminListeRoles.scss";
import {useEffect, useRef, useState} from "react";
import {appInstance} from "../../controller/index.js";
import LinkTo from "../LinkTo/LinkTo.jsx";
import {useToasts} from "../Toasts/ToastContext.jsx";
import FeatherIcon from "feather-icons-react";
import {useModal} from "../Modale/ModaleContext.jsx";

const listeMessagesEmis = ["admin_demande_liste_roles", "admin_supprimer_role"];
const listeMessagesRecus = ["admin_liste_roles", "admin_role_supprime"];

const AdminListeRoles = () => {
    const {newModal} = useModal();
    const {pushToast} = useToasts();
    const [roles, setRoles] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const controller = useRef(appInstance.getController()).current;

    const instanceRef = useRef({
        instanceName: "AdminListeRoles", traitementMessage: (msg) => {
            console.log("Received data:", msg)
            if (msg.admin_liste_roles) {

                if (msg.admin_liste_roles.success) {
                    setRoles(msg.admin_liste_roles.roles || []);
                } else {
                    pushToast({
                        title: "Erreur",
                        message: msg.admin_liste_roles.message || "Erreur lors de la récupération des rôles",
                        type: "error",
                    });
                }
            } else if (msg.admin_role_supprime) {
                if (msg.admin_role_supprime.success) {
                    pushToast({
                        title: "Succès",
                        message: "Rôle supprimé avec succès",
                        type: "success",
                    });
                } else {
                    pushToast({
                        title: "Erreur",
                        message: "Erreur lors de la suppression du rôle",
                        type: "error",
                    });
                }
            }
        },
    });

    useEffect(() => {
        controller.subscribe(instanceRef.current, listeMessagesEmis, listeMessagesRecus);

        controller.send(instanceRef.current, { "admin_demande_liste_roles": {} });

        return () => {
            controller.unsubscribe(instanceRef.current, listeMessagesEmis, listeMessagesRecus);
        };
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredRoles = roles.filter(role => {
        return (
            role.role_uuid.toLowerCase().includes(searchTerm) ||
            role.role_label.toLowerCase().includes(searchTerm) ||
            role.role_permissions.join(", ").toLowerCase().includes(searchTerm) ||
            (role._id ? role._id.toLowerCase().includes(searchTerm) : false)
        );
    });

    return (
        <div className="liste-roles layout-content--full">
            <div className="liste-roles--card">
                <h2>Liste des rôles</h2>
            </div>

            <div className="liste-roles--tools">
                <div className={"liste-roles--tools--search"}>
                    <FeatherIcon icon="search" size={20}/>
                    <input type="search" placeholder={"Rechercher"} onChange={handleSearchChange}/>
                </div>
                <LinkTo to={`/admin/roles/new`}
                        className="liste-roles--tools--button">
                    Créer un rôle
                </LinkTo>
            </div>

            {/* test with false data */}
            <div className="liste-roles--container">
                <div className="liste-roles--container">
                    <table className="liste-roles--table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Libellé</th>
                            <th>Permissions</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredRoles.map((role, index) => (<tr key={index}>
                            <td>{role.role_uuid}</td>
                            <td>{role.role_label}</td>
                            <td>{role.role_permissions.join(", ")}</td>
                            <td className="liste-roles--actions">
                                <LinkTo to={`/admin/roles/${role._id || role.id}/view`}
                                        className="liste-roles--actions--voir">
                                    <FeatherIcon icon="eye" size={20}/>
                                </LinkTo>

                                {role.role_default ? (
                                    <>
                                        <button disabled
                                                className="liste-roles--actions--modif">
                                            <FeatherIcon icon="edit-2" size={20}/>
                                        </button>
                                        <button className="liste-roles--actions--supp" disabled>
                                            <FeatherIcon icon="trash" size={20}/>
                                        </button>
                                    </>

                                ) : (
                                    <>
                                        <LinkTo to={`/admin/roles/${role._id || role.id}/edit`}
                                                className="liste-roles--actions--modif">
                                            <FeatherIcon icon="edit-2" size={20}/>
                                        </LinkTo>
                                        <button onClick={() => newModal({
                                            type: 'error',
                                            boutonClose: true,
                                            titre: 'Vous allez supprimer un rôle.',
                                            texte: "Toutes les données du rôle serront supprimées. Êtes-vous sûr de vouloir continuer ?",
                                            texteBoutonAction: "Supprimer le rôle",
                                            onValidate: () => {
                                                controller.send(instanceRef.current, {admin_supprimer_role: role._id})
                                            },
                                        })}
                                                className="liste-roles--actions--supp">
                                            <FeatherIcon icon="trash" size={20}/>
                                        </button>
                                    </>

                                )}

                            </td>
                        </tr>))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>);
};

export default AdminListeRoles;
