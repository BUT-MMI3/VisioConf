import {useEffect, useRef, useState} from 'react';
import {appInstance} from "../../controller/index.js";
import "./NoyauProfil.css";

const listeMessageEmis = ["demande_user_info"];
const listeMessageRecus = ["information_user"];


const NoyauProfil = () => {

    const instanceName = "NoyauProfil";
    const verbose = false;
    const [controller] = useState(appInstance.getController());

    const [utilisateur, setUtilisateur] = useState(null);

    const {current} = useRef({
        instanceName,
        traitementMessage: (msg) => {
            if (verbose || controller.verboseall) console.log(`INFO: (${instanceName}) - traitementMessage - `, msg);

            if (typeof msg.information_user !== "undefined") {
                setUtilisateur(msg.information_user);
                console.log("Informations utilisateur obtenues sur NoyauProfil", msg.information_user);
            } else {
                console.log("Erreur lors du traitement du message :", msg);
            }
        }
    });

    const logIn = async () => {
        if (verbose || controller.verboseall) console.log(`INFO: (${instanceName})`);

        return new Promise((resolve, reject) => {
            try {
                controller.send(current, {"demande_user_info": "information utilisateur"});
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    };

    useEffect(() => {
        controller.subscribe(current, listeMessageEmis, listeMessageRecus);

        return () => {
            controller.unsubscribe(current, listeMessageEmis, listeMessageRecus);
        };
    }, [current, controller]);

    useEffect(() => {
        logIn();
    }, []);

    return (
        <div className={"fc ai-fs g1"} style={{margin:"2rem",}}>
            <div className={"content-profil fr g1"}>
                <div className={"fc g1"}>
                    <h2>Mon profil</h2>
                    {/* Informations utilisateur */}
                    <div className={"fc g1"}>
                        <div className={"fc ai-fs g0-5"}>
                            <h3>À Propos</h3>
                            <p className={"ta-l o0-5"}>{utilisateur && utilisateur.user_desc}</p>
                        </div>

                        {/* Autres informations utilisateur */}
                        <div className={"fr g1"}>
                            <p>Nom :</p>
                            <p className={"o0-5"}>{utilisateur && utilisateur.user_lastname}</p>
                        </div>
                        <div className={"fr g1"}>
                            <p>Prénom :</p>
                            <p className={"o0-5"}>{utilisateur && utilisateur.user_firstname}</p>
                        </div>
                        <div className={"fr g1"}>
                            <p>Date de création :</p>
                            <p className={"o0-5"}>
                                {utilisateur && new Date(utilisateur.user_date_create).toLocaleDateString('fr-FR')}
                            </p>
                        </div>
                        <div className={"fr g1"}>
                            <p>Email :</p>
                            <p className={"o0-5"}>{utilisateur && utilisateur.user_email}</p>
                        </div>
                        <div className={"fr g1"}>
                            <p>Job :</p>
                            <p className={"o0-5"}>{utilisateur && utilisateur.user_job}</p>
                        </div>
                        <div className={"fr g1"}>
                            <p>Rôles</p>
                            <div className={"fr g0-5"}>
                                {utilisateur && utilisateur.user_roles.map((role, index) => (
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
                <div className={"fc g1 ai-c"}>
                    <h2 className={"ta-c"}>Prochainement Modifiable</h2>
                    {/* Image de profil */}
                    <div className={"fr g1"}>
                        {utilisateur && (
                            <img src={utilisateur.user_picture} alt={"Photo de profil"}
                                 style={{width: '100px', height: '100px'}}/>
                        )}
                    </div>

                    {/* Champ d'entrée pour modifier la description */}
                    <div className={"fr g1"}>
                        <input
                            type={"text"}
                            placeholder="votre description"
                            onChange={(e) => setUtilisateur({...utilisateur, user_desc: e.target.value})}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

    export default NoyauProfil;
