/**
 * Author: @mathis-lambert
 * Date : Janvier 2024
 */
import { Routes, Route } from "react-router-dom";
import NoyauAccueil from "./components/NoyauAccueil/NoyauAccueil.jsx";
import Accueil from "./components/Accueil/NoyauAccueil.jsx";
import { socket } from "./socket";
import { useState, useEffect } from "react";
import NotFound from "./components/NotFound.jsx";
import Layout from "./components/Layout/Layout.jsx";
import ListeDiscussion from "./components/ListeDiscussion/ListeDiscussion.jsx";

export default function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      console.log("connect");
      setIsConnected(true);
    }

    function onDisconnect() {
      console.log("disconnect");
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  });

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          path="discussions"
          element={
            /* l'élément à l'interieur de <></> sera affiché grâce au composant <Outlet /> dans <Layout /> */
            <>
              <ListeDiscussion />
              <NoyauAccueil isConnected={isConnected} />
            </>
          }
        />
        <Route
          path="discussion/:id"
          element={
            <>
              <ListeDiscussion />
              <NoyauAccueil isConnected={isConnected} />
            </>
          }
        />
        <Route
          path="/dev_route_accueil"
          element={
            <>
              <Accueil/>
            </>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
