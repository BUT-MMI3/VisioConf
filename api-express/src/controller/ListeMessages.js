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
    "envoie_message",
    "demande_liste_discussions",
    "demande_historique_discussion",
    "demande_creation_discussion",
    "naviguer_vers"
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
    "reception_message",
    "liste_discussions",
    "historique_discussion",
    "discussion_creee",
]

module.exports = {
    ListeMessagesEmis,
    ListeMessagesRecus
}