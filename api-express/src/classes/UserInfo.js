// UserInfo.js
const User = require("../models/user");
const {sha256} = require("../utils/utils");
const jwt = require("jsonwebtoken");

class UserInfo {
    constructor(controller) {
        this.controller = controller;
        this.instanceName = "UserInfo";

        this.listeMessagesEmis = ["user_info"];
        this.listeMessagesRecus = ["connexion_acceptee"];

        this.verbose = true;

        if (this.verbose || this.controller.verboseall) console.log("INFO (" + this.instanceName + ") - Création de l'instance UserInfo : " + this.instanceName);

        this.controller.subscribe(this, this.listeMessagesEmis, this.listeMessagesRecus);
    }

    handleUserInfo = async (msg) => {
        if (this.verbose || this.controller.verboseall) console.log("INFO (" + this.instanceName + ") - Traitement de la demande d'informations de l'utilisateur");

        const user_picture = msg.connexion_acceptee.user_picture;
        const user_firstname = msg.connexion_acceptee.user_firstname;
        const user_lastname = msg.connexion_acceptee.user_lastname;
        const user_job = msg.connexion_acceptee.user_job;

        try {
            this.controller.send(this, {
                "user_info": {
                    user_picture: user_picture,
                    user_firstname: user_firstname,
                    user_lastname: user_lastname,
                    user_job: user_job,

                },
                id: msg.id
            });
        } catch (error) {
            // Gérez les erreurs
            console.error("Erreur lors du traitement des données de l'utilisateur :", error);
        }
    };

    traitementMessage = async (msg) => {
        if (this.verbose || this.controller.verboseall) console.log("INFO (" + this.instanceName + ") - Traitement du message : " + JSON.stringify(msg));

        if (typeof msg.connexion_acceptee !== "undefined") {
            await this.handleUserInfo(msg);
        }
    };
}

module.exports = UserInfo;
