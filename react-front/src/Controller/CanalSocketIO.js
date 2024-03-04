class CanalSocketIO {

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
            if (this.controller.verboseall || this.verbose) console.log("INFO (" + this.nomDInstance + "): reçoit ce message:" + msg);
            this.controller.send(this, JSON.parse(msg));
        });
        this.socket.on("donne_liste", (msg) => {
            let listes = JSON.parse(msg);
            this.listeDesMessagesEmis = listes.emission || [];
            this.listeDesMessagesRecus = listes.abonnement || [];
            if (this.controller.verboseall || this.verbose) console.log("INFO (" + this.nomDInstance + "): subscribe des messages de CanalSocketIO");
            this.controller.subscribe(this, listes.emission, listes.abonnement);
        });

        this.socket.emit("demande_liste", {});
    }

    traitementMessage(msg) {
        this.socket.emit("message", JSON.stringify(msg));
    }
}

export default CanalSocketIO;
