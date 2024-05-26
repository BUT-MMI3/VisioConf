import "./AdminListePermissions.scss";
import {useEffect, useRef, useState} from "react";
import {appInstance} from "../../controller/index.js";
import {toast} from "react-toastify";
import FeatherIcon from "feather-icons-react";
import {useModal} from "../Modale/ModaleContext.jsx";

const listeMessagesEmis = ["admin_demande_liste_permissions"];
const listeMessagesRecus = ["admin_liste_permissions"];

const AdminListePermissions = () => {
    const {newModal} = useModal();
    const [permissions, setPermissions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const controller = useRef(appInstance.getController()).current;

    const instanceRef = useRef({
        instanceName: "AdminListePermisisons", traitementMessage: (msg) => {
            console.log("Received data:", msg)
            if (msg.admin_liste_permissions) {

                if (msg.admin_liste_permissions.success) {
                    setPermissions(msg.admin_liste_permissions.permissions || []);
                } else {
                    toast.error(msg.admin_liste_permissions.message || "Erreur lors de la récupération des permissions", {
                        theme: "colored",
                        icon: "🚫"
                    });
                }
            }
        },
    });

    useEffect(() => {
        controller.subscribe(instanceRef.current, listeMessagesEmis, listeMessagesRecus);

        controller.send(instanceRef.current, {"admin_demande_liste_permissions": {}});

        return () => {
            controller.unsubscribe(instanceRef.current, listeMessagesEmis, listeMessagesRecus);
        };
    }, [controller]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredPermissions = permissions.filter(permission => {
        return (
            permission.permission_uuid.toLowerCase().includes(searchTerm) ||
            permission.permission_label.toLowerCase().includes(searchTerm) ||
            (permission._id ? permission._id.toLowerCase().includes(searchTerm) : false)
        );
    });

    return (
        <div className="liste-permissions layout-content--full">
            <div className="liste-permissions--card">
                <h2>Liste des Permissions</h2>
            </div>

            <div className="liste-permissions--tools">
                <div className={"liste-permissions--tools--search"}>
                    <FeatherIcon icon="search" size={20}/>
                    <input type="search" placeholder={"Rechercher"} onChange={handleSearchChange}/>
                </div>
            </div>

            <div className="liste-permissions--container">
                <div className="liste-permissions--container">
                    <table className="liste-permissions--table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Libellé</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredPermissions.map((permission, index) => (<tr key={index}>
                            <td>{permission.permission_uuid}</td>
                            <td>{permission.permission_label}{permission.permission_uuid.includes("admin_") && (
                                <> (Admin)</>
                            )}</td>
                        </tr>))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>);
};

export default AdminListePermissions;
