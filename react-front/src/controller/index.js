import CanalSocketIO from "./CanalSocketIO.js";
import {socket} from "./socket.js";
import WebRTCManager from "../classes/WebRTCManager.js";

class AppInstance {
    controller = null;
    canal = null;
    webRTCManager = null;
    loading = true;

    constructor() {
        // Init and CanalSocketIO instances
        socket.emit("demande_fichier", "Controller.js");

        socket.on("envoi_fichier", (msg) => {
            if (msg.nom !== "Controller.js") return;

            this.setController(msg.data);
            this.setCanal();
        });
    }

    setLoadingCallback = (callback) => {
        this.onLoadingChange = callback;
    }

    setControllerCallback = (callback) => {
        this.onControllerChange = callback;
    }

    setCanalCallback = (callback) => {
        this.onCanalChange = callback;
    }

    setWebRTCManagerCallback = (callback) => {
        this.onWebRTCManagerChange = callback;
    }

    setLoading(value) {
        this.loading = value;
        if (this.onLoadingChange) {
            this.onLoadingChange(value);
        }
    }

    setController(data) {
        // data is an ArrayBuffer
        this.controller = new (new Function("return " + new TextDecoder().decode(data))())();
        console.log("Setting Controller");

        // Verbose
        this.controller.verbose = false;
        this.controller.verboseall = false;

        if (this.onControllerChange) {
            this.onControllerChange(this.controller);
        }

        // Init WebRTCManager
        this.setWebRTCManager();
    }

    setCanal() {
        console.log("Setting CanalSocketIO");
        this.canal = new CanalSocketIO(socket, this.controller, "CanalSocketIO");
        this.canal.verbose = true;

        if (this.onCanalChange) {
            this.onCanalChange(this.canal);
        }

        this.setLoading(false);
    }

    setWebRTCManager() {
        console.log("Setting WebRTCManager");
        this.webRTCManager = new WebRTCManager(this.controller);

        if (this.onWebRTCManagerChange) {
            this.onWebRTCManagerChange(this.webRTCManager);
        }
    }

    getController = () => {
        return this.controller;
    }

    getWebRTCManager = () => {
        return this.webRTCManager;
    }

    getCanal = () => {
        return this.canal;
    }
}


export const appInstance = new AppInstance();