/**
 * Author: @mathis-lambert
 * Date : Janvier 2024
 */

import { useToasts } from "./Toasts/ToastContext";
import { useModal } from './Modale/ModaleContext';

function Dev() {
    const { newModal } = useModal();
    const { pushToast } = useToasts();

    return (
        <div className={"fc g1"}>
            <h1>MMI VisioConf</h1>
            <div className={"fc"}>
                <button
                    onClick={() =>
                        pushToast({
                            type: "error",
                            title: "Erreur",
                            message: "Une erreur est survenue",
                            duration: 3,
                        })
                    }
                >
                    Toast d'erreur
                </button>
                <button
                    onClick={() =>
                        pushToast({
                            type: "success",
                            title: "Succès",
                            message: "Une opération a réussi",
                        })
                    }
                >
                    Toast de succès
                </button>
                <button
                    onClick={() =>
                        pushToast({
                            type: "info",
                            title: "Info",
                            message: "Une information",
                            duration: 3,
                        })
                    }
                >
                    Toast d'information
                </button>
                <button
                    onClick={() =>
                        pushToast({
                            type: "warning",
                            title: "Attention",
                            message: "Une information importante",
                            duration: 3,
                        })
                    }
                >
                    Toast d'attention
                </button>
            </div>
            <div>
                <button
                    onClick={() => {
                        newModal({
                            type: 'error',
                            boutonClose: true,
                            titre: 'Vous êtes sur le point de supprimer un élément.',
                            texte: 'Toutes les données personnelles de l’utilisateur serront supprimées, mais l’ensemble des contenus associés au compte resteront visibles (messages, posts, etc...). Le profil de l’utilisateur apparaîtra comme “Utilisateur Supprimé”..',
                            texteBoutonAction: "Supprimer l'utilisateur",
                            onValidate: () => {
                                console.log('Utilisateur supprimé');
                            },
                        })
                    }
                    }
                >
                    Modale d'erreur
                </button>
                <button
                    onClick={() => {
                        newModal({
                            type: 'info',
                            titre: 'Information',
                            texte: 'Une information',
                            texteBoutonAction: "Ok",
                        })
                    }
                    }
                >
                    Modale d'information
                </button>
                <button
                    onClick={() => {
                        newModal({
                            type: 'warning',
                            titre: 'Attention',
                            texte: 'Une information importante',
                            texteBoutonAction: "Ok",
                        })
                    }
                    }
                >
                    Modale d'attention
                </button>
            </div>
        </div>
    );
}

export default Dev;
