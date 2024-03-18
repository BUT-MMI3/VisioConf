/* 
Author: @mathis-lambert
Date: Janvier 2024
*/

import {createContext, useCallback, useContext, useEffect, useRef, useState,} from "react";
import {controller} from "../../../controller/index.js";
import {useLocation, useNavigate} from "react-router-dom";
import ChatInput from "../../../elements/ChatInput/ChatInput.jsx";
import FilDiscussion from "../fil-discussion/FilDiscussion.jsx";
import ListeDiscussions from "../liste-discussions/ListeDiscussions.jsx";
import CreateDiscussion from "../create-discussion/CreateDiscussion.jsx";

// Initialisation du contexte avec une valeur par défaut
const DiscussionContext = createContext({
    messages: [],
    // eslint-disable-next-line no-unused-vars
    addMessage: (message) => {
    },
    newDiscussion: () => {
    },
    setCreateDiscussion: () => {
    },
});

const listeMessagesEmis = [
    "envoie_message",
    "demande_liste_discussions",
    "demande_historique_discussion",
];
const listeMessagesRecus = [
    "reception_message",
    "liste_discussions",
    "historique_discussion",
    "discussion_creee"
];

export function DiscussionContextProvider() {
    const instanceName = "Discussion Context";
    const verbose = true;

    const location = useLocation();
    const navigate = useNavigate();

    const [discussionId, setDiscussionId] = useState(undefined);
    const [messages, setMessages] = useState([]);
    const [createDiscussion, setCreateDiscussion] = useState(false);

    const {current} = useRef({
        instanceName,
        traitementMessage: (msg) => {
            if (verbose || controller.verboseall) console.log(`INFO (${instanceName}) - traitementMessage: `, msg);

            if (typeof msg.reception_message !== "undefined") {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        discussionId: msg.chat_message.discussionId,
                        message: msg.chat_message.message,
                    },
                ]);
            } else if (typeof msg.liste_discussions !== "undefined") {
                const current_discussion = msg.liste_discussions.find((d) => d.discussion_uuid === discussionId);

                if (current_discussion !== undefined) {
                    setMessages(current_discussion.discussion_messages);
                }
            } else if (typeof msg.discussion_creee !== "undefined") {
                console.log("INFO (" + instanceName + ") - traitementMessage : discussion_creee : ", msg.discussion_creee);
                setCreateDiscussion(false);
                setDiscussionId(msg.discussion_creee.discussion_uuid);
                navigate("/discussion/" + msg.discussion_creee.discussion_uuid);
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
            "envoie_message": {
                discussionId: discussionId,
                message: message,
            },
        });
    }, [current, discussionId]);

    // Fonction pour créer une discussion
    const newDiscussion = useCallback(() => {
        setCreateDiscussion(true);
    }, []);

    // La valeur fournie au contexte
    const contextValue = {
        messages,
        addMessage,
        newDiscussion,
        setCreateDiscussion,
    };

    return (
        <DiscussionContext.Provider value={contextValue}>
            <div className="discussion-context">
                <ListeDiscussions/>

                {createDiscussion && (
                    <CreateDiscussion />
                )}

                {(!createDiscussion && discussionId === undefined && (
                    <div className="discussion-content no-discussion">
                        <h2>Choisissez une discussion</h2>
                    </div>
                )) || (discussionId && !createDiscussion && (
                    <div className="discussion-content">
                        <h2>Discussion ID: {discussionId}</h2>
                        <FilDiscussion/>
                        <ChatInput/>
                    </div>
                ))}

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
