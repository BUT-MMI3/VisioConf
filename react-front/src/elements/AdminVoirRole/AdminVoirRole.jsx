import "./AdminVoirRole.scss";
import {useEffect, useRef, useState} from "react";
import {appInstance} from "../../controller/index.js";
import {useLocation, useNavigate} from "react-router-dom";
import LinkTo from "../LinkTo/LinkTo.jsx";
import FeatherIcon from "feather-icons-react";
import {useToasts} from "../Toasts/ToastContext.jsx";

const listeMessagesEmis = ["admin_demande_role_details"];
const listeMessagesRecus = ["admin_role_details"];

const AdminVoirRole = () => {
    const location = useLocation();
    // url splitted = ['', 'admin', 'roles', ':id', 'view']
    const id = location.pathname.split("/")[3];
    const navigate = useNavigate();
    const {pushToast} = useToasts();

    const [role, setRole] = useState(undefined);

    const controller = useRef(appInstance.getController()).current;

    const instanceRef = useRef({
        instanceName: "AdminVoirRole",
        traitementMessage: (msg) => {
            console.log("Received data:", msg);
            if (msg && msg.admin_role_details) {
                if(msg.admin_role_details.success){
                    console.log("Role trouvé:", msg.admin_role_details.role);
                    setRole(msg.admin_role_details.role || {});
                }else {
                    pushToast({
                        title: "Erreur",
                        message: "Erreur lors de la récupération du rôle",
                        type: "error",
                    });
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
        <div className="voir-utilisateur layout-content--full">
            <div className="voir-utilisateur--card">
                <h2>Voir un rôle</h2>
            </div>
            <div className={"voir-utilisateur--tools"}>
                <LinkTo to="/admin/roles" className="voir-utilisateur--back">
                    <FeatherIcon icon="arrow-left" size={20}/>
                    <span>Retour</span>
                </LinkTo>
            </div>

            {role && (
                <>
                    <div className="voir-utilisateur--content">
                        <div className="voir-utilisateur--content--card">
                            <h3>Informations du rôle</h3>
                            <div className="voir-utilisateur--content--card--content">
                                <div className="voir-utilisateur--content--card--content--row">
                                    <span>Label : </span>
                                    <span>{role.role_label}</span>
                                </div>
                                <div className="voir-utilisateur--content--card--content--row">
                                    <span>UUID : </span>
                                    <span>{role.role_uuid}</span>
                                </div>
                                <div className="voir-utilisateur--content--card--content--row">
                                    <span>Permissions : </span>
                                    <span>{role.role_permissions.join(", ")}</span>
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
