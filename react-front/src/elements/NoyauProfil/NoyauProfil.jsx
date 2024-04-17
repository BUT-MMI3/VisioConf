import {useEffect, useRef, useState} from 'react';
import {appInstance} from "../../controller/index.js";
import "./NoyauProfil.css";

const listeMessageEmis = ["demande_user_info"];
const listeMessageRecus = ["information_user", "connexion_acceptee"];


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
                console.log("Informations utilisateur obtenues sur NoyauProfil");
                setUtilisateur(msg.information_user);
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


    const user = {
        user_uuid: 123456,
        user_firstname: "John",
        user_lastname: "Doe",
        user_job_desc: `Chef de département MMI à l’universite de Toulon.\nÉgalement professeur de développement web.`,
        user_picture: "https://imgv3.fotor.com/images/gallery/a-girl-cartoon-character-with-pink-background-generated-by-cartoon-character-maker-in-Fotor.jpg",
        user_email: "john.doe@example.com",
        user_date_create: Date.now(),
        user_roles: ["Chef de département", "Administration", "Enseignant"],
        user_last_connection: Date.now(),
    };

    return (
        <div className={"fc ai-fs g1"}>
            <h2>Mon profil</h2>
            <div className={"fc ai-fs g0-5"}>
                <h3>À Propos</h3>
                <p className={"ta-l o0-5"}>{user.user_job_desc}</p>
            </div>

            <div className={"fr g1"}>
                <p>
                    Nom
                </p>
                <p className={"o0-5"}>
                    {utilisateur ? utilisateur.user_lastname : "test"}
                </p>
            </div>
            <div className={"fr g1"}>
                <p>
                    Prénom
                </p>
                <p className={"o0-5"}>
                    {user.user_firstname}
                </p>
            </div>
            <div className={"fr g1"}>
                <p>
                    Date de création
                </p>
                <p className={"o0-5"}>
                    {user.user_date_create}
                </p>
            </div>
            <div className={"fr g1"}>
                <p>
                    Email
                </p>
                <p className={"o0-5"}>
                    {user.user_email}
                </p>
            </div>
            <div className={"fr g1"}>
                <p>
                    Rôles
                </p>
                <div className={"fr g0-5"}>
                    {user.user_roles.map((role, index) => (
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
                    ))
                    }
                </div>
            </div>
        </div>
    );
};

export default NoyauProfil;
