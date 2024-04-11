/**
 * Author: @mathis-lambert
 * Date : Janvier 2024
 */
const Controller = require("../controller/Controller.js");
const CanalSocketIO = require("../controller/CanalSocketIO.js");
const LogIn = require("../classes/LogIn.js");
const Register = require("../classes/Register.js");
const Discussions = require("../classes/Discussions.js");
const Utilisateurs = require("../classes/Utilisateurs.js");
const Messages = require("../classes/Messages.js");

const SocketApp = (io) => {
    /**
     * Cette fonction initialise les événements de connexion et de déconnexion
     * pour le serveur de socket.
     *
     * @param {SocketIO.Server} io - Serveur de socket
     * @param {import("mongoose").Connection} db - Connexion à la base de données
     *
     * @returns {void}
     */

    const controller = new Controller();

    new CanalSocketIO(io, controller, "CanalSocketIO");

    new LogIn(controller, "LogIn");
    new Register(controller, "Register");
    new Discussions(controller, "Discussions");
    new Utilisateurs(controller, "Utilisateurs");
    new Messages(controller, "Messages");
};

module.exports = SocketApp;
