class CanalSocketIO {
    /**
     * Classe qui permet de gérer un canal de communication avec un client SocketIO
     *
     * @param {Socket} s
     * @param {Controller} c
     * @param {string} nom
     */

    controller = null;
    instanceName;
    socket;

    listeDesMessagesEmis;
    listeDesMessagesRecus;

    sessionToken = null;

    verbose = false;

    constructor(s, c, nom) {
        this.socket = s;
        this.controller = c;
        this.instanceName = nom;

        this.socket.on("message", (msg) => {
            if (!this.controller) {
                console.error("No controller")
                return new Error("No controller");
            }

            if (this.controller.verboseall || this.verbose) console.log(`INFO (${this.instanceName}): reçoit ce message: ${msg}`);
            msg = JSON.parse(msg);
            if (typeof msg.id !== "undefined") delete msg.id;
            this.controller.send(this, msg);
        });

        this.socket.on("donne_liste", (msg) => {
            if (!this.controller) {
                console.error("No controller")
                return new Error("No controller");
            }

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

        if (typeof msg.update_session_token !== "undefined") {
            this.setSessionToken(msg.update_session_token);
            delete msg.update_session_token;
        } else {
            if (!this.sessionToken && typeof msg.demande_de_connexion === "undefined" && typeof msg.demande_inscription === "undefined" && typeof msg.demande_password === "undefined") {
                console.error("No session token")
                this.controller.send(this, {client_deconnexion: this.socket.id});
                return new Error("No session token");
            }

            if (typeof msg.demande_de_connexion !== "undefined" || typeof msg.demande_inscription !== "undefined" || typeof msg.demande_password !== "undefined"){
                this.sessionToken = null;
            }

            this.socket.emit("message", JSON.stringify({
                ...msg,
                sessionToken: this.sessionToken
            }));
        }
    }

    setSessionToken(token) {
        this.sessionToken = token;
    }
}

export default CanalSocketIO;
