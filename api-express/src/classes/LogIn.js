const User = require("../models/user");
const Call = require("../models/call");
const {sha256} = require("../utils/utils");
const jwt = require("jsonwebtoken");

class LogIn {
    controller = null;
    instanceName = "";

    listeMessagesEmis = ["connexion_acceptee", "connexion_refusee", "information_user", "demande_liste_utilisateurs", "status_answer", "hang_up"];
    listeMessagesRecus = ["demande_de_connexion", "client_deconnexion", "demande_changement_status"];

    email = "";

    verbose = false;

    constructor(controller, instanceName) {
        this.controller = controller;
        this.instanceName = instanceName;

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
            let user = await User.findOne({user_email: this.email}).populate("user_roles");
            if (user) {
                if (this.verbose || this.controller.verboseall) console.log("INFO (LogIn) - Utilisateur trouvé dans la base de données");

                if (user.user_status === "active") {
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

                        this.controller.send(this, {
                            demande_liste_utilisateurs: {},
                        })

                        if (this.verbose || this.controller.verboseall) console.log("INFO (LogIn) - Utilisateur connecté et token envoyé");
                    } else {
                        if (this.verbose || this.controller.verboseall) console.log("INFO (LogIn) - Mot de passe invalide");
                        this.controller.send(this, {
                            connexion_refusee: "Mot de passe invalide",
                            id: msg.id
                        }, this.instanceName);
                    }
                } else {
                    if (this.verbose || this.controller.verboseall) console.log("INFO (LogIn) - Utilisateur inactif");
                    this.controller.send(this, {
                        connexion_refusee: "Status de l'utilisateur : " + user.user_status,
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
            try {
                const user = await User.findOne({user_socket_id: msg.id}).populate('user_roles')
                if (user) {
                    // check if the user was in a call
                    const calls = await Call.find({
                        in_call_members: user._id,
                        is_ended: false
                    }).populate("in_call_members").populate("call_creator");

                    if (calls.length > 0) {
                        for (let call of calls) {
                            if (this.verbose || this.controller.verboseall) console.log("INFO (LogIn) - Utilisateur déconnecté, mise à jour de l'appel en cours");
                            this.controller.send(this, {
                                "hang_up": {
                                    discussion_uuid: call.discussion_uuid,
                                    user_uuid: user.user_uuid
                                },
                                id: msg.id
                            });
                        }
                    }

                    await User.updateOne({user_socket_id: msg.id}, {
                        user_socket_id: "none",
                        user_is_online: false,
                        user_last_connection: new Date(),
                        user_tokens: {}
                    });

                    if (this.verbose || this.controller.verboseall) console.log("INFO (LogIn) - Utilisateur déconnecté, informations mises à jour dans la base de données");
                } else {
                    if (this.verbose || this.controller.verboseall) console.log("INFO (LogIn) - Utilisateur non trouvé dans la base de données");
                }
            } catch (e) {
                console.log("ERROR (LogIn) - " + e);
            }
            // } else if (typeof msg.demande_user_info !== "undefined") {
            //     if (this.verbose || this.controller.verboseall) console.log("INFO (LogIn) - Demande d'informations de l'utilisateur pour NoyauAccueil");
            //     await User.updateOne({user_socket_id: msg.id}, {
            //         user_socket_id: "none",
            //         user_is_online: false,
            //         user_last_connection: new Date(),
            //         user_tokens: {}
            //     });
            //     if (this.verbose || this.controller.verboseall) console.log("INFO (LogIn) - Utilisateur déconnecté, informations mises à jour dans la base de données");
        } else if (typeof msg.demande_changement_status !== "undefined") {
            try {
                if (this.verbose || this.controller.verboseall) console.log("INFO (LogIn) - Demande de changement de statut");
                let user = await User.findOne({user_socket_id: msg.id});
                if (user) {
                    user.user_disturb_status = msg.demande_changement_status;
                    await user.save();
                    this.controller.send(this, {
                        status_answer: user.user_disturb_status,
                        id: msg.id
                    });
                } else {
                    if (this.verbose || this.controller.verboseall) console.log("INFO (LogIn) - Utilisateur non trouvé dans la base de données pour changement de statut");
                }
            } catch (error) {
                console.error("Erreur lors de la mise à jour du statut utilisateur :", error);
            }
        }

    }
}

module
    .exports = LogIn;