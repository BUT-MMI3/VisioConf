/**
 * Author: @mathis-lambert
 * Date : Janvier 2024
 */
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home.jsx";
import { socket } from "./socket";
import { useState, useEffect } from "react";

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
      <Route path="/" element={<Home isConnected={isConnected} />} />
      <Route path="/:room" element={<Home />} />
    </Routes>
  );
}
