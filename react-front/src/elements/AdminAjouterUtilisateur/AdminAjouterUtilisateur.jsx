import "./AdminAjouterUtilisateur.scss";
import {useEffect, useRef, useState} from "react";
import {appInstance} from "../../controller/index.js";
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import LinkTo from "../LinkTo/LinkTo.jsx";
import FeatherIcon from "feather-icons-react";
import {redirect} from "react-router-dom";
import {useToasts} from "../Toasts/ToastContext.jsx";

const listeMessagesEmis = ["admin_ajouter_utilisateur"];
const listeMessagesRecus = ["admin_utilisateur_cree"];

const AdminAjouterUtilisateur = () => {
    const navigate = useNavigate();
    const {pushToast} = useToasts();

    const [userFirstname, setUserFirstname] = useState("");
    const [userLastname, setUserLastname] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPhone, setUserPhone] = useState("");
    const [userJob, setUserJob] = useState("");
    const [message, setMessage] = useState("");

    const controller = useRef(appInstance.getController()).current;

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!userEmail || !userFirstname || !userLastname) {
            setMessage("Please fill in all required fields.");
            return;
        }

        const userData = {
            user_firstname: userFirstname,
            user_lastname: userLastname,
            user_email: userEmail,
            user_phone: userPhone,
            user_job: userJob,
        };
        controller.send(instanceRef.current, { "admin_ajouter_utilisateur": {userData: userData} });
    };

    const instanceRef = useRef({
        instanceName: "AdminAjouterUtilisateur",
        traitementMessage: (msg) => {
            console.log("Received data:", msg);
            if (msg && msg.admin_utilisateur_cree) {
                pushToast({
                    title: "Succès",
                    message: "Compte créé avec succès !",
                    type: "success",
                })
                setMessage("Utilisateur créé avec succès ! ouais");
                navigate(`/admin/users/${msg.admin_utilisateur_cree.newUser._id}/view`);
                console.log("Utilisateur créé avec succès !", msg.admin_utilisateur_cree.newUser);
            }
        },
    });

    useEffect(() => {
        controller.subscribe(instanceRef.current, listeMessagesEmis, listeMessagesRecus);


        return () => {
            controller.unsubscribe(instanceRef.current, listeMessagesEmis, listeMessagesRecus);
        };
    }, []);


    return (
        <div className="ajouter-utilisateur layout-content--full">
            <div className="ajouter-utilisateur--card">
                <h2>Ajouter un utilisateur</h2>
            </div>

            <div className={"ajouter-utilisateur--tools"}>
                <LinkTo to="/admin/users" className="ajouter-utilisateur--back">
                    <FeatherIcon icon="arrow-left" size={20}/>
                    <span>Retour</span>
                </LinkTo>
            </div>

            <form onSubmit={handleSubmit} className={"ajouter-utilisateur-form"}>
                <label className={"ajouter-utilisateur-label"} style={{width:'100%'}}>
                    <span>Les champs marqués d'une (<p>*</p>) sont obligatoires.</span>
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
                <label style={{flexDirection: "column"}}>
                    <h4>Permissions additionnelles</h4>
                    <span>
                        L'utilisateur héritera des permissions selon les groupes et rôles associés.
                        Vous pourrez associer des permissions additionnelles plus tard via le module "Attribuer une permission".
                    </span>
                </label>
                <button type="submit">Créer l'utilisateur</button>
                {message && <p>{message}</p>}
            </form>
        </div>
    );
};

export default AdminAjouterUtilisateur;
