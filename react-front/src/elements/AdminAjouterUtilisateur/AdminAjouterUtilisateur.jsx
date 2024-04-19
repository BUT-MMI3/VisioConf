import "./AdminAjouterUtilisateur.scss";
import {useEffect, useRef, useState} from "react";
import {appInstance} from "../../controller/index.js";
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import LinkTo from "../LinkTo/LinkTo.jsx";
import FeatherIcon from "feather-icons-react";
import {redirect} from "react-router-dom";

const listeMessagesEmis = ["admin_ajouter_utilisateur"];
const listeMessagesRecus = ["admin_utilisateur_cree"];

const AdminAjouterUtilisateur = () => {
    const navigate = useNavigate();

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

            <form onSubmit={handleSubmit}>
                <label>
                    Prénom :
                    <input type="text" value={userFirstname} onChange={(e) => setUserFirstname(e.target.value)}
                           required/>
                </label>
                <label>
                    Nom :
                    <input type="text" value={userLastname} onChange={(e) => setUserLastname(e.target.value)} required/>
                </label>
                <label>
                    Email :
                    <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} required/>
                </label>
                <label>
                    Téléphone :
                    <input type="tel" value={userPhone} onChange={(e) => setUserPhone(e.target.value)}/>
                </label>
                <label>
                    Job :
                    <input type="text" value={userJob} onChange={(e) => setUserJob(e.target.value)}/>
                </label>
                <button type="submit">Créer l'utilisateur</button>
                {message && <p>{message}</p>}
            </form>
        </div>
    );
};

export default AdminAjouterUtilisateur;
