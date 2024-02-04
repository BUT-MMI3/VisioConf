/**
 * Author: @mathis-lambert
 * Date : Janvier 2024
 */
import { Routes, Route } from "react-router-dom";
import NoyauAccueil from "./components/NoyauAccueil/NoyauAccueil.jsx";
import { socket } from "./socket";
import { useState, useEffect } from "react";
import Modale from "./components/Modale/Modale.jsx";
import NoyauBarreDeMenu from "./components/NoyauBarreDeMenu/NoyauBarreDeMenu.jsx";
import NotFound from "./components/NotFound.jsx";

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
      <Route path="/" element={<NoyauAccueil isConnected={isConnected} />} />
      <Route
        path="/dev_route_nav"
        element={
          <NoyauBarreDeMenu/>
        }
      />
      {/*<Route path="/:room" element={<Home />} />*/}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
