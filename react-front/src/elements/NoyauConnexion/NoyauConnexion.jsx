import {useEffect, useRef, useState} from 'react';
import './NoyauConnexion.css';
import {controller} from "../../Controller/index.js";

const listeMessageEmis = [
    "demande_de_connexion",
]

const listeMessageRecu = [
    "connexion_acceptee",
    "connexion_refusee",
]

const utilisateur = {
    id: 123,
    nom: "Doe",
    prenom: "John",
    email: "john.doe@example.com",
    motDePasse: "azerty",
    job: "Etudiant MMI3",
    isConnected: false,
    isAdmin: true,
    logo: "./user-base-icon.svg",
}

const NoyauConnexion = () => {
    const nomDInstance = "NoyauConnexion";
    const verbose = true;

    const {current} = useRef({
        nomDInstance,
        traitementMessage: (msg) => {
            if (verbose || controller.verboseall) console.log(`INFO: (${nomDInstance}) - traitementMessage - `, msg);

            if (typeof msg.connexion_acceptee !== "undefined") {
                console.log("Connexion établie");
            } else if (typeof msg.connexion_refusee !== "undefined") {
                console.log("Connexion refusée");
                setErreur(msg.connexion_refusee);
            }
        }
    });

    useEffect(() => {
        controller.subscribe(current, listeMessageEmis, listeMessageRecu);

        return () => {
            controller.unsubscribe(current, listeMessageEmis, listeMessageRecu);
        };
    }, []);

    const [email, setEmail] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    const [erreur, setErreur] = useState('');

    const logIn = () => {
        if (email && motDePasse) {
            if (verbose || controller.verboseall) console.log(`INFO: (${nomDInstance}) - logIn - `, email, motDePasse);

            setErreur('');
            // Envoi de la demande de connexion
            controller.send(current, {
                "demande_de_connexion": {
                    "email": email,
                    "password": motDePasse
                }
            })
        } else {
            if (verbose || controller.verboseall) console.log(`INFO: (${nomDInstance}) - logIn - `, "Veuillez remplir tous les champs.");
            setErreur('Veuillez remplir tous les champs.');
        }
    };

    return (
        <div className={`page-connexion ${utilisateur.isConnected ? 'online' : ''}`}>
            <div className={`card-connexion ${utilisateur.isConnected ? 'online' : ''}`}>
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
                    <a href="/mot-de-passe-oublie">Mot de passe oublié ?</a>
                </div>
            </div>
        </div>
    );
};

export default NoyauConnexion;
