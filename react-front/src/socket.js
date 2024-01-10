/**
 * Author: @mathis-lambert
 * Date : Janvier 2024
 */
import { io } from "socket.io-client";

const currentURL = window.location.href;
// "undefined" means the URL will be computed from the `window.location` object
console.log(import.meta.env.VITE_ENV === "production");
const URL =
  // eslint-disable-next-line no-undef
  import.meta.env.VITE_ENV === "production"
    ? currentURL.split(":")[0] + ":" + currentURL.split(":")[1] + ":3001"
    : "http://localhost:3001";

export const socket = io(URL);
