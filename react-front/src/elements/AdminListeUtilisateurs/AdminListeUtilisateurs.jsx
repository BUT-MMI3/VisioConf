import "./AdminListeUtilisateurs.scss";
import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { socket } from "../../socket";
import { Link } from "react-router-dom";
import Controller from "../../Controller/Controller";

export default function AdminListeUtilisateurs() {
    const location = useLocation();
    const [utilisateurs, setUtilisateurs] = useState([]);
    const controller = useRef(new Controller());

    useEffect(() => {
        const emitter = {
            nomDInstance: "AdminListeUtilisateurs",
        };
        const listeMessagesEmis = ["fetch-users"];
        const listeMessagesRecus = ["get-users"];

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
            setUtilisateurs(message);
        };

        controller.current.traitementMessage = traitementMessage;

        return () => {
            controller.current.traitementMessage = null;
        };
    }, []);

    return (
        <div className="liste-utilisateurs layout-content--full">
            <div className="liste-utilisateurs--card">
                <h2>Liste des utilisateurs</h2>
            </div>

            {/* test with false data */}
            <div className="liste-utilisateurs--container">
                <div className="liste-utilisateurs--container">
                    <table className="liste-utilisateurs--table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Prénom</th>
                                <th>Nom</th>
                                <th>Email</th>
                                <th>Rôles</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {utilisateurs.map((user, index) => (
                                <tr key={index}>
                                    <td>{user.id}</td>
                                    <td>{user.prenom}</td>
                                    <td>{user.nom}</td>
                                    <td>{user.email}</td>
                                    <td>{user.roles.join(", ")}</td>
                                    <td>
                                        <Link
                                            to={`/modifier-utilisateur/${user.id}`}
                                            className="liste-utilisateurs--modif"
                                        >
                                            Mod
                                        </Link>
                                        <Link
                                            to={`/supprimer-utilisateur/${user.id}`}
                                            className="liste-utilisateurs--supp"
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
