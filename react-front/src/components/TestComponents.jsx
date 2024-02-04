import { useModal } from "./Modale/ModaleContext";
import { useToasts } from "./Toasts/ToastContext";

export default function TestComponents() {
  const { newModal } = useModal();
  const { pushToast } = useToasts();

  return (
    <>
      <div>
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
          Afficher un toast d&apos;erreur
        </button>
        <button
          onClick={() =>
            pushToast({
              type: "success",
              title: "Succés",
              message: "Une opération a réussi",
            })
          }
        >
          Afficher un toast de succés
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
          Afficher un toast d&apos;information
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
          Afficher un toast d&apos;attention
        </button>
      </div>
      <div>
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
    </>
  );
}
