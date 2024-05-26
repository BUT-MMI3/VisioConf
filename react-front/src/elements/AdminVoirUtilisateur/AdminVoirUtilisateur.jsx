import "./AdminVoirUtilisateur.scss";
import {useEffect, useRef, useState} from "react";
import {appInstance} from "../../controller/index.js";
import {useLocation, useNavigate} from "react-router-dom";
import LinkTo from "../LinkTo/LinkTo.jsx";
import FeatherIcon from "feather-icons-react";
import {toast} from "react-toastify";

const listeMessagesEmis = ["admin_demande_utilisateur_details"];
const listeMessagesRecus = ["admin_utilisateur_details"];

const AdminVoirUtilisateur = () => {
    const location = useLocation();
    // url splitted = ['', 'admin', 'users', ':id', 'view']
    const id = location.pathname.split("/")[3];
    const navigate = useNavigate();

    const [user, setUser] = useState(undefined);

    const controller = useRef(appInstance.getController()).current;

    const instanceRef = useRef({
        instanceName: "AdminVoirUtilisateur",
        traitementMessage: (msg) => {
            console.log("Received data:", msg);
            if (msg && msg.admin_utilisateur_details) {
                if (msg.admin_utilisateur_details.success) {
                    console.log("Utilisateur trouvé:", msg.admin_utilisateur_details.user);
                    setUser(msg.admin_utilisateur_details.user || {});
                } else {
                    toast.error("Erreur lors de la récupération de l'utilisateur", {theme: "colored", icon: "🚫"});
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
        <div className="voir-utilisateur layout-content--full">
            <div className="voir-utilisateur--card">
                <h2>Voir un utilisateur</h2>
            </div>
            <div className={"voir-utilisateur--tools"}>
                <button onClick={() => navigate(-1)} className="voir-utilisateur--back" style={{cursor: 'pointer'}}>
                    <FeatherIcon icon="arrow-left" size={20}/>
                    <span>Retour</span>
                </button>
            </div>

            {user && (
                <>
                    <div className="voir-utilisateur--content">
                        <div className="voir-utilisateur--content--card">
                        <h3>Informations de l'utilisateur</h3>
                            <div className="voir-utilisateur--content--card--content">
                                <div className="voir-utilisateur--content--card--content--row">
                                    <span>Photo : </span>
                                    <img src={user.user_picture} alt="User" style={{width: "100px"}}/>
                                </div>
                                <div className="voir-utilisateur--content--card--content--row">
                                    <span>Prénom : </span>
                                    <span>{user.user_firstname}</span>
                                </div>
                                <div className="voir-utilisateur--content--card--content--row">
                                    <span>Nom : </span>
                                    <span>{user.user_lastname}</span>
                                </div>
                                <div className="voir-utilisateur--content--card--content--row">
                                    <span>Email : </span>
                                    <a href={`mailto:${user.user_email}`}
                                       className="voir-utilisateur--content--card--content--row--email">
                                        {user.user_email}
                                    </a>
                                </div>
                                <div className="voir-utilisateur--content--card--content--row">
                                    <span>Téléphone : </span>
                                    <span>{user.user_phone}</span>
                                </div>
                                <div className="voir-utilisateur--content--card--content--row">
                                    <span>Job : </span>
                                    <span>{user.user_job}</span>
                                </div>
                                <div className="voir-utilisateur--content--card--content--row">
                                    <span>Date de création : </span>
                                    <span>{new Date(user.user_date_create).toLocaleString()}</span>
                                </div>
                                <div className="voir-utilisateur--content--card--content--row">
                                    <span>Rôles : </span>
                                    <span className={"fr g0-5"}>{user.user_roles.map((role, index) => (
                                        <p key={index} style={{
                                            backgroundColor: "#223A6A",
                                            color: "white",
                                            padding: '0.3rem 0.8rem',
                                            fontSize: '0.8rem',
                                            whiteSpace: "nowrap",
                                            borderRadius: '4rem'
                                        }}>
                                            {role.role_label}
                                        </p>
                                    ))}</span>

                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

        </div>
    );
};

export default AdminVoirUtilisateur;
