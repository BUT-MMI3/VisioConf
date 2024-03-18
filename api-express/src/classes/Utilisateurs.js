const User = require('../models/user');

class Utilisateurs {
    controller = null;
    instanceName = "Utilisateurs";

    listeMessagesEmis = ["liste_utilisateurs"];
    listeMessagesRecus = ["demande_liste_utilisateurs"];

    verbose = false;

    constructor(controller, instanceName) {
        this.controller = controller;
        this.instanceName = instanceName;

        if (this.verbose || controller.verboseall) console.log(`INFO (${this.instanceName}) - Création de l'instance Utilisateurs`);

        controller.subscribe(this, this.listeMessagesEmis, this.listeMessagesRecus);
    }

    traitementMessage = async msg => {
        if (this.verbose || this.controller.verboseall) console.log(`INFO (${this.instanceName}) - Traitement d'un message`);

        if (typeof msg.demande_liste_utilisateurs !== 'undefined') {
            if (this.verbose || this.controller.verboseall) console.log(`INFO (${this.instanceName}) - Traitement d'une demande de liste d'utilisateurs`);

            let listeUtilisateurs = await User.find({user_socket_id: {$ne: msg.id}}).select('user_uuid user_firstname user_lastname user_job');
            this.controller.send(this, {liste_utilisateurs: listeUtilisateurs, id: msg.id});
        }
    }
}

module.exports = Utilisateurs;