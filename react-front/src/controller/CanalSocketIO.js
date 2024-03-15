// TODO: Rework this class to be capable to use session Redux to send session token to the server on each message
class CanalSocketIO {
    /**
     * Classe qui permet de gérer un canal de communication avec un client SocketIO
     *
     * @param {SocketIO.Socket} s
     * @param {Controller} c
     * @param {string} nom
     */

    controller;
    instanceName;
    socket;

    listeDesMessagesEmis;
    listeDesMessagesRecus;

    verbose = false;

    constructor(s, c, nom) {

        this.controller = c;
        this.socket = s;
        this.instanceName = nom;

        this.socket.on("message", (msg) => {
            if (this.controller.verboseall || this.verbose) console.log(`INFO (${this.instanceName}): reçoit ce message: ${msg}`);
            msg = JSON.parse(msg);
            if (typeof msg.id !== "undefined") delete msg.id;
            this.controller.send(this, msg);
        });

        this.socket.on("donne_liste", (msg) => {
            let listes = JSON.parse(msg);
            this.listeDesMessagesEmis = listes.emission || [];
            this.listeDesMessagesRecus = listes.reception || [];
            if (this.controller.verboseall || this.verbose) console.log(`INFO (${this.instanceName}): subscribe des messages`);
            this.controller.subscribe(this, this.listeDesMessagesEmis, this.listeDesMessagesRecus);
        });

        this.socket.emit("demande_liste", {});
    }

    traitementMessage(msg) {
        this.socket.emit("message", JSON.stringify(msg));
    }
}

export default CanalSocketIO;
