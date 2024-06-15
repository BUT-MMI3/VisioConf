// Register.js
const User = require("../models/user");
const {sha256} = require("../utils/utils");
const jwt = require("jsonwebtoken");

class Register {
    constructor(controller) {
        this.controller = controller;
        this.instanceName = "Register";

        this.listeMessagesEmis = ["inscription_acceptee", "inscription_refusee"];
        this.listeMessagesRecus = ["demande_inscription"];

        this.verbose = true;

        if (this.verbose || this.controller.verboseall) console.log("INFO (" + this.instanceName + ") - Création de l'instance Register : " + this.instanceName);

        this.controller.subscribe(this, this.listeMessagesEmis, this.listeMessagesRecus);
    }

    handleRegistration = async (msg) => {
        if (this.verbose || this.controller.verboseall) console.log("INFO (" + this.instanceName + ") - Traitement de la demande d'inscription");

        const token = msg.demande_inscription.token;
        const motDePasse = msg.demande_inscription.mot_de_passe;

        try {
            const user = await User.findOne({"user_tokens.invitation": token});
            if (user) {
                // Si l'utilisateur existe déjà, mettez à jour ses informations
                user.set({
                    'user_socket_id': msg.id,
                    'user_last_connection': new Date(),
                    'user_is_online': false,
                    'user_status': "active",
                    'user_password': motDePasse,
                    'user_tokens.session': jwt.sign({user: user.user_email + user.user_password}, process.env.JWT_SECRET, {expiresIn: "1h"}),
                });
                user.user_tokens.invitation = undefined;

                // Sauvegardez les modifications dans la base de données
                await user.save();

                // Envoyez un message pour indiquer que l'inscription est réussie
                this.controller.send(this, {
                    "inscription_acceptee": {
                        session_token: user.user_tokens["session"],
                        user_info: user.info
                    },
                    id: msg.id
                });
            } else {
                // Envoyez un message pour indiquer que l'e-mail n'existe pas dans la base de données
                this.controller.send(this, {
                    "inscription_refusee": "Utilisateur non trouvé dans la base de données",
                    id: msg.id
                });
            }
        } catch (error) {
            // Gérez les erreurs
            console.error("Erreur lors du traitement de l'inscription :", error);
            // Envoyez un message pour indiquer que l'inscription a échoué en raison d'une erreur
            this.controller.send(this, {
                "inscription_refusee": "Erreur lors du traitement de l'inscription",
                id: msg.id
            });
        }
    };


    traitementMessage = async (msg) => {
        if (this.verbose || this.controller.verboseall) console.log("INFO (" + this.instanceName + ") - Traitement du message : " + JSON.stringify(msg));

        if (typeof msg.demande_inscription !== "undefined") {
            await this.handleRegistration(msg);
        }
    };
}

module.exports = Register;
