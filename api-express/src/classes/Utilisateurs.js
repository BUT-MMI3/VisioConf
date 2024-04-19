const User = require('../models/user');
const {v4: uuidv4} = require("uuid");

class Utilisateurs {
    controller = null;
    instanceName = "Utilisateurs";

    listeMessagesEmis = ["liste_utilisateurs", "admin_liste_utilisateurs", "admin_utilisateur_cree", "admin_utilisateur_details"];
    listeMessagesRecus = ["demande_liste_utilisateurs", "admin_demande_liste_utilisateurs", "admin_ajouter_utilisateur", "admin_demande_utilisateur_details"];

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
        } else if (typeof msg.admin_ajouter_utilisateur !== 'undefined') {
            if (this.verbose || this.controller.verboseall) console.log(`INFO (${this.instanceName}) - Traitement de la création d'un utilisateur par un administrateur`);

            const { user_firstname, user_lastname, user_email, user_phone, user_job } = msg.admin_ajouter_utilisateur.userData;

            const newUser = new User({
                user_uuid: uuidv4(),
                user_password: 'default_password',
                user_firstname,
                user_lastname,
                user_email,
                user_phone,
                user_job
            });

            await newUser.save();

            this.controller.send(this, {
                admin_utilisateur_cree: {
                    message: "Utilisateur créé avec succès",
                    newUser
                },
                id: msg.id
            });
        } else if (typeof msg.admin_demande_utilisateur_details !== 'undefined') {
            if (this.verbose || this.controller.verboseall) console.log(`INFO (${this.instanceName}) - Traitement de la demande de détails d'un utilisateur par un administrateur`);
            console.log(msg.admin_demande_utilisateur_details.userId);
            const user = await User.findOne({_id: msg.admin_demande_utilisateur_details.userId}).select('user_uuid user_firstname user_lastname user_email user_phone user_job user_date_create user_picture user_is_online user_disturb_status user_last_connection user_direct_manager user_tokens user_roles');
            this.controller.send(this, {
                admin_utilisateur_details: {
                    user
                },
                id: msg.id
            });
        }
    }
}

module.exports = Utilisateurs;