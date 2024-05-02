const Discussion = require('../models/discussion');

class Notifications {
    constructor(controller, instanceName) {
        this.instanceName = instanceName || 'Notifications';
        this.controller = controller;
        this.listeMessagesEmis = ["notification_answer"];
        this.listeMessagesRecus = ["demande_notifications", "connexion_acceptee", "update_notifications"];
        this.verbose = true;

        if (this.verbose || this.controller.verboseall) {
            console.log(`INFO (${this.instanceName}) - Instance créée, abonnement aux messages : ${this.listeMessagesEmis.join(', ')}`);
        }

        this.controller.subscribe(this, this.listeMessagesEmis, this.listeMessagesRecus);
    }

    traitementMessage = async msg => {
        if (this.verbose || this.controller.verboseall) {
            console.log(`INFO (${this.instanceName}) - Réception d'un message : ${JSON.stringify(msg)}`);
        }
        if (typeof msg.connexion_acceptee !== 'undefined') {
            console.log(`INFO (${this.instanceName}) - Connexion acceptée reçue`);

            //enregistrer l'id de l'utilisateur connecté
            this.user_id = msg.connexion_acceptee.user_info.user_uuid;
        }

        if (typeof msg.demande_notifications !== 'undefined') {
            console.log(`INFO (${this.instanceName}) - Demande de notifications reçue`);

            // Trouver tous les messages dans toutes les discussions
            const discussions = await Discussion.find({}).populate({
                path: 'discussion_messages.message_sender',
                model: 'User',
                select: 'user_firstname user_lastname user_picture user_socket_id user_uuid'
            });

            const unreadMessages = discussions.reduce((accumulator, discussion) => {
                discussion.discussion_messages.forEach(message => {

                    // if (message.message_status !== 'read' && message.message_sender.user_uuid !== this.user_id) {
                    if (message.message_status !== 'read') {
                        accumulator.push({
                            message,
                            discussionId: discussion.discussion_uuid,
                            discussionName: discussion.discussion_name
                        });
                    }
                });
                return accumulator;
            }, []);

            this.controller.send(this, {notification_answer: {historique: unreadMessages}, id: msg.id});
        }

        if (typeof msg.update_notifications !== 'undefined') {
            console.log(`INFO (${this.instanceName}) - Mise à jour des notifications reçue`);

            for (const notificationData of msg.update_notifications) {
                const messageToUpdate = notificationData.message;
                messageToUpdate.message_status = 'read';

                await Discussion.updateOne(
                    {'discussion_messages._id': messageToUpdate._id},
                    {$set: {'discussion_messages.$.message_status': 'read'}}
                );
            }
        }
    }
}

module.exports = Notifications;
