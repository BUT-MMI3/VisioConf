/**
 * Author: @mathis-lambert
 * Date : Janvier 2024
 */
import { useState, useEffect, useRef } from "react";
import "./Home.scss";
import ConnectionState from "../../components/ConnectionState";
import Events from "../../components/Events";
import ConnectionManager from "../../components/ConnectionManager";
import SubscribeToEvent from "../../components/SubscribeToEvent";
import { useToasts } from "../../components/Toasts/ToastContext";
import ChatInput from "../../components/ChatInput/ChatInput";
import { DiscussionContextProvider } from "../../components/FilDiscussion/DiscussionContext";
import FilDiscussion from "../../components/FilDiscussion/FilDiscussion";

function Home({ isConnected }) {
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

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/pages/home/Home.jsx</code> and save to reload.
        </p>
      </div>
    </>
  );
}

export default Home;
