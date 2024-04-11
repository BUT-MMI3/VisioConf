import {useEffect, useRef, useState} from 'react';
import './NoyauInscription.css';
import {useNavigate} from "react-router-dom";
import {appInstance} from "../../controller/index.js";
import sha256 from "../../utils/sha256.js";

const listeMessageEmis = [
    "demande_inscription",
];

const listeMessageRecus = [
    "inscription_acceptee",
    "inscription_refusee",
];

const NoyauInscription = () => {
    const instanceName = "NoyauInscription";
    const verbose = true;

    const [controller] = useState(appInstance.getController());

    const {current} = useRef({
        instanceName,
        traitementMessage: (msg) => {
            if (verbose || controller.verboseall) console.log(`INFO: (${instanceName}) - traitementMessage - `, msg);

            if (typeof msg.inscription_acceptee !== "undefined") {
                console.log("Inscription réussite");
            } else if (typeof msg.inscription_refusee !== "undefined") {
                console.log("Inscription refusée");
                setErreur(msg.inscription_refusee);
            }
        }
    });

    const [motDePasse, setMotDePasse] = useState('');
    const [erreur, setErreur] = useState('');
    const [isValidPassword, setIsValidPassword] = useState(false);
    const [passwordRules, setPasswordRules] = useState({
        containsDigit: false,
        containsUppercase: false,
        hasMinimumLength: false,
        containsSpecialCharacter: false,
    });
    useEffect(() => {
        controller.subscribe(current, listeMessageEmis, listeMessageRecus);

        return () => {
            controller.unsubscribe(current, listeMessageEmis, listeMessageRecus);
        };
    }, [controller, current, listeMessageEmis, listeMessageRecus]); // Ajoutez current comme dépendance


    useEffect(() => {
        const validatePassword = () => {
            const containsDigit = /\d/.test(motDePasse);
            const containsUppercase = /[A-Z]/.test(motDePasse);
            const hasMinimumLength = motDePasse.length >= 8;
            const containsSpecialCharacter = /\W/.test(motDePasse);

            setPasswordRules({
                containsDigit,
                containsUppercase,
                hasMinimumLength,
                containsSpecialCharacter,
            });

            setIsValidPassword(containsDigit && containsUppercase && hasMinimumLength && containsSpecialCharacter);
        };

        validatePassword();
    }, [motDePasse]);

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);

    if (token) {
        const Register = async () => {


            console.log(token, motDePasse);

            if (token && motDePasse) {
                if (verbose || controller.verboseall) console.log(`INFO: (${instanceName}) - Register - `, token, motDePasse);

                setErreur('');
                // Envoi de la demande de connexion
                controller.send(current, {
                    "demande_inscription": {
                        "token": token,
                        "mot_de_passe": await sha256(motDePasse)
                    }
                });
            } else {
                if (verbose || controller.verboseall) console.log(`INFO: (${instanceName}) - Register - `, "Veuillez remplir tous les champs.");
                setErreur('Veuillez remplir tous les champs.');
            }
        };
        return (
            <div className="page-inscription">
                <div className="card-inscription">
                    <img src={'./others/logo-universite-toulon.png'} alt="Logo de l'entreprise"
                         className="logo-inscription"/>
                    <h2 className="h2-inscription">Vous avez été invité à rejoindre VisioConf</h2>
                    <form className='form-controller' onSubmit={(e) => e.preventDefault()}>
                        <div className="form-group">
                            <label htmlFor="password">Mot de Passe :</label>
                            <input
                                type="password"
                                id="password"
                                value={motDePasse}
                                onChange={(e) => setMotDePasse(e.target.value)}
                                className={erreur ? 'erreur' : ''}
                                placeholder="Entrez votre mot de passe"
                            />
                        </div>
                        <div className="password-rules">
                            <p className="pass"><b>Votre mot de passe doit contenir :</b></p>
                            <p className={`pass ${passwordRules.containsDigit ? 'valid' : ''}`}>Avec un chiffre</p>
                            <p className={`pass ${passwordRules.containsUppercase ? 'valid' : ''}`}>Avec une
                                majuscule</p>
                            <p className={`pass ${passwordRules.hasMinimumLength ? 'valid' : ''}`}>Avec minimum 8
                                caractères</p>
                            <p className={`pass ${passwordRules.containsSpecialCharacter ? 'valid' : ''}`}>Avec un
                                caractère
                                spécial</p>
                        </div>
                        {erreur && <p className="erreur-message">{erreur}</p>}
                        <button className={`button-inscription ${isValidPassword ? '' : 'button-disabled'}`}
                                type="button"
                                onClick={Register} disabled={!isValidPassword}>
                            S&apos;inscrire
                        </button>

                    </form>
                </div>
            </div>
        );

    }
};

export default NoyauInscription;
