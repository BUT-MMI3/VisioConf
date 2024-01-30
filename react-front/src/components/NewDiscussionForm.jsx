import React, { useState } from 'react';

const NewDiscussionForm = ({ socket }) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchUser = () => {
    // Envoyer l'événement 'search-user' avec la valeur de l'input au serveur via le socket
    socket.emit('search-user', searchInput);
  };

  return (
    <div>
      <label>Rechercher un utilisateur :</label>
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <button onClick={handleSearchUser}>Rechercher</button>
    </div>
  );
};

export default NewDiscussionForm;