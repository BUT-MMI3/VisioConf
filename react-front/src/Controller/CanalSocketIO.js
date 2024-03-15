class CanalSocketIO {
    /**
     * Classe qui permet de gérer un canal de communication avec un client SocketIO
     *
     * @param {SocketIO.Socket} s
     * @param {Controller} c
     * @param {string} nom
     */

    controller;
    nomDInstance;
    socket;

    listeDesMessagesEmis;
    listeDesMessagesRecus;

    verbose = false;

    constructor(s, c, nom) {

        this.controller = c;
        this.socket = s;
        this.nomDInstance = nom;

        this.socket.on("message", (msg) => {
            if (this.controller.verboseall || this.verbose) console.log(`INFO (${this.nomDInstance}): reçoit ce message: ${msg}`);
            msg = JSON.parse(msg);
            if (typeof msg.id !== "undefined") delete msg.id;
            this.controller.send(this, msg);
        });

        this.socket.on("donne_liste", (msg) => {
            let listes = JSON.parse(msg);
            this.listeDesMessagesEmis = listes.emission || [];
            this.listeDesMessagesRecus = listes.reception || [];
            if (this.controller.verboseall || this.verbose) console.log(`INFO (${this.nomDInstance}): subscribe des messages`);
            this.controller.subscribe(this, this.listeDesMessagesEmis, this.listeDesMessagesRecus);
        });

        this.socket.emit("demande_liste", {});
    }

    traitementMessage(msg) {
        this.socket.emit("message", JSON.stringify(msg));
    }
}

export default CanalSocketIO;
