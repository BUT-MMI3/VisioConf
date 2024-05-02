/**
 * Author: @mathis-lambert
 * Date : Janvier 2024
 * Description : Ce fichier est le point d'entrée de l'application
 */
const {app, db} = require("./app");
const {createServer} = require("http");
const {Server} = require("socket.io");
const {onError, onListening, normalizePort} = require("./src/utils/utils");
const SocketApp = require("./src/routes/events");
require("dotenv").config();

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || "3001");
app.set("port", port);

/**
 * Create HTTP and Socket.io server.
 */
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
    path: "/api/socket.io",
});
SocketApp(io);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on("error", (e) => onError(e, port));
server.on("listening", () => onListening(server));
