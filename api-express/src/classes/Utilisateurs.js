require("dotenv").config();
const User = require('../models/user');
const Role = require('../models/role');
const {v4: uuidv4} = require("uuid");
const {sha256} = require("../utils/utils");
const mailer = require('../utils/mailer');

class Utilisateurs {
    controller = null;
    instanceName = "Utilisateurs";

    listeMessagesEmis = ["liste_utilisateurs", "annuaire", "info_utilisateur", "admin_liste_utilisateurs", "admin_utilisateur_cree", "admin_utilisateur_details", "admin_utilisateur_supprime", "admin_utilisateur_modifie"];
    listeMessagesRecus = ["demande_liste_utilisateurs", "demande_annuaire", "demande_info_utilisateur", "admin_demande_liste_utilisateurs", "admin_ajouter_utilisateur", "admin_demande_utilisateur_details", "admin_supprimer_utilisateur", "admin_modifier_utilisateur"];

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
        } else if (typeof msg.demande_annuaire !== 'undefined') {
            if (this.verbose || this.controller.verboseall) console.log(`INFO (${this.instanceName}) - Traitement d'une demande d'annuaire`);

            const allUsers = await User.find({}).select('user_uuid user_firstname user_lastname user_job user_picture');

            this.controller.send(this, {
                annuaire: {
                    success: true,
                    annuaire: allUsers,
                },
                id: msg.id
            });
        } else if (typeof msg.demande_info_utilisateur !== 'undefined') {
            if (this.verbose || this.controller.verboseall) console.log(`INFO (${this.instanceName}) - Traitement de la demande d'informations sur un utilisateur`);

            const user = await User.findOne({user_uuid: msg.demande_info_utilisateur.user_uuid}).select('user_uuid user_firstname user_lastname user_email user_phone user_job user_desc user_date_create user_picture user_is_online user_disturb_status user_last_connection user_direct_manager user_tokens user_roles').populate('user_roles');

            this.controller.send(this, {
                info_utilisateur: {
                    success: true,
                    user: user
                },
                id: msg.id
            });

        } else if (typeof msg.admin_demande_liste_utilisateurs !== 'undefined') {
            if (this.verbose || this.controller.verboseall) console.log(`INFO (${this.instanceName}) - Traitement d'une demande de liste d'utilisateurs par un administrateur`);

            const allUsers = await User.find({}).select('user_uuid user_firstname user_lastname user_email user_job user_is_online');

            this.controller.send(this, {
                admin_liste_utilisateurs: {
                    success: true,
                    liste_utilisateurs: allUsers,
                },
                id: msg.id
            });
        } else if (typeof msg.admin_ajouter_utilisateur !== 'undefined') {
            if (this.verbose || this.controller.verboseall) console.log(`INFO (${this.instanceName}) - Traitement de la création d'un utilisateur par un administrateur`);

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
                user_role: [],
                user_desc: ' ',
                user_status: user_status || 'waiting',
            });
            const userRole = await Role.findOne({role_uuid: "user"});
            newUser.user_roles.push(userRole._id);

            // if no password set, generate invitation token and send email
            if (!user_password) {
                newUser.user_tokens.invitation = uuidv4();
                await mailer.sendMail({
                    to: newUser.user_email,
                    subject: 'Invitation à rejoindre Visioconf',
                    text: `Bonjour ${newUser.user_firstname} ${newUser.user_lastname},\n\nVous avez été invité à rejoindre Visioconf. Pour cela, veuillez cliquer sur le lien suivant : ${process.env.CLIENT_URL}/inscription/${newUser.user_tokens.invitation}`,
                    html: `<p>Bonjour ${newUser.user_firstname} ${newUser.user_lastname},</p><p>Vous avez été invité à rejoindre Visioconf. Pour cela, veuillez cliquer sur le lien suivant : <a href="${process.env.CLIENT_URL}/inscription/${newUser.user_tokens.invitation}">Rejoindre l'application</a>`
                });
                if (this.verbose || this.controller.verboseall) console.log(`INFO (${this.instanceName}) - Invitation email sent to ${newUser.user_email} - Token : ${newUser.user_tokens.invitation}`);
            }

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

            const user = await User.findOne({_id: msg.admin_demande_utilisateur_details.userId}).select('user_uuid user_firstname user_lastname user_email user_phone user_status user_job user_date_create user_picture user_is_online user_disturb_status user_last_connection user_direct_manager user_tokens user_roles').populate('user_roles');
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

            const {
                user_firstname,
                user_lastname,
                user_email,
                user_phone,
                user_job,
                user_status
            } = msg.admin_modifier_utilisateur.userData;

            const user = await User.findOne({user_email: msg.admin_modifier_utilisateur.userData.user_email}).populate('user_roles');
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