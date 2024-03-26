import CanalSocketIO from "./CanalSocketIO.js";
import {socket} from "./socket.js";


class InitConnection {
    controller = null;
    canal = null;
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

    setLoading(value) {
        this._loading = value;
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

    getController = () => {
        return this.controller;
    }

    getCanal = () => {
        return this.canal;
    }
}


export const initConnection = new InitConnection();