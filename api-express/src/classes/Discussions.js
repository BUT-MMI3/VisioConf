const Discussion = require('../models/discussion');
const User = require('../models/user');
const {v4: uuidv4} = require('uuid');

class Discussions {
    instanceName = 'Discussions';
    controller = null;

    listeMessagesEmis = ["liste_discussions", "historique_discussion", "discussion_creee", "discussion_info"];
    listeMessagesRecus = ["demande_liste_discussions", "demande_historique_discussion", "demande_creation_discussion", "demande_discussion_info"];

    verbose = false;

    constructor(controller, instanceName) {
        this.controller = controller;
        instanceName ? this.instanceName = instanceName : null;

        if (this.verbose || this.controller.verboseall) console.log(`INFO (${this.instanceName}) - Instance créée, abonnement aux messages : ${this.listeMessagesEmis.join(', ')}`);

        this.controller.subscribe(this, this.listeMessagesEmis, this.listeMessagesRecus);
    }

    traitementMessage = async msg => {
        if (this.verbose || this.controller.verboseall) console.log(`INFO (${this.instanceName}) - Réception d'un message : ${JSON.stringify(msg)}`);

        if (typeof msg.demande_liste_discussions !== 'undefined') {
            if (this.verbose || this.controller.verboseall) console.log(`INFO (${this.instanceName}) - Demande de liste de discussions reçue`);

            const user = await User.findOne({user_socket_id: msg.id});
            const user_discussions = await Discussion.find({discussion_members: user._id}).populate({
                path: 'discussion_members',
                model: 'User',
                select: 'user_firstname user_lastname user_picture user_socket_id user_uuid'
            }).populate({
                path: 'discussion_messages.message_sender',
                model: 'User',
                select: 'user_firstname user_lastname user_picture user_socket_id user_uuid'
            });
            this.controller.send(this, {liste_discussions: user_discussions, id: msg.id});

        } else if (typeof msg.demande_historique_discussion !== 'undefined') {

            const discussion = await Discussion.findOne({discussion_uuid: msg.demande_historique_discussion.discussionId}).populate({
                path: 'discussion_messages.message_sender',
                model: 'User',
                select: 'user_firstname user_lastname user_picture user_socket_id user_uuid'
            });
            if (!discussion) {
                this.controller.send(this, {historique_discussion: [], id: msg.id});
                return;
            }
            this.controller.send(this, {historique_discussion: {historique: discussion.discussion_messages, discussionId: discussion.discussion_uuid}, id: msg.id});

        } else if (typeof msg.demande_creation_discussion !== 'undefined') {
            if (this.verbose || this.controller.verboseall) console.log(`INFO (${this.instanceName}) - Demande de création de discussion reçue`);

            const user = await User.findOne({user_socket_id: msg.id});
            const discussion = new Discussion({
                discussion_uuid: uuidv4(),
                discussion_name: msg.demande_creation_discussion.discussionName || '',
                discussion_description: msg.demande_creation_discussion.discussionDescription || '',
                discussion_members: msg.demande_creation_discussion.discussionMembers.concat(user._id) || [user._id],
                discussion_type: msg.demande_creation_discussion.discussionMembers.length > 1 ? 'group' : 'unique',
                discussion_creator: user._id
            });
            await discussion.save();
            this.controller.send(this, {discussion_creee: discussion, id: msg.id});
        } else if (typeof msg.demande_discussion_info !== 'undefined') {
            if (this.verbose || this.controller.verboseall) console.log(`INFO (${this.instanceName}) - Demande d'infos sur une discussion reçue`);

            const discussion = await Discussion.findOne({discussion_uuid: msg.demande_discussion_info.discussionId});
            if (!discussion) {
                this.controller.send(this, {discussion_info: null, id: msg.id});
                return;
            }
            this.controller.send(this, {discussion_info: discussion.info, id: msg.id});
        }
    }
}

module.exports = Discussions;