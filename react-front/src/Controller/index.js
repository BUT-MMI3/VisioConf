import Controller from "./Controller.js";
import CanalSocketIO from "./CanalSocketIO.js";
import {socket} from "../socket.js";

// Init Controller and CanalSocketIO instances
const controller = new Controller();
const canal = new CanalSocketIO(socket, controller, "canalsocketio");

// Verbose
controller.verbose = true;

// Export instances
export {controller, canal};