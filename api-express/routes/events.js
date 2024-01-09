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

    // Custom event
    socket.on("customEvent", (data) => {
      // Handle custom event logic here
      console.log("Custom event received:", data);
    });

    // Disconnect event
    socket.on("disconnect", () => {
      // Handle disconnect logic here
      console.log("User disconnected");
    });

    setInterval(() => {
      socket.emit("foo", "bar");
    }, 1000);
  });
};
