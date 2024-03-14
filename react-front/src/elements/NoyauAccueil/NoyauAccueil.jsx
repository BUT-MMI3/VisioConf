import { useEffect, useRef } from 'react';
import { controller } from '../../Controller/index.js';
import { DiscussionContextProvider } from '../../elements/FilDiscussion/DiscussionContext';
import './NoyauAccueil.scss';

const NoyauAccueil = () => {
    const nomDInstance = 'NoyauAccueil';

    // Initialisation de la référence avec un objet contenant le nom d'instance
    // et la fonction de traitement des messages.
    const {current} = useRef({
        nomDInstance,
        traitementMessage: (msg) => {
            console.log('Traitement message NoyauAccueil:', msg);
        }
    });

    useEffect(() => {
        // S'abonner avec la référence actuelle du composant
        controller.subscribe(current, ['test_send'], ['test_receive']);

        // Fonction de nettoyage pour se désabonner lors du démontage du composant
        return () => {
            controller.unsubscribe(current, ['test_send'], ['test_receive']);
        };
    });

    return (
        <div className="NoyeauAccueil">
            <button onClick={() => controller.send(current, {"test_send": "message de test"})}>
                Send
            </button>
            <DiscussionContextProvider />
        </div>
    );
};

export default NoyauAccueil;
