import "./AdminModifierUtilisateur.scss";
import {useEffect, useRef, useState} from "react";
import {appInstance} from "../../controller/index.js";
import {useLocation, useNavigate} from "react-router-dom";
import LinkTo from "../LinkTo/LinkTo.jsx";
import FeatherIcon from "feather-icons-react";
import {toast} from "react-toastify";

const listeMessagesEmis = ["admin_modifier_utilisateur", "admin_demande_utilisateur_details"];
const listeMessagesRecus = ["admin_utilisateur_modifie", "admin_utilisateur_details"];

const AdminModifierUtilisateur = () => {
    const location = useLocation();
    // url splitted = ['', 'admin', 'users', ':id', 'view']
    const id = location.pathname.split("/")[3];
    const navigate = useNavigate();

    const [userFirstname, setUserFirstname] = useState("");
    const [userLastname, setUserLastname] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPhone, setUserPhone] = useState("");
    const [userJob, setUserJob] = useState("");
    const [userStatus, setUserStatus] = useState("waiting");

    const controller = useRef(appInstance.getController()).current;


    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!userEmail || !userFirstname || !userLastname) {
            toast.error("Veuillez remplir tous les champs obligatoires.", {theme: "colored", icon: "🚫"})
            return;
        }

        const userData = {
            user_firstname: userFirstname,
            user_lastname: userLastname,
            user_email: userEmail,
            user_phone: userPhone,
            user_job: userJob,
            user_status: userStatus,
        };
        controller.send(instanceRef.current, {"admin_modifier_utilisateur": {userData: userData}});
    };

    const instanceRef = useRef({
        instanceName: "AdminModifierUtilisateur",
        traitementMessage: (msg) => {
            console.log("Received data:", msg);
            if (msg && msg.admin_utilisateur_modifie) {
                if (msg.admin_utilisateur_modifie.success) {
                    toast.success("Utilisateur modifié avec succès !", {theme: "colored", icon: "🚀"})
                    navigate(`/admin/users/${msg.admin_utilisateur_modifie.editedUser._id}/view`);
                    console.log("Utilisateur modifié avec succès !", msg.admin_utilisateur_modifie.editedUser);
                } else {
                    toast.error("Erreur lors de la modification de l'utilisateur", {theme: "colored", icon: "🚫"})
                }
            } else if (msg && msg.admin_utilisateur_details) {
                if (msg.admin_utilisateur_details.success) {
                    console.log("Utilisateur trouvé:", msg.admin_utilisateur_details.user);
                    setUserFirstname(msg.admin_utilisateur_details.user.user_firstname || "");
                    setUserLastname(msg.admin_utilisateur_details.user.user_lastname || "");
                    setUserEmail(msg.admin_utilisateur_details.user.user_email || "");
                    setUserPhone(msg.admin_utilisateur_details.user.user_phone || "");
                    setUserJob(msg.admin_utilisateur_details.user.user_job || "");
                    setUserStatus(msg.admin_utilisateur_details.user.user_status || "");
                } else {
                    toast.error("Erreur lors de la récupération des informations de l'utilisateur", {theme: "colored", icon: "🚫"})
                }
            }
        },
    });

    useEffect(() => {
        controller.subscribe(instanceRef.current, listeMessagesEmis, listeMessagesRecus);

        controller.send(instanceRef.current, {"admin_demande_utilisateur_details": {userId: id}});

        return () => {
            controller.unsubscribe(instanceRef.current, listeMessagesEmis, listeMessagesRecus);
        };
    }, []);


    return (
        <div className="ajouter-utilisateur layout-content--full">
            <div className="ajouter-utilisateur--card">
                <h2>Modifier un utilisateur</h2>
            </div>

            <div className={"ajouter-utilisateur--tools"}>
                <LinkTo to="/admin/users" className="ajouter-utilisateur--back">
                    <FeatherIcon icon="arrow-left" size={20}/>
                    <span>Retour</span>
                </LinkTo>
            </div>

            <form onSubmit={handleSubmit} className={"ajouter-utilisateur-form"}>
                <label className={"ajouter-utilisateur-label"} style={{width: '100%'}}>
                    <span>Les champs marqués d&apos;une (<p>*</p>) sont obligatoires.</span>
                </label>
                <label className={"ajouter-utilisateur-label"}>
                    <h4>Prénom : <p>*</p></h4>
                    <input type="text" placeholder={"John"} value={userFirstname}
                           onChange={(e) => setUserFirstname(e.target.value)} required/>
                </label>
                <label className={"ajouter-utilisateur-label"}>
                    <h4>Nom : <p>*</p></h4>
                    <input type="text" placeholder={"Doe"} value={userLastname}
                           onChange={(e) => setUserLastname(e.target.value)} required/>
                </label>
                <label className={"ajouter-utilisateur-label"}>
                    <h4>Email : <p>*</p></h4>
                    <input type="email" placeholder={"john@doe.com"} value={userEmail}
                           onChange={(e) => setUserEmail(e.target.value)} required/>
                </label>
                <label className={"ajouter-utilisateur-label"}>
                    <h4>Téléphone : <p>*</p></h4>
                    <input type="tel" placeholder={"0607080910"} value={userPhone}
                           onChange={(e) => setUserPhone(e.target.value)} required/>
                </label>
                <label className={"ajouter-utilisateur-label"} style={{width: '100%'}}>
                    <h4>Job : <p>*</p></h4>
                    <textarea type="text" placeholder={"Agent"} value={userJob}
                              onChange={(e) => setUserJob(e.target.value)} required/>
                </label>
                <label className={"ajouter-utilisateur-label"}>
                    <h4>Statut : <p>*</p></h4>
                    <select value={userStatus} onChange={(e) => setUserStatus(e.target.value)}>
                        <option value="waiting">En attente</option>
                        <option value="active">Actif</option>
                        <option value="banned">Banni</option>
                    </select>
                </label>
                <label style={{flexDirection: "column"}}>
                    <h4>Permissions additionnelles</h4>
                    <span>
                        L&apos;utilisateur héritera des permissions selon les groupes et rôles associés.
                        Vous pourrez associer des permissions additionnelles plus tard via le module &quot;Attribuer une permission&quot;.
                    </span>
                </label>
                <button type="submit">Modifier l&apos;utilisateur</button>
            </form>
        </div>
    );
};

export default AdminModifierUtilisateur;
