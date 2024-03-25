class CanalSocketIO {
    /**
     * Classe qui permet de gérer un canal de communication avec un client SocketIO
     *
     * @param {Socket} s
     * @param {Controller} c
     * @param {string} nom
     */

    controller;
    instanceName;
    socket;

    listeDesMessagesEmis;
    listeDesMessagesRecus;

    sessionToken = null;

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
        if (typeof msg.id !== "undefined") delete msg.id;
        if (typeof msg.client_deconnexion !== "undefined") return;

        if (this.controller.verboseall || this.verbose) console.log(`INFO (${this.instanceName}): envoie ce message: ${JSON.stringify(msg)}`);

        if (!this.sessionToken && typeof msg.demande_de_connexion === "undefined" && typeof msg.demande_inscription === "undefined") {
            console.error("No session token")
            return new Error("No session token");
        }

        this.socket.emit("message", JSON.stringify({
            ...msg,
            sessionToken: this.sessionToken
        }));
    }

    setSessionToken(token) {
        this.sessionToken = token;
    }
}

export default CanalSocketIO;
