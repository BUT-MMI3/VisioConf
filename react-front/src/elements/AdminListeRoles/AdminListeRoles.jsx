import "./AdminListeRoles.scss";
import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import Controller from "../../Controller/Controller";

export default function AdminListeRoles() {
    const location = useLocation();
    const [roles, setRoles] = useState([]);
    const controller = useRef(new Controller());

    useEffect(() => {
        const emitter = {
            nomDInstance: "AdminListeRoles",
        };
        const listeMessagesEmis = ["fetch-roles"];
        const listeMessagesRecus = ["get-roles"];

        controller.current.subscribe(
            emitter,
            listeMessagesEmis,
            listeMessagesRecus
        );
        return () => {
            controller.current.unsubscribe(
                emitter,
                listeMessagesEmis,
                listeMessagesRecus
            );
        };
    }, [location]);

    useEffect(() => {
        const traitementMessage = (message) => {
            console.log("Received message:", message);
            setRoles(message);
        };

        controller.current.traitementMessage = traitementMessage;

        return () => {
            controller.current.traitementMessage = null;
        };
    }, []);

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
}
