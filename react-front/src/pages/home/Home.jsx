import { useState } from "react";
import "./Home.scss";

function Home() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>MMI VisioConf</h1>
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
