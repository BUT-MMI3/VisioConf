const User = require("../models/user");
const {sha256} = require("../utils/utils");
const jwt = require("jsonwebtoken");

class LogIn {
    controller = null;
    instanceName = "";

    listeMessagesEmis = ["connexion_acceptee", "connexion_refusee", "information_user"];
    listeMessagesRecus = ["demande_de_connexion", "client_deconnexion", "demande_user_info"];

    email = "";

    verbose = true;

    constructor(controller, name) {
        this.controller = controller;
        this.instanceName = name;

        if (this.verbose || this.controller.verboseall) console.log("INFO (LogIn) - Création de l'instance LogIn : " + this.instanceName);

        this.controller.subscribe(this, this.listeMessagesEmis, this.listeMessagesRecus);
    }

    handleLogin = async (msg) => {
        if (this.verbose || this.controller.verboseall) console.log("INFO (LogIn) - Traitement de la demande de connexion");
        this.email = msg.demande_de_connexion.email || "";
        const client_challenge = msg.demande_de_connexion.challenge || "";

        // regex on mail
        if (this.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-z]{2,6}$/)) {
            if (this.verbose || this.controller.verboseall) console.log("INFO (LogIn) - Adresse mail valide");
            // check if mail exists in database
            let user = await User.findOne({user_email: this.email});
            if (user) {
                if (this.verbose || this.controller.verboseall) console.log("INFO (LogIn) - Utilisateur trouvé dans la base de données");

                if (client_challenge === await sha256(user.user_email + user.user_password)) {
                    user.set({
                        'user_socket_id': msg.id,
                        'user_last_connection': new Date(),
                        'user_is_online': true,
                        'user_tokens.session': jwt.sign({user: user.user_email + user.user_password}, process.env.JWT_SECRET, {expiresIn: "1h"})
                    });
                    try {
                        await user.save();
                    } catch (e) {
                        console.log("ERROR (LogIn) - " + e);
                    }

                    this.controller.send(this, {
                        "connexion_acceptee": {
                            session_token: user.user_tokens["session"],
                            user_info: user.info
                        },
                        id: msg.id
                    });

                    if (this.verbose || this.controller.verboseall) console.log("INFO (LogIn) - Utilisateur connecté et token envoyé");
                } else {
                    if (this.verbose || this.controller.verboseall) console.log("INFO (LogIn) - Mot de passe invalide");
                    this.controller.send(this, {
                        connexion_refusee: "Mot de passe invalide",
                        id: msg.id
                    }, this.instanceName);
                }
            } else {
                if (this.verbose || this.controller.verboseall) console.log("INFO (LogIn) - Utilisateur non trouvé dans la base de données");
                this.controller.send(this, {
                    connexion_refusee: "Utilisateur non trouvé",
                    id: msg.id
                }, this.instanceName);
            }
        } else {
            if (this.verbose || this.controller.verboseall) console.log("INFO (LogIn) - Adresse mail invalide");
            this.controller.send(this, {connexion_refusee: "Adresse mail invalide", id: msg.id}, this.instanceName);
        }
    }

    traitementMessage = async msg => {
        if (this.verbose || this.controller.verboseall) console.log("INFO (LogIn) - Traitement du message : " + JSON.stringify(msg));

        if (typeof msg.demande_de_connexion !== "undefined") {
            await this.handleLogin(msg);
        } else if (typeof msg.client_deconnexion !== "undefined") {
            await User.updateOne({user_socket_id: msg.id}, {
                user_socket_id: "none",
                user_is_online: false,
                user_last_connection: new Date(),
                user_tokens: {}
            });
            if (this.verbose || this.controller.verboseall) console.log("INFO (LogIn) - Utilisateur déconnecté, informations mises à jour dans la base de données");
        }else if (typeof msg.demande_user_info !== "undefined") {
            if (this.verbose || this.controller.verboseall) console.log("INFO (LogIn) - Demande d'informations de l'utilisateur pour NoyauAccueil");
            let user = await User.findOne({user_socket_id: msg.id});
            if (user) {
                this.controller.send(this, {
                    "information_user": {
                        user_picture: user.user_picture,
                        user_firstname: user.user_firstname,
                        user_lastname: user.user_lastname,
                        user_job: user.user_job
                    },
                    id: msg.id
                });
            } else {
                if (this.verbose || this.controller.verboseall) console.log("INFO (LogIn) - Utilisateur non trouvé dans la base de données");
            }
        }
    }
}

module.exports = LogIn;