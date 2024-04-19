import "./AdminVoirUtilisateur.scss";
import {useEffect, useRef, useState} from "react";
import {appInstance} from "../../controller/index.js";
import {useLocation, useNavigate} from "react-router-dom";
import LinkTo from "../LinkTo/LinkTo.jsx";
import FeatherIcon from "feather-icons-react";
import {useToasts} from "../Toasts/ToastContext.jsx";

const listeMessagesEmis = ["admin_demande_utilisateur_details"];
const listeMessagesRecus = ["admin_utilisateur_details"];

const AdminVoirUtilisateur = () => {
    const location = useLocation();
    // url splitted = ['', 'admin', 'users', ':id', 'view']
    const id = location.pathname.split("/")[3];
    const navigate = useNavigate();
    const {pushToast} = useToasts();

    const [user, setUser] = useState(undefined);

    const controller = useRef(appInstance.getController()).current;

    const instanceRef = useRef({
        instanceName: "AdminVoirUtilisateur",
        traitementMessage: (msg) => {
            console.log("Received data:", msg);
            if (msg && msg.admin_utilisateur_details) {
                if(msg.admin_utilisateur_details.success){
                    console.log("Utilisateur trouvé:", msg.admin_utilisateur_details.user);
                    setUser(msg.admin_utilisateur_details.user || {});
                }else {
                    pushToast({
                        title: "Erreur",
                        message: "Erreur lors de la récupération de l'utilisateur",
                        type: "error",
                    });
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
                <LinkTo to="/admin/users" className="voir-utilisateur--back">
                    <FeatherIcon icon="arrow-left" size={20}/>
                    <span>Retour</span>
                </LinkTo>
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
                                    <span>{user.user_roles.join(", ")}</span>
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
