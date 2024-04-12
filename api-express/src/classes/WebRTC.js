const User = require('../models/user');
const Call = require('../models/call');
const {v4: uuidv4} = require('uuid');


class WebRTC {
    instanceName = 'WebRTC';
    controller = null;

    listeMessagesEmis = ["receive_offer", "receive_answer", "receive_ice_candidate", "offer_rejected"]
    listeMessagesRecus = ["send_offer", "send_answer", "send_ice_candidate", "reject_offer"]

    verbose = false;

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
                let pseudo_caller = User.findBySocketId(msg.send_offer.initiator).user_firstname;
                const call = Call.findOne({discussion_uuid: msg.send_offer.discussion});
                const user = User.findBySocketId(msg.id);

                if (msg.id === msg.send_offer.initiator) {
                    if (!call) {
                        console.log("Creating new call for discussion: " + msg.send_offer.discussion);
                        Call.insertOne({
                            call_uuid: uuidv4(),
                            discussion_uuid: msg.send_offer.discussion,
                            type: msg.send_offer.type,
                            members_allowed_to_join: msg.send_offer.members,
                            in_call_members: [user],
                            call_creator: msg.send_offer.initiator,
                        });
                    } else {
                        console.log("Adding user to call for discussion: " + msg.send_offer.discussion);
                        call.addMemberToCall(user);
                    }
                } else {
                    call.addMemberToCall(user);
                }

                if (user && user.user_socket_id && user.user_is_online && user.user_socket_id !== msg.id) {
                    console.log(msg.id + " is sending offer to: " + msg.send_offer.target);
                    this.controller.send(this, {
                        receive_offer: {
                            discussion: msg.send_offer.discussion,
                            members: msg.send_offer.members,
                            initiator: msg.send_offer.initiator,
                            sender: msg.id,
                            offer: msg.send_offer.offer,
                            pseudo_caller: pseudo_caller,
                            type: msg.send_offer.type,
                            connected_users: call.connected_users
                        },
                        id: msg.send_offer.target
                    });
                }

            } catch (e) {
                console.log("Utilisateur introuvable")
            }
        } else if (typeof msg.send_answer !== 'undefined') {
            try {
                let pseudo_caller = User.findBySocketId(msg.send_answer.initiator).user_firstname;
                const call = Call.findOne({discussion_uuid: msg.send_answer.discussion});
                const user = User.findBySocketId(msg.id);

                if (user && user.user_socket_id && user.user_is_online && user.user_socket_id !== msg.id) {
                    console.log(msg.id + " is sending answer to: " + msg.send_answer.target);
                    this.controller.send(this, {
                        receive_answer: {
                            discussion: msg.send_answer.discussion,
                            initiator: msg.send_answer.initiator,
                            sender: msg.id,
                            answer: msg.send_answer.answer,
                            pseudo_caller: pseudo_caller,
                            type: msg.send_answer.type,
                            connected_users: call.connected_users
                        },
                        id: msg.send_answer.target
                    });
                }

            } catch (e) {
                console.log("Utilisateur introuvable")
            }
        } else if (typeof msg.send_ice_candidate !== 'undefined') {
            try {
                let pseudo_caller = User.findBySocketId(msg.send_ice_candidate.initiator).user_firstname;
                const call = Call.findOne({discussion_uuid: msg.send_ice_candidate.discussion});
                const user = User.findBySocketId(msg.id);

                if (user && user.user_socket_id && user.user_is_online && user.user_socket_id !== msg.id) {
                    console.log(msg.id + " is sending ice candidate to: " + msg.send_ice_candidate.target);
                    this.controller.send(this, {
                        receive_ice_candidate: {
                            discussion: msg.send_ice_candidate.discussion,
                            initiator: msg.send_ice_candidate.initiator,
                            sender: msg.id,
                            candidate: msg.send_ice_candidate.candidate,
                            pseudo_caller: pseudo_caller,
                            type: msg.send_ice_candidate.type,
                            connected_users: call.connected_users
                        },
                        id: msg.send_ice_candidate.target
                    });
                }

            } catch (e) {
                console.log("Utilisateur introuvable")
            }
        } else if (typeof msg.reject_offer !== 'undefined') {
            try {
                let pseudo_caller = User.findBySocketId(msg.reject_offer.initiator).user_firstname;
                const call = Call.findOne({discussion_uuid: msg.reject_offer.discussion});
                const user = User.findBySocketId(msg.id);

                if (user && user.user_socket_id && user.user_is_online && user.user_socket_id !== msg.id) {
                    console.log(msg.id + " is rejecting offer from: " + msg.reject_offer.target);
                    this.controller.send(this, {
                        offer_rejected: {
                            discussion: msg.reject_offer.discussion,
                            initiator: msg.reject_offer.initiator,
                            sender: msg.id,
                            pseudo_caller: pseudo_caller,
                            type: msg.reject_offer.type,
                            connected_users: call.connected_users
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