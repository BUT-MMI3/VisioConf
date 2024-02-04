/**
 * Author: @mathis-lambert
 * Date : Janvier 2024
 */
import { useState } from "react";
import "./NoyauAccueil.scss";
import ConnectionState from "../../components/ConnectionState";
import ConnectionManager from "../../components/ConnectionManager";
import { useToasts } from "../../components/Toasts/ToastContext";
import ChatInput from "../../components/ChatInput/ChatInput";
import { DiscussionContextProvider } from "../../components/FilDiscussion/DiscussionContext";
import FilDiscussion from "../../components/FilDiscussion/FilDiscussion";
import Modale from "../../components/Modale/Modale";
import { useModal } from '../../components/Modale/ModaleContext';

function NoyeauAccueil({ isConnected }) {
    const { newModal } = useModal();
    const { pushToast } = useToasts();

  return (
    <>
      <h1>MMI VisioConf</h1>
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
                        type: 'error',
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
                Afficher une modale d'erreur
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
                Afficher une modale d'information
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
                Afficher une modale d'attention
            </button>
        </div>


      <ConnectionState isConnected={isConnected} />
      <ConnectionManager />
      {/* <Events events={fooEvents} /> */}

      <DiscussionContextProvider>
        <FilDiscussion />
        <ChatInput />
      </DiscussionContextProvider>
    </>
  );
}

export default NoyeauAccueil;
