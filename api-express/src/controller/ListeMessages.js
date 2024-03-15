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
    "demande_de_connexion",
    "client_deconnexion",
    "demande_liste_utilisateurs",
    "chat_message",
    "demande_liste_discussions",
    "demande_historique_discussion",
]

/**
 * Liste des messages reçus
 * @type {string[]}
 */
const ListeMessagesRecus = [
    "liste_utilisateurs",
    "connexion_acceptee",
    "connexion_refusee",
    "chat_message",
    "liste_discussions",
    "historique_discussion",
]

module.exports = {
    ListeMessagesEmis,
    ListeMessagesRecus
}