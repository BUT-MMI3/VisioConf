/**
 * Author: @mathis-lambert
 * Date : Janvier 2024
 */
const Controller = require("../controller/Controller.js");
const CanalSocketIO = require("../controller/CanalSocketIO.js");
const LogIn = require("../classes/LogIn.js");

const uuid = require("uuid");
const User = require("../models/user");
const Discussion = require("../models/discussion");

const SocketApp = (io, db) => {
  /**
   * Cette fonction initialise les événements de connexion et de déconnexion
   * pour le serveur de socket.
   *
   * @param {SocketIO.Server} io - Serveur de socket
   * @param {import("mongoose").Connection} db - Connexion à la base de données
   *
   * @returns {void}
   */

      // Initialisation des canaux
    const controller = new Controller();
    const canalSocketIO = new CanalSocketIO(io, controller, "CanalSocketIO");

    const login = new LogIn(controller, db, "LogIn");


  // io.on("connection", (socket) => {
  //   console.log("User connected");
  //   // Login event
  //   socket.on("login", (userData) => {
  //     // Handle login logic here
  //     console.log("User logged in:", userData);
  //   });
  //
  //   // Logout event
  //   socket.on("logout", (userId) => {
  //     // Handle logout logic here
  //     console.log("User logged out:", userId);
  //   });
  //
  //   socket.on("chat-message", (message) => {
  //     // Handle chat message logic here
  //     const messageObj = {
  //       message_uuid: "uuid",
  //       message_content: message,
  //       message_sender: "server",
  //       message_date_create: new Date(),
  //       message_react_list: [],
  //       message_status: "sent",
  //       from: "server",
  //     };
  //     io.emit("chat-message", messageObj);
  //     console.log("Chat message received:", message);
  //   });
  //
  //   socket.on("test-send", (data) => {
  //     // Handle chat message logic here
  //     console.log("Test message received:", data);
  //     io.emit("test-receive", data);
  //   });
  //
  //   // Custom event
  //   socket.on("customEvent", (data) => {
  //     // Handle custom event logic here
  //     console.log("Custom event received:", data);
  //   });
  //
  //   socket.on("search-user", async (query) => {
  //     try {
  //       const results = await User.find({
  //         $or: [
  //           { user_firstname: { $regex: query, $options: "i" } },
  //           { user_lastname: { $regex: query, $options: "i" } },
  //         ],
  //       });
  //
  //       // Émettre les résultats de la recherche à l'utilisateur
  //       socket.emit("search-results", results);
  //     } catch (error) {
  //       console.error(
  //         "Erreur lors de la recherche d'utilisateur :",
  //         error.message
  //       );
  //     }
  //   });
  //
  //   socket.on("create-group", async (selectedUsers) => {
  //     try {
  //       const newDiscussion = new Discussion({
  //         discussion_uuid: uuid.v4(), // Utilisation de uuid pour générer un identifiant UUID aléatoire
  //         discussion_name: null,
  //         discussion_description: null,
  //         discussion_type: "group",
  //         discussion_members: selectedUsers,
  //       });
  //
  //       const savedDiscussion = await newDiscussion.save();
  //       io.emit("group-created", savedDiscussion);
  //     } catch (error) {
  //       console.error("Erreur lors de la création du groupe :", error.message);
  //     }
  //   });
  //
  //   socket.on("fetch-users", async () => {
  //     try {
  //       const usersList = await User.find(
  //         {},
  //         "user_firstname user_lastname _id"
  //       );
  //       socket.emit("users-list", usersList);
  //     } catch (error) {
  //       console.error(
  //         "Erreur lors de la récupération de la liste des utilisateurs :",
  //         error.message
  //       );
  //     }
  //   });
  //
  //   socket.on("fetch-discussions", async () => {
  //     try {
  //       const discussionsList = await Discussion.find(
  //         {},
  //         "discussion_name discussion_uuid"
  //       );
  //       socket.emit("discussions-list", discussionsList);
  //     } catch (error) {
  //       console.error(
  //         "Erreur lors de la récupération de la liste des discussions :",
  //         error.message
  //       );
  //     }
  //   });
  //
  //   // Disconnect event
  //   socket.on("disconnect", () => {
  //     // Handle disconnect logic here
  //     console.log("User disconnected");
  //   });
  // });
}

module.exports = SocketApp;
