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
  const [fooEvents, setFooEvents] = useState([]);

  useEffect(() => {
    function onConnect() {
      console.log("connect");
      setIsConnected(true);
    }

    function onDisconnect() {
      console.log("disconnect");
      setIsConnected(false);
    }

    function onFooEvent(value) {
      setFooEvents((previous) => [...previous, value]);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("foo", onFooEvent);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("foo", onFooEvent);
    };
  });

  return (
    <Routes>
      <Route
        path="/"
        element={<Home isConnected={isConnected} fooEvents={fooEvents} />}
      />
      <Route path="/:room" element={<Home />} />
    </Routes>
  );
}
