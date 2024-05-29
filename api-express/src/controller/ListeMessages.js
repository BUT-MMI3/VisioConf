/**
 * @fileoverview Fichier contenant les constantes des messages émis et reçus par le composant SocketIO
 * À savoir que les messages émis sont les messages envoyés par le client au serveur et les messages reçus sont les messages envoyés par le serveur au client
 *
 * @author Mathis LAMBERT
 * @module ListeMessages
 */

/**
 * Liste des messages émis
 * @type {string[]}
 */
const ListeMessagesEmis = [
    "client_deconnexion",
    "demande_de_connexion",
    "demande_inscription",
    "demande_liste_utilisateurs",
    "demande_annuaire",
    "demande_info_utilisateur",
    "admin_demande_liste_utilisateurs",
    "admin_ajouter_utilisateur",
    "admin_demande_utilisateur_details",
    "admin_supprimer_utilisateur",
    "admin_modifier_utilisateur",
    "admin_demande_liste_roles",
    "admin_demande_role_details",
    "admin_ajouter_role",
    "admin_modifier_role",
    "admin_supprimer_role",
    "admin_demande_liste_permissions",
    "envoie_message",
    "demande_liste_discussions",
    "demande_historique_discussion",
    "demande_changement_status",
    "update_notifications",
    "update_profil",
    "update_picture",
    "demande_creation_discussion",
    "demande_discussion_info",
    "naviguer_vers",
    "new_call",
    "send_offer",
    "send_answer",
    "send_ice_candidate",
    "reject_offer",
    "hang_up",
    "update_session_token",
]

/**
 * Liste des messages reçus
 * @type {string[]}
 */
const ListeMessagesRecus = [
    "client_deconnexion",
    "liste_utilisateurs",
    "annuaire",
    "info_utilisateur",
    "admin_liste_utilisateurs",
    "admin_utilisateur_cree",
    "admin_utilisateur_details",
    "admin_utilisateur_supprime",
    "admin_utilisateur_modifie",
    "admin_liste_roles",
    "admin_role_details",
    "admin_role_cree",
    "admin_role_modifie",
    "admin_role_supprime",
    "admin_liste_permissions",
    "connexion_acceptee",
    "connexion_refusee",
    "inscription_acceptee",
    "inscription_refusee",
    "nouveau_message",
    "erreur_envoi_message",
    "liste_discussions",
    "historique_discussion",
    "distribue_notification",
    "retourne_modification_profil",
    "retourne_modification_picture",
    "discussion_creee",
    "discussion_non_creee",
    "status_answer",
    "discussion_info",
    "receive_offer",
    "receive_answer",
    "receive_ice_candidate",
    "offer_rejected",
    "call_created",
    "call_ended",
    "hung_up",
    "call_connected_users",
]

module.exports = {
    ListeMessagesEmis,
    ListeMessagesRecus
}