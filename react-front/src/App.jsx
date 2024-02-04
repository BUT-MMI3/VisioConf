/**
 * Author: @mathis-lambert
 * Date : Janvier 2024
 */
import { Routes, Route } from "react-router-dom";
import NoyauAccueil from "./pages/NoyauAccueil/NoyauAccueil.jsx";
import { socket } from "./socket";
import { useState, useEffect } from "react";
import Modale from "./components/Modale/Modale.jsx";
import BarreDeMenu from "./components/NoyauBarreDeMenu/NoyauBarreDeMenu.jsx";
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

  const utilisateur = {
    id: 123,
    nom: "Doe",
    prenom: "John",
    email: "john.doe@example.com",
    job: "Etudiant MMI3",
    connecte: true,
    isAdmin: true,
    logo: "https://imgv3.fotor.com/images/gallery/a-girl-cartoon-character-with-pink-background-generated-by-cartoon-character-maker-in-Fotor.jpg",
  };

  return (
    <Routes>
      <Route path="/" element={<NoyauAccueil isConnected={isConnected} />} />
      <Route
        path="/dev_route_nav"
        element={
          <BarreDeMenu
            logoImage="https://jeremiahhaulin.fr/img/Logo%20MMI%20Toulon.png"
            utilisateur={utilisateur}
          />
        }
      />
      {/*<Route path="/:room" element={<Home />} />*/}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
