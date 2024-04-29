import "./AdminAjouterRole.scss";
import {useEffect, useRef, useState} from "react";
import {appInstance} from "../../controller/index.js";
import {useNavigate} from "react-router-dom";
import LinkTo from "../LinkTo/LinkTo.jsx";
import FeatherIcon from "feather-icons-react";
import {useToasts} from "../Toasts/ToastContext.jsx";

const listeMessagesEmis = ["admin_ajouter_role"];
const listeMessagesRecus = ["admin_role_cree"];

const AdminAjouterRole = () => {
    const navigate = useNavigate();
    const {pushToast} = useToasts();

    const [label, setLabel] = useState("");

    const controller = useRef(appInstance.getController()).current;

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!label) {
            pushToast({
                title: "Erreur",
                message: "Veuillez remplir tous les champs obligatoires.",
                type: "error",
            });
            return;
        }

        const roleData = {
            role_label: label,
        };
        controller.send(instanceRef.current, {"admin_ajouter_role": {roleData: roleData}});
    };

    const instanceRef = useRef({
        instanceName: "AdminAjouterRole", traitementMessage: (msg) => {
            console.log("Received data:", msg);
            if (msg && msg.admin_role_cree) {
                if (msg.admin_role_cree.success) {
                    pushToast({
                        title: "Succès", message: "Rôle créé avec succès !", type: "success",
                    })
                    navigate(`/admin/roles/${msg.admin_role_cree.role._id}/view`);
                    console.log("Rôle créé avec succès !", msg.admin_role_cree.role);
                } else {
                    pushToast({
                        title: "Erreur", message: "Erreur lors de la création du rôle", type: "error",
                    });

                }
            }
        },
    });

    useEffect(() => {
        controller.subscribe(instanceRef.current, listeMessagesEmis, listeMessagesRecus);


        return () => {
            controller.unsubscribe(instanceRef.current, listeMessagesEmis, listeMessagesRecus);
        };
    }, []);


    return (<div className="ajouter-role layout-content--full">
        <div className="ajouter-role--card">
            <h2>Ajouter un rôle</h2>
        </div>

        <div className={"ajouter-role--tools"}>
            <LinkTo to="/admin/roles" className="ajouter-role--back">
                <FeatherIcon icon="arrow-left" size={20}/>
                <span>Retour</span>
            </LinkTo>
        </div>

        <form onSubmit={handleSubmit} className={"ajouter-role-form"}>
            <label className={"ajouter-role-label"} style={{width: '100%'}}>
                <span>Les champs marqués d'une (<p>*</p>) sont obligatoires.</span>
            </label>
            <label className={"ajouter-role-label"}>
                <h4>Nom du rôle : <p>*</p></h4>
                <input type="text" placeholder={"Utilisateur"} value={label}
                       onChange={(e) => setLabel(e.target.value)} required/>
            </label>
            <button type="submit">Créer le rôle</button>
        </form>
    </div>);
};

export default AdminAjouterRole;
