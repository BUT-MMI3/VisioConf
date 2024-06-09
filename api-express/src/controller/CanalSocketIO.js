const {ListeMessagesEmis, ListeMessagesRecus} = require("./ListeMessages");
const User = require("../models/user");
const jwt = require('jsonwebtoken');
const fs = require("fs");

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
    instanceName;
    io;
    listeDesMessagesEmis = ListeMessagesEmis
    listeDesMessagesRecus = ListeMessagesRecus;
    verbose = false;

    constructor(io, controller, name) {

        this.io = io;
        this.controller = controller;
        this.instanceName = name;

        if (this.controller.verboseall || this.verbose) console.log("INFO (" + this.instanceName + "): " + this.instanceName + " s'enregistre auprès du controller");
        this.controller.subscribe(this, this.listeDesMessagesEmis, this.listeDesMessagesRecus);

        this.io.on('connection', (socket) => {
            console.log("INFO (" + this.instanceName + "): " + socket.id + " s'est connecté");
            console.log("INFO (" + this.instanceName + "): " + socket.id + " s'est connecté");
            socket.on('message', async (msg) => {
                try {
                    if (this.controller.verboseall || this.verbose) console.log("INFO (" + this.instanceName + "): canalsocketio reçoit: " + msg + " de la part de " + socket.id);

                    const message = JSON.parse(msg);
                    message.id = socket.id;

                    // Si le token est valide, on peut continuer, sinon on refuse la connexion
                    const token = message.sessionToken;
                    if (token !== null) {
                        const user = await User.findOne({"user_tokens.session": message.sessionToken})
                            .populate({
                                path: 'user_roles',
                                populate: {
                                    path: 'role_permissions',
                                    select: 'permission_uuid',
                                }
                            });

                        if (user) {
                            jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
                                if (err) {
                                    if (this.controller.verboseall || this.verbose) console.log("ERROR: Token invalide", err);
                                    return;
                                }
                                if (this.controller.verboseall || this.verbose) console.log("INFO: Token valide");

                                if (user && user.user_roles) {
                                    const permissions = user.user_roles.flatMap(role =>
                                        role.role_permissions.map(permission => permission.permission_uuid)
                                    );
                                    if (this.controller.verboseall || this.verbose) console.log("PERMISSIONS VERIFICATION : ", "Permissions: ", permissions, " message permission: ", Object.keys(message)[0]);

                                    // Check if the user has the required permission
                                    if (permissions.includes(Object.keys(message)[0])) {
                                        this.controller.send(this, message);
                                    } else {
                                        if (this.controller.verboseall || this.verbose) console.log("ERROR: Permission refusée : ", Object.keys(message)[0], " n'est pas dans les permissions de l'utilisateur");
                                        console.log("ERROR: Permission refusée : ", Object.keys(message)[0], " n'est pas dans les permissions de l'utilisateur", permissions);
                                        socket.emit("error", "Permission refusée");
                                    }
                                } else {
                                    console.log('User not found or no roles assigned');
                                }
                            });
                        } else {
                            if (this.controller.verboseall || this.verbose) console.log("ERROR: Token invalide");
                            this.controller.send(this, {client_deconnexion: socket.id, id: socket.id});
                        }
                    } else if (typeof message.demande_de_connexion !== 'undefined') {
                        if (this.controller.verboseall || this.verbose) console.log("INFO: Demande de connexion");
                        const demandeDeConnexionId = Object.keys(message.demande_de_connexion)[0]; // Extraction de l'identifiant
                        console.log("ID de la demande de connexion:", demandeDeConnexionId);
                        this.controller.send(this, message);
                    } else if (typeof message.demande_inscription !== 'undefined') {
                        if (this.controller.verboseall || this.verbose) console.log("INFO: Demande d'inscription");
                        console.log("mon message id", message.id);
                        this.controller.send(this, message);
                    } else if (typeof message.demande_password !== 'undefined') {
                        if (this.controller.verboseall || this.verbose) console.log("INFO: Demande de changement de mot de passe");
                        console.log("mon message id", message.id);
                        this.controller.send(this, message);
                    } else {
                        if (this.controller.verboseall || this.verbose) console.log("ERROR: Token invalide");
                    }

                } catch (e) {
                    console.log(e);
                }
            });


            socket.on('demande_fichier', async (msg) => {
                if (this.controller.verboseall || this.verbose) console.log("INFO (" + this.instanceName + "): demande de fichier reçue: " + msg);
                this.envoiFichier(socket, msg);
            })

            socket.on('demande_liste', (msg) => {
                if (this.controller.verboseall || this.verbose) console.log("INFO (" + this.instanceName + "): on donne les listes émission et abonnement");
                socket.emit("donne_liste", JSON.stringify({
                    reception: this.listeDesMessagesEmis,
                    emission: this.listeDesMessagesRecus
                }));
            });


            socket.on('disconnect', () => {
                if (this.controller.verboseall || this.verbose) console.log("INFO (" + this.instanceName + "): " + socket.id + " s'est déconnecté");

                this.controller.send(this, {client_deconnexion: socket.id, id: socket.id});
            });
        });
    }

    envoiFichier = (socket, fichier) => {
        if (this.verbose || this.controller.verboseall) console.log("INFO (" + this.instanceName + "): Envoi du fichier: " + fichier);

        fs.readFile('./src/client-files/' + fichier, (err, data) => {
            if (err) {
                if (this.verbose || this.controller.verboseall) console.error("ERREUR (" + this.instanceName + "): Erreur lors de la lecture du fichier: " + err);

                socket.emit("erreur_fichier", "Erreur lors de la lecture du fichier");
                return;
            }

            socket.emit("envoi_fichier", {
                nom: fichier,
                data: data
            });

            if (this.verbose || this.controller.verboseall) console.log("INFO (" + this.instanceName + "): Fichier envoyé: " + fichier);
        });
    }


    traitementMessage(msg) {

        if (this.controller.verboseall || this.verbose) console.log("INFO (" + this.instanceName + "): canalsocketio va emettre sur la/les io ");
        if (this.controller.verboseall || this.verbose) console.log(msg);
        if (typeof msg.id === "undefined") {
            console.log("Broadcasting");
            this.io.emit("message", JSON.stringify(msg));
        } else {
            console.log("Emitting");
            let message = JSON.parse(JSON.stringify(msg));
            delete message.id;
            message = JSON.stringify(message);

            if (this.controller.verboseall || this.verbose) console.log("INFO (" + this.instanceName + "):emission sur la io: " + msg.id);
            this.io.to(msg.id).emit("message", message);
        }
    }
}

module.exports = CanalSocketIO