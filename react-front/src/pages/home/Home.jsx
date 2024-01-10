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

function Home({ isConnected }) {
  const [count, setCount] = useState(0);
  const [fooEvents, setFooEvents] = useState([]);
  const { pushToast } = useToasts();

  // This is a trick to keep the same function reference
  const onFooEventRef = useRef((event) => {
    setFooEvents((fooEvents) => [...fooEvents, event]);
  });

  useEffect(() => {
    // Subscribe to the event
    const unsub = SubscribeToEvent("foo", onFooEventRef.current);

    return () => {
      // Clean up the subscription to avoid memory leaks
      unsub();
    };
  }, []);

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
      <Events events={fooEvents} />
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
