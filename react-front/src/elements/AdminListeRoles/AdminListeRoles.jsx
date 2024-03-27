import "./AdminListeRoles.scss";
import {useEffect, useRef, useState} from "react";
import {initConnection} from "../../controller/index.js";
import LinkTo from "../LinkTo/LinkTo.jsx";

const listeMessagesEmis = ["fetch-roles"];
const listeMessagesRecus = ["get-roles"];

const AdminListeRoles = () => {
    const instanceName = "AdminListeRoles";
    const [roles, setRoles] = useState([]);

    const [controller] = useState(initConnection.getController());


    const {current} = useRef({
        instanceName,
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
                                    <LinkTo
                                        to={`/modifier-role/${role.id}`}
                                        className="liste-roles--modif"
                                    >
                                        Mod
                                    </LinkTo>
                                    <LinkTo
                                        to={`/supprimer-role/${role.id}`}
                                        className="liste-roles--supp"
                                    >
                                        Sup
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

export default AdminListeRoles;
