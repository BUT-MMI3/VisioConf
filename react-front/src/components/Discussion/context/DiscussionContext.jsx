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
import Call from "../call/Call.jsx";
import {toast} from "react-toastify";

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
    call: (type) => {
        console.log("Calling type: " + type);
    }
});

const listeMessagesEmis = [
    "envoie_message",
    "demande_liste_discussions",
    "demande_historique_discussion",
    "demande_discussion_info",
    "create_offer",
    "new_call",
    "is_call_initiator",
    "is_in_call",
    "get_call_info",
    "get_streams",
];
const listeMessagesRecus = [
    "liste_discussions",
    "historique_discussion",
    "discussion_creee",
    "discussion_info",
    "nouveau_message",
    "erreur_envoi_message",
    "set_in_call",
    "update_remote_streams",
    "set_call_info",
    "set_remote_streams",
    "call_created"
];

export function DiscussionContextProvider() {
    // INIT COMPONENT
    const instanceName = "Discussion Context";
    const verbose = false;

    // CALL CONTROLLER
    const [controller] = useState(appInstance.getController());

    // USE SESSION
    const session = useSelector((state) => state.session);

    // UTILS
    const location = useLocation();
    const navigate = useNavigate();

    // DISCUSSION STATES
    const [discussionId, setDiscussionId] = useState(undefined);
    const [discussion, setDiscussion] = useState(undefined);
    const [listeDiscussions, setListeDiscussions] = useState([]);
    const [createDiscussion, setCreateDiscussion] = useState(false);

    // MESSAGES STATES
    const [messages, setMessages] = useState([]);

    // WEBRTC STATES
    const [remoteStreams, setRemoteStreams] = useState({});
    const [inCall, setInCall] = useState(false);
    const [callInfo, setCallInfo] = useState({});
    const [calling, setCalling] = useState(false);

    // DISCUSSION REF
    const discussionInstanceRef = useRef(null)

    useEffect(() => {
        discussionInstanceRef.current = {
            instanceName,
            traitementMessage: (msg) => {
                if (verbose || controller.verboseall) console.log(`INFO (${instanceName}) - traitementMessage: `, msg);

                if (typeof msg.liste_discussions !== "undefined") {
                    // Update liste des discussions
                    setListeDiscussions(msg.liste_discussions);
                } else if (typeof msg.discussion_creee !== "undefined") {
                    // Création d'une discussion
                    setCreateDiscussion(false);
                    setDiscussionId(msg.discussion_creee.discussion_uuid);
                    navigate("/discussion/" + msg.discussion_creee.discussion_uuid);
                } else if (typeof msg.historique_discussion !== "undefined") {
                    // Update discussion history si la discussion en cours
                    if (msg.historique_discussion.historique.length >= 0 && discussionId === msg.historique_discussion.discussionId) {
                        setMessages(msg.historique_discussion.historique);
                    }
                } else if (typeof msg.discussion_info !== "undefined") {
                    // Update discussion info
                    setDiscussion(msg.discussion_info);
                } else if (typeof msg.nouveau_message !== "undefined") {
                    // Si nouveau message dans la discussion en cours
                    if (msg.nouveau_message.discussionId === discussionId) {
                        if (messages.length === 0) {
                            setMessages([msg.nouveau_message.message]);
                        } else if (messages[messages.length - 1].message_status === "sending" && messages[messages.length - 1].message_sender.user_uuid === msg.nouveau_message.message.message_sender.user_uuid) {
                            setMessages((prevMessages) => {
                                const newMessages = [...prevMessages];
                                newMessages[newMessages.length - 1] = msg.nouveau_message.message;
                                return newMessages;
                            });
                        } else {
                            setMessages((prevMessages) => [
                                ...prevMessages,
                                msg.nouveau_message.message,
                            ]);
                        }
                    }
                } else if (typeof msg.erreur_envoi_message !== "undefined") {
                    // Si erreur d'envoi de message
                    toast.error("Erreur lors de l'envoi du message", {theme: "colored", icon: "🚫"});

                    setMessages((prevMessages) => {
                        const newMessages = [...prevMessages];
                        newMessages[newMessages.length - 1].message_status = "error";
                        return newMessages;
                    });
                } else if (typeof msg.set_in_call !== "undefined") {
                    if (discussionId === msg.set_in_call.discussion.discussion_uuid) {
                        setInCall(msg.set_in_call.value);
                        if (msg.set_in_call.value) {
                            controller.send(discussionInstanceRef.current, {
                                "get_call_info": {
                                    discussion_uuid: discussionId,
                                }
                            })
                            controller.send(discussionInstanceRef.current, {
                                "get_streams": {
                                    discussion_uuid: discussionId,
                                }
                            })
                        }
                    } else {
                        setInCall(false);
                    }

                } else if (typeof msg.update_remote_streams !== "undefined") {
                    updateRemoteStreams(msg.update_remote_streams.target, msg.update_remote_streams.stream);
                } else if (typeof msg.set_call_info !== "undefined") {
                    setCallInfo(msg.set_call_info);
                } else if (typeof msg.set_remote_streams !== "undefined") {
                    setRemoteStreams(msg.set_remote_streams);
                } else if (typeof msg.call_created !== "undefined") {
                    if (!msg.call_created.value && msg.call_created.error) {
                        toast.error(msg.call_created.error, {theme: "colored", icon: "🚫"});
                    }
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

        if (id && createDiscussion) {
            setCreateDiscussion(false);
        }

        if (id !== discussionId) {
            setDiscussionId(id);
        }
    }, [createDiscussion, discussionId, location, location.pathname]);

    useEffect(() => {
        /*
        * Si l'id de la discussion est défini, on demande l'historique de la discussion
        * et les informations de la discussion
        *
        * Effectué à chaque changement de discussionId
         */
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
        controller.send(discussionInstanceRef.current, {
            "is_in_call": {
                discussion: discussionId,
            },
        });
    }, [controller, discussionId]);

    useEffect(() => {
        if (calling) {
            toast.info("Appel en cours", {theme: "colored", icon: "📞"});
        }
    }, [calling]);

    const updateRemoteStreams = (socketId, stream) => {
        setRemoteStreams((prevStreams) => {
            return {...prevStreams, [socketId]: stream};
        });
    };

    // Fonction pour ajouter un message au fil de discussion, gestion de l'ajout de message
    const addMessage = useCallback((message) => {
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

    // Fonction pour démarrer un appel
    const call = useCallback(async (type) => {
        if (discussionId === undefined) return;

        setCalling(true);

        if (verbose || controller.verboseall) console.log(`INFO - (${instanceName}) : Demande de création d'appel`);
        if (verbose || controller.verboseall) console.log(`INFO - (${instanceName}) : Type d'appel : ${type}`);

        controller.send(discussionInstanceRef.current, {
            "new_call": {
                discussion_uuid: discussionId,
                type: type,
            },
        });
    }, [controller, discussionId]);

    // La valeur fournie au contexte
    const contextValue = {
        messages,
        listeDiscussions,
        addMessage,
        newDiscussion,
        setCreateDiscussion,
        call
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
                        <HeaderFilDiscussion discussion={discussion} inCall={inCall}/>

                        {inCall && (
                            <>
                                <Call streams={remoteStreams} callInfo={callInfo}/>
                            </>
                        ) || (
                            <>
                                <FilDiscussion/>
                                <ChatInput/>
                            </>
                        )}

                    </div>
                ))}

            </div>
        </DiscussionContext.Provider>
    );
}

// Hook personnalisé pour utiliser le contexte du Discussion dans d'autres composants
export function useDiscussion() {
    const context = useContext(DiscussionContext);
    if (!context) {
        throw new Error(
            "useDiscussion must be used within a DiscussionContextProvider"
        );
    }
    return context;
}