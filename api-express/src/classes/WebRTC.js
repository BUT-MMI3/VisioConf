const User = require('../models/user');
const Call = require('../models/call');
const Discussion = require('../models/discussion');
const {v4: uuidv4} = require('uuid');


class WebRTC {
    instanceName = 'WebRTC';
    controller = null;

    listeMessagesEmis = ["receive_offer", "receive_answer", "receive_ice_candidate", "offer_rejected", "call_created", "hung_up"]
    listeMessagesRecus = ["send_offer", "send_answer", "send_ice_candidate", "reject_offer", "hang_up"]

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
                let call = await Call.findOne({
                    discussion_uuid: msg.send_offer.discussion,
                    is_ended: false
                }).populate('in_call_members').populate('call_creator');
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
                    await call.addMemberToCall(userFrom.user_socket_id);
                }

                call = await Call.findOne({
                    discussion_uuid: msg.send_offer.discussion,
                    is_ended: false
                }).populate('in_call_members').populate('call_creator');

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
                            call_creator: call.call_creator.user_socket_id,
                            pseudo_caller: pseudo_caller,
                            type: msg.send_offer.type,
                            connected_users: call.in_call_members || [],
                        },
                        id: userTo.user_socket_id
                    });

                    this.controller.send(this, {
                        call_created: {
                            call: call,
                        },
                        id: msg.id
                    })
                }

            } catch (e) {
                console.log("Utilisateur introuvable")
                console.log(e)
            }
        } else if (typeof msg.send_answer !== 'undefined') {
            try {
                const call = await Call.findOne({discussion_uuid: msg.send_answer.discussion});
                const userFrom = await User.findBySocketId(msg.id);
                const userTo = await User.findBySocketId(msg.send_answer.target);

                if (call && userTo && userTo.user_socket_id && userTo.user_is_online && userTo.user_socket_id !== msg.id) {
                    console.log(msg.id + " is sending answer to: " + msg.send_answer.target);
                    await call.addMemberToCall(userFrom.user_socket_id);
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
                const userTo = await User.findBySocketId(msg.reject_offer.target);

                if (call && userTo && userTo.user_socket_id && userTo.user_is_online && userTo.user_socket_id !== msg.id) {
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
                console.log("Une erreur est survenue")
                console.log(e)
            }
        } else if (typeof msg.hang_up !== 'undefined') {
            try {
                const call = await Call.findOne({
                    discussion_uuid: msg.hang_up.discussion,
                    is_ended: false
                }).populate('in_call_members').populate('call_creator');
                if (call) {
                    for (const member of call.in_call_members) {
                        if (member.user_socket_id !== msg.id) {
                            this.controller.send(this, {
                                hung_up: {
                                    sender: msg.id,
                                },
                                id: member.user_socket_id
                            });
                        }
                    }

                    call.in_call_members = call.in_call_members.filter(member => member.user_socket_id !== msg.id);
                    if (call.in_call_members.length === 0) {
                        call.is_ended = true;
                        call.date_ended = Date.now();
                    }
                    await call.save();
                }
            } catch (e) {
                console.log("Une erreur est survenue")
                console.log(e)
            }
        }
    }
}

module.exports = WebRTC;