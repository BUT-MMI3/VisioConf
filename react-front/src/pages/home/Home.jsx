/**
 * Author: @mathis-lambert
 * Date : Janvier 2024
 */
import { useState } from "react";
import "./Home.scss";
import ConnectionState from "../../components/ConnectionState";
import Events from "../../components/Events";
import ConnectionManager from "../../components/ConnectionManager";

function Home({ isConnected, fooEvents }) {
  const [count, setCount] = useState(0);

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
