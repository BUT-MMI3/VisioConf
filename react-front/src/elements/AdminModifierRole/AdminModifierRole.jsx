import "./AdminModifierRole.scss";
import { useEffect, useRef, useState } from "react";
import { appInstance } from "../../controller/index.js";
import { useNavigate, useParams } from "react-router-dom";
import LinkTo from "../LinkTo/LinkTo.jsx";
import FeatherIcon from "feather-icons-react";
import { useToasts } from "../Toasts/ToastContext.jsx";

const listeMessagesEmis = ["admin_demande_role_details", "admin_modifier_role", "admin_demande_liste_permissions"];
const listeMessagesRecus = ["admin_role_details", "admin_role_modifie", "admin_liste_permissions"];

const AdminModifierRole = () => {
    const roleId = location.pathname.split("/")[3];
    const navigate = useNavigate();
    const { pushToast } = useToasts();

    const [label, setLabel] = useState("");
    const [permissions, setPermissions] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    const controller = useRef(appInstance.getController()).current;

    useEffect(() => {
        controller.subscribe(instanceRef.current, listeMessagesEmis, listeMessagesRecus);

        controller.send(instanceRef.current, { "admin_demande_liste_permissions": {} });

        return () => {
            controller.unsubscribe(instanceRef.current, listeMessagesEmis, listeMessagesRecus);
        };
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!label || selectedPermissions.length === 0) {
            pushToast({
                title: "Erreur",
                message: "Veuillez remplir tous les champs obligatoires.",
                type: "error",
            });
            return;
        }

        const roleData = {
            role_id: roleId,
            role_label: label,
            role_permissions: selectedPermissions,
        };
        controller.send(instanceRef.current, { "admin_modifier_role": { roleData } });
    };

    const handlePermissionChange = (permissionId) => {
        const newSelection = selectedPermissions.includes(permissionId)
            ? selectedPermissions.filter(id => id !== permissionId)
            : [...selectedPermissions, permissionId];
        setSelectedPermissions(newSelection);
    };

    const instanceRef = useRef({
        instanceName: "AdminModifierRole",
        traitementMessage: (msg) => {
            console.log("Received data:", msg);
            if (msg.admin_role_details) {
                if (msg.admin_role_details.success) {
                    console.log(msg.admin_role_details)
                    setLabel(msg.admin_role_details.role.role_label);
                    setSelectedPermissions(msg.admin_role_details.role.role_permissions.map(p => p._id));
                } else {
                    pushToast({
                        title: "Erreur",
                        message: msg.admin_role_details.message || "Erreur lors de la récupération des détails du rôle",
                        type: "error",
                    });
                }
            } else if (msg.admin_role_modifie) {
                if (msg.admin_role_modifie.success) {
                    pushToast({
                        title: "Succès",
                        message: "Rôle modifié avec succès",
                        type: "success",
                    });
                    navigate(`/admin/roles/${roleId}/view`);
                } else {
                    pushToast({
                        title: "Erreur",
                        message: msg.admin_role_modifie.message || "Erreur lors de la modification du rôle",
                        type: "error",
                    });
                }
            }
            else if(msg.admin_liste_permissions){
                setPermissions(msg.admin_liste_permissions.permissions || []);
                controller.send(instanceRef.current, { "admin_demande_role_details": { roleId } });
            }
        }
    });

    return (
        <div className="modifier-role layout-content--full">
            <div className="modifier-role--card">
                <h2>Modifier un rôle</h2>
            </div>

            <div className="modifier-role--tools">
                <LinkTo to="/admin/roles" className="modifier-role--back">
                    <FeatherIcon icon="arrow-left" size={20}/>
                    <span>Retour</span>
                </LinkTo>
            </div>

            <form onSubmit={handleSubmit} className="modifier-role-form">
                <label className="modifier-role-label">
                    <h4>Nom du rôle : <p>*</p></h4>
                    <input type="text" placeholder="Nom du rôle" value={label} onChange={(e) => setLabel(e.target.value)} required/>
                </label>
                <label className="modifier-role-label w-100">
                    <h4>Permissions :</h4>
                    <div className="fc modifier-role-checkboxes">
                        {permissions.map(permission => (
                            <label key={permission._id} className="checkbox-label">
                                <input type="checkbox" checked={selectedPermissions.includes(permission._id)} onChange={() => handlePermissionChange(permission._id)} />
                                {permission.permission_label}
                            </label>
                        ))}
                    </div>
                </label>
                <button type="submit" className="modifier-role-submit">Modifier le rôle</button>
            </form>
        </div>
    );
};

export default AdminModifierRole;
