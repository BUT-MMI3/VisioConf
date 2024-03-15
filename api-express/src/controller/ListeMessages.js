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
]

/**
 * Liste des messages reçus
 * @type {string[]}
 */
const ListeMessagesRecus = [
    "liste_utilisateurs",
    "connexion_acceptee",
    "connexion_refusee",
]

module.exports = {
    ListeMessagesEmis,
    ListeMessagesRecus
}