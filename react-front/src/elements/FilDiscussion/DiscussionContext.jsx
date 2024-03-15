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
// import SubscribeToEvent from "../SubscribeToEvent";
import { socket } from "../../controller/socket.js";
import { useLocation } from "react-router-dom";
import ChatInput from "../../elements/ChatInput/ChatInput";
import FilDiscussion from "../../elements/FilDiscussion/FilDiscussion";

// Initialisation du contexte avec une valeur par défaut
const DiscussionContext = createContext({
    messages: [],
    // eslint-disable-next-line no-unused-vars
    addMessage: (message) => {},
});

export function DiscussionContextProvider() {
    const location = useLocation();
    const [discussionId, setDiscussionId] = useState(
        location.pathname.split("/")[2]
    );
    const [messages, setMessages] = useState([]);

    // This is a trick to keep the same function reference
    const onMessageEventRef = useRef((message) => {
        setMessages((messages) => [...messages, message]);
    });
    const onDiscussionHistoryRef = useRef((history) => {
        setMessages(history);
    });

    useEffect(() => {
        // Subscribe to the event
        const unsub = SubscribeToEvent(
            "chat-message",
            onMessageEventRef.current
        );

        return () => {
            // Clean up the subscription to avoid memory leaks
            unsub();
        };
    }, []);

    useEffect(() => {
        setDiscussionId(location.pathname.split("/")[2]);
    }, [location]);

    useEffect(() => {
        socket.emit("fetch-discussion-history", discussionId);

        // Subscribe to the event
        const unsub = SubscribeToEvent(
            "discussion-history",
            onDiscussionHistoryRef.current
        );

        return () => {
            // Clean up the subscription to avoid memory leaks
            unsub();
        };
    }, [discussionId]);

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
            <div className="discussion">
                {(discussionId === undefined && (
                    <div className="discussion--no-discussion">
                        <h2>Choisissez une discussion</h2>
                    </div>
                )) || (
                    <>
                        <h2>Discussion ID: {discussionId}</h2>
                        <FilDiscussion />
                        <ChatInput />
                    </>
                )}
            </div>
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
