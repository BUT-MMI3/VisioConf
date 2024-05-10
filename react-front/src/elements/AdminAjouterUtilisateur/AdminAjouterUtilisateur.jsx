import "./AdminAjouterUtilisateur.scss";
import {useEffect, useRef, useState} from "react";
import {appInstance} from "../../controller/index.js";
import {useNavigate} from "react-router-dom";
import LinkTo from "../LinkTo/LinkTo.jsx";
import FeatherIcon from "feather-icons-react";
import {useCollapse} from 'react-collapsed'
import {toast} from "react-toastify";

const listeMessagesEmis = ["admin_ajouter_utilisateur"];
const listeMessagesRecus = ["admin_utilisateur_cree"];

const AdminAjouterUtilisateur = () => {
    const navigate = useNavigate();
    const {getToggleProps, getCollapseProps, isExpanded} = useCollapse()

    const [userFirstname, setUserFirstname] = useState("");
    const [userLastname, setUserLastname] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPhone, setUserPhone] = useState("");
    const [userJob, setUserJob] = useState("");
    const [definePassword, setDefinePassword] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [defineStatus, setDefineStatus] = useState(false);
    const [status, setStatus] = useState("waiting");

    const controller = useRef(appInstance.getController()).current;

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!userEmail || !userFirstname || !userLastname || (definePassword && password !== confirmPassword) || (defineStatus && !status)) {
            toast.error("Veuillez remplir tous les champs obligatoires.", {theme: "colored", icon: "🚫"})
            return;
        }

        const userData = {
            user_firstname: userFirstname,
            user_lastname: userLastname,
            user_email: userEmail,
            user_phone: userPhone,
            user_job: userJob,
            user_password: definePassword ? password : undefined,
            user_status: defineStatus ? status : undefined,
        };
        controller.send(instanceRef.current, {"admin_ajouter_utilisateur": {userData: userData}});
    };

    const instanceRef = useRef({
        instanceName: "AdminAjouterUtilisateur", traitementMessage: (msg) => {
            console.log("Received data:", msg);
            if (msg && msg.admin_utilisateur_cree) {
                if (msg.admin_utilisateur_cree.success) {
                    toast.success("Compte créé avec succès !", {theme: "colored", icon: "🚀"})
                    navigate(`/admin/users/${msg.admin_utilisateur_cree.newUser._id}/view`);
                    console.log("Utilisateur créé avec succès !", msg.admin_utilisateur_cree.newUser);
                } else {
                    toast.error("Erreur lors de la création du compte.", {theme: "colored", icon: "🚫"})
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


    return (<div className="ajouter-utilisateur layout-content--full">
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
                <input type="email" placeholder={"john@doe.com"} value={userEmail} autoComplete={"email"}
                       onChange={(e) => setUserEmail(e.target.value)} required/>
            </label>
            <label className={"ajouter-utilisateur-label"}>
                <h4>Téléphone : <p>*</p></h4>
                <input type="tel" placeholder={"0607080910"} value={userPhone} autoComplete={"tel"}
                       onChange={(e) => setUserPhone(e.target.value)} required/>
            </label>
            <label className={"ajouter-utilisateur-label"} style={{width: '100%'}}>
                <h4>Job : <p>*</p></h4>
                <textarea type="text" placeholder={"Agent"} value={userJob}
                          onChange={(e) => setUserJob(e.target.value)} required/>
            </label>
            <div className={"collapse fc w-100"}>
                <button {...getToggleProps()} className={"expand-button"}>
                    {isExpanded ?
                        <>
                            <span>Masquer les paramètres avancés</span>
                            <FeatherIcon icon="chevron-up" size={20} className={"unexpand-icon"}/>
                        </>
                        :
                        <>
                            <span>Paramètres avancés</span>
                            <FeatherIcon icon="chevron-down" size={20} className={"expand-icon"}/>
                        </>
                    }
                </button>

                <section {...getCollapseProps()}>
                    <div className={"collapse-content"}>
                        <div className={"fc"}>
                            <label className={"ajouter-utilisateur-label"}>
                                <h4>Mot de passe</h4>
                                <div className={"fr ai-c g0-5 "}>
                                    <input
                                        type="checkbox"
                                        checked={definePassword}
                                        onChange={(e) => setDefinePassword(e.target.checked)}
                                        id={"define-password"}
                                    />
                                    <label htmlFor={"define-password"}>Définir le mot de passe maintenant</label>
                                </div>

                            </label>
                            {definePassword && (<div className={"fr g1"}>
                                <label className={"ajouter-utilisateur-label"}>
                                    <h4>Mot de passe : <p>*</p></h4>
                                    <input type="password" placeholder={"Mot de passe"}
                                           value={password}
                                           autoComplete={"new-password"}
                                           onChange={(e) => setPassword(e.target.value)} required/>
                                </label>
                                <label className={"ajouter-utilisateur-label"}>
                                    <h4>Confirmer le mot de passe : <p>*</p></h4>
                                    <input type="password" placeholder={"Confirmer le mot de passe"}
                                           value={confirmPassword}
                                           autoComplete={"new-password"}
                                           onChange={(e) => setConfirmPassword(e.target.value)} required/>
                                </label>
                            </div>)}
                        </div>
                        <br/>
                        <div>
                            <label className={"ajouter-utilisateur-label"}>
                                <h4>Status</h4>
                                <div className={"fr ai-c g0-5 "}>
                                    <input
                                        type="checkbox"
                                        checked={defineStatus}
                                        onChange={(e) => setDefineStatus(e.target.checked)}
                                        id={"define-status"}
                                    />
                                    <label htmlFor={"define-status"}>Définir le status maintenant</label>
                                </div>
                            </label>
                            {defineStatus && (<div className={"fr g1"}>
                                <label className={"ajouter-utilisateur-label"}>
                                    <h4>Status : <p>*</p></h4>
                                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                        <option value={"waiting"}>En attente</option>
                                        <option value={"active"}>Actif</option>
                                        <option value={"banned"}>Banni</option>
                                        <option value={"deleted"}>Supprimé</option>
                                    </select>
                                </label>
                            </div>)}
                        </div>
                    </div>
                </section>
            </div>

            <label style={{flexDirection: "column"}}>
                <h4>Permissions additionnelles</h4>
                <span>
                        L&apos;utilisateur héritera des permissions selon les groupes et rôles associés.
                        Vous pourrez associer des permissions additionnelles plus tard via le module &quot;Attribuer une permission&quot;.
                    </span>
            </label>
            <button type="submit">Créer l&apos;utilisateur</button>
        </form>
    </div>);
};

export default AdminAjouterUtilisateur;
