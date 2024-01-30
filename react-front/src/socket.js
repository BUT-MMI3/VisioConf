/**
 * Author: @mathis-lambert
 * Date : Janvier 2024
 */
import { io } from "socket.io-client";

const currentURL = window.location.hostname;
const currentProtocol = window.location.protocol;

const URL =
  // eslint-disable-next-line no-undef
  import.meta.env.VITE_ENV === "production"
    ? `${currentProtocol}//${currentURL}${import.meta.env.VITE_SERVER_ROUTE}`
    : "http://localhost:3001";

console.log("URL", URL);

export const socket = io(URL);
