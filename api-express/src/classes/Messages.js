const User = require("../models/user");
const Discussion = require("../models/discussion");
const {v4: uuidv4} = require("uuid");

class Messages {
    instanceName = 'Messages';
    controller = null;

    listeMessagesEmis = ["demande_historique_discussion", "nouveau_message", "erreur_envoi_message", "demande_notification"];
    listeMessagesRecus = ["envoie_message"];

    verbose = true;

    constructor(controller, instanceName) {
        this.controller = controller;
        instanceName ? this.instanceName = instanceName : null;

        if (this.verbose || this.controller.verboseall) console.log(`INFO (${this.instanceName}) - Instance créée, abonnement aux messages : ${this.listeMessagesEmis.join(', ')}`);

        this.controller.subscribe(this, this.listeMessagesEmis, this.listeMessagesRecus);
    }

    traitementMessage = async msg => {
        if (this.verbose || this.controller.verboseall) console.log(`INFO (${this.instanceName}) - Réception d'un message : ${JSON.stringify(msg)}`);

        if (typeof msg.envoie_message !== 'undefined') {
            let discussion = await Discussion.findOne({discussion_uuid: msg.envoie_message.discussionId}).populate({
                path: 'discussion_messages.message_sender',
                model: 'User',
                select: 'user_firstname user_lastname user_picture user_socket_id user_uuid'
            }).populate({
                path: 'discussion_members',
                model: 'User',
                select: 'user_firstname user_lastname user_picture user_socket_id user_uuid'
            });
            const sender = await User.findOne({user_socket_id: msg.id});

            if (!msg.envoie_message.content) {
                console.log("Message vide");

                this.controller.send(this, {
                    erreur_envoi_message: "Message vide",
                    id: msg.id
                });
                return;
            }

            if (!sender) {
                console.log("Utilisateur non trouvé");
                this.controller.send(this, {
                    erreur_envoi_message: "Utilisateur non trouvé",
                    id: msg.id
                });
                return;
            }

            console.log(discussion);
            if (!discussion) {
                console.log("Discussion non trouvée");
                this.controller.send(this, {
                    erreur_envoi_message: "Discussion non trouvée",
                    id: msg.id
                });
                // TODO: Checker ca (création de discussion si elle n'existe pas et envoi du message)
                // discussion = new Discussion({
                //     id: msg.envoie_message.discussionId,
                //     messages: []
                // });
                return;
            }

            discussion.discussion_messages.push({
                message_uuid: uuidv4(),
                message_content: msg.envoie_message.content,
                message_sender: sender._id,
            });

            await discussion.save();

            const populatedDiscussion = await Discussion.findById(discussion._id)
                .populate({
                    path: 'discussion_messages.message_sender',
                    model: 'User',
                    select: 'user_firstname user_lastname user_picture user_socket_id user_uuid'
                })
            const lastMessage = populatedDiscussion.discussion_messages[populatedDiscussion.discussion_messages.length - 1];

            discussion.discussion_members.forEach(member => {
                if (member.user_socket_id && member.user_socket_id !== 'none') {
                    this.controller.send(this, {
                        nouveau_message: {
                            discussionId: discussion.discussion_uuid,
                            message: lastMessage
                        },
                        id: member.user_socket_id
                    });
                    this.controller.send(this, {
                        demande_notification: {
                            type: "Info",
                            content: "Vous avez reçu un nouveau message",
                            data: {
                                discussionId: discussion.discussion_uuid,
                                discussionName: discussion.discussion_name,
                                lastMessage,
                            },

                        },
                        id: member.user_socket_id
                    });
                }
            });
        }
    }
}

module.exports = Messages;