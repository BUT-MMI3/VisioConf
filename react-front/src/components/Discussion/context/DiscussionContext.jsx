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
import {useToasts} from "../../../elements/Toasts/ToastContext.jsx";
import Call from "../call/Call.jsx";

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
];

export function DiscussionContextProvider() {
    // INIT COMPONENT
    const instanceName = "Discussion Context";
    const verbose = true;

    // CALL CONTROLLER
    const [controller] = useState(appInstance.getController());

    // USE SESSION
    const session = useSelector((state) => state.session);

    // UTILS
    const location = useLocation();
    const navigate = useNavigate();
    const {pushToast} = useToasts();

    // DISCUSSION STATES
    const [discussionId, setDiscussionId] = useState(undefined);
    const [discussion, setDiscussion] = useState(undefined);
    const [listeDiscussions, setListeDiscussions] = useState([]);
    const [createDiscussion, setCreateDiscussion] = useState(false);

    // MESSAGES STATES
    const [messages, setMessages] = useState([]);

    // WEBRTC STATES
    const [peersStreams, setPeersStreams] = useState({});
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
                        if (messages[messages.length - 1].message_status === "sending" && messages[messages.length - 1].message_sender.user_uuid === msg.nouveau_message.message.message_sender.user_uuid) {
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
                    pushToast({
                        title: "Erreur",
                        message: "Erreur lors de l'envoi du message",
                        type: "error",
                    })
                    setMessages((prevMessages) => {
                        const newMessages = [...prevMessages];
                        newMessages[newMessages.length - 1].message_status = "error";
                        return newMessages;
                    });
                } else if (typeof msg.set_in_call !== "undefined") {
                    setInCall(msg.set_in_call);
                } else if (typeof msg.update_remote_streams !== "undefined") {
                    updateRemoteStreams(msg.update_remote_streams.target, msg.update_remote_streams.stream);
                } else if (typeof msg.set_call_info !== "undefined") {
                    setCallInfo(msg.set_call_info);
                }
            }
        };

        controller.subscribe(discussionInstanceRef.current, listeMessagesEmis, listeMessagesRecus);

        return () => {
            controller.unsubscribe(discussionInstanceRef.current, listeMessagesEmis, listeMessagesRecus);
        };
    }, [controller, controller.verboseall, discussion, discussionId, location, navigate, verbose, messages, pushToast]);

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
    }, [controller, discussionId]);

    useEffect(() => {
        if (calling) {
            pushToast({
                title: "Appel en cours",
                message: "Appel en cours",
                type: "info",
            })
        }
    }, [calling, pushToast]);

    const updateRemoteStreams = (socketId, stream) => {
        setPeersStreams((prevStreams) => {
            return {...prevStreams, [socketId]: stream};
        });
    }

    // async function StartScreenSharing() {
    //
    //     if (inCall && webRTCManager ? webRTCManager.isCallInitiator : false) {
    //         console.log("Start Screen Sharing " + self.username);
    //         webRTCManager ? await webRTCManager.shareScreen() : null;
    //         setIsScreenSharing(true);
    //     }
    // }
    //
    // function stopScreenSharing() {
    //     if (inCall && isScreenSharing) {
    //         console.log("Stopping Screen Sharing " + self.username);
    //         if (webRTCManager) {
    //             webRTCManager ? webRTCManager.stopSharingScreen() : null;
    //         }
    //     }
    // }

    // async function createOfferForNewUser(target) {
    //     if (webRTCManager && inCall && isCallInitiator) {
    //         await webRTCManager.createOffer([target], webRTCManager.discussion, 'video', self.id);
    //     }
    // }

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
        const members = discussion?.discussion_members || [];
        console.log(discussion)
        const ids = []
        if (members) {
            for (const member of members) {
                if (member.user_socket_id && member.user_is_online && member.user_uuid !== session.user_uuid) ids.push(member.user_socket_id);
            }
        } else {
            console.log("No members in discussion");
            alert("No members in discussion");
        }

        console.log("Calling members: " + JSON.stringify(ids));
        console.log("Calling type: " + type);
        console.log("Calling discussionId: " + discussionId);
        console.log("Calling session: " + session);
        controller.send(discussionInstanceRef.current, {
            "create_offer": {
                members: ids,
                discussion: discussionId,
                type: type,
                initiator: session.user_socket_id
            },
        });
    }, [controller, discussion, discussionId, session]);

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
                                <Call streams={peersStreams} callInfo={callInfo}/>
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
