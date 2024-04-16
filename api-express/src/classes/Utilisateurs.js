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

            const utilisateursConnectes = await User.find({
                user_socket_id: {$ne: msg.id},
                user_is_online: true
            }).select('user_uuid user_firstname user_lastname user_job user_socket_id');

            const utilisateursDeconnectes = await User.find({
                user_socket_id: {$ne: msg.id},
                user_is_online: false
            }).select('user_uuid user_firstname user_lastname user_job');

            utilisateursConnectes.forEach(utilisateur => {
                if (utilisateur.user_socket_id) {
                    this.controller.send(this, {
                        liste_utilisateurs: {
                            utilisateurs_connectes: utilisateursConnectes,
                            utilisateurs_deconnectes: utilisateursDeconnectes
                        },
                        id: utilisateur.user_socket_id
                    });
                }
            });
        }
    }
}

module.exports = Utilisateurs;