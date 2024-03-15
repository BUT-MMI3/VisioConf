/* 
Author: @mathis-lambert
Date: Janvier 2024
*/

import {createContext, useCallback, useContext, useEffect, useRef, useState,} from "react";
import {controller} from "../../controller/index.js";
import {useLocation} from "react-router-dom";
import ChatInput from "../../elements/ChatInput/ChatInput";
import FilDiscussion from "../../elements/FilDiscussion/FilDiscussion";
import { useSelector } from 'react-redux';


// Initialisation du contexte avec une valeur par défaut
const DiscussionContext = createContext({
    messages: [],
    // eslint-disable-next-line no-unused-vars
    addMessage: (message) => {
    },
});

const listeMessagesEmis = [
    "chat_message",
    "demande_liste_discussions",
    "demande_historique_discussion",
];
const listeMessagesRecus = [
    "chat_message",
    "liste_discussions",
    "historique_discussion",
];

export function DiscussionContextProvider() {
    const instanceName = "Discussion Context";
    const verbose = true;


    const location = useLocation();

    const [discussionId, setDiscussionId] = useState(undefined);
    const [messages, setMessages] = useState([]);

    const {current} = useRef({
        instanceName,
        traitementMessage: (msg) => {
            if (verbose || controller.verboseall) console.log(`INFO (${instanceName}) - traitementMessage: `, msg);

            if (typeof msg.chat_message !== "undefined") {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        discussionId: msg.chat_message.discussionId,
                        message: msg.chat_message.message,
                    },
                ]);
            } else if (typeof msg.liste_discussions !== "undefined") {
                setMessages(msg.liste_discussions);
            }
        }
    })

    useEffect(() => {
        controller.subscribe(current, listeMessagesEmis, listeMessagesRecus);
        return () => {
            controller.unsubscribe(current, listeMessagesEmis, listeMessagesRecus);
        };
    }, [current]);

    useEffect(() => {
        if (location.pathname.split("/")[1] === "discussions") {
            if (verbose || controller.verboseall) console.log(`INFO - (${instanceName}) : Demande de liste de discussions`);

            controller.send(current, {
                "demande_liste_discussions": null,
            });
        }
    }, [current, location]);

    useEffect(() => {
        let id = location.pathname.split("/")[2];
        if (id !== discussionId) setDiscussionId(id);
        console.log("Discussion ID: ", discussionId);
    }, [discussionId, location]);

    useEffect(() => {
        if (discussionId === undefined) return;

        controller.send(current, {
            "demande_liste_discussions": discussionId,
        })
    }, [current, discussionId]);

    // Fonction pour ajouter un message au fil de discussion, gestion de l'ajout de message
    const addMessage = useCallback((message) => {
        controller.send(current, {
            "chat_message": {
                discussionId: discussionId,
                message: message,
            },
        });
    }, [current, discussionId]);

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
                        <FilDiscussion/>
                        <ChatInput/>
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
