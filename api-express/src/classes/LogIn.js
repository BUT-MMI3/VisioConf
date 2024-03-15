const User = require("../models/user");
const {sha256} = require("../utils/utils");

class LogIn {
    controller = null;
    mongo = null;
    nomDInstance = "";

    listeMessagesEmis = ["connexion_acceptee", "connexion_refusee"];
    listeMessagesRecus = ["demande_de_connexion"];

    email = "";
    password = "";

    verbose = true;

    constructor(controller, database, nomDInstance) {
        this.controller = controller;
        this.mongo = database;
        this.nomDInstance = nomDInstance;

        if (this.verbose || this.controller.verboseall) console.log("INFO (LogIn) - Création de l'instance LogIn : " + this.nomDInstance);

        this.controller.subscribe(this, this.listeMessagesEmis, this.listeMessagesRecus);
    }

    traitementMessage = async msg => {
        if (this.verbose || this.controller.verboseall) console.log("INFO (LogIn) - Traitement du message : " + JSON.stringify(msg));

        if (typeof msg.demande_de_connexion !== "undefined") {
            if (this.verbose || this.controller.verboseall) console.log("INFO (LogIn) - Traitement de la demande de connexion");
            this.email = msg.demande_de_connexion.email;
            this.password = msg.demande_de_connexion.password;

            console.log("email : " + this.email)
            console.log("password : " + this.password)

            // regex on mail
            if (this.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-z]{2,6}$/)) {
                if (this.verbose || this.controller.verboseall) console.log("INFO (LogIn) - Adresse mail valide");
                // check if mail exists in database
                let user = await User.findOne({user_email: this.email});
                if (user) {
                    if (this.verbose || this.controller.verboseall) console.log("INFO (LogIn) - Utilisateur trouvé dans la base de données");

                    console.log(user.user_password)

                    if (user.user_password === sha256(this.password)) {
                        if (this.verbose || this.controller.verboseall) console.log("INFO (LogIn) - Mot de passe valide");
                        this.controller.send(this, {connexion_acceptee: "Connexion acceptée", id: msg.id}, this.nomDInstance);
                    } else {
                        if (this.verbose || this.controller.verboseall) console.log("INFO (LogIn) - Mot de passe invalide");
                        this.controller.send(this, {connexion_refusee: "Mot de passe invalide", id: msg.id}, this.nomDInstance);
                    }
                } else {
                    if (this.verbose || this.controller.verboseall) console.log("INFO (LogIn) - Utilisateur non trouvé dans la base de données");
                    this.controller.send(this, {connexion_refusee: "Utilisateur non trouvé", id: msg.id}, this.nomDInstance);
                }
            } else {
                if (this.verbose || this.controller.verboseall) console.log("INFO (LogIn) - Adresse mail invalide");
                this.controller.send(this, {connexion_refusee: "Adresse mail invalide", id: msg.id}, this.nomDInstance);
            }
        }
    }
}

module.exports = LogIn;