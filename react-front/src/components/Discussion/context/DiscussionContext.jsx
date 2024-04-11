/* 
Author: @mathis-lambert
Date: Janvier 2024
*/

import {createContext, useCallback, useContext, useEffect, useRef, useState,} from "react";
import {appInstance} from "../../../controller/index.js";
import {useLocation, useNavigate} from "react-router-dom";
import ChatInput from "../../../elements/ChatInput/ChatInput.jsx";
import FilDiscussion from "../fil-discussion/FilDiscussion.jsx";
import ListeDiscussions from "../liste-discussions/ListeDiscussions.jsx";
import CreateDiscussion from "../create-discussion/CreateDiscussion.jsx";
import {useSelector} from "react-redux";
import HeaderFilDiscussion from "../header-fil-de-discussion/HeaderFilDiscussion.jsx";

// Initialisation du contexte avec une valeur par défaut
const DiscussionContext = createContext({
    messages: [],
    listeDiscussions: [],
    addMessage: (message) => {
        this.messages.push(message);
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
    "demande_discussion_info",
];
const listeMessagesRecus = [
    "liste_discussions",
    "historique_discussion",
    "discussion_creee",
    "discussion_info",
    "nouveau_message",
    "erreur_envoi_message",
];

export function DiscussionContextProvider() {
    const instanceName = "Discussion Context";
    const verbose = true;

    const [controller] = useState(appInstance.getController());

    const session = useSelector((state) => state.session);

    const location = useLocation();
    const navigate = useNavigate();

    const [discussionId, setDiscussionId] = useState(undefined);
    const [discussion, setDiscussion] = useState(undefined);
    const [listeDiscussions, setListeDiscussions] = useState([]);
    const [messages, setMessages] = useState([]);
    const [createDiscussion, setCreateDiscussion] = useState(false);

    const discussionInstanceRef = useRef(null)

    useEffect(() => {
        discussionInstanceRef.current = {
            instanceName,
            traitementMessage: (msg) => {
                if (verbose || controller.verboseall) console.log(`INFO (${instanceName}) - traitementMessage: `, msg);

                if (typeof msg.liste_discussions !== "undefined") {
                    setListeDiscussions(msg.liste_discussions);
                } else if (typeof msg.discussion_creee !== "undefined") {
                    setCreateDiscussion(false);
                    setDiscussionId(msg.discussion_creee.discussion_uuid);
                    navigate("/discussion/" + msg.discussion_creee.discussion_uuid);
                } else if (typeof msg.historique_discussion !== "undefined") {

                    if (msg.historique_discussion.historique.length >= 0 && discussionId === msg.historique_discussion.discussionId) {
                        setMessages(msg.historique_discussion.historique);
                    }
                } else if (typeof msg.discussion_info !== "undefined") {
                    setDiscussion(msg.discussion_info);
                } else if (typeof msg.nouveau_message !== "undefined") {
                    if (msg.nouveau_message.discussionId === discussionId) {
                        if (messages[messages.length - 1].message_status === "sending" && messages[messages.length - 1].message_sender.user_uuid === msg.nouveau_message.message.message_sender.user_uuid) {
                            console.log("INFO (" + instanceName + ") - traitementMessage : Message déjà envoyé");
                            setMessages((prevMessages) => {
                                const newMessages = [...prevMessages];
                                newMessages[newMessages.length - 1] = msg.nouveau_message.message;
                                return newMessages;
                            });
                        } else  {
                            setMessages((prevMessages) => [
                                ...prevMessages,
                                msg.nouveau_message.message,
                            ]);
                        }
                    }
                } else if (typeof msg.erreur_envoi_message !== "undefined") {
                    setMessages((prevMessages) => {
                        const newMessages = [...prevMessages];
                        newMessages[newMessages.length - 1].message_status = "error";
                        return newMessages;
                    });
                }
            }
        };

        controller.subscribe(discussionInstanceRef.current, listeMessagesEmis, listeMessagesRecus);

        return () => {
            controller.unsubscribe(discussionInstanceRef.current, listeMessagesEmis, listeMessagesRecus);
        };
    }, [controller, controller.verboseall, discussion, discussionId, location, navigate, verbose, messages]);

    useEffect(() => {
        if (location.pathname.split("/")[1] === "discussions") {
            if (verbose || controller.verboseall) console.log(`INFO - (${instanceName}) : Demande de liste de discussions`);

            controller.send(discussionInstanceRef.current, {
                "demande_liste_discussions": null,
            });
        }
    }, [controller, location, verbose]);

    useEffect(() => {
        const id = location.pathname.split("/")[2];
        if (id !== discussionId) {
            setDiscussionId(id);
        }
    }, [discussionId, location, location.pathname]);

    useEffect(() => {
        if (discussionId === undefined) return;

        controller.send(discussionInstanceRef.current, {
            "demande_liste_discussions": {},
        })
        controller.send(discussionInstanceRef.current, {
            "demande_historique_discussion": {
                discussionId: discussionId,
            },
        });
        controller.send(discussionInstanceRef.current, {
            "demande_discussion_info": {
                discussionId: discussionId,
            },
        });
    }, [controller, discussionId]);

    // Fonction pour ajouter un message au fil de discussion, gestion de l'ajout de message
    const addMessage = useCallback((message) => {
        console.log("INFO (" + instanceName + ") - addMessage : ", message);
        setMessages((prevMessages) => [
            ...prevMessages,
            {
                message_content: message,
                message_date_create: Date.now(),
                message_sender: {
                    user_uuid: session.user_uuid,
                    user_firstname: session.user_firstname,
                    user_lastname: session.user_lastname,
                    user_picture: session.user_picture,
                },
                message_status: "sending"
            },
        ]);
        controller.send(discussionInstanceRef.current, {
            "envoie_message": {
                discussionId: discussionId,
                content: message,
            },
        });
    }, [controller, discussionId, session]);

    // Fonction pour créer une discussion
    const newDiscussion = useCallback(() => {
        setCreateDiscussion(true);
    }, []);

    // La valeur fournie au contexte
    const contextValue = {
        messages,
        listeDiscussions,
        addMessage,
        newDiscussion,
        setCreateDiscussion,
    };

    return (
        <DiscussionContext.Provider value={contextValue}>
            <div className="discussion-context">
                <ListeDiscussions/>

                {createDiscussion && (
                    <CreateDiscussion/>
                )}

                {(!createDiscussion && discussionId === undefined && (
                    <div className="discussion-content no-discussion">
                        <h2>Choisissez une discussion</h2>
                    </div>
                )) || (discussionId && !createDiscussion && discussion && (
                    <div className="discussion-content">
                        <HeaderFilDiscussion discussion={discussion} />
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
