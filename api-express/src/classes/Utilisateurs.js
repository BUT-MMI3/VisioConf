const User = require('../models/user');
const {v4: uuidv4} = require("uuid");
const {sha256} = require("../utils/utils");

class Utilisateurs {
    controller = null;
    instanceName = "Utilisateurs";

    listeMessagesEmis = ["liste_utilisateurs", "admin_liste_utilisateurs", "admin_utilisateur_cree", "admin_utilisateur_details", "admin_utilisateur_supprime", "admin_utilisateur_modifie"];
    listeMessagesRecus = ["demande_liste_utilisateurs", "admin_demande_liste_utilisateurs", "admin_ajouter_utilisateur", "admin_demande_utilisateur_details", "admin_supprimer_utilisateur", "admin_modifier_utilisateur"];

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

            try {
                const user = await User.findBySocketId(msg.id);
                if (!user.user_roles.includes('admin')) {
                    this.controller.send(this, {
                        admin_liste_utilisateurs: {
                            success: false,
                            message: "Vous n'avez pas les droits pour récupérer la liste des utilisateurs"
                        },
                        id: msg.id
                    });
                    return;
                }
            } catch (error) {
                console.log(error);
            }

            const allUsers = await User.find({}).select('user_uuid user_firstname user_lastname user_email user_job');

            this.controller.send(this, {
                admin_liste_utilisateurs: {
                    success: true,
                    liste_utilisateurs: allUsers,
                },
                id: msg.id
            });
        } else if (typeof msg.admin_ajouter_utilisateur !== 'undefined') {
            if (this.verbose || this.controller.verboseall) console.log(`INFO (${this.instanceName}) - Traitement de la création d'un utilisateur par un administrateur`);

            try {
                const user = await User.findBySocketId(msg.id);
                if (!user.user_roles.includes('admin')) {
                    this.controller.send(this, {
                        admin_utilisateur_cree: {
                            success: false,
                            message: "Vous n'avez pas les droits pour créer un utilisateur"
                        },
                        id: msg.id
                    });
                    return;
                }
            } catch (error) {
                console.log(error);
            }
            const {
                user_firstname,
                user_lastname,
                user_email,
                user_password,
                user_phone,
                user_job,
                user_status
            } = msg.admin_ajouter_utilisateur.userData;
            const password = user_password ? await sha256(user_password) : "default_password";
            const newUser = new User({
                user_uuid: uuidv4(),
                user_password: password,
                user_firstname,
                user_lastname,
                user_email,
                user_phone,
                user_job,
                user_desc: ' ',
                user_status: user_status || 'waiting',
            });

            await newUser.save();

            this.controller.send(this, {
                admin_utilisateur_cree: {
                    success: true,
                    message: "Utilisateur créé avec succès",
                    newUser: newUser
                },
                id: msg.id
            });
        } else if (typeof msg.admin_demande_utilisateur_details !== 'undefined') {
            if (this.verbose || this.controller.verboseall) console.log(`INFO (${this.instanceName}) - Traitement de la demande de détails d'un utilisateur par un administrateur`);

            try {
                const user = await User.findBySocketId(msg.id);
                if (!user.user_roles.includes('admin')) {
                    this.controller.send(this, {
                        admin_utilisateur_details: {
                            success: false,
                            message: "Vous n'avez pas les droits pour récupérer les détails de cet utilisateur"
                        },
                        id: msg.id
                    });
                    return;
                }
            } catch (error) {
                console.log(error);
            }

            const user = await User.findOne({_id: msg.admin_demande_utilisateur_details.userId}).select('user_uuid user_firstname user_lastname user_email user_phone user_status user_job user_date_create user_picture user_is_online user_disturb_status user_last_connection user_direct_manager user_tokens user_roles');
            this.controller.send(this, {
                admin_utilisateur_details: {
                    success: true,
                    user: user
                },
                id: msg.id
            });
        } else if (typeof msg.admin_supprimer_utilisateur !== 'undefined') {
            if (this.verbose || this.controller.verboseall) console.log(`INFO (${this.instanceName}) - Traitement de la suppression d'un utilisateur par un administrateur`);

            try {
                const user = await User.findBySocketId(msg.id);
                if (!user.user_roles.includes('admin')) {
                    this.controller.send(this, {
                        admin_utilisateur_supprime: {
                            success: false,
                            message: "Vous n'avez pas les droits pour supprimer cet utilisateur"
                        },
                        id: msg.id
                    });
                    return;
                }

                await User.deleteOne({_id: msg.admin_supprimer_utilisateur});
                this.controller.send(this, {
                    admin_utilisateur_supprime: {
                        success: true,
                        message: "Utilisateur supprimé avec succès"
                    },
                    id: msg.id
                });

                const allUsers = await User.find({}).select('user_uuid user_firstname user_lastname user_email user_job');

                this.controller.send(this, {
                    admin_liste_utilisateurs: {
                        success: true,
                        liste_utilisateurs: allUsers,
                    },
                    id: msg.id
                });
            } catch (error) {
                console.log(error);
            }
        } else if (typeof msg.admin_modifier_utilisateur !== 'undefined') {
            if (this.verbose || this.controller.verboseall) console.log(`INFO (${this.instanceName}) - Traitement de la modification d'un utilisateur par un administrateur`);

            try {
                const user = await User.findBySocketId(msg.id);
                if (!user.user_roles.includes('admin')) {
                    this.controller.send(this, {
                        admin_utilisateur_modifie: {
                            success: false,
                            message: "Vous n'avez pas les droits pour modifier cet utilisateur"
                        },
                        id: msg.id
                    });
                    return;
                }
            } catch (error) {
                console.log(error);
            }

            const {
                user_firstname,
                user_lastname,
                user_email,
                user_phone,
                user_job,
                user_status
            } = msg.admin_modifier_utilisateur.userData;

            const user = await User.findOne({user_email: msg.admin_modifier_utilisateur.userData.user_email});
            user.user_firstname = user_firstname;
            user.user_lastname = user_lastname;
            user.user_email = user_email;
            user.user_phone = user_phone;
            user.user_job = user_job;
            user.user_status = user_status;

            await user.save();

            this.controller.send(this, {
                admin_utilisateur_modifie: {
                    success: true,
                    message: "Utilisateur modifié avec succès",
                    editedUser: user
                },
                id: msg.id
            });
        }
    }
}

module.exports = Utilisateurs;