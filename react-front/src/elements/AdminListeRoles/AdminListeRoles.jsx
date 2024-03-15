import "./AdminListeRoles.scss";
import { useEffect, useState, useRef } from "react";
import { controller } from "../../controller/index.js";

const AdminListeRoles = () => {
    const [roles, setRoles] = useState([]);
    const nomDInstance = "AdminListeRoles";
    const listeMessagesEmis = ["fetch-roles"];
    const listeMessagesRecus = ["get-roles"];

    const { current } = useRef({
        nomDInstance,
        traitementMessage: (msg) => {
            console.log("Traitement message NoyauAccueil:", msg);
        },
    });

    useEffect(() => {
        controller.subscribe(current, listeMessagesEmis, listeMessagesRecus);

        return () => {
            controller.unsubscribe(
                current,
                listeMessagesEmis,
                listeMessagesRecus
            );
        };
    });

    return (
        <div className="liste-roles layout-content--full">
            <div className="liste-roles--card">
                <h2>Liste des rôles</h2>
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
                            {roles.map((role, index) => (
                                <tr key={index}>
                                    <td>{role.id}</td>
                                    <td>{role.label}</td>
                                    <td>{role.permissions.join(", ")}</td>
                                    <td>
                                        <Link
                                            to={`/modifier-role/${role.id}`}
                                            className="liste-roles--modif"
                                        >
                                            Mod
                                        </Link>
                                        <Link
                                            to={`/supprimer-role/${role.id}`}
                                            className="liste-roles--supp"
                                        >
                                            Sup
                                        </Link>
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

export default AdminListeRoles;
