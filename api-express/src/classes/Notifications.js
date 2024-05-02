const Discussion = require('../models/discussion');

class Notifications {
    constructor(controller, instanceName) {
        this.instanceName = instanceName || 'Notifications';
        this.controller = controller;
        this.listeMessagesEmis = ["distribue_notification"];
        this.listeMessagesRecus = ["update_notifications", "demande_notification"];
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

        if (typeof msg.demande_notification !== 'undefined') {
            console.log(`INFO (${this.instanceName}) - Demande de notifications reçue`);
            console.log(msg.demande_notification);
            this.controller.send(this, {distribue_notification: msg.demande_notification, id: msg.id});
        }

        if (typeof msg.update_notifications !== 'undefined') {
            console.log(`INFO (${this.instanceName}) - Mise à jour des notifications reçue`);

            for (const notificationData of msg.update_notifications) {
                const messageToUpdate = notificationData.content;
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
