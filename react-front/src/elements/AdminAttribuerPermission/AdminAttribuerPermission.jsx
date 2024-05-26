import "./AdminAttribuerPermission.scss";
import { useEffect, useRef, useState } from "react";
import { appInstance } from "../../controller/index.js";
import { useNavigate } from "react-router-dom";
import LinkTo from "../LinkTo/LinkTo.jsx";
import FeatherIcon from "feather-icons-react";
import { toast } from "react-toastify";

const listeMessagesEmis = ["admin_demande_liste_permissions", "admin_demande_liste_roles", "admin_attribuer_permission"];
const listeMessagesRecus = ["admin_liste_permissions", "admin_liste_roles", "admin_permission_attribuee"];

const AdminAttribuerPermission = () => {
    const navigate = useNavigate();

    const [selectedRole, setSelectedRole] = useState("");
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    const controller = useRef(appInstance.getController()).current;

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedRole || selectedPermissions.length === 0) {
            toast.error("Veuillez remplir tous les champs obligatoires");
            return;
        }

        const permissionData = {
            role: selectedRole,
            permissions: selectedPermissions,
        };
        controller.send(instanceRef.current, { "admin_attribuer_permission": { permissionData: permissionData } });
    };

    const handlePermissionChange = (permissionId) => {
        const newSelection = selectedPermissions.includes(permissionId)
            ? selectedPermissions.filter(id => id !== permissionId)
            : [...selectedPermissions, permissionId];
        setSelectedPermissions(newSelection);
    };

    const instanceRef = useRef({
        instanceName: "AdminAttribuerPermission", traitementMessage: (msg) => {
            console.log("Received data:", msg);
            if (msg && msg.admin_liste_permissions) {
                if (msg.admin_liste_permissions.success) {
                    setPermissions(msg.admin_liste_permissions.permissions || []);
                } else {
                    toast.error("Erreur lors de la récupération des permissions");
                }
            } else if (msg && msg.admin_liste_roles) {
                if (msg.admin_liste_roles.success) {
                    setRoles(msg.admin_liste_roles.roles || []);
                } else {
                    toast.error("Erreur lors de la récupération des rôles");
                }
            } else if (msg && msg.admin_permission_attribuee) {
                if (msg.admin_permission_attribuee.success) {
                    toast.success("Permissions attribuées avec succès !");
                    navigate(`/admin/roles/${selectedRole}/view`);
                } else {
                    toast.error("Erreur lors de l'attribution des permissions");
                }
            }
        },
    });

    useEffect(() => {
        controller.subscribe(instanceRef.current, listeMessagesEmis, listeMessagesRecus);

        controller.send(instanceRef.current, { "admin_demande_liste_permissions": {} });
        controller.send(instanceRef.current, { "admin_demande_liste_roles": {} });

        return () => {
            controller.unsubscribe(instanceRef.current, listeMessagesEmis, listeMessagesRecus);
        };
    }, []);

    useEffect(() => {
        if (selectedRole) {
            const role = roles.find(r => r._id === selectedRole);
            if (role) {
                setSelectedPermissions(role.role_permissions.map(p => p._id));
            }
        }
    }, [selectedRole, roles]);

    return (
        <div className="ajouter-role layout-content--full">
            <div className="ajouter-role--card">
                <h2>Attribuer des permissions à un rôle</h2>
            </div>

            <div className={"ajouter-role--tools"}>
                <LinkTo to="/admin/roles" className="ajouter-role--back">
                    <FeatherIcon icon="arrow-left" size={20} />
                    <span>Retour</span>
                </LinkTo>
            </div>

            <form onSubmit={handleSubmit} className={"ajouter-role-form"}>
                <label className={"ajouter-role-label"} style={{ width: '100%' }}>
                    <span>Les champs marqués d&apos;une (<p>*</p>) sont obligatoires.</span>
                </label>
                <label className={"ajouter-role-label"}>
                    <h4>Sélectionner un rôle : <p>*</p></h4>
                    <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} required>
                        <option value="" disabled>Choisir un rôle</option>
                        {roles.map(role => (
                            <option key={role._id} value={role._id}>{role.role_label}</option>
                        ))}
                    </select>
                </label>
                <label className={"ajouter-role-label w-100"}>
                    <h4>Permissions : <p>*</p></h4>
                    <div className={"fc ajouter-role-chechboxes"}>
                        {permissions.map(permission => (
                            <label key={permission._id} className="checkbox-label">
                                <input type="checkbox" checked={selectedPermissions.includes(permission._id)}
                                       onChange={() => handlePermissionChange(permission._id)} />
                                {permission.permission_label}
                            </label>
                        ))}
                    </div>
                </label>
                <button type="submit">Attribuer les permissions</button>
            </form>
        </div>
    );
};

export default AdminAttribuerPermission;
