const Discussion = require('../models/discussion');

class Notifications {
    constructor(controller, instanceName) {
        this.instanceName = instanceName || 'Notifications';
        this.controller = controller;
        this.listeMessagesEmis = ["notification_sent"];
        this.listeMessagesRecus = ["update_notifications", "notification_answer"];
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

        if (typeof msg.notification_answer !== 'undefined') {
            console.log(`INFO (${this.instanceName}) - Demande de notifications reçue`);
            console.log(msg.notification_answer);
            this.controller.send(this, {notification_sent: msg.notification_answer, id: msg.id});
        }

        if (typeof msg.update_notifications !== 'undefined') {
            console.log(`INFO (${this.instanceName}) - Mise à jour des notifications reçue`);

            for (const notificationData of msg.update_notifications) {
                const messageToUpdate = notificationData.message;
                messageToUpdate.message_status = 'read';

                await Discussion.updateOne(
                    { 'discussion_messages._id': messageToUpdate._id },
                    { $set: { 'discussion_messages.$.message_status': 'read' } }
                );
            }
        }
    }
}

module.exports = Notifications;
