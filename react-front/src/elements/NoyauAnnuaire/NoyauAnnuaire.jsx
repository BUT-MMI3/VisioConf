import "./NoyauAnnuaire.scss";
import {useEffect, useRef, useState} from "react";
import {appInstance} from "../../controller/index.js";
import FeatherIcon from "feather-icons-react";
import {useModal} from "../Modale/ModaleContext.jsx";
import {useToasts} from "../Toasts/ToastContext.jsx";

const listeMessagesEmis = ["demande_annuaire"];
const listeMessagesRecus = ["annuaire"];

const NoyauAnnuaire = () => {
    const {newModal} = useModal();
    const {pushToast} = useToasts();

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
                    pushToast({
                        title: "Erreur",
                        message: "Erreur lors de la récupération de l'annuaire'",
                        type: "error",
                    });
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
