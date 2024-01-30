/**
 * Author: @mathis-lambert
 * Date : Janvier 2024
 */
module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("User connected");
    // Login event
    socket.on("login", (userData) => {
      // Handle login logic here
      console.log("User logged in:", userData);
    });

    // Logout event
    socket.on("logout", (userId) => {
      // Handle logout logic here
      console.log("User logged out:", userId);
    });

    socket.on("chat-message", (message) => {
      // Handle chat message logic here
      io.emit("chat-message", message);
      console.log("Chat message received:", message);
    });
    // Custom event
    socket.on("customEvent", (data) => {
      // Handle custom event logic here
      console.log("Custom event received:", data);
    });

    socket.on("search-user", (searchInput) => {
      // Traitez la recherche d'utilisateur ici et envoyez une réponse au client si nécessaire
      console.log(`Recherche d'utilisateur : ${searchInput}`);
    });

    // Disconnect event
    socket.on("disconnect", () => {
      // Handle disconnect logic here
      console.log("User disconnected");
    });
  });
};
