import "./NoyauAnnuaire.scss";
import {useEffect, useRef, useState} from "react";
import {appInstance} from "../../controller/index.js";
import FeatherIcon from "feather-icons-react";
import {useModal} from "../Modale/ModaleContext.jsx";
import {toast} from "react-toastify";

const listeMessagesEmis = ["demande_annuaire", "demande_info_utilisateur"];
const listeMessagesRecus = ["annuaire", "info_utilisateur"];

const NoyauAnnuaire = () => {
    const {newModal} = useModal();

    const [utilisateurs, setUtilisateurs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const controller = useRef(appInstance.getController()).current;

    const instanceRef = useRef({
        instanceName: "NoyauAnnuaire",
        traitementMessage: (msg) => {
            console.log("Received data:", msg);
            if (msg && msg.annuaire) {
                if (msg.annuaire.success) {
                    setUtilisateurs(msg.annuaire.annuaire || []);
                } else {
                    toast.error("Erreur lors de la récupération de l'annuaire", {theme: "colored", icon:"🚫"});
                }
            } else if (msg && msg.info_utilisateur) {
                if (msg.info_utilisateur.success) {
                    newModal({
                        title: "Informations utilisateur",
                        htmlContent: (
                            <div className={"profile-modale"}>
                                <div className={"profile-modale--bar"}>
                                    <div className={"fr g0-5"}>
                                        <img src={msg.info_utilisateur.user.user_picture} alt="profile"/>
                                        <div>
                                            <h3>{msg.info_utilisateur.user.user_firstname} {msg.info_utilisateur.user.user_lastname}</h3>
                                            <p className={"o0-5"}>{msg.info_utilisateur.user.user_job}</p>
                                        </div>
                                    </div>

                                    <div className={"annuaire--actions"}>
                                        <button>
                                            <FeatherIcon icon={"message-circle"} size={20}/>
                                        </button>
                                        <button>
                                            <FeatherIcon icon={"phone"} size={20}/>
                                        </button>
                                        <button>
                                            <FeatherIcon icon={"video"} size={20}/>
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <h3>Informations</h3>
                                        <p className={"o0-5"}>{msg.info_utilisateur.user.user_desc}</p>
                                    </div>
                                    <div className={"info"}>
                                        <h3>Prénom</h3>
                                        <p className={"o0-5"}>{msg.info_utilisateur.user.user_firstname}</p>
                                    </div>
                                    <div className={"info"}>
                                        <h3>Nom</h3>
                                        <p className={"o0-5"}>{msg.info_utilisateur.user.user_lastname}</p>
                                    </div>
                                    <div className={"info"}>
                                        <h3>Email</h3>
                                        <p className={"o0-5"}>{msg.info_utilisateur.user.user_email}</p>
                                    </div>
                                    <div className={"info"}>
                                        <h3>Téléphone</h3>
                                        <p className={"o0-5"}>{msg.info_utilisateur.user.user_phone}</p>
                                    </div>
                                    <div className={"info"}>
                                        <h3>Compte créé le</h3>
                                        <p className={"o0-5"}>{msg.info_utilisateur.user.user_date_create}</p>
                                    </div>
                                    <div className={"info"}>
                                        <h3>Dernière connexion</h3>
                                        <p className={"o0-5"}>{msg.info_utilisateur.user.user_last_connection}</p>
                                    </div>
                                    <div className={"info"}>
                                        <h3>Rôles</h3>
                                        <div className={"fr g0-5"}>
                                            {msg.info_utilisateur.user.user_roles.map((role, index) => (
                                                <p key={index} style={{
                                                    backgroundColor: "#223A6A",
                                                    color: "white",
                                                    padding: '0.3rem 0.8rem',
                                                    fontSize: '0.8rem',
                                                    whiteSpace: "nowrap",
                                                    borderRadius: '4rem'
                                                }}>
                                                    {role}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ),
                    });
                } else {
                    toast.error("Erreur lors de la récupération des informations de l'utilisateur", {theme: "colored", icon:"🚫"});
                }
            }
        },
    });

    useEffect(() => {
        controller.subscribe(instanceRef.current, listeMessagesEmis, listeMessagesRecus);

        controller.send(instanceRef.current, {"demande_annuaire": {}});

        return () => {
            controller.unsubscribe(instanceRef.current, listeMessagesEmis, listeMessagesRecus);
        };
    }, []);

    const handleUserClick = (user) => {
        console.log("User clicked", user);
        controller.send(instanceRef.current, {"demande_info_utilisateur": {user_uuid: user.user_uuid}});
    }

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredUtilisateurs = utilisateurs.filter(user => {
        return (
            user.user_firstname.toLowerCase().includes(searchTerm) ||
            user.user_lastname.toLowerCase().includes(searchTerm) ||
            user.user_job.toLowerCase().includes(searchTerm) ||
            (user._id ? user._id.toLowerCase().includes(searchTerm) : false)
        );
    });

    return (
        <div className="annuaire layout-content--full">
            <div className="annuaire--card">
                <h2>Annuaire</h2>
            </div>

            <div className="annuaire--tools">
                <div className={"annuaire--tools--search"}>
                    <FeatherIcon icon="search" size={20}/>
                    <input type="search" placeholder={"Rechercher"} onChange={handleSearchChange}/>
                </div>
            </div>

            {/* test with false data */}
            <div className="annuaire--container">

                {filteredUtilisateurs.map((user, index) => (
                    <div className={"annuaire--profile-card"} key={index}>
                        <img src={user.user_picture} alt="profile"/>
                        <FeatherIcon icon={"info"} className={"info"} size={20} onClick={() => handleUserClick(user)}/>
                        <h3>{user.user_firstname} {user.user_lastname}</h3>
                        <p>{user.user_job}</p>
                        <div className="annuaire--actions">
                            <button>
                                <FeatherIcon icon={"message-circle"} size={20}/>
                            </button>
                            <button>
                                <FeatherIcon icon={"phone"} size={20}/>
                            </button>
                            <button>
                                <FeatherIcon icon={"video"} size={20}/>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NoyauAnnuaire;
