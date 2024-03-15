import { useState, useEffect } from 'react';
import { socket } from '../controller/socket.js';

const ChatCreationDeConversation = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [usersCreateGroup, setUsersCreateGroup] = useState([]);

  const handleSearchUser = (query) => {
    socket.emit('search-user', query);
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchInput(query);
    handleSearchUser(query);
  };

  const handleUserClick = (user) => {
    const isSelected = selectedUsers.some((selectedUser) => selectedUser._id === user._id);
    if (isSelected) {
      setSelectedUsers((prevUsers) => prevUsers.filter((u) => u._id !== user._id));
    } else {
      setSelectedUsers((prevUsers) => [...prevUsers, user]);
    }
  };

  const handleCreateGroup = () => {
    socket.emit('create-group', selectedUsers);
  };

  const handleFetchUsers = () => {
    socket.emit('fetch-users');
  };

  const handleSelectUser = (user) => {
    setUsersCreateGroup((prevUsers) => [...prevUsers, user]);
  };

  const handleRemoveUser = (user) => {
    setUsersCreateGroup((prevUsers) => prevUsers.filter((u) => u._id !== user._id));
  };

  useEffect(() => {
    socket.on('search-results', (results) => {
      setSearchResults(results);
    });

    socket.on('group-created', (group) => {
      console.log('Groupe créé avec succès :', group);
    });

    socket.on('users-list', (usersList) => {
      console.log('Liste des utilisateurs récupérée avec succès :', usersList);
    });

    return () => {
      socket.off('search-results');
      socket.off('group-created');
      socket.off('users-list');
    };
  }, []);

  return (
    <div>
      <label>Rechercher un utilisateur :</label>
      <input type="text" value={searchInput} onChange={handleInputChange} />

      <ul>
        {searchResults.map((user) => (
          <li key={user._id} onClick={() => handleUserClick(user)}>
            {user.user_fullname} {selectedUsers.some((selectedUser) => selectedUser._id === user._id) && '(Sélectionné)'}
          </li>
        ))}
      </ul>

      <button onClick={handleCreateGroup}>Créer un groupe</button>

      <div>
        <p>Utilisateurs sélectionnés :</p>
        <ul>
          {selectedUsers.map((user) => (
            <li key={user._id}>{user.user_fullname}</li>
          ))}
        </ul>
      </div>

      <button onClick={handleFetchUsers}>Récupérer la liste des utilisateurs</button>

      <div>
        <p>Utilisateurs pour la création de groupe :</p>
        <ul>
          {usersCreateGroup.map((user) => (
            <li key={user._id}>
              {user.user_fullname} <button onClick={() => handleRemoveUser(user)}>Retirer</button>
            </li>
          ))}
        </ul>
      </div>

      <button onClick={() => handleSelectUser(searchResults[0])}>Sélectionner un utilisateur</button>
    </div>
  );
};

export default ChatCreationDeConversation;