/* 
Author: @mathis-lambert
Date: Janvier 2024
*/

import { useState } from "react";
import { useDiscussion } from "../FilDiscussion/DiscussionContext";
import "./ChatInput.scss";

export default function ChatInput() {
  const { addMessage } = useDiscussion();
  const [newMessage, setNewMessage] = useState("");

  // Gestion de la soumission du nouveau message
  const handleSubmit = (event) => {
    event.preventDefault();
    if (newMessage.trim()) {
      addMessage(newMessage.trim());
      setNewMessage(""); // Réinitialiser le champ après l'envoi
    }
  };

  return (
    <form onSubmit={handleSubmit} className="chat-form">
      <input
        type="text"
        value={newMessage}
        onChange={(event) => setNewMessage(event.target.value)}
        placeholder="Votre message"
        className="chat-input"
      />
      <button type="submit" className="chat-send">Envoyer</button>
    </form>
  );
}
