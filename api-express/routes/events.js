/**
 * Author: @mathis-lambert
 * Date : Janvier 2024
 */
const uuid = require('uuid');

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

    socket.on('search-user', async (query) => {
      try {
        
        const results = await User.find({
          $or: [{ user_firstname: { $regex: query, $options: 'i' } }, { user_lastname: { $regex: query, $options: 'i' } }],
        });

        // Émettre les résultats de la recherche à l'utilisateur
        socket.emit('search-results', results);
      } catch (error) {
        console.error('Erreur lors de la recherche d\'utilisateur :', error.message);
      }
    });

    socket.on('create-group', async (selectedUsers) => {
      try {
        const newDiscussion = new Discussion({
          discussion_uuid: uuid.v4(), // Utilisation de uuid pour générer un identifiant UUID aléatoire
          discussion_name: null, 
          discussion_description: null, 
          discussion_type: 'group',
          discussion_members: selectedUsers,
        });

        const savedDiscussion = await newDiscussion.save();
        io.emit('group-created', savedDiscussion);
      } catch (error) {
        console.error('Erreur lors de la création du groupe :', error.message);
      }
    });

    socket.on('fetch-users', async () => {
      try {
        const usersList = await User.find({}, 'user_firstname user_lastname _id');
        socket.emit('users-list', usersList);
      } catch (error) {
        console.error('Erreur lors de la récupération de la liste des utilisateurs :', error.message);
      }
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
