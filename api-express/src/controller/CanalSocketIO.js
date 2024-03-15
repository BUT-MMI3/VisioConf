const {ListeMessagesEmis, ListeMessagesRecus} = require("./ListeMessages");

class CanalSocketIO {
    /**
     * Classe CanalSocketIO
     *
     * Cette classe permet de gérer les échanges de messages entre le serveur et les clients
     * Elle s'enregistre auprès du controller pour recevoir les messages et les émettre
     * Elle écoute les messages des clients et les transmet au controller
     * Elle émet les messages reçus du controller aux clients
     * Elle gère les connexions et déconnexions des clients
     * Elle gère les listes d'abonnement et d'émission
     *
     * @param {Object} io - Le socket sur lequel on va écouter et émettre
     * @param {Object} controller - Le controller auquel on va s'enregistrer
     * @param {String} name - Le nom de l'instance
     *
     * @returns {Object} - L'instance créée
     */

    controller;
    nomDInstance;
    io;
    listeDesMessagesEmis = ListeMessagesEmis
    listeDesMessagesRecus = ListeMessagesRecus;
    verbose = true;

    constructor(io, controller, name) {

        this.io = io;
        this.controller = controller;
        this.nomDInstance = name;

        if (this.controller.verboseall || this.verbose) console.log("INFO (" + this.nomDInstance + "): " + this.nomDInstance + " s'enregistre auprès du controller");
        this.controller.subscribe(this, this.listeDesMessagesEmis, this.listeDesMessagesRecus);

        this.io.on('connection', (socket) => {
            socket.on('message', (msg) => {
                let message = JSON.parse(msg);
                if (message.ecrit_message) console.log(message)
                message.id = socket.id;
                if (this.controller.verboseall || this.verbose) console.log("INFO (" + this.nomDInstance + "): canalsocketio reçoit: " + msg + " de la part de " + socket.id);
                this.controller.send(this, message);
            });


            socket.on('demande_liste', (msg) => {
                if (this.controller.verboseall || this.verbose) console.log("INFO (" + this.nomDInstance + "): on donne les listes émission et abonnement");
                socket.emit("donne_liste", JSON.stringify({
                    reception: this.listeDesMessagesEmis,
                    emission: this.listeDesMessagesRecus
                }));
            });


            socket.on('disconnect', () => {
                if (this.controller.verboseall || this.verbose) console.log("INFO (" + this.nomDInstance + "): " + socket.id + " s'est déconnecté");

                let message = {}
                message.client_deconnexion = socket.id;
                this.controller.send(this, message);
            });
        });


    }


    traitementMessage(msg) {

        if (this.controller.verboseall || this.verbose) console.log("INFO (" + this.nomDInstance + "): canalsocketio va emettre sur la/les io " + JSON.stringify(msg));
        if (typeof msg.id != "undefined") {
            this.io.emit("message", JSON.stringify(msg));
        } else {
            let message = JSON.parse(JSON.stringify(msg));
            delete message.id;
            message = JSON.stringify(message);

            if (this.controller.verboseall || this.verbose) console.log("INFO (" + this.nomDInstance + "):emission sur la io: " + msg.id);
            this.io.to(msg.id).emit("message", message);
        }
    }
}

module.exports = CanalSocketIO