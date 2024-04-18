const User = require('../models/user');

class Utilisateurs {
    controller = null;
    instanceName = "Utilisateurs";

    listeMessagesEmis = ["liste_utilisateurs", "admin_liste_utilisateurs"];
    listeMessagesRecus = ["demande_liste_utilisateurs", "admin_demande_liste_utilisateurs"];

    verbose = true;

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

            if (msg.id) {
                this.controller.send(this, {
                    liste_utilisateurs: {
                        utilisateurs_connectes: utilisateursConnectes,
                        utilisateurs_deconnectes: utilisateursDeconnectes
                    },
                    id: msg.id
                });
            } else {
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
        } else if (typeof msg.admin_demande_liste_utilisateurs !== 'undefined') {
            if (this.verbose || this.controller.verboseall) console.log(`INFO (${this.instanceName}) - Traitement d'une demande de liste d'utilisateurs par un administrateur`);

            const allUsers = await User.find({}).select('user_uuid user_firstname user_lastname user_email user_job');

            this.controller.send(this, {
                admin_liste_utilisateurs : {
                    liste_utilisateurs: allUsers,
                },
                id: msg.id
            });
        }
    }
}

module.exports = Utilisateurs;