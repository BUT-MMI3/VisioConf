/* 
Author: @mathis-lambert
Date: Janvier 2024
*/

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import SubscribeToEvent from "../SubscribeToEvent";
import { socket } from "../../socket";

// Initialisation du contexte avec une valeur par défaut
const DiscussionContext = createContext({
  messages: [],
  // eslint-disable-next-line no-unused-vars
  addMessage: (message) => {},
});

export function DiscussionContextProvider({ children }) {
  const [messages, setMessages] = useState([]);

  // This is a trick to keep the same function reference
  const onMessageEventRef = useRef((message) => {
    setMessages((messages) => [...messages, message]);
  });

  useEffect(() => {
    // Subscribe to the event
    const unsub = SubscribeToEvent("chat-message", onMessageEventRef.current);

    return () => {
      // Clean up the subscription to avoid memory leaks
      unsub();
    };
  }, []);

  // Fonction pour ajouter un message au fil de discussion, gestion de l'ajout de message
  const addMessage = useCallback((message) => {
    socket.emit("chat-message", message);
  }, []);

  // La valeur fournie au contexte inclut les messages et la fonction pour ajouter un message
  const contextValue = {
    messages,
    addMessage,
  };

  return (
    <DiscussionContext.Provider value={contextValue}>
      <div className="discussion">{children}</div>
    </DiscussionContext.Provider>
  );
}

// Hook personnalisé pour utiliser le contexte du Discussion dans d'autres composants
// eslint-disable-next-line react-refresh/only-export-components
export function useDiscussion() {
  const context = useContext(DiscussionContext);
  if (!context) {
    throw new Error(
      "useDiscussion must be used within a DiscussionContextProvider"
    );
  }
  return context;
}
