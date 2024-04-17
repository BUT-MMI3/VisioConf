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
    "demande_user_info",
    "demande_de_connexion",
    "demande_inscription",
    "demande_liste_utilisateurs",
    "envoie_message",
    "demande_liste_discussions",
    "demande_historique_discussion",
    "demande_notifications",
    "update_notifications",
    "demande_creation_discussion",
    "demande_discussion_info",
    "naviguer_vers",
    "send_offer",
    "send_answer",
    "send_ice_candidate",
    "reject_offer",
    "hang_up"
]

/**
 * Liste des messages reçus
 * @type {string[]}
 */
const ListeMessagesRecus = [
    "client_deconnexion",
    "liste_utilisateurs",
    "connexion_acceptee",
    "connexion_refusee",
    "inscription_acceptee",
    "inscription_refusee",
    "information_user",
    "nouveau_message",
    "erreur_envoi_message",
    "liste_discussions",
    "historique_discussion",
    "notification_answer",
    "discussion_creee",
    "discussion_non_creee",
    "discussion_info",
    "receive_offer",
    "receive_answer",
    "receive_ice_candidate",
    "offer_rejected",
    "call_created",
    "call_ended",
    "hung_up"
]

module.exports = {
    ListeMessagesEmis,
    ListeMessagesRecus
}