/**
 * Author: @mathis-lambert
 * Date : Janvier 2024
 */
import { io } from "socket.io-client";

const currentURL = window.location.hostname;
const currentProtocol = window.location.protocol;

const URL = import.meta.env.VITE_API_URL || `${currentProtocol}//${currentURL}` + ":3001";

console.log("API URL", URL);

export const socket = io(URL, {
    path: "/api/socket.io",
    transports: ["websocket"],
    autoConnect: true,
    reconnection: true,
});
