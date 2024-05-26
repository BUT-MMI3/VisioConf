import "./AdminVoirRole.scss";
import {useEffect, useRef, useState} from "react";
import {appInstance} from "../../controller/index.js";
import {useLocation, useNavigate} from "react-router-dom";
import LinkTo from "../LinkTo/LinkTo.jsx";
import FeatherIcon from "feather-icons-react";
import {toast} from "react-toastify";

const listeMessagesEmis = ["admin_demande_role_details"];
const listeMessagesRecus = ["admin_role_details"];

const AdminVoirRole = () => {
    const location = useLocation();
    // url splitted = ['', 'admin', 'roles', ':id', 'view']
    const id = location.pathname.split("/")[3];
    const navigate = useNavigate();

    const [role, setRole] = useState(undefined);

    const controller = useRef(appInstance.getController()).current;

    const instanceRef = useRef({
        instanceName: "AdminVoirRole",
        traitementMessage: (msg) => {
            console.log("Received data:", msg);
            if (msg && msg.admin_role_details) {
                if (msg.admin_role_details.success) {
                    console.log("Role trouvé:", msg.admin_role_details.role);
                    setRole(msg.admin_role_details.role || {});
                } else {
                    toast.error("Erreur lors de la récupération du rôle", {theme: "colored", icon: "🚫"});
                }
            }
        },
    });

    useEffect(() => {
        controller.subscribe(instanceRef.current, listeMessagesEmis, listeMessagesRecus);

        controller.send(instanceRef.current, {"admin_demande_role_details": {roleId: id}});

        return () => {
            controller.unsubscribe(instanceRef.current, listeMessagesEmis, listeMessagesRecus);
        };
    }, []);


    return (
        <div className="voir-role layout-content--full">
            <div className="voir-role--card">
                <h2>Voir un rôle</h2>
            </div>
            <div className={"voir-role--tools"}>
                <button onClick={() => navigate(-1)} className="voir-role--back" style={{cursor: 'pointer'}}>
                    <FeatherIcon icon="arrow-left" size={20}/>
                    <span>Retour</span>
                </button>
            </div>

            {role && (
                <>
                    <div className="voir-role--content">
                        <div className="voir-role--content--card">
                            <h3>Informations du rôle</h3>
                            <div className="voir-role--content--card--content">
                                <div className="voir-role--content--card--content--row">
                                    <span>Label : </span>
                                    <span>{role.role_label}</span>
                                </div>
                                <div className="voir-role--content--card--content--row">
                                    <span>UUID : </span>
                                    <span>{role.role_uuid}</span>
                                </div>
                                <div className="voir-role--content--card--content--row">
                                    <span>Permissions : </span>
                                    <span>{role.role_permissions.map(p => p.permission_label).join(", ")}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

        </div>
    );
};

export default AdminVoirRole;
