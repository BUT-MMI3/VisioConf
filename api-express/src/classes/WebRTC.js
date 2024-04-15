const User = require('../models/user');
const Call = require('../models/call');
const Discussion = require('../models/discussion');
const {v4: uuidv4} = require('uuid');


class WebRTC {
    instanceName = 'WebRTC';
    controller = null;

    listeMessagesEmis = ["receive_offer", "receive_answer", "receive_ice_candidate", "offer_rejected"]
    listeMessagesRecus = ["send_offer", "send_answer", "send_ice_candidate", "reject_offer"]

    verbose = true;

    constructor(controller, instanceName) {
        this.controller = controller;
        instanceName ? this.instanceName = instanceName : null;

        if (this.verbose || this.controller.verboseall) console.log(`INFO (${this.instanceName}) - Instance créée, abonnement aux messages : ${this.listeMessagesEmis.join(', ')}`);

        this.controller.subscribe(this, this.listeMessagesEmis, this.listeMessagesRecus);
    }

    traitementMessage = async msg => {
        if (this.verbose || this.controller.verboseall) console.log(`INFO (${this.instanceName}) - Traitement du message : `);
        if (this.verbose || this.controller.verboseall) console.log(msg);

        if (typeof msg.send_offer !== 'undefined') {
            try {
                let call = await Call.findOne({discussion_uuid: msg.send_offer.discussion}).populate('in_call_members').populate('call_creator');
                const userFrom = await User.findBySocketId(msg.id);
                const userTo = await User.findBySocketId(msg.send_offer.target);
                const pseudo_caller = userFrom.user_firstname + " " + userFrom.user_lastname;

                if (!call) {
                    console.log("Creating new call for discussion: " + msg.send_offer.discussion)
                    const discussion = await Discussion.findPopulateMembersByDiscussionId(msg.send_offer.discussion);

                    const newCall = new Call({
                        call_uuid: uuidv4(),
                        discussion_uuid: msg.send_offer.discussion,
                        type: msg.send_offer.type,
                        members_allowed_to_join: discussion.discussion_members || [userFrom],
                        in_call_members: [userFrom],
                        call_creator: userFrom,
                    });
                    await newCall.save();
                } else {
                    console.log("Adding user to call for discussion: " + msg.send_offer.discussion);
                    call.addMemberToCall(userFrom);
                }

                call = await Call.findOne({discussion_uuid: msg.send_offer.discussion});

                if (call && userTo && userTo.user_socket_id && userTo.user_is_online && userTo.user_socket_id !== msg.id) {
                    console.log(msg.id + " is sending offer to: " + msg.send_offer.target);
                    console.log("Call")
                    console.log(call)

                    this.controller.send(this, {
                        receive_offer: {
                            discussion: msg.send_offer.discussion,
                            members: msg.send_offer.members,
                            initiator: call.call_creator.user_socket_id,
                            sender: msg.id,
                            offer: msg.send_offer.offer,
                            pseudo_caller: pseudo_caller,
                            type: msg.send_offer.type,
                            connected_users: call.in_call_members || [],
                        },
                        id: userTo.user_socket_id
                    });
                }

            } catch (e) {
                console.log("Utilisateur introuvable")
                console.log(e)
            }
        } else if (typeof msg.send_answer !== 'undefined') {
            try {
                const call = await Call.findOne({discussion_uuid: msg.send_answer.discussion});
                const userTo = await User.findBySocketId(msg.send_answer.target);

                if (call && userTo && userTo.user_socket_id && userTo.user_is_online && userTo.user_socket_id !== msg.id) {
                    console.log(msg.id + " is sending answer to: " + msg.send_answer.target);
                    this.controller.send(this, {
                        receive_answer: {
                            sender: msg.id,
                            answer: msg.send_answer.answer,
                        },
                        id: msg.send_answer.target
                    });
                }
            } catch (e) {
                console.log("Utilisateur introuvable")
            }
        } else if (typeof msg.send_ice_candidate !== 'undefined') {
            try {
                const call = await Call.findOne({discussion_uuid: msg.send_ice_candidate.discussion});
                const userTo = await User.findBySocketId(msg.send_ice_candidate.target);

                if (call && userTo && userTo.user_socket_id && userTo.user_is_online && userTo.user_socket_id !== msg.id) {
                    console.log(msg.id + " is sending ice candidate to: " + msg.send_ice_candidate.target);
                    this.controller.send(this, {
                        receive_ice_candidate: {
                            discussion: msg.send_ice_candidate.discussion,
                            sender: msg.id,
                            candidate: msg.send_ice_candidate.candidate,
                        },
                        id: msg.send_ice_candidate.target
                    });
                }

            } catch (e) {
                console.log("Utilisateur introuvable")
            }
        } else if (typeof msg.reject_offer !== 'undefined') {
            try {
                const call = await Call.findOne({discussion_uuid: msg.reject_offer.discussion});
                const userFrom = await User.findBySocketId(msg.id);
                const userTo = await User.findBySocketId(msg.reject_offer.target);
                const pseudo_caller = userFrom.user_firstname + " " + userFrom.user_lastname;

                if (userTo && userTo.user_socket_id && userTo.user_is_online && userTo.user_socket_id !== msg.id) {
                    console.log(msg.id + " is rejecting offer from: " + msg.reject_offer.target);
                    this.controller.send(this, {
                        offer_rejected: {
                            sender: msg.id,
                            target: msg.reject_offer.target,
                        },
                        id: msg.reject_offer.target
                    });
                }

            } catch (e) {
                console.log("Utilisateur introuvable")
            }
        }
    }
}

module.exports = WebRTC;