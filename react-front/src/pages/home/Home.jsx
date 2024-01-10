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

function Home({ isConnected }) {
  const [count, setCount] = useState(0);
  const [fooEvents, setFooEvents] = useState([]);

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
