/**
 * Author: @mathis-lambert
 * Date : Janvier 2024
 */
const Controller = require("../controller/Controller.js");
const CanalSocketIO = require("../controller/CanalSocketIO.js");
const LogIn = require("../classes/LogIn.js");
const Discussions = require("../classes/Discussions.js");

const uuid = require("uuid");
const User = require("../models/user");
const Discussion = require("../models/discussion");

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
    new Discussions(controller, "Discussions");
}

module.exports = SocketApp;
