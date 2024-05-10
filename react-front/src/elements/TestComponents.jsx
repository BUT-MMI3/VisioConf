import {useModal} from "./Modale/ModaleContext";
import {toast} from "react-toastify";

export default function TestComponents() {
    const {newModal} = useModal();

    return (
        <div className={"fc g1"}>
            <div className={"fr"}>
                <button
                    onClick={() =>
                        toast.error("Une erreur est survenue", {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        })
                    }
                >
                    Afficher un toast d&apos;erreur
                </button>
                <button
                    onClick={() =>
                        toast.success("Opération réussie", {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        })
                    }
                >
                    Afficher un toast de succés
                </button>
                <button
                    onClick={() =>
                        toast.info("Une information", {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        })
                    }
                >
                    Afficher un toast d&apos;information
                </button>
                <button
                    onClick={() =>
                        toast.warn("Attention", {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        })
                    }
                >
                    Afficher un toast d&apos;attention
                </button>
            </div>
            <div className={"fr"}>
                <button
                    onClick={() => {
                        newModal({
                            type: "error",
                            boutonClose: true,
                            titre: "Vous êtes sur le point de supprimer un élément.",
                            texte:
                                "Toutes les données personnelles de l’utilisateur serront supprimées, mais l’ensemble des contenus associés au compte resteront visibles (messages, posts, etc...). Le profil de l’utilisateur apparaîtra comme “Utilisateur Supprimé”..",
                            texteBoutonAction: "Supprimer l'utilisateur",
                            onValidate: () => {
                                console.log("Utilisateur supprimé");
                            },
                        });
                    }}
                >
                    Afficher une modale d&apos;erreur
                </button>
                <button
                    onClick={() => {
                        newModal({
                            type: "info",
                            titre: "Information",
                            texte: "Une information",
                            texteBoutonAction: "Ok",
                        });
                    }}
                >
                    Afficher une modale d&apos;information
                </button>
                <button
                    onClick={() => {
                        newModal({
                            type: "warning",
                            titre: "Attention",
                            texte: "Une information importante",
                            texteBoutonAction: "Ok",
                        });
                    }}
                >
                    Afficher une modale d&apos;attention
                </button>
            </div>
        </div>
    );
}
