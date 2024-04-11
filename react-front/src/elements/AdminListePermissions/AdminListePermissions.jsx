import "./AdminListePermissions.scss";
import {useEffect, useRef, useState} from "react";
import {appInstance} from "../../controller/index.js";

const listeMessagesEmis = ["fetch-permissions"];
const listeMessagesRecus = ["get-permissions"];

const AdminListePermissions = () => {
    const instanceName = "AdminListePermissions";

    const [permissions, setPermissions] = useState([]);
    const [controller] = useState(appInstance.getController());


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
        <div className="liste-permissions layout-content--full">
            <div className="liste-permissions--card">
                <h2>Liste des permissions</h2>
            </div>

            {/* test with false data */}
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
                        {permissions.map((permission, index) => (
                            <tr key={index}>
                                <td>{permission.id}</td>
                                <td>{permission.label}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminListePermissions;
