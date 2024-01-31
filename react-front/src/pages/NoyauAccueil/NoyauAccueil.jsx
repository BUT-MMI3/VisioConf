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

function NoyeauAccueil({ isConnected }) {
  const [count, setCount] = useState(0);
  const { pushToast } = useToasts();

  return (
    <>
      <h1>MMI VisioConf</h1>
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
