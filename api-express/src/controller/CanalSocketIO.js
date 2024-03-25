const {ListeMessagesEmis, ListeMessagesRecus} = require("./ListeMessages");
const User = require("../models/user");
const jwt = require('jsonwebtoken');

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
            socket.on('message', async (msg) => {
                try {
                    if (this.controller.verboseall || this.verbose) console.log("INFO (" + this.nomDInstance + "): canalsocketio reçoit: " + msg + " de la part de " + socket.id);

                    const message = JSON.parse(msg);
                    message.id = socket.id;

                    // Si le token est valide, on peut continuer, sinon on refuse la connexion
                    const token = message.sessionToken;

                    if (token !== null) {
                        const user = await User.findOne({"user_tokens.session": message.sessionToken});

                        if (user) {
                            jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
                                if (err) {
                                    if (this.controller.verboseall || this.verbose) console.log("ERROR: Token invalide", err);
                                    return;
                                }
                                if (this.controller.verboseall || this.verbose) console.log("INFO: Token valide");
                                this.controller.send(this, message);
                            });
                        } else {
                            if (this.controller.verboseall || this.verbose) console.log("ERROR: Token invalide");

                            this.controller.send(this, {client_deconnexion: socket.id, id: socket.id});
                        }
                    } else if (typeof message.demande_de_connexion !== 'undefined') {
                        if (this.controller.verboseall || this.verbose) console.log("INFO: Demande de connexion");
                        this.controller.send(this, message);
                    } else if (typeof message.demande_inscription !== 'undefined') {
                        if (this.controller.verboseall || this.verbose) console.log("INFO: Demande d'inscription");
                        console.log("mon message id",message.id);
                        this.controller.send(this, message);
                    } else {
                        if (this.controller.verboseall || this.verbose) console.log("ERROR: Token invalide");
                    }

                } catch (e) {
                    console.log(e)
                }
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

                this.controller.send(this, {client_deconnexion: socket.id, id: socket.id});
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