// NoyauProfil.js
import "./NoyauProfil.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { appInstance } from "../../controller/index.js";
import { updateUserDescription, updateUserPicture } from "../../features/session/sessionSlice";


const listeMessageEmis = ["update_profil","update_picture"];
const listeMessageRecus = ["retourne_modification_profil", "retourne_modification_picture"];
const NoyauProfil = () => {
    const session = useSelector((state) => state.session);
    const dispatch = useDispatch();
    const instanceName = "Profil";
    const verbose = true;
    const [controller] = useState(appInstance.getController());
    const { current } = useRef({
        instanceName,
        traitementMessage: (msg) => {
            if (verbose || controller.verboseall) console.log(`INFO: (${instanceName}) - traitementMessage - `, msg);

            if (typeof msg.retourne_modification_profil !== "undefined") {
                if (verbose || controller.verboseall) console.log("Informations profil obtenue", msg.retourne_modification_profil);
                const newDescription = msg.retourne_modification_profil.message;
                setConfirmationMessage("Mise à jour réussie !");
                dispatch(updateUserDescription({ newDescription }));
                setDescription(newDescription);
            } else {
                if (verbose || controller.verboseall) console.log("Erreur lors du traitement du message :", msg);
            }

            if (typeof msg.retourne_modification_picture !== "undefined") {
                if (verbose || controller.verboseall) console.log("Informations profil obtenue", msg.retourne_modification_picture);
                const newPicture = msg.retourne_modification_picture.message;
                setConfirmationMessage("Mise à jour réussie !");
                dispatch(updateUserPicture({ newPicture }));
                setPicture(newPicture);
            } else {
                if (verbose || controller.verboseall) console.log("Erreur lors du traitement du message :", msg);
            }
        }
    });

    useEffect(() => {
        controller.subscribe(current, listeMessageEmis, listeMessageRecus);

        return () => {
            controller.unsubscribe(current, listeMessageEmis, listeMessageRecus);
        };
    }, [current, controller]);

    const [description, setDescription] = useState(session.user_desc);
    const [picture, setPicture] = useState(session.user_picture);
    const [confirmationMessage, setConfirmationMessage] = useState("");

    const handleChangeDesc = async () => {
        try {
            await controller.send(current, { update_profil: description });
            if (verbose || controller.verboseall) console.log("Demande de changement de description envoyée", description);
            setDescription(""); // Vider le champ de texte après envoi
        } catch (error) {
            console.error("Erreur lors de la demande de changement de description :", error);
        }
    };

    const handleChangePicture = async (e) => {
        const file = e.target.files[0];

        if (!file) {
            console.error("Aucun fichier sélectionné.");
            return;
        }

        try {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onloadend = async () => {
                const arrayBuffer = reader.result;
                await controller.send(current, {
                    update_picture: {
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        buffer: arrayBuffer
                    }
                });
                if (verbose || controller.verboseall) console.log("Demande de changement de photo de profil envoyée", { update_picture: file });
            };
        } catch (error) {
            console.error("Erreur lors de la demande de changement de photo de profil :", error);
        }
    };

    useEffect(() => {
        // Mettre à jour la description par défaut avec celle de la session
        setDescription(session.user_desc);
    }, [session.user_desc]);

    return (
        <div className={"fc ai-fs g1"} style={{ margin: "2rem" }}>
            <div className={"content-profil fr g1"}>
                <div className={"fc g1"}>
                    <h2>Mon profil</h2>
                    <div className={"fc g1"}>
                        <div className={"fc ai-fs g0-5"}>
                            <h3>À Propos</h3>
                            <p className={"ta-l o0-5"}>{session && description}</p>
                        </div>

                        <div className={"fr g2"}>
                            <p>Nom :</p>
                            <p className={"o0-5"}>{session && session.user_lastname}</p>
                        </div>
                        <div className={"fr g2"}>
                            <p>Prénom :</p>
                            <p className={"o0-5"}>{session && session.user_firstname}</p>
                        </div>
                        <div className={"fr g2"}>
                            <p>Date de création :</p>
                            <p className={"o0-5"}>
                                {session && new Date(session.user_date_create).toLocaleDateString('fr-FR')}
                            </p>
                        </div>
                        <div className={"fr g2"}>
                            <p className={"rem3"}>Email :</p>
                            <p className={"o0-5"}>{session && session.user_email}</p>
                        </div>
                        <div className={"fr g2"}>
                            <p className={"rem3"}>Job :</p>
                            <p className={"o0-5"}>{session && session.user_job}</p>
                        </div>
                        <div className={"fr g2"}>
                            <p >Rôles</p>
                            <div className={"fr g0-5"}>
                                {session && session.user_roles.map((role, index) => (
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
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"fc g1 ai-c"}>
                    <h2 className={"ta-c"}>Modifiable</h2>
                    <div className={"fr g1"}>
                        <input type="file" accept="image/*" onChange={handleChangePicture} />
                        {session && (
                            <img src={picture} onClick={handleChangePicture} alt={"Photo de profil"}
                                 style={{ width: '100px', height: '100px' }} />
                        )}
                    </div>

                    <div className={"fr g1 jc-c"} style={{flexWrap:"wrap"}}>
                        <textarea
                            placeholder="Votre description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="4"
                            cols="50"
                        />
                        <button onClick={handleChangeDesc}>Modifier</button>
                    </div>
                    {confirmationMessage && <p>{confirmationMessage}</p>}
                </div>
            </div>
        </div>
    );
};

export default NoyauProfil;

