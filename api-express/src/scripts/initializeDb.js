require('dotenv').config();
const {v4: uuidv4} = require('uuid');
const Role = require('../models/role');
const Permission = require('../models/permission');
const User = require('../models/user');
const Discussion = require('../models/discussion');
const Call = require('../models/call');
const {sha256} = require("../utils/utils");

const usersToInsert = [
    {
        user_uuid: uuidv4(),
        user_firstname: 'John',
        user_lastname: 'Doe',
        user_job_desc: 'Developer',
        user_picture: 'https://play-lh.googleusercontent.com/15OKLti0ofnjK4XK1bgRXgsoblPvMi3hCA5z2o9WAcjssFNt2dXxemp2Om9vB3A_jYAe',
        user_email: 'john.doe@example.com',
        user_phone: "00.00.00.00.00",
        user_job: "Responsable RH",
        user_desc: "Chef de département MMI à l’universite de Toulon. Également professeur de développement web.",
        user_status: 'active',
        user_password: 'f4f263e439cf40925e6a412387a9472a6773c2580212a4fb50d224d3a817de17',
    },
    {
        user_uuid: uuidv4(),
        user_firstname: 'Janny',
        user_lastname: 'Doey',
        user_job_desc: 'Designer',
        user_email: 'janny.doey@example.com',
        user_phone: "00.00.00.00.00",
        user_job: "Responsable RH",
        user_desc: "Chef de département MMI à l’universite de Toulon. Également professeur de développement web.",
        user_status: 'active',
        user_password: 'f4f263e439cf40925e6a412387a9472a6773c2580212a4fb50d224d3a817de17', // hash = mdp
    },
    {
        user_uuid: uuidv4(),
        user_firstname: 'Jean',
        user_lastname: 'Deau',
        user_job_desc: 'Manager',
        user_email: 'jean.deau@example.com',
        user_phone: "00.00.00.00.00",
        user_job: "Responsable RH",
        user_desc: "Chef de département MMI à l’universite de Toulon. Également professeur de développement web.",
        user_status: 'active',
        user_password: 'f4f263e439cf40925e6a412387a9472a6773c2580212a4fb50d224d3a817de17', // hash = mdp
    },
    {
        user_uuid: uuidv4(),
        user_firstname: 'kyllian',
        user_lastname: 'Diochon',
        user_job_desc: 'Student',
        user_email: 'kyllian.diochon.kd@gmail.com',
        user_phone: "00.00.00.00.00",
        user_picture: '../others/default.png',
        user_job: "Student",
        user_desc: "Etudiant à l’universite de Toulon. Également développeur web.",
        user_password: ' ',
        user_status: 'waiting',
        user_tokens: {invitation: 'azerty1234'},
    },
];

const initializeRoles = async () => {
    const permissionIds = await initializePermissions();
    try {
        await Role.deleteMany({});
        const rolesToInsert = [
            {
                role_uuid: 'admin',
                role_label: 'Administrateur',
                role_permissions: [
                    permissionIds['admin_demande_liste_utilisateurs'],
                    permissionIds['admin_ajouter_utilisateur'],
                    permissionIds['admin_demande_utilisateur_details'],
                    permissionIds['admin_supprimer_utilisateur'],
                    permissionIds['admin_modifier_utilisateur'],
                    permissionIds['admin_demande_liste_roles'],
                    permissionIds['admin_demande_role_details'],
                    permissionIds['admin_ajouter_role'],
                    permissionIds['admin_modifier_role'],
                    permissionIds['admin_supprimer_role'],
                    permissionIds['admin_demande_liste_permissions'],
                ],
                role_default: true,
            },
            {
                role_uuid: 'user',
                role_label: 'Utilisateur',
                role_permissions: [
                    permissionIds['naviguer_vers'],
                    permissionIds['demande_liste_utilisateurs'],
                    permissionIds['demande_annuaire'],
                    permissionIds['demande_info_utilisateur'],
                    permissionIds['envoie_message'],
                    permissionIds['demande_liste_discussions'],
                    permissionIds['demande_historique_discussion'],
                    permissionIds['demande_notifications'],
                    permissionIds['demande_changement_status'],
                    permissionIds['update_notifications'],
                    permissionIds['update_profil'],
                    permissionIds['update_picture'],
                    permissionIds['demande_creation_discussion'],
                    permissionIds['demande_discussion_info'],
                    permissionIds['new_call'],
                    permissionIds['send_ice_candidate'],
                    permissionIds['send_offer'],
                    permissionIds['send_answer'],
                    permissionIds['reject_offer'],
                    permissionIds['hang_up'],
                    permissionIds['call_created'],
                    permissionIds['hung_up'],
                ],
                role_default: true,
            },
        ];
        for (const roleData of rolesToInsert) {
            const roleExists = await Role.findOne({role_label: roleData.role_label});
            if (!roleExists) {
                const newRole = new Role(roleData);
                await newRole.save();
                console.log(`Role '${roleData.role_label}' inserted`);
            } else {
                console.log(`Role '${roleData.role_label}' already exists`);
            }
        }
    } catch (err) {
        console.error(err);
    }
};

const initializePermissions = async () => {
    try {
        await Permission.deleteMany({});
        const permissions = [
            {
                permission_uuid: 'naviguer_vers',
                permission_label: 'Naviguer vers',
                permission_default: true,
            },
            {
                permission_uuid: 'admin_demande_liste_utilisateurs',
                permission_label: 'Lister les utilisateurs',
            },
            {
                permission_uuid: 'admin_ajouter_utilisateur',
                permission_label: 'Ajouter un utilisateur',
            },
            {
                permission_uuid: 'admin_demande_utilisateur_details',
                permission_label: 'Détails de l\'utilisateur',
            },
            {
                permission_uuid: 'admin_supprimer_utilisateur',
                permission_label: 'Supprimer un utilisateur',
            },
            {
                permission_uuid: 'admin_modifier_utilisateur',
                permission_label: 'Modifier un utilisateur',
            },
            {
                permission_uuid: 'admin_demande_liste_roles',
                permission_label: 'Lister les rôles',
            },
            {
                permission_uuid: 'admin_modifier_role',
                permission_label: 'Modifier un rôle',
            },
            {
                permission_uuid: 'admin_supprimer_role',
                permission_label: 'Supprimer un rôle',
            },
            {
                permission_uuid: 'admin_demande_liste_permissions',
                permission_label: 'Lister les permissions',
            },
            {
                permission_uuid: 'admin_ajouter_role',
                permission_label: 'Ajouter un rôle',
            },
            {
                permission_uuid: 'admin_demande_role_details',
                permission_label: 'Détails du rôle',
            },
            {
                permission_uuid: 'demande_liste_utilisateurs',
                permission_label: 'Lister les utilisateurs',
            },
            {
                permission_uuid: 'demande_annuaire',
                permission_label: 'Annuaire',
            },
            {
                permission_uuid: 'demande_info_utilisateur',
                permission_label: 'Information sur un utilisateur',
            },
            {
                permission_uuid: 'envoie_message',
                permission_label: 'Envoyer un message',
            },
            {
                permission_uuid: 'demande_liste_discussions',
                permission_label: 'Lister les discussions',
            },
            {
                permission_uuid: 'demande_historique_discussion',
                permission_label: 'Historique des discussions',
            },
            {
                permission_uuid: 'demande_notifications',
                permission_label: 'Notifications',
            },
            {
                permission_uuid: 'demande_changement_status',
                permission_label: 'Changement de status',
            },
            {
                permission_uuid: 'update_notifications',
                permission_label: 'Mise à jour des notifications',
            },
            {
                permission_uuid: 'update_profil',
                permission_label: 'Mise à jour du profil',
            },
            {
                permission_uuid: 'update_picture',
                permission_label: 'Mise à jour de la photo de profil',
            },
            {
                permission_uuid: 'demande_creation_discussion',
                permission_label: 'Création d\'une discussion',
            },
            {
                permission_uuid: 'demande_discussion_info',
                permission_label: 'Information sur une discussion',
            },
            {
                permission_uuid: 'new_call',
                permission_label: 'Nouvel appel',
                permission_default: true,
            },
            {
                permission_uuid: 'send_ice_candidate',
                permission_label: 'Envoi de candidat ICE',
                permission_default: true,
            },
            {
                permission_uuid: 'send_offer',
                permission_label: 'Envoi d\'offre',
                permission_default: true,
            },
            {
                permission_uuid: 'send_answer',
                permission_label: 'Envoi de réponse',
                permission_default: true,
            },
            {
                permission_uuid: 'reject_offer',
                permission_label: 'Rejet d\'offre',
                permission_default: true,
            },
            {
                permission_uuid: 'hang_up',
                permission_label: 'Raccrocher',
                permission_default: true,
            },
            {
                permission_uuid: 'receive_offer',
                permission_label: 'Réception d\'offre',
                permission_default: true,
            },
            {
                permission_uuid: 'receive_answer',
                permission_label: 'Réception de réponse',
                permission_default: true,
            },
            {
                permission_uuid: 'receive_ice_candidate',
                permission_label: 'Réception de candidat ICE',
                permission_default: true,
            },
            {
                permission_uuid: 'offer_rejected',
                permission_label: 'Offre rejetée',
                permission_default: true,
            },
            {
                permission_uuid: 'call_created',
                permission_label: 'Appel créé',
                permission_default: true,
            },
            {
                permission_uuid: 'hung_up',
                permission_label: 'Raccroché',
                permission_default: true,
            },
            {
                permission_uuid: 'call_connected_users',
                permission_label: 'Utilisateurs connectés',
                permission_default: true,
            },
        ];
        const permissionIds = {};
        for (const permission of permissions) {
            const newPermission = new Permission(permission);
            await newPermission.save();
            permissionIds[permission.permission_uuid] = newPermission._id;
            console.log(`Permission '${permission.permission_label}' inserted`);
        }

        return permissionIds;
    } catch (err) {
        console.error(err);
    }
};

const initializeUsers = async () => {
    try {
        if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
            console.log("Les identifiants de l'administrateur ne sont pas définis dans le .env");
        } else {
            const adminPasswordHash = await sha256(process.env.ADMIN_PASSWORD);

            // Récupérer les ObjectId des rôles 'admin' et 'user'
            const adminRole = await Role.findOne({role_uuid: 'admin'});
            const userRole = await Role.findOne({role_uuid: 'user'});

            if (adminRole && userRole) {
                usersToInsert.push({
                    user_uuid: uuidv4(),
                    user_firstname: 'Admin',
                    user_status: 'active',
                    user_lastname: 'Admin',
                    user_job_desc: 'Administrateur',
                    user_email: process.env.ADMIN_EMAIL,
                    user_phone: "00.00.00.00.00",
                    user_job: "Admin",
                    user_desc: "Chef de département MMI à l’universite de Toulon. Également professeur de développement web.",
                    user_password: adminPasswordHash,
                    user_is_admin: true,
                    user_roles: [adminRole._id, userRole._id],
                });
            } else {
                console.error("Les rôles 'admin' ou 'user' n'ont pas été trouvés");
                return;
            }
        }
        await User.deleteMany({});
        for (const userData of usersToInsert) {
            // flush existing users
            const userExists = await User.findOne({user_email: userData.user_email});
            if (!userExists) {
                const newUser = new User(userData);

                if (!userData.user_roles) {
                    const userRole = await Role.findOne({role_uuid: 'user'});
                    if (userRole) {
                        newUser.user_roles = [userRole._id];
                    }
                }
                await newUser.save();
                console.log(`User ${userData.user_email} inserted`);
            } else {
                console.log(`User ${userData.user_email} already exists`);
            }
        }
    } catch (err) {
        console.error(err);
    }
};

const initializeDiscussions = async () => {
    try {
        await Discussion.deleteMany({});

        // Trouvez les utilisateurs par email (ou un autre identifiant unique)
        const userJohn = await User.findOne({user_email: 'john.doe@example.com'});
        const userJanny = await User.findOne({user_email: 'janny.doey@example.com'});
        const userJean = await User.findOne({user_email: 'jean.deau@example.com'});
        const userUtilisateur = await User.findOne({user_email: 'utilisateur@example.com'});

        // Vérifiez si les utilisateurs existent
        if (!userJohn || !userJanny || !userJean || !userUtilisateur) {
            console.log("Certains utilisateurs sont manquants. Assurez-vous que les utilisateurs sont insérés d'abord.");
            return;
        }

        // Discussions à insérer
        const discussionsToInsert = [
            {
                discussion_uuid: uuidv4(),
                discussion_name: 'Project Discussion',
                discussion_description: 'Discussion about the project',
                discussion_members: [userJohn._id, userJanny._id],
                discussion_creator: userJohn._id,
            },
        ];

        for (const discussionData of discussionsToInsert) {
            const discussionExists = await Discussion.findOne({discussion_uuid: discussionData.discussion_uuid});
            if (!discussionExists) {
                const newDiscussion = new Discussion(discussionData);
                await newDiscussion.save();
                console.log(`Discussion '${discussionData.discussion_name}' inserted`);
            } else {
                console.log(`Discussion '${discussionData.discussion_name}' already exists`);
            }
        }
    } catch (err) {
        console.error(err);
    }
};

const resetCalls = async () => {
    try {
        const callsNotEnded = await Call.find({is_ended: false});
        for (const call of callsNotEnded) {
            call.is_ended = true;
            if (!call.date_ended) {
                call.date_ended = Date.now();
            }
            await call.save();
        }
    } catch (err) {
        console.error(err);
    }
};

module.exports = {
    initializeRoles,
    initializeUsers,
    initializeDiscussions,
    resetCalls,
};
