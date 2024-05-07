const User = require('../models/user');
const Call = require('../models/call');
const Discussion = require('../models/discussion');
const {v4: uuidv4} = require('uuid');


class WebRTC {
    instanceName = 'WebRTC';
    controller = null;

    listeMessagesEmis = ["receive_offer", "receive_answer", "receive_ice_candidate", "offer_rejected", "call_created", "hung_up", "call_connected_users"]
    listeMessagesRecus = ["new_call", "send_offer", "send_answer", "send_ice_candidate", "reject_offer", "hang_up"]

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

        if (typeof msg.new_call !== 'undefined') {
            // new_call: {
            //   discussion: discussion_uuid,
            //   type: type,
            // }
            try {
                const call = await Call.findOne({
                    discussion_uuid: msg.new_call.discussion,
                    is_ended: false
                }).populate('in_call_members').populate('call_creator');
                const userFrom = await User.findBySocketId(msg.id);

                if (!call) {
                    console.log("Creating new call for discussion: " + msg.new_call.discussion)
                    const discussion = await Discussion.findPopulateMembersByDiscussionId(msg.new_call.discussion);

                    if (!discussion) {
                        throw new Error("Discussion not found")
                    }
                    const newCall = new Call({
                        call_uuid: uuidv4(),
                        discussion_uuid: msg.new_call.discussion,
                        type: msg.new_call.type,
                        members_allowed_to_join: discussion.discussion_members || [userFrom],
                        in_call_members: [userFrom],
                        call_creator: userFrom,
                    });
                    await newCall.save();


                    this.controller.send(this, {
                        call_created: {
                            value: true,
                            call: newCall,
                        },
                        id: msg.id
                    })
                } else {
                    this.controller.send(this, {
                        call_created: {
                            value: false,
                            error: "Call already exists",
                            call: call,
                        },
                        id: msg.id
                    })
                }
            } catch (e) {
                console.log("Une erreur est survenue")
                console.log(e)
            }
        } else if (typeof msg.send_offer !== 'undefined') {
            try {
                const call = await Call.findOne({
                    discussion_uuid: msg.send_offer.discussion,
                    is_ended: false
                }).populate('in_call_members', 'user_socket_id').populate('call_creator');
                const userFrom = await User.findBySocketId(msg.id);
                const userTo = await User.findBySocketId(msg.send_offer.target);
                const pseudo_caller = userFrom.user_firstname + " " + userFrom.user_lastname;

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
                            in_call_members: call.in_call_members.map(member => member.user_socket_id) || [],
                        },
                        id: userTo.user_socket_id
                    });
                } else if (!call) {
                    throw new Error("Call not found")
                } else {
                    throw new Error("Error while sending offer")
                }
            } catch (e) {
                console.log("Une erreur est survenue")
                console.log(e)
            }
        } else if (typeof msg.send_answer !== 'undefined') {
            try {
                const call = await Call.findOne({discussion_uuid: msg.send_answer.discussion, is_ended: false}).populate('in_call_members').populate('members_allowed_to_join')
                const userFrom = await User.findBySocketId(msg.id);
                const userTo = await User.findBySocketId(msg.send_answer.target);

                if (call && userTo && userTo.user_socket_id && userTo.user_is_online && userTo.user_socket_id !== msg.id) {
                    console.log(msg.id + " is sending answer to: " + msg.send_answer.target);
                    console.log("{{{ ADDING MEMBER TO CALL }}}")
                    console.log(userFrom.user_socket_id)
                    await call.addMemberToCall(userFrom.user_socket_id);
                    this.controller.send(this, {
                        receive_answer: {
                            sender: msg.id,
                            answer: msg.send_answer.answer,
                        },
                        id: msg.send_answer.target
                    });
                    console.log("|||| CALL MEMBERS ||||")
                    console.log(call.in_call_members)


                    for (const member of call.members_allowed_to_join) {
                        if (member.user_socket_id) {
                            this.controller.send(this, {
                                call_connected_users: {
                                    discussion: msg.send_answer.discussion,
                                    connected_users: call.in_call_members.map(member => member.user_socket_id),
                                },
                                id: member.user_socket_id
                            })
                        }
                    }
                }
            } catch (e) {
                console.log("Utilisateur introuvable")
                console.log(e)
            }
        } else if (typeof msg.send_ice_candidate !== 'undefined') {
            try {
                const call = await Call.findOne({discussion_uuid: msg.send_ice_candidate.discussion, is_ended: false});
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
                const call = await Call.findOne({discussion_uuid: msg.reject_offer.discussion, is_ended: false});
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
                    if (this.verbose || this.controller.verboseall) console.log(msg.id + " is hanging up from call: " + msg.hang_up.discussion);

                    const userFrom = await User.findBySocketId(msg.id);

                    // Retirer l'utilisateur du tableau 'in_call_members'
                    const updatedCall = await Call.findOneAndUpdate(
                        {_id: call._id},
                        {$pull: {'in_call_members': userFrom._id}},
                        {new: true} // Retourne le document mis à jour pour vérifier si le tableau est vide
                    ).populate('in_call_members').populate('call_creator');

                    console.log(msg.id);
                    console.log(updatedCall.in_call_members);

                    // Vérifier si le tableau 'in_call_members' est maintenant vide
                    if (updatedCall.in_call_members.length === 0) {
                        // Si vide, mettre à jour 'is_ended' et 'date_ended'
                        const finalUpdate = await Call.findByIdAndUpdate(
                            updatedCall._id,
                            {$set: {'is_ended': true, 'date_ended': Date.now()}},
                            {new: true}
                        );

                        console.log('L\'appel est terminé');
                        console.log(finalUpdate);
                    }

                    // Send hung up message to other members
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
                }
            } catch (e) {
                console.log("Une erreur est survenue")
                console.log(e)
            }
        }
    }
}

module.exports = WebRTC;