import {useEffect, useRef, useState} from 'react';
import './NoyauConnexion.css';
import {appInstance} from "../../controller/index.js";
import sha256 from "../../utils/sha256.js";
import LinkTo from "../../elements/LinkTo/LinkTo.jsx";

const listeMessageEmis = [
    "demande_de_connexion",
]

const listeMessageRecus = [
    "connexion_acceptee",
    "connexion_refusee",
]

const NoyauConnexion = () => {
    const instanceName = "NoyauConnexion";
    const verbose = false;

    const [controller] = useState(appInstance.getController())

    const {current} = useRef({
        instanceName,
        traitementMessage: (msg) => {
            if (verbose || controller.verboseall) console.log(`INFO: (${instanceName}) - traitementMessage - `, msg);

            if (typeof msg.connexion_acceptee !== "undefined") {
                if (verbose || controller.verboseall) console.log("Connexion établie");
            } else if (typeof msg.connexion_refusee !== "undefined") {
                if (verbose || controller.verboseall) console.log("Connexion refusée");
                setErreur(msg.connexion_refusee);
            }
        }
    });

    useEffect(() => {
        controller.subscribe(current, listeMessageEmis, listeMessageRecus);

        return () => {
            controller.unsubscribe(current, listeMessageEmis, listeMessageRecus);
        };
    }, [current]);

    const [email, setEmail] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    const [erreur, setErreur] = useState('');

    const logIn = async () => {
        if (email && motDePasse) {
            if (verbose || controller.verboseall) console.log(`INFO: (${instanceName}) - logIn - `, email, motDePasse);

            setErreur('');
            // Envoi de la demande de connexion
            controller.send(current, {
                "demande_de_connexion": {
                    "email": email,
                    "challenge": await sha256(email + await sha256(motDePasse)) // Challenge = sha256(email + sha256(motDePasse))
                }
            })
        } else {
            if (verbose || controller.verboseall) console.log(`INFO: (${instanceName}) - logIn - `, "Veuillez remplir tous les champs.");
            setErreur('Veuillez remplir tous les champs.');
        }
    };

    return (
        <div className={`page-connexion`}>
            <div className={`card-connexion`}>
                <img src={'./others/logo-universite-toulon.png'} alt="Logo de l'entreprise" className="logo-connexion"/>
                <form className='from-controller' onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                        <label htmlFor="email" style={{fontWeight: 600}} className={erreur ? 'erreur' : ''}>Adresse
                            Email :</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyUp={(e) => e.key === 'Enter' && logIn()}
                            className={erreur ? 'erreur' : ''}
                            placeholder="Entrez votre adresse email"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" style={{fontWeight: 600}} className={erreur ? 'erreur' : ''}>Mot de
                            Passe :</label>
                        <input
                            type="password"
                            id="password"
                            value={motDePasse}
                            onChange={(e) => setMotDePasse(e.target.value)}
                            onKeyUp={(e) => e.key === 'Enter' && logIn()}
                            className={erreur ? 'erreur' : ''}
                            placeholder="Entrez votre mot de passe"
                        />
                    </div>
                    {erreur && <p className="erreur-message">{erreur}</p>}
                    <button className={erreur ? 'button-connexion erreur' : 'button-connexion'} type="button"
                            onClick={logIn}>
                        Connexion
                    </button>
                </form>
                <div className="lien-mot-de-passe-oublie">
                    <LinkTo to="/mot-de-passe-oublie">Mot de passe oublié ?</LinkTo>
                </div>
            </div>
        </div>
    );
};

export default NoyauConnexion;
