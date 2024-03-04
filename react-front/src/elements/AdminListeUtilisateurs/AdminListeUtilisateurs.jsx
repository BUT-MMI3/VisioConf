import "./AdminListeUtilisateurs.scss";
import { useEffect, useState, useRef } from "react";
import { controller } from "../../Controller/index.js";

const AdminListeUtilisateurs = () => {
    const [utilisateurs, setUtilisateurs] = useState([]);
    const nomDInstance = "AdminListeUtilisateurs";
    const listeMessagesEmis = ["fetch-utilisateurs"];
    const listeMessagesRecus = ["get-utilisateurs"];

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
};

export default AdminListeUtilisateurs;