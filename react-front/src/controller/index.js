import Controller from "./Controller.js";
import CanalSocketIO from "./CanalSocketIO.js";
import {socket} from "./socket.js";

// Init controller and CanalSocketIO instances
const controller = new Controller();
const canal = new CanalSocketIO(socket, controller, "CanalSocketIO");

// Verbose
controller.verbose = false;
controller.verboseall = false;
canal.verbose = true;

// Export instances
export {controller, canal};