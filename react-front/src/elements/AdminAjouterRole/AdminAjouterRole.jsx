import "./AdminAjouterRole.scss";
import {useEffect, useRef, useState} from "react";
import {appInstance} from "../../controller/index.js";
import {useNavigate} from "react-router-dom";
import LinkTo from "../LinkTo/LinkTo.jsx";
import FeatherIcon from "feather-icons-react";
import {toast} from "react-toastify";

const listeMessagesEmis = ["admin_ajouter_role", "admin_demande_liste_permissions"];
const listeMessagesRecus = ["admin_role_cree", "admin_liste_permissions"];

const AdminAjouterRole = () => {
    const navigate = useNavigate();

    const [label, setLabel] = useState("");
    const [permissions, setPermissions] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    const controller = useRef(appInstance.getController()).current;

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!label || selectedPermissions.length === 0) {
            toast.error("Veuillez remplir tous les champs obligatoires");
            return;
        }

        const roleData = {
            role_label: label,
            role_permissions: selectedPermissions,
        };
        controller.send(instanceRef.current, {"admin_ajouter_role": {roleData: roleData}});
    };

    const handlePermissionChange = (permissionId) => {
        const newSelection = selectedPermissions.includes(permissionId)
            ? selectedPermissions.filter(id => id !== permissionId)
            : [...selectedPermissions, permissionId];
        setSelectedPermissions(newSelection);
    };

    const instanceRef = useRef({
        instanceName: "AdminAjouterRole", traitementMessage: (msg) => {
            console.log("Received data:", msg);
            if (msg && msg.admin_role_cree) {
                if (msg.admin_role_cree.success) {
                    toast.success("Rôle créé avec succès !")
                    navigate(`/admin/roles/${msg.admin_role_cree.role._id}/view`);
                    console.log("Rôle créé avec succès !", msg.admin_role_cree.role);
                } else {
                    toast.error("Erreur lors de la création du rôle");
                }
            } else if (msg && msg.admin_liste_permissions) {
                if (msg.admin_liste_permissions.success) {
                    setPermissions(msg.admin_liste_permissions.permissions || []);
                } else {
                    toast.error("Erreur lors de la récupération des permissions");
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
    }, []);


    return (<div className="ajouter-role layout-content--full">
        <div className="ajouter-role--card">
            <h2>Ajouter un rôle</h2>
        </div>

        <div className={"ajouter-role--tools"}>
            <button onClick={() => navigate(-1)} className="ajouter-role--back" style={{cursor: 'pointer'}}>
                <FeatherIcon icon="arrow-left" size={20}/>
                <span>Retour</span>
            </button>
        </div>

        <form onSubmit={handleSubmit} className={"ajouter-role-form"}>
            <label className={"ajouter-role-label"} style={{width: '100%'}}>
                <span>Les champs marqués d&apos;une (<p>*</p>) sont obligatoires.</span>
            </label>
            <label className={"ajouter-role-label"}>
                <h4>Nom du rôle : <p>*</p></h4>
                <input type="text" placeholder={"Rôle"} value={label}
                       onChange={(e) => setLabel(e.target.value)} required/>
            </label>
            <label className={"ajouter-role-label w-100"}>
                <h4>Permissions : <p>*</p></h4>
                <div className={"fc ajouter-role-chechboxes"}>
                    {permissions.map(permission => (
                        <label key={permission._id} className="checkbox-label">
                            <input type="checkbox" checked={selectedPermissions.includes(permission._id)}
                                   onChange={() => handlePermissionChange(permission._id)}/>
                            {permission.permission_label}
                        </label>
                    ))}
                </div>
            </label>
            <button type="submit">Créer le rôle</button>
        </form>
    </div>);
};

export default AdminAjouterRole;
