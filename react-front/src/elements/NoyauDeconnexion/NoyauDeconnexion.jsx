import {useModal} from '../../elements/Modale/ModaleContext';
import FeatherIcon from 'feather-icons-react'
import {initConnection} from "../../controller/index.js";
import {useEffect, useRef, useState} from "react";

const listeMessageEmis = [
    "client_deconnexion"
]

const listeMessageRecus = []

const NoyauDeconnexion = () => {
    const instanceName = 'NoyauDeconnexion';
    const verbose = true;

    const [controller] = useState(initConnection.getController());

    const {newModal} = useModal();

    const {current} = useRef({
        instanceName,
        traitementMessage: (msg) => {
            if (verbose || controller.verboseall) console.log(`INFO: (${instanceName}) - traitementMessage - `, msg);
        }
    });

    const validateLogout = () => {
        controller.send(current, {
            "client_deconnexion": ""
        });
    }

    useEffect(() => {
        controller.subscribe(current, listeMessageEmis, listeMessageRecus);

        return () => {
            controller.unsubscribe(current, listeMessageEmis, listeMessageRecus);
        }
    }, [controller, current]);


    return (
        <>
            <button style={{background: 'none', border: 'none', color: 'red', cursor: 'pointer', padding: 0}}
                    className={"fr ai-c g1 jc-fs"}
                    onClick={() => newModal({
                        type: 'error',
                        boutonClose: true,
                        titre: 'Souhaitez-vous vraiment vous déconnecter ?',
                        texteBoutonAction: "déconnexion",
                        onValidate: validateLogout,
                    })}>
                <FeatherIcon icon="log-out" size="20" strokeWidth="1" className="log-out"/>
                Déconnexion
            </button>
        </>
    );
};

export default NoyauDeconnexion;
