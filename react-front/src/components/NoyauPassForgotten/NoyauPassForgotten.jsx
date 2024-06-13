import {useEffect, useRef, useState} from 'react';
import {useNavigate} from "react-router-dom";
import './NoyauPassForgotten.css';
import {appInstance} from "../../controller/index.js";
import {toast} from "react-toastify";

const listeMessageEmis = [
    "demande_password",
];

const listeMessageRecus = [
    "password_acceptee",
    "password_refusee",
];

const NoyauPassForgotten = () => {
    const instanceName = "NoyauPassForgotten";
    const verbose = true;
    const navigate = useNavigate();

    const [controller] = useState(appInstance.getController());
    const {current} = useRef({
        instanceName,
        traitementMessage: (msg) => {
            if (verbose || controller.verboseall) console.log(`INFO: (${instanceName}) - traitementMessage - `, msg);

            if (typeof msg.password_acceptee !== "undefined") {
                console.log(msg.password_acceptee.message);
                toast.success("Email pour changer le mot de passe a été envoyé avec succès", {theme: "colored", icon: "🚀"})
                navigate("/login");
            } else if (typeof msg.password_refusee !== "undefined") {
                console.log(msg.password_refusee.message);
                setErreur(msg.password_refusee.message);
            }
        }
    });

    const [email, setEmail] = useState('');
    const [erreur, setErreur] = useState('');

    useEffect(() => {
        controller.subscribe(current, listeMessageEmis, listeMessageRecus);

        return () => {
            controller.unsubscribe(current, listeMessageEmis, listeMessageRecus);
        };
    }, [controller, current]);


    const PassForgotten = async () => {

        if (email) {
            if (verbose || controller.verboseall) console.log(`INFO: (${instanceName}) - PassForgotten - `, email);

            setErreur('');
            // Envoi de la demande de connexion
            controller.send(current, {
                "demande_password": {
                    "email": email,
                }
            });
        } else {
            if (verbose || controller.verboseall) console.log(`INFO: (${instanceName}) - PassForgotten - `, "Veuillez remplir tous les champs.");
            setErreur('Veuillez remplir tous les champs.');
        }
    };
    return (
        <div className="page-inscription">
            <div className="card-inscription">
                <img src={'../others/logo-universite-toulon.png'} alt="Logo de l'entreprise"
                     className="logo-inscription"/>
                <h2 className="h2-inscription">Mot de passe oublié ?</h2>
                <form className='form-controller' onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                        <label htmlFor="email">Email :</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={erreur ? 'erreur' : ''}
                            placeholder="Entrez votre email"
                        />
                    </div>
                    <button className={`button-inscription`}
                            type="button"
                            onClick={PassForgotten}>
                        Envoyer demande
                    </button>
                </form>
                {erreur && <p className="erreur-message">{erreur}</p>}
            </div>
        </div>
    );
};

export default NoyauPassForgotten;
